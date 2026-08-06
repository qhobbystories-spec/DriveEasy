import { Response } from 'express';
import { PaymentMethod } from '@prisma/client';
import prisma from '../prisma/client';
import { sendSuccess, sendPaginated, sendError } from '../utils/response';
import { getPaginationParams } from '../utils/pagination';
import { NotFoundError, ValidationError } from '../utils/errors';
import { AuthRequest } from '../middleware/auth.middleware';
import { isValidUUID } from '../utils/validators';
import { generateTransactionId, generateReceiptNumber } from '../utils/generators';
import { emailService } from '../services/email.service';
import { logger } from '../utils/logger';
import { writeAuditLog } from '../utils/audit';
import { broadcastPaymentConfirmed } from '../sockets/handlers';

export class PaymentController {
  async create(req: AuthRequest, res: Response) {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }

    const { bookingId, method } = req.body;
    if (!isValidUUID(bookingId)) {
      throw new ValidationError('Invalid booking id');
    }
    if (!method) {
      throw new ValidationError('Payment method is required');
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { customer: { select: { id: true, email: true } } },
    });
    if (!booking) {
      throw new NotFoundError('Booking');
    }

    const isStaff = req.user.role === 'ADMIN' || req.user.role === 'EMPLOYEE';
    if (!isStaff && booking.customerId !== req.user.id) {
      return sendError(res, 'Forbidden', 403);
    }

    const existing = await prisma.payment.findUnique({ where: { bookingId } });
    if (existing) {
      throw new ValidationError('Booking already has a payment');
    }

    const payment = await prisma.payment.create({
      data: {
        transactionId: generateTransactionId(),
        bookingId,
        userId: booking.customerId,
        amount: booking.totalPrice,
        currency: 'GHS',
        status: 'COMPLETED',
        method: method as PaymentMethod,
        receiptNumber: generateReceiptNumber(),
        paidAt: new Date(),
      },
    });

    await prisma.booking.update({
      where: { id: bookingId },
      data: { paymentStatus: 'COMPLETED' },
    });

    broadcastPaymentConfirmed(booking.customerId, payment);

    writeAuditLog({
      userId: req.user.id,
      action: 'CREATE',
      entityType: 'Payment',
      entityId: payment.id,
      changes: { bookingId, amount: payment.amount, method },
      req,
    });

    try {
      await emailService.sendPaymentConfirmation(
        booking.customer.email,
        payment.transactionId,
        payment.amount,
        payment.currency
      );
    } catch (error) {
      logger.warn('Failed to send payment confirmation email', { bookingId });
    }

    return sendSuccess(res, payment, 'Payment recorded successfully', 201);
  }

  async getByBooking(req: AuthRequest, res: Response) {
    const { bookingId } = req.params;
    if (!isValidUUID(bookingId)) {
      throw new NotFoundError('Payment');
    }

    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) {
      throw new NotFoundError('Booking');
    }

    const isStaff = req.user?.role === 'ADMIN' || req.user?.role === 'EMPLOYEE';
    if (!isStaff && booking.customerId !== req.user?.id) {
      return sendError(res, 'Forbidden', 403);
    }

    const payment = await prisma.payment.findUnique({ where: { bookingId } });
    return sendSuccess(res, payment, 'Payment retrieved successfully');
  }

  async listMine(req: AuthRequest, res: Response) {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }

    const page = parseInt(String(req.query.page ?? '1'));
    const limit = parseInt(String(req.query.limit ?? '10'));
    const { skip } = getPaginationParams(page, limit);

    const where = { userId: req.user.id };
    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: { booking: { select: { bookingNumber: true, car: { select: { brand: true, model: true } } } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.payment.count({ where }),
    ]);

    return sendPaginated(res, payments, total, page, limit, 'Payments retrieved successfully');
  }
}

export const paymentController = new PaymentController();
