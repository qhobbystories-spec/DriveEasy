import { Router, Request, Response, RequestHandler } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { wishlistController } from '../controllers/wishlist.controller';

const router = Router();

const asyncHandler = (fn: RequestHandler): RequestHandler => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.get('/', authenticate, asyncHandler((req: Request, res: Response) => wishlistController.list(req, res)));
router.post('/', authenticate, asyncHandler((req: Request, res: Response) => wishlistController.add(req, res)));
router.post('/toggle', authenticate, asyncHandler((req: Request, res: Response) => wishlistController.toggle(req, res)));
router.delete('/:carId', authenticate, asyncHandler((req: Request, res: Response) => wishlistController.remove(req, res)));

export default router;
