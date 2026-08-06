import { Router, Request, Response, RequestHandler } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { couponController } from '../controllers/coupon.controller';

const router = Router();

const asyncHandler = (fn: RequestHandler): RequestHandler => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post('/validate', asyncHandler((req: Request, res: Response) => couponController.validate(req, res)));
router.get('/', authenticate, authorize('ADMIN'), asyncHandler((req: Request, res: Response) => couponController.list(req, res)));
router.post('/', authenticate, authorize('ADMIN'), asyncHandler((req: Request, res: Response) => couponController.create(req, res)));
router.put('/:id', authenticate, authorize('ADMIN'), asyncHandler((req: Request, res: Response) => couponController.update(req, res)));
router.delete('/:id', authenticate, authorize('ADMIN'), asyncHandler((req: Request, res: Response) => couponController.remove(req, res)));

export default router;
