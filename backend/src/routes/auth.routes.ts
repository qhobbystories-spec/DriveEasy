import { Router, Request, Response, RequestHandler } from 'express';
import { authController } from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validation';
import {
  registerValidator,
  loginValidator,
  changePasswordValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  verifyEmailValidator,
} from '../validators/auth.validator';
import { authenticate } from '../middleware/auth.middleware';
import { authLimiter, passwordResetLimiter, registrationLimiter } from '../middleware/rateLimit';

const router = Router();

// Async error wrapper
const asyncHandler = (fn: RequestHandler): RequestHandler => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  '/register',
  registrationLimiter,
  registerValidator,
  validateRequest,
  asyncHandler((req: Request, res: Response) => authController.register(req, res))
);

/**
 * @route   POST /api/auth/login
 * @desc    User login
 * @access  Public
 */
router.post(
  '/login',
  authLimiter,
  loginValidator,
  validateRequest,
  asyncHandler((req: Request, res: Response) => authController.login(req, res))
);

/**
 * @route   POST /api/auth/logout
 * @desc    User logout
 * @access  Private
 */
router.post(
  '/logout',
  authenticate,
  asyncHandler((req: Request, res: Response) => authController.logout(req, res))
);

/**
 * @route   POST /api/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.post(
  '/change-password',
  authenticate,
  changePasswordValidator,
  validateRequest,
  asyncHandler((req: Request, res: Response) => authController.changePassword(req, res))
);

/**
 * @route   POST /api/auth/refresh-token
 * @desc    Refresh access token
 * @access  Public
 */
router.post(
  '/refresh-token',
  asyncHandler((req: Request, res: Response) => authController.refreshToken(req, res))
);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
router.post(
  '/forgot-password',
  passwordResetLimiter,
  forgotPasswordValidator,
  validateRequest,
  asyncHandler((req: Request, res: Response) => authController.forgotPassword(req, res))
);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post(
  '/reset-password',
  passwordResetLimiter,
  resetPasswordValidator,
  validateRequest,
  asyncHandler((req: Request, res: Response) => authController.resetPassword(req, res))
);

/**
 * @route   POST /api/auth/verify-email
 * @desc    Verify email address
 * @access  Public
 */
router.post(
  '/verify-email',
  verifyEmailValidator,
  validateRequest,
  asyncHandler((req: Request, res: Response) => authController.verifyEmail(req, res))
);

export default router;
