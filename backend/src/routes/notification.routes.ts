import { Router, Request, Response, RequestHandler } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { notificationController } from '../controllers/notification.controller';

const router = Router();

const asyncHandler = (fn: RequestHandler): RequestHandler => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.get('/', authenticate, asyncHandler((req: Request, res: Response) => notificationController.list(req, res)));
router.get('/unread-count', authenticate, asyncHandler((req: Request, res: Response) => notificationController.unreadCount(req, res)));
router.put('/mark-all-read', authenticate, asyncHandler((req: Request, res: Response) => notificationController.markAllRead(req, res)));
router.put('/:id/mark-read', authenticate, asyncHandler((req: Request, res: Response) => notificationController.markRead(req, res)));

export default router;
