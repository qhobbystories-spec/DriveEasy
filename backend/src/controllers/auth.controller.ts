import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../middleware/auth.middleware';

const REFRESH_COOKIE_NAME = 'refreshToken';
const REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

export class AuthController {
  private setRefreshCookie(res: Response, refreshToken: string) {
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: REFRESH_COOKIE_MAX_AGE,
    });
  }

  private clearRefreshCookie(res: Response) {
    res.clearCookie(REFRESH_COOKIE_NAME, { path: '/' });
  }

  async register(req: Request, res: Response) {
    const { email, password, firstName, lastName, phone } = req.body;

    const result = await authService.register(
      email,
      password,
      firstName,
      lastName,
      phone
    );

    this.setRefreshCookie(res, result.refreshToken);

    return sendSuccess(
      res,
      {
        user: result.user,
        accessToken: result.accessToken,
      },
      'Registration successful',
      201
    );
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    this.setRefreshCookie(res, result.refreshToken);

    return sendSuccess(
      res,
      {
        user: result.user,
        accessToken: result.accessToken,
      },
      'Login successful',
      200
    );
  }

  async logout(_req: Request, res: Response) {
    this.clearRefreshCookie(res);

    return sendSuccess(res, null, 'Logout successful', 200);
  }

  async changePassword(req: AuthRequest, res: Response) {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }

    const { oldPassword, newPassword } = req.body;

    await authService.changePassword(req.user.id, oldPassword, newPassword);

    return sendSuccess(res, null, 'Password changed successfully', 200);
  }

  async refreshToken(req: Request, res: Response) {
    const token = req.cookies[REFRESH_COOKIE_NAME];

    if (!token) {
      return sendError(res, 'Refresh token not found', 401);
    }

    const result = await authService.refreshToken(token);

    this.setRefreshCookie(res, result.refreshToken);

    return sendSuccess(
      res,
      {
        user: result.user,
        accessToken: result.accessToken,
      },
      'Token refreshed successfully',
      200
    );
  }

  async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;

    await authService.forgotPassword(email);

    return sendSuccess(
      res,
      null,
      'If the account exists, a password reset link has been sent to the email',
      200
    );
  }

  async resetPassword(req: Request, res: Response) {
    const { token, password } = req.body;

    await authService.resetPassword(token, password);

    return sendSuccess(res, null, 'Password reset successful', 200);
  }

  async verifyEmail(req: Request, res: Response) {
    const { token } = req.body;

    await authService.verifyEmail(token);

    return sendSuccess(res, null, 'Email verified successfully', 200);
  }
}

export const authController = new AuthController();
