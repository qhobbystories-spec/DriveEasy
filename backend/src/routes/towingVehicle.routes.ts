import { Router, Request, Response, RequestHandler } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { towingVehicleController } from '../controllers/towingVehicle.controller';

const router = Router();

const asyncHandler = (fn: RequestHandler): RequestHandler => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.get('/', asyncHandler((req: Request, res: Response) => towingVehicleController.list(req, res)));
router.get('/:id', asyncHandler((req: Request, res: Response) => towingVehicleController.getById(req, res)));
router.post('/', authenticate, authorize('ADMIN'), asyncHandler((req: Request, res: Response) => towingVehicleController.create(req, res)));
router.put('/:id', authenticate, authorize('ADMIN'), asyncHandler((req: Request, res: Response) => towingVehicleController.update(req, res)));
router.delete('/:id', authenticate, authorize('ADMIN'), asyncHandler((req: Request, res: Response) => towingVehicleController.remove(req, res)));

export default router;
