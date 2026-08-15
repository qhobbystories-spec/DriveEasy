import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../prisma/client';
import { sendSuccess, sendPaginated } from '../utils/response';
import { getPaginationParams } from '../utils/pagination';
import { NotFoundError, ValidationError } from '../utils/errors';
import { AuthRequest } from '../middleware/auth.middleware';
import { isValidUUID } from '../utils/validators';

const VEHICLE_SELECT = {
  id: true,
  brand: true,
  name: true,
  tag: true,
  towCapacity: true,
  price: true,
  currency: true,
  image: true,
  description: true,
  operator: true,
  phone: true,
  experience: true,
  rating: true,
  totalReviews: true,
  available: true,
  location: true,
} satisfies Prisma.TowingVehicleSelect;

const buildWhere = (req: Request): Prisma.TowingVehicleWhereInput => {
  const { tag, location, search } = req.query;
  const where: Prisma.TowingVehicleWhereInput = { deletedAt: null };

  if (tag) where.tag = String(tag);
  if (location) where.location = { contains: String(location) };

  if (search) {
    const term = String(search);
    where.OR = [
      { name: { contains: term } },
      { brand: { contains: term } },
      { location: { contains: term } },
    ];
  }

  return where;
};

export class TowingVehicleController {
  async list(req: Request, res: Response) {
    const page = parseInt(String(req.query.page ?? '1'));
    const limit = parseInt(String(req.query.limit ?? '24'));
    const { skip } = getPaginationParams(page, limit);

    const where = buildWhere(req);
    const [vehicles, total] = await Promise.all([
      prisma.towingVehicle.findMany({
        where,
        select: VEHICLE_SELECT,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.towingVehicle.count({ where }),
    ]);

    return sendPaginated(res, vehicles, total, page, limit, 'Towing vehicles retrieved successfully');
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    if (!isValidUUID(id)) {
      throw new NotFoundError('TowingVehicle');
    }

    const vehicle = await prisma.towingVehicle.findFirst({ where: { id, deletedAt: null } });
    if (!vehicle) {
      throw new NotFoundError('TowingVehicle');
    }

    return sendSuccess(res, vehicle, 'Towing vehicle retrieved successfully');
  }

  async create(req: AuthRequest, res: Response) {
    const data = req.body;
    if (!data.name || !data.brand || !data.image) {
      throw new ValidationError('name, brand and image are required');
    }

    const vehicle = await prisma.towingVehicle.create({
      data: {
        brand: data.brand,
        name: data.name,
        tag: data.tag ?? 'Economy',
        towCapacity: data.towCapacity ?? '5 Tons',
        price: Number(data.price) || 0,
        currency: data.currency ?? 'GHS',
        image: data.image,
        description: data.description ?? null,
        operator: data.operator ?? null,
        phone: data.phone ?? null,
        experience: data.experience ?? null,
        available: data.available !== undefined ? Boolean(data.available) : true,
        location: data.location ?? 'Accra',
      },
    });
    return sendSuccess(res, vehicle, 'Towing vehicle created successfully', 201);
  }

  async update(req: AuthRequest, res: Response) {
    const { id } = req.params;
    if (!isValidUUID(id)) {
      throw new NotFoundError('TowingVehicle');
    }

    const existing = await prisma.towingVehicle.findFirst({ where: { id, deletedAt: null } });
    if (!existing) {
      throw new NotFoundError('TowingVehicle');
    }

    const data = req.body;
    const vehicle = await prisma.towingVehicle.update({
      where: { id },
      data: {
        brand: data.brand ?? existing.brand,
        name: data.name ?? existing.name,
        tag: data.tag ?? existing.tag,
        towCapacity: data.towCapacity ?? existing.towCapacity,
        price: data.price !== undefined ? Number(data.price) : existing.price,
        currency: data.currency ?? existing.currency,
        image: data.image ?? existing.image,
        description: data.description !== undefined ? data.description : existing.description,
        operator: data.operator !== undefined ? data.operator : existing.operator,
        phone: data.phone !== undefined ? data.phone : existing.phone,
        experience: data.experience !== undefined ? data.experience : existing.experience,
        available: data.available !== undefined ? Boolean(data.available) : existing.available,
        location: data.location ?? existing.location,
      },
    });
    return sendSuccess(res, vehicle, 'Towing vehicle updated successfully');
  }

  async remove(req: AuthRequest, res: Response) {
    const { id } = req.params;
    if (!isValidUUID(id)) {
      throw new NotFoundError('TowingVehicle');
    }

    const existing = await prisma.towingVehicle.findFirst({ where: { id, deletedAt: null } });
    if (!existing) {
      throw new NotFoundError('TowingVehicle');
    }

    await prisma.towingVehicle.update({ where: { id }, data: { deletedAt: new Date() } });
    return sendSuccess(res, null, 'Towing vehicle deleted successfully');
  }
}

export const towingVehicleController = new TowingVehicleController();
