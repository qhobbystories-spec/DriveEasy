import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  // Log request
  logger.debug(`${req.method} ${req.path}`, {
    query: req.query,
    ip: req.ip,
  });

  // Capture response
  const originalSend = res.send;

  res.send = function (data: any) {
    const duration = Date.now() - start;

    logger.info(`${req.method} ${req.path} - ${res.statusCode}`, {
      duration: `${duration}ms`,
      status: res.statusCode,
    });

    return originalSend.call(this, data);
  };

  next();
};
