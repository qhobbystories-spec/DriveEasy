import { Request, Response } from 'express';
import prisma from '../prisma/client';
import { sendSuccess, sendPaginated } from '../utils/response';
import { getPaginationParams } from '../utils/pagination';
import { NotFoundError, ValidationError } from '../utils/errors';
import { AuthRequest } from '../middleware/auth.middleware';
import { isValidUUID } from '../utils/validators';

export class CouponController {
  async list(req: AuthRequest, res: Response) {
    const page = parseInt(String(req.query.page ?? '1'));
    const limit = parseInt(String(req.query.limit ?? '20'));
    const { skip } = getPaginationParams(page, limit);

    const [coupons, total] = await Promise.all([
      prisma.coupon.findMany({ orderBy: { createdAt: 'desc' }, skip, take: limit }),
      prisma.coupon.count(),
    ]);

    return sendPaginated(res, coupons, total, page, limit, 'Coupons retrieved successfully');
  }

  async create(req: AuthRequest, res: Response) {
    const { code, discountType, discountValue, maxUses, expiresAt } = req.body;

    if (!code || !discountValue || !expiresAt) {
      throw new ValidationError('code, discountValue and expiresAt are required');
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: String(code).toUpperCase(),
        discountType: discountType ?? 'percentage',
        discountValue: Number(discountValue),
        maxUses: maxUses ? Number(maxUses) : undefined,
        expiresAt: new Date(expiresAt),
      },
    });

    return sendSuccess(res, coupon, 'Coupon created successfully', 201);
  }

  async update(req: AuthRequest, res: Response) {
    const { id } = req.params;
    if (!isValidUUID(id)) {
      throw new NotFoundError('Coupon');
    }

    const existing = await prisma.coupon.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError('Coupon');
    }

    const coupon = await prisma.coupon.update({ where: { id }, data: req.body });
    return sendSuccess(res, coupon, 'Coupon updated successfully');
  }

  async remove(req: AuthRequest, res: Response) {
    const { id } = req.params;
    if (!isValidUUID(id)) {
      throw new NotFoundError('Coupon');
    }

    const existing = await prisma.coupon.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError('Coupon');
    }

    await prisma.coupon.delete({ where: { id } });
    return sendSuccess(res, null, 'Coupon deleted successfully');
  }

  async validate(req: Request, res: Response) {
    const { code } = req.body;
    if (!code) {
      throw new ValidationError('Coupon code is required');
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: String(code).toUpperCase() },
    });

    if (!coupon || !coupon.isActive) {
      throw new ValidationError('Invalid coupon code');
    }
    if (coupon.expiresAt < new Date()) {
      throw new ValidationError('Coupon has expired');
    }
    if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
      throw new ValidationError('Coupon usage limit reached');
    }

    return sendSuccess(res, coupon, 'Coupon is valid');
  }
}

export const couponController = new CouponController();
