import { Router, Request, Response, RequestHandler } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { contactController } from '../controllers/contact.controller';
import { contactLimiter } from '../middleware/rateLimit';

const router = Router();

const asyncHandler = (fn: RequestHandler): RequestHandler => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.get('/', authenticate, authorize('ADMIN'), asyncHandler((req: Request, res: Response) => contactController.list(req, res)));
router.post('/', contactLimiter, asyncHandler((req: Request, res: Response) => contactController.create(req, res)));
router.get('/:id', authenticate, authorize('ADMIN'), asyncHandler((req: Request, res: Response) => contactController.getById(req, res)));
router.post('/:id/reply', authenticate, authorize('ADMIN'), asyncHandler((req: Request, res: Response) => contactController.reply(req, res)));
router.put('/:id/read', authenticate, authorize('ADMIN'), asyncHandler((req: Request, res: Response) => contactController.markRead(req, res)));

export default router;
