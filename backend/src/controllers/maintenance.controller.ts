import { Response } from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../prisma/client';
import { sendSuccess, sendPaginated } from '../utils/response';
import { getPaginationParams } from '../utils/pagination';
import { NotFoundError, ValidationError } from '../utils/errors';
import { AuthRequest } from '../middleware/auth.middleware';
import { isValidUUID } from '../utils/validators';
import { writeAuditLog } from '../utils/audit';

const MAINTENANCE_SELECT = {
  id: true,
  carId: true,
  type: true,
  description: true,
  startDate: true,
  endDate: true,
  cost: true,
  createdAt: true,
} satisfies Prisma.MaintenanceSelect;

export class MaintenanceController {
  async list(req: AuthRequest, res: Response) {
    const page = parseInt(String(req.query.page ?? '1'));
    const limit = parseInt(String(req.query.limit ?? '20'));
    const { skip } = getPaginationParams(page, limit);

    const { carId } = req.query;
    const where: Prisma.MaintenanceWhereInput = {};
    if (carId) where.carId = String(carId);

    const [records, total] = await Promise.all([
      prisma.maintenance.findMany({
        where,
        select: MAINTENANCE_SELECT,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.maintenance.count({ where }),
    ]);

    return sendPaginated(res, records, total, page, limit, 'Maintenance records retrieved successfully');
  }

  async getById(req: AuthRequest, res: Response) {
    const { id } = req.params;
    if (!isValidUUID(id)) {
      throw new NotFoundError('Maintenance record');
    }

    const record = await prisma.maintenance.findUnique({
      where: { id },
      select: MAINTENANCE_SELECT,
    });
    if (!record) {
      throw new NotFoundError('Maintenance record');
    }

    return sendSuccess(res, record, 'Maintenance record retrieved successfully');
  }

  async create(req: AuthRequest, res: Response) {
    const { carId, type, description, startDate, endDate, cost } = req.body;

    if (!carId || !type || !description || !startDate) {
      throw new ValidationError('carId, type, description and startDate are required');
    }
    if (!isValidUUID(carId)) {
      throw new ValidationError('Invalid car id');
    }

    const car = await prisma.car.findFirst({ where: { id: carId, deletedAt: null } });
    if (!car) {
      throw new NotFoundError('Car');
    }

    const record = await prisma.maintenance.create({
      data: {
        carId,
        type,
        description,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        cost: cost !== undefined ? Number(cost) : null,
      },
      select: MAINTENANCE_SELECT,
    });

    writeAuditLog({
      userId: req.user!.id,
      action: 'CREATE',
      entityType: 'Maintenance',
      entityId: record.id,
      carId,
      req,
    });

    return sendSuccess(res, record, 'Maintenance record created successfully', 201);
  }

  async update(req: AuthRequest, res: Response) {
    const { id } = req.params;
    if (!isValidUUID(id)) {
      throw new NotFoundError('Maintenance record');
    }

    const existing = await prisma.maintenance.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError('Maintenance record');
    }

    const { type, description, startDate, endDate, cost } = req.body;

    const record = await prisma.maintenance.update({
      where: { id },
      data: {
        type: type ?? existing.type,
        description: description ?? existing.description,
        startDate: startDate ? new Date(startDate) : existing.startDate,
        endDate: endDate !== undefined ? (endDate ? new Date(endDate) : null) : existing.endDate,
        cost: cost !== undefined ? Number(cost) : existing.cost,
      },
      select: MAINTENANCE_SELECT,
    });

    writeAuditLog({
      userId: req.user!.id,
      action: 'UPDATE',
      entityType: 'Maintenance',
      entityId: id,
      carId: existing.carId,
      req,
    });

    return sendSuccess(res, record, 'Maintenance record updated successfully');
  }

  async remove(req: AuthRequest, res: Response) {
    const { id } = req.params;
    if (!isValidUUID(id)) {
      throw new NotFoundError('Maintenance record');
    }

    const existing = await prisma.maintenance.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError('Maintenance record');
    }

    await prisma.maintenance.delete({ where: { id } });

    writeAuditLog({
      userId: req.user!.id,
      action: 'DELETE',
      entityType: 'Maintenance',
      entityId: id,
      carId: existing.carId,
      req,
    });

    return sendSuccess(res, null, 'Maintenance record deleted successfully');
  }
}

export const maintenanceController = new MaintenanceController();
