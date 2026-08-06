import { Router, Request, Response, RequestHandler } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { bookingController } from '../controllers/booking.controller';
import { validateRequest } from '../middleware/validation';
import { bookingCreateValidator } from '../validators/booking.validator';

const router = Router();

const asyncHandler = (fn: RequestHandler): RequestHandler => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.get('/', authenticate, asyncHandler((req: Request, res: Response) => bookingController.list(req, res)));
router.post('/', authenticate, bookingCreateValidator, validateRequest, asyncHandler((req: Request, res: Response) => bookingController.create(req, res)));
router.post('/:id/approve', authenticate, authorize('ADMIN'), asyncHandler((req: Request, res: Response) => bookingController.approve(req, res)));
router.post('/:id/reject', authenticate, authorize('ADMIN'), asyncHandler((req: Request, res: Response) => bookingController.reject(req, res)));
router.post('/:id/activate', authenticate, authorize('ADMIN', 'EMPLOYEE'), asyncHandler((req: Request, res: Response) => bookingController.activate(req, res)));
router.post('/:id/complete', authenticate, authorize('ADMIN', 'EMPLOYEE'), asyncHandler((req: Request, res: Response) => bookingController.complete(req, res)));
router.post('/:id/return', authenticate, authorize('ADMIN', 'EMPLOYEE'), asyncHandler((req: Request, res: Response) => bookingController.return(req, res)));
router.delete('/:id', authenticate, asyncHandler((req: Request, res: Response) => bookingController.cancel(req, res)));
router.get('/:id', authenticate, asyncHandler((req: Request, res: Response) => bookingController.getById(req, res)));

export default router;
