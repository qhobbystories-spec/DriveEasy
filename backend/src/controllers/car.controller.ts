import { Request, Response } from 'express';
import { Car, CarStatus, Prisma } from '@prisma/client';
import prisma from '../prisma/client';
import { sendSuccess, sendPaginated } from '../utils/response';
import { getPaginationParams } from '../utils/pagination';
import { NotFoundError, ValidationError } from '../utils/errors';
import { AuthRequest } from '../middleware/auth.middleware';
import { isValidUUID } from '../utils/validators';
import { writeAuditLog } from '../utils/audit';

const CAR_SELECT = {
  id: true,
  brand: true,
  model: true,
  year: true,
  fuelType: true,
  transmission: true,
  color: true,
  plateNumber: true,
  seats: true,
  doors: true,
  airConditioning: true,
  gps: true,
  bluetooth: true,
  dailyPrice: true,
  weeklyPrice: true,
  monthlyPrice: true,
  deposit: true,
  mileage: true,
  description: true,
  location: true,
  status: true,
  category: true,
  mainImage: true,
  rating: true,
  totalReviews: true,
} satisfies Prisma.CarSelect;

const buildWhere = (req: Request): Prisma.CarWhereInput => {
  const {
    status,
    category,
    search,
    brand,
    minPrice,
    maxPrice,
    seats,
    fuelType,
    transmission,
  } = req.query;

  const where: Prisma.CarWhereInput = { deletedAt: null };

  if (status) where.status = status as CarStatus;
  if (category) where.category = category as Car['category'];
  if (fuelType) where.fuelType = fuelType as Car['fuelType'];
  if (transmission) where.transmission = transmission as Car['transmission'];
  if (brand) where.brand = { contains: String(brand) };
  if (seats) where.seats = { gte: parseInt(String(seats)) };

  const min = minPrice !== undefined ? parseFloat(String(minPrice)) : NaN;
  const max = maxPrice !== undefined ? parseFloat(String(maxPrice)) : NaN;
  if (!isNaN(min) || !isNaN(max)) {
    const priceFilter: Prisma.FloatFilter = {};
    if (!isNaN(min)) priceFilter.gte = min;
    if (!isNaN(max)) priceFilter.lte = max;
    where.dailyPrice = priceFilter;
  }

  if (search) {
    const term = String(search);
    where.OR = [
      { brand: { contains: term } },
      { model: { contains: term } },
      { location: { contains: term } },
      { description: { contains: term } },
    ];
  }

  return where;
};

export class CarController {
  async list(req: Request, res: Response) {
    const page = parseInt(String(req.query.page ?? '1'));
    const limit = parseInt(String(req.query.limit ?? '12'));
    const { skip } = getPaginationParams(page, limit);

    const where = buildWhere(req);
    // Public listings default to available cars
    if (where.deletedAt === null && !where.status) {
      where.status = { not: 'ARCHIVED' } as Prisma.EnumCarStatusFilter;
    }

    const [cars, total] = await Promise.all([
      prisma.car.findMany({
        where,
        select: CAR_SELECT,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.car.count({ where }),
    ]);

    return sendPaginated(res, cars, total, page, limit, 'Cars retrieved successfully');
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    if (!isValidUUID(id)) {
      throw new NotFoundError('Car');
    }

    const car = await prisma.car.findFirst({
      where: { id, deletedAt: null },
      include: {
        images: { orderBy: { order: 'asc' } },
        reviews: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true, profileImage: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!car) {
      throw new NotFoundError('Car');
    }

    return sendSuccess(res, car, 'Car retrieved successfully');
  }

  async create(req: AuthRequest, res: Response) {
    const data = req.body;
    if (!data.brand || !data.model || !data.mainImage) {
      throw new ValidationError('brand, model and mainImage are required');
    }

    const car = await prisma.car.create({ data });

    writeAuditLog({
      userId: req.user!.id,
      action: 'CREATE',
      entityType: 'Car',
      entityId: car.id,
      req,
    });

    return sendSuccess(res, car, 'Car created successfully', 201);
  }

  async update(req: AuthRequest, res: Response) {
    const { id } = req.params;
    if (!isValidUUID(id)) {
      throw new NotFoundError('Car');
    }

    const existing = await prisma.car.findFirst({ where: { id, deletedAt: null } });
    if (!existing) {
      throw new NotFoundError('Car');
    }

    const car = await prisma.car.update({ where: { id }, data: req.body });

    writeAuditLog({
      userId: req.user!.id,
      action: 'UPDATE',
      entityType: 'Car',
      entityId: car.id,
      req,
    });

    return sendSuccess(res, car, 'Car updated successfully');
  }

  async remove(req: AuthRequest, res: Response) {
    const { id } = req.params;
    if (!isValidUUID(id)) {
      throw new NotFoundError('Car');
    }

    const existing = await prisma.car.findFirst({ where: { id, deletedAt: null } });
    if (!existing) {
      throw new NotFoundError('Car');
    }

    // Soft delete
    await prisma.car.update({ where: { id }, data: { deletedAt: new Date(), status: 'ARCHIVED' } });

    writeAuditLog({
      userId: req.user!.id,
      action: 'DELETE',
      entityType: 'Car',
      entityId: id,
      req,
    });

    return sendSuccess(res, null, 'Car deleted successfully');
  }

  async advancedSearch(req: Request, res: Response) {
    const page = parseInt(String(req.query.page ?? '1'));
    const limit = parseInt(String(req.query.limit ?? '12'));
    const { skip } = getPaginationParams(page, limit);

    const where = buildWhere(req);
    const { pickupDate, returnDate } = req.query;

    // Exclude cars already booked for the requested period
    if (pickupDate && returnDate) {
      const start = new Date(String(pickupDate));
      const end = new Date(String(returnDate));

      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const bookedCarIds = await prisma.booking.findMany({
          where: {
            bookingStatus: { in: ['PENDING', 'CONFIRMED', 'ACTIVE'] },
            OR: [
              { AND: [{ pickupDate: { lte: end } }, { returnDate: { gte: start } }] },
            ],
          },
          select: { carId: true },
        });
        where.id = { notIn: [...new Set(bookedCarIds.map(b => b.carId))] };
      }
    }

    const [cars, total] = await Promise.all([
      prisma.car.findMany({
        where,
        select: CAR_SELECT,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.car.count({ where }),
    ]);

    return sendPaginated(res, cars, total, page, limit, 'Search results');
  }

  async getCategories(_req: Request, res: Response) {
    const categories = await prisma.car.groupBy({
      by: ['category'],
      _count: { _all: true },
      where: { deletedAt: null },
    });

    return sendSuccess(
      res,
      categories.map(c => ({ category: c.category, count: c._count._all })),
      'Categories retrieved'
    );
  }
}

export const carController = new CarController();
