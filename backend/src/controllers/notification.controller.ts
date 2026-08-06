import { Response } from 'express';
import prisma from '../prisma/client';
import { sendSuccess, sendPaginated, sendError } from '../utils/response';
import { getPaginationParams } from '../utils/pagination';
import { AuthRequest } from '../middleware/auth.middleware';
import { isValidUUID } from '../utils/validators';

export class NotificationController {
  async list(req: AuthRequest, res: Response) {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }

    const page = parseInt(String(req.query.page ?? '1'));
    const limit = parseInt(String(req.query.limit ?? '20'));
    const { skip } = getPaginationParams(page, limit);

    const where = { userId: req.user.id };
    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.notification.count({ where }),
    ]);

    return sendPaginated(res, notifications, total, page, limit, 'Notifications retrieved successfully');
  }

  async unreadCount(req: AuthRequest, res: Response) {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }

    const count = await prisma.notification.count({
      where: { userId: req.user.id, isRead: false },
    });

    return sendSuccess(res, { count }, 'Unread count retrieved');
  }

  async markRead(req: AuthRequest, res: Response) {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }

    const { id } = req.params;
    if (!isValidUUID(id)) {
      return sendError(res, 'Invalid notification id', 400);
    }

    await prisma.notification.updateMany({
      where: { id, userId: req.user.id },
      data: { isRead: true },
    });

    return sendSuccess(res, null, 'Notification marked as read');
  }

  async markAllRead(req: AuthRequest, res: Response) {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }

    await prisma.notification.updateMany({
      where: { userId: req.user.id, isRead: false },
      data: { isRead: true },
    });

    return sendSuccess(res, null, 'All notifications marked as read');
  }
}

export const notificationController = new NotificationController();
