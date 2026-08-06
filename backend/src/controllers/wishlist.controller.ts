import { Response } from 'express';
import prisma from '../prisma/client';
import { sendSuccess, sendError } from '../utils/response';
import { NotFoundError, ValidationError, ConflictError } from '../utils/errors';
import { AuthRequest } from '../middleware/auth.middleware';
import { isValidUUID } from '../utils/validators';

export class WishlistController {
  async list(req: AuthRequest, res: Response) {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }

    const items = await prisma.wishlist.findMany({
      where: { userId: req.user.id },
      include: {
        car: {
          select: {
            id: true,
            brand: true,
            model: true,
            year: true,
            dailyPrice: true,
            mainImage: true,
            category: true,
            status: true,
            rating: true,
            totalReviews: true,
            location: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return sendSuccess(res, items, 'Wishlist retrieved successfully');
  }

  async add(req: AuthRequest, res: Response) {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }

    const { carId } = req.body;
    if (!isValidUUID(carId)) {
      throw new ValidationError('Invalid car id');
    }

    const car = await prisma.car.findFirst({ where: { id: carId, deletedAt: null } });
    if (!car) {
      throw new NotFoundError('Car');
    }

    const existing = await prisma.wishlist.findUnique({
      where: { userId_carId: { userId: req.user.id, carId } },
    });
    if (existing) {
      throw new ConflictError('Car already in wishlist');
    }

    const item = await prisma.wishlist.create({
      data: { userId: req.user.id, carId },
    });

    return sendSuccess(res, item, 'Added to wishlist', 201);
  }

  async remove(req: AuthRequest, res: Response) {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }

    const { carId } = req.params;
    if (!isValidUUID(carId)) {
      throw new NotFoundError('Wishlist item');
    }

    await prisma.wishlist.deleteMany({
      where: { userId: req.user.id, carId },
    });

    return sendSuccess(res, null, 'Removed from wishlist');
  }

  async toggle(req: AuthRequest, res: Response) {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }

    const { carId } = req.body;
    if (!isValidUUID(carId)) {
      throw new ValidationError('Invalid car id');
    }

    const existing = await prisma.wishlist.findUnique({
      where: { userId_carId: { userId: req.user.id, carId } },
    });

    if (existing) {
      await prisma.wishlist.delete({ where: { id: existing.id } });
      return sendSuccess(res, { inWishlist: false }, 'Removed from wishlist');
    }

    await prisma.wishlist.create({ data: { userId: req.user.id, carId } });
    return sendSuccess(res, { inWishlist: true }, 'Added to wishlist');
  }
}

export const wishlistController = new WishlistController();
