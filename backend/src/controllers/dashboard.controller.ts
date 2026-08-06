import { Response } from 'express';
import { BookingStatus } from '@prisma/client';
import prisma from '../prisma/client';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../middleware/auth.middleware';

export class DashboardController {
  async adminStats(req: AuthRequest, res: Response) {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalCars,
      availableCars,
      totalBookings,
      pendingBookings,
      activeBookings,
      totalCustomers,
      totalRevenue,
      monthRevenue,
      recentBookings,
    ] = await Promise.all([
      prisma.car.count({ where: { deletedAt: null } }),
      prisma.car.count({ where: { deletedAt: null, status: 'AVAILABLE' } }),
      prisma.booking.count(),
      prisma.booking.count({ where: { bookingStatus: 'PENDING' } }),
      prisma.booking.count({ where: { bookingStatus: 'ACTIVE' } }),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.payment.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true },
      }),
      prisma.payment.aggregate({
        where: { status: 'COMPLETED', createdAt: { gte: startOfMonth } },
        _sum: { amount: true },
      }),
      prisma.booking.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: { select: { id: true, firstName: true, lastName: true } },
          car: { select: { id: true, brand: true, model: true, mainImage: true } },
        },
      }),
    ]);

    return sendSuccess(
      res,
      {
        totalCars,
        availableCars,
        totalBookings,
        pendingBookings,
        activeBookings,
        totalCustomers,
        totalRevenue: totalRevenue._sum.amount ?? 0,
        monthRevenue: monthRevenue._sum.amount ?? 0,
        recentBookings,
      },
      'Dashboard stats retrieved successfully'
    );
  }

  async bookingStats(req: AuthRequest, res: Response) {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }

    const statuses: BookingStatus[] = ['PENDING', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'REJECTED', 'RETURNED'];
    const counts: Record<string, number> = {};

    await Promise.all(
      statuses.map(async status => {
        counts[status] = await prisma.booking.count({ where: { bookingStatus: status } });
      })
    );

    return sendSuccess(res, counts, 'Booking stats retrieved successfully');
  }

  async recentActivity(req: AuthRequest, res: Response) {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }

    const auditLogs = await prisma.auditLog.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    return sendSuccess(res, auditLogs, 'Recent activity retrieved successfully');
  }
}

export const dashboardController = new DashboardController();
