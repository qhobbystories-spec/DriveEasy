import { Router, Request, Response, RequestHandler } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { paymentController } from '../controllers/payment.controller';

const router = Router();

const asyncHandler = (fn: RequestHandler): RequestHandler => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.get('/my-payments', authenticate, asyncHandler((req: Request, res: Response) => paymentController.listMine(req, res)));
router.post('/', authenticate, asyncHandler((req: Request, res: Response) => paymentController.create(req, res)));
router.get('/booking/:bookingId', authenticate, asyncHandler((req: Request, res: Response) => paymentController.getByBooking(req, res)));

export default router;
