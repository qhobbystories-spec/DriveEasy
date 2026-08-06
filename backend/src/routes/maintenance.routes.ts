import { Router, Request, Response, RequestHandler } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { maintenanceController } from '../controllers/maintenance.controller';

const router = Router();

const asyncHandler = (fn: RequestHandler): RequestHandler => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.get('/', authenticate, asyncHandler((req: Request, res: Response) => maintenanceController.list(req, res)));
router.get('/:id', authenticate, asyncHandler((req: Request, res: Response) => maintenanceController.getById(req, res)));
router.post('/', authenticate, authorize('ADMIN'), asyncHandler((req: Request, res: Response) => maintenanceController.create(req, res)));
router.put('/:id', authenticate, authorize('ADMIN'), asyncHandler((req: Request, res: Response) => maintenanceController.update(req, res)));
router.delete('/:id', authenticate, authorize('ADMIN'), asyncHandler((req: Request, res: Response) => maintenanceController.remove(req, res)));

export default router;
