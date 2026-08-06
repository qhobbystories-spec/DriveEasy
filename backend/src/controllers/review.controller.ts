import { Request, Response } from 'express';
import prisma from '../prisma/client';
import { sendSuccess, sendPaginated, sendError } from '../utils/response';
import { getPaginationParams } from '../utils/pagination';
import { NotFoundError, ValidationError, AuthorizationError } from '../utils/errors';
import { AuthRequest } from '../middleware/auth.middleware';
import { isValidUUID } from '../utils/validators';

export class ReviewController {
  async create(req: AuthRequest, res: Response) {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }

    const { carId, rating, comment, images } = req.body;

    if (!isValidUUID(carId)) {
      throw new ValidationError('Invalid car id');
    }
    if (!rating || rating < 1 || rating > 5) {
      throw new ValidationError('Rating must be between 1 and 5');
    }

    const car = await prisma.car.findFirst({ where: { id: carId, deletedAt: null } });
    if (!car) {
      throw new NotFoundError('Car');
    }

    const existing = await prisma.review.findUnique({
      where: { carId_userId: { carId, userId: req.user.id } },
    });
    if (existing) {
      throw new ValidationError('You have already reviewed this car');
    }

    const review = await prisma.review.create({
      data: {
        carId,
        userId: req.user.id,
        rating: Number(rating),
        comment,
        images: images ? JSON.parse(JSON.stringify(images)) : undefined,
      },
    });

    // Recompute car rating aggregate
    const aggregate = await prisma.review.aggregate({
      where: { carId },
      _avg: { rating: true },
      _count: { _all: true },
    });
    await prisma.car.update({
      where: { id: carId },
      data: {
        rating: aggregate._avg.rating ?? 0,
        totalReviews: aggregate._count._all,
      },
    });

    return sendSuccess(res, review, 'Review submitted successfully', 201);
  }

  async listByCar(req: Request, res: Response) {
    const { carId } = req.params;
    if (!isValidUUID(carId)) {
      throw new NotFoundError('Reviews');
    }

    const page = parseInt(String(req.query.page ?? '1'));
    const limit = parseInt(String(req.query.limit ?? '10'));
    const { skip } = getPaginationParams(page, limit);

    const where = { carId };
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          user: { select: { id: true, firstName: true, lastName: true, profileImage: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.review.count({ where }),
    ]);

    return sendPaginated(res, reviews, total, page, limit, 'Reviews retrieved successfully');
  }

  async listMine(req: AuthRequest, res: Response) {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }

    const reviews = await prisma.review.findMany({
      where: { userId: req.user.id },
      include: { car: { select: { id: true, brand: true, model: true, mainImage: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return sendSuccess(res, reviews, 'Reviews retrieved successfully');
  }

  async remove(req: AuthRequest, res: Response) {
    const { id } = req.params;
    if (!isValidUUID(id)) {
      throw new NotFoundError('Review');
    }

    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) {
      throw new NotFoundError('Review');
    }

    const isStaff = req.user?.role === 'ADMIN' || req.user?.role === 'EMPLOYEE';
    if (!isStaff && review.userId !== req.user?.id) {
      throw new AuthorizationError();
    }

    await prisma.review.delete({ where: { id } });

    const aggregate = await prisma.review.aggregate({
      where: { carId: review.carId },
      _avg: { rating: true },
      _count: { _all: true },
    });
    await prisma.car.update({
      where: { id: review.carId },
      data: {
        rating: aggregate._avg.rating ?? 0,
        totalReviews: aggregate._count._all,
      },
    });

    return sendSuccess(res, null, 'Review deleted successfully');
  }
}

export const reviewController = new ReviewController();
