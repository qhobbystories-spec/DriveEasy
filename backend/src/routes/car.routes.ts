import { Router, Request, Response, RequestHandler } from 'express';
import { authenticate, authorize, optional } from '../middleware/auth.middleware';
import { carController } from '../controllers/car.controller';
import { validateRequest } from '../middleware/validation';
import { carCreateValidator, carUpdateValidator } from '../validators/car.validator';

const router = Router();

const asyncHandler = (fn: RequestHandler): RequestHandler => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.get('/', asyncHandler((req: Request, res: Response) => carController.list(req, res)));
router.get('/search/advanced', asyncHandler((req: Request, res: Response) => carController.advancedSearch(req, res)));
router.get('/categories/all', asyncHandler((req: Request, res: Response) => carController.getCategories(req, res)));
router.get('/:id', optional, asyncHandler((req: Request, res: Response) => carController.getById(req, res)));
router.post('/', authenticate, authorize('ADMIN'), carCreateValidator, validateRequest, asyncHandler((req: Request, res: Response) => carController.create(req, res)));
router.put('/:id', authenticate, authorize('ADMIN'), carUpdateValidator, validateRequest, asyncHandler((req: Request, res: Response) => carController.update(req, res)));
router.delete('/:id', authenticate, authorize('ADMIN'), asyncHandler((req: Request, res: Response) => carController.remove(req, res)));

export default router;
