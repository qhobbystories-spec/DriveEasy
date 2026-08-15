import { Response } from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../prisma/client';
import { sendSuccess, sendPaginated, sendError } from '../utils/response';
import { getPaginationParams } from '../utils/pagination';
import { NotFoundError, AuthorizationError, ValidationError } from '../utils/errors';
import { AuthRequest } from '../middleware/auth.middleware';
import { isValidUUID } from '../utils/validators';
import { writeAuditLog } from '../utils/audit';

const USER_SELECT = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  profileImage: true,
  role: true,
  isVerified: true,
  isActive: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

export class UserController {
  async list(req: AuthRequest, res: Response) {
    const page = parseInt(String(req.query.page ?? '1'));
    const limit = parseInt(String(req.query.limit ?? '10'));
    const { skip } = getPaginationParams(page, limit);

    const role = req.query.role as string | undefined;
    const search = req.query.search as string | undefined;
    const where: Prisma.UserWhereInput = { deletedAt: null };
    if (role) where.role = role as any;
    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: USER_SELECT,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return sendPaginated(res, users, total, page, limit, 'Users retrieved successfully');
  }

  async getById(req: AuthRequest, res: Response) {
    const { id } = req.params;
    if (!isValidUUID(id)) {
      throw new NotFoundError('User');
    }

    const isStaff = req.user?.role === 'ADMIN' || req.user?.role === 'EMPLOYEE';
    if (!isStaff && id !== req.user?.id) {
      throw new AuthorizationError();
    }

    const user = await prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: USER_SELECT,
    });
    if (!user) {
      throw new NotFoundError('User');
    }

    return sendSuccess(res, user, 'User retrieved successfully');
  }

  async profileMe(req: AuthRequest, res: Response) {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }

    const user = await prisma.user.findFirst({
      where: { id: req.user.id, deletedAt: null },
      select: USER_SELECT,
    });
    if (!user) {
      throw new NotFoundError('User');
    }

    return sendSuccess(res, user, 'Profile retrieved successfully');
  }

  async update(req: AuthRequest, res: Response) {
    const { id } = req.params;
    if (!isValidUUID(id)) {
      throw new NotFoundError('User');
    }

    const isAdmin = req.user?.role === 'ADMIN';
    const isStaff = isAdmin || req.user?.role === 'EMPLOYEE';
    const isSelf = id === req.user?.id;
    if (!isStaff && !isSelf) {
      throw new AuthorizationError();
    }

    const existing = await prisma.user.findFirst({ where: { id, deletedAt: null } });
    if (!existing) {
      throw new NotFoundError('User');
    }

    // Never trust the client wholesale — only whitelisted fields are accepted
    const data: Prisma.UserUpdateInput = {};

    // Profile fields editable by the user themselves or any staff
    const profileFields = ['firstName', 'lastName', 'phone', 'profileImage'] as const;
    for (const field of profileFields) {
      if (req.body[field] !== undefined) {
        (data as Record<string, unknown>)[field] = req.body[field];
      }
    }

    // Privileged fields editable by admins only
    if (isAdmin) {
      const adminFields = ['email', 'role', 'status', 'isActive', 'isVerified'] as const;
      for (const field of adminFields) {
        if (req.body[field] !== undefined) {
          if (field === 'email') {
            const existingEmail = await prisma.user.findUnique({
              where: { email: req.body.email },
              select: { id: true },
            });
            if (existingEmail && existingEmail.id !== id) {
              throw new ValidationError('Email already in use');
            }
          }
          (data as Record<string, unknown>)[field] =
            field === 'isActive' || field === 'isVerified'
              ? Boolean(req.body[field])
              : req.body[field];
        }
      }
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: USER_SELECT,
    });

    writeAuditLog({
      userId: req.user!.id,
      action: 'UPDATE',
      entityType: 'User',
      entityId: id,
      changes: Object.keys(data).length > 0 ? data as Record<string, unknown> : undefined,
      req,
    });

    return sendSuccess(res, user, 'User updated successfully');
  }

  async remove(req: AuthRequest, res: Response) {
    const { id } = req.params;
    if (!isValidUUID(id)) {
      throw new NotFoundError('User');
    }

    if (id === req.user?.id) {
      throw new AuthorizationError('You cannot delete your own account');
    }

    const existing = await prisma.user.findFirst({ where: { id, deletedAt: null } });
    if (!existing) {
      throw new NotFoundError('User');
    }

    await prisma.user.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false, status: 'INACTIVE' },
    });

    writeAuditLog({
      userId: req.user!.id,
      action: 'DELETE',
      entityType: 'User',
      entityId: id,
      req,
    });

    return sendSuccess(res, null, 'User deleted successfully');
  }
}

export const userController = new UserController();
