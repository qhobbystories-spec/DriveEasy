import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ValidationError } from '../utils/errors';

export const validateRequest = (req: Request, _res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg).join(', ');
    throw new ValidationError(errorMessages);
  }

  next();
};

export const validateId = (paramName: string = 'id') => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const id = req.params[paramName];

    if (!id || id.length === 0) {
      throw new ValidationError(`${paramName} is required`);
    }

    next();
  };
};
