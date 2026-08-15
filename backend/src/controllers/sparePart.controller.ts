import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../prisma/client';
import { sendSuccess, sendPaginated } from '../utils/response';
import { getPaginationParams } from '../utils/pagination';
import { NotFoundError, ValidationError } from '../utils/errors';
import { AuthRequest } from '../middleware/auth.middleware';
import { isValidUUID } from '../utils/validators';

const PART_SELECT = {
  id: true,
  name: true,
  category: true,
  brand: true,
  price: true,
  currency: true,
  image: true,
  description: true,
  quantity: true,
  inStock: true,
  rating: true,
  totalReviews: true,
} satisfies Prisma.SparePartSelect;

const buildWhere = (req: Request): Prisma.SparePartWhereInput => {
  const { category, brand, search } = req.query;
  const where: Prisma.SparePartWhereInput = { deletedAt: null };

  if (category) where.category = String(category);
  if (brand) where.brand = { contains: String(brand) };

  if (search) {
    const term = String(search);
    where.OR = [
      { name: { contains: term } },
      { brand: { contains: term } },
      { category: { contains: term } },
    ];
  }

  return where;
};

export class SparePartController {
  async list(req: Request, res: Response) {
    const page = parseInt(String(req.query.page ?? '1'));
    const limit = parseInt(String(req.query.limit ?? '24'));
    const { skip } = getPaginationParams(page, limit);

    const where = buildWhere(req);
    const [parts, total] = await Promise.all([
      prisma.sparePart.findMany({
        where,
        select: PART_SELECT,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.sparePart.count({ where }),
    ]);

    return sendPaginated(res, parts, total, page, limit, 'Spare parts retrieved successfully');
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    if (!isValidUUID(id)) {
      throw new NotFoundError('SparePart');
    }

    const part = await prisma.sparePart.findFirst({ where: { id, deletedAt: null } });
    if (!part) {
      throw new NotFoundError('SparePart');
    }

    return sendSuccess(res, part, 'Spare part retrieved successfully');
  }

  async create(req: AuthRequest, res: Response) {
    const data = req.body;
    if (!data.name || !data.category || !data.image) {
      throw new ValidationError('name, category and image are required');
    }

    const part = await prisma.sparePart.create({
      data: {
        name: data.name,
        category: data.category,
        brand: data.brand ?? null,
        price: Number(data.price) || 0,
        currency: data.currency ?? 'GHS',
        image: data.image,
        description: data.description ?? null,
        quantity: Number(data.quantity) || 0,
        inStock: data.inStock !== undefined ? Boolean(data.inStock) : (Number(data.quantity) || 0) > 0,
      },
    });
    return sendSuccess(res, part, 'Spare part created successfully', 201);
  }

  async update(req: AuthRequest, res: Response) {
    const { id } = req.params;
    if (!isValidUUID(id)) {
      throw new NotFoundError('SparePart');
    }

    const existing = await prisma.sparePart.findFirst({ where: { id, deletedAt: null } });
    if (!existing) {
      throw new NotFoundError('SparePart');
    }

    const data = req.body;
    const part = await prisma.sparePart.update({
      where: { id },
      data: {
        name: data.name ?? existing.name,
        category: data.category ?? existing.category,
        brand: data.brand !== undefined ? data.brand : existing.brand,
        price: data.price !== undefined ? Number(data.price) : existing.price,
        currency: data.currency ?? existing.currency,
        image: data.image ?? existing.image,
        description: data.description !== undefined ? data.description : existing.description,
        quantity: data.quantity !== undefined ? Number(data.quantity) : existing.quantity,
        inStock: data.inStock !== undefined ? Boolean(data.inStock) : existing.inStock,
      },
    });
    return sendSuccess(res, part, 'Spare part updated successfully');
  }

  async remove(req: AuthRequest, res: Response) {
    const { id } = req.params;
    if (!isValidUUID(id)) {
      throw new NotFoundError('SparePart');
    }

    const existing = await prisma.sparePart.findFirst({ where: { id, deletedAt: null } });
    if (!existing) {
      throw new NotFoundError('SparePart');
    }

    await prisma.sparePart.update({ where: { id }, data: { deletedAt: new Date() } });
    return sendSuccess(res, null, 'Spare part deleted successfully');
  }
}

export const sparePartController = new SparePartController();
