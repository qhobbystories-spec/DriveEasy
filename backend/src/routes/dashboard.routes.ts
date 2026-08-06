import { Router, Request, Response, RequestHandler } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { dashboardController } from '../controllers/dashboard.controller';

const router = Router();

const asyncHandler = (fn: RequestHandler): RequestHandler => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.get('/stats', authenticate, authorize('ADMIN'), asyncHandler((req: Request, res: Response) => dashboardController.adminStats(req, res)));
router.get('/bookings', authenticate, authorize('ADMIN'), asyncHandler((req: Request, res: Response) => dashboardController.bookingStats(req, res)));
router.get('/activity', authenticate, authorize('ADMIN'), asyncHandler((req: Request, res: Response) => dashboardController.recentActivity(req, res)));

export default router;
