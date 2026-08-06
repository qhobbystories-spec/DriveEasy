import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/environment';
import { AppError } from '../utils/errors';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticate = (req: AuthRequest, _res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

    if (!token) {
      throw new AppError('No token provided', 401);
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded as any;
    next();
  } catch (error) {
    throw new AppError('Unauthorized', 401);
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError('Forbidden: Insufficient permissions', 403);
    }

    next();
  };
};

export const optional = (req: AuthRequest, _res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

    if (token) {
      const decoded = jwt.verify(token, config.jwtSecret);
      req.user = decoded as any;
    }
  } catch (error) {
    // Optional auth, so ignore errors
  }

  next();
};
