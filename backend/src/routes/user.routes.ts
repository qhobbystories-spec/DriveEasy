import { Router, Request, Response, RequestHandler } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { userController } from '../controllers/user.controller';

const router = Router();

const asyncHandler = (fn: RequestHandler): RequestHandler => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * @route   GET /api/users/profile/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get(
  '/profile/me',
  authenticate,
  asyncHandler((req: Request, res: Response) => userController.profileMe(req, res))
);

/**
 * @route   GET /api/users
 * @desc    Get all users (admin only)
 * @access  Private/Admin
 */
router.get(
  '/',
  authenticate,
  authorize('ADMIN'),
  asyncHandler((req: Request, res: Response) => userController.list(req, res))
);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private
 */
router.get(
  '/:id',
  authenticate,
  asyncHandler((req: Request, res: Response) => userController.getById(req, res))
);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user
 * @access  Private
 */
router.put(
  '/:id',
  authenticate,
  asyncHandler((req: Request, res: Response) => userController.update(req, res))
);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user (admin only)
 * @access  Private/Admin
 */
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  asyncHandler((req: Request, res: Response) => userController.remove(req, res))
);

export default router;
