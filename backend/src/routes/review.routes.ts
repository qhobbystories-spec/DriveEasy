import { Router, Request, Response, RequestHandler } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { reviewController } from '../controllers/review.controller';

const router = Router();

const asyncHandler = (fn: RequestHandler): RequestHandler => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.get('/my-reviews', authenticate, asyncHandler((req: Request, res: Response) => reviewController.listMine(req, res)));
router.get('/car/:carId', asyncHandler((req: Request, res: Response) => reviewController.listByCar(req, res)));
router.post('/', authenticate, asyncHandler((req: Request, res: Response) => reviewController.create(req, res)));
router.delete('/:id', authenticate, asyncHandler((req: Request, res: Response) => reviewController.remove(req, res)));

export default router;
