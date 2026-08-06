import { Request } from 'express';
import prisma from '../prisma/client';
import { logger } from './logger';

interface AuditLogParams {
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  carId?: string;
  changes?: Record<string, unknown>;
  req?: Request;
}

export const writeAuditLog = async (params: AuditLogParams): Promise<void> => {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        carId: params.carId,
        changes: params.changes ? JSON.stringify(params.changes) : null,
        ipAddress: params.req?.ip,
        userAgent: params.req?.headers['user-agent'],
      },
    });
  } catch (error) {
    logger.warn('Failed to write audit log', {
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
    });
  }
};
