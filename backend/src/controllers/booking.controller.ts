import { Response } from 'express';
import { BookingStatus, Prisma } from '@prisma/client';
import prisma from '../prisma/client';
import { sendSuccess, sendPaginated, sendError } from '../utils/response';
import { getPaginationParams } from '../utils/pagination';
import { NotFoundError, ValidationError, AuthorizationError } from '../utils/errors';
import { AuthRequest } from '../middleware/auth.middleware';
import { isValidUUID } from '../utils/validators';
import { generateBookingNumber } from '../utils/generators';
import { emailService } from '../services/email.service';
import { logger } from '../utils/logger';
import { writeAuditLog } from '../utils/audit';
import {
  broadcastBookingRequest,
  broadcastBookingApproved,
  broadcastBookingRejected,
  broadcastNotification,
} from '../sockets/handlers';

// Valid state transitions: from → allowed targets
const VALID_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  PENDING: ['CONFIRMED', 'REJECTED', 'CANCELLED'],
  CONFIRMED: ['ACTIVE', 'CANCELLED'],
  ACTIVE: ['COMPLETED', 'RETURNED'],
  COMPLETED: [],
  RETURNED: [],
  CANCELLED: [],
  REJECTED: [],
};

function assertTransition(current: BookingStatus, next: BookingStatus) {
  if (!VALID_TRANSITIONS[current].includes(next)) {
    throw new ValidationError(`Cannot transition from ${current} to ${next}`);
  }
}

const BOOKING_INCLUDE = {
  car: {
    select: {
      id: true,
      brand: true,
      model: true,
      year: true,
      mainImage: true,
      dailyPrice: true,
      plateNumber: true,
    },
  },
  customer: {
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
    },
  },
  payment: true,
} satisfies Prisma.BookingInclude;

export class BookingController {
  async list(req: AuthRequest, res: Response) {
    const page = parseInt(String(req.query.page ?? '1'));
    const limit = parseInt(String(req.query.limit ?? '10'));
    const { skip } = getPaginationParams(page, limit);

    const isStaff = req.user?.role === 'ADMIN' || req.user?.role === 'EMPLOYEE';
    const where: Prisma.BookingWhereInput = {};

    if (!isStaff) {
      if (!req.user) return sendError(res, 'Unauthorized', 401);
      where.customerId = req.user.id;
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: BOOKING_INCLUDE,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.booking.count({ where }),
    ]);

    return sendPaginated(res, bookings, total, page, limit, 'Bookings retrieved successfully');
  }

  async getById(req: AuthRequest, res: Response) {
    const { id } = req.params;
    if (!isValidUUID(id)) {
      throw new NotFoundError('Booking');
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: BOOKING_INCLUDE,
    });

    if (!booking) {
      throw new NotFoundError('Booking');
    }

    const isStaff = req.user?.role === 'ADMIN' || req.user?.role === 'EMPLOYEE';
    if (!isStaff && booking.customerId !== req.user?.id) {
      throw new AuthorizationError();
    }

    return sendSuccess(res, booking, 'Booking retrieved successfully');
  }

  async create(req: AuthRequest, res: Response) {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }

    const {
      carId,
      pickupLocation,
      returnLocation,
      pickupDate,
      returnDate,
      pickupTime,
      returnTime,
      insurance,
      driverRequired,
      numberOfDrivers,
      specialRequest,
      couponCode,
    } = req.body;

    if (!isValidUUID(carId)) {
      throw new ValidationError('Invalid car id');
    }
    if (!pickupDate || !returnDate) {
      throw new ValidationError('pickupDate and returnDate are required');
    }

    const car = await prisma.car.findFirst({ where: { id: carId, deletedAt: null } });
    if (!car) {
      throw new NotFoundError('Car');
    }

    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    if (end <= start) {
      throw new ValidationError('returnDate must be after pickupDate');
    }

    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86400000));
    let computedPrice = days * car.dailyPrice + (insurance ? 50 : 0) + (driverRequired ? 20 : 0);
    let discount = 0;

    const booking = await prisma.$transaction(async (tx) => {
      // Check the car is not already booked in the requested window (atomic with creation)
      const conflict = await tx.booking.findFirst({
        where: {
          carId,
          bookingStatus: { in: ['PENDING', 'CONFIRMED', 'ACTIVE'] },
          AND: [
            { pickupDate: { lte: end } },
            { returnDate: { gte: start } },
          ],
        },
      });
      if (conflict) {
        throw new ValidationError('Car is not available for the selected dates');
      }

      // Apply coupon if provided
      if (couponCode) {
        const coupon = await tx.coupon.findUnique({
          where: { code: String(couponCode).toUpperCase() },
        });
        if (!coupon || !coupon.isActive) {
          throw new ValidationError('Invalid coupon code');
        }
        if (coupon.expiresAt < new Date()) {
          throw new ValidationError('Coupon has expired');
        }

        // Atomically check and increment usedCount
        const updated = await tx.coupon.updateMany({
          where: {
            id: coupon.id,
            OR: [
              { maxUses: null },
              { usedCount: { lt: coupon.maxUses! } },
            ],
          },
          data: { usedCount: { increment: 1 } },
        });
        if (updated.count === 0) {
          throw new ValidationError('Coupon usage limit reached');
        }

        if (coupon.discountType === 'percentage') {
          discount = computedPrice * (coupon.discountValue / 100);
        } else {
          discount = Math.min(coupon.discountValue, computedPrice);
        }
        computedPrice = Math.max(0, computedPrice - discount);
      }

      const newBooking = await tx.booking.create({
        data: {
          bookingNumber: generateBookingNumber(),
          customerId: req.user.id,
          carId,
          pickupLocation,
          returnLocation: returnLocation ?? pickupLocation,
          pickupDate: start,
          returnDate: end,
          pickupTime,
          returnTime,
          insurance: Boolean(insurance),
          driverRequired: Boolean(driverRequired),
          numberOfDrivers: numberOfDrivers ?? 1,
          specialRequest,
          totalPrice: computedPrice,
          deposit: car.deposit,
          tax: 0,
          discount,
          paymentStatus: 'PENDING',
          bookingStatus: 'PENDING',
        },
        include: BOOKING_INCLUDE,
      });

      return newBooking;
    });

    // Notify admins of the new booking request
    const admins = await prisma.user.findMany({ where: { role: 'ADMIN' } });
    await prisma.notification.createMany({
      data: admins.map(a => ({
        userId: a.id,
        type: 'BOOKING_REQUEST',
        title: 'New booking request',
        message: `Booking ${booking.bookingNumber} for ${car.brand} ${car.model}`,
        relatedId: booking.id,
      })),
    });

    // Real-time: notify admins via Socket.IO
    broadcastBookingRequest(booking);

    // Send confirmation email to customer
    try {
      await emailService.sendBookingConfirmation(
        req.user.email,
        booking.bookingNumber,
        `${car.brand} ${car.model}`,
        start.toISOString().split('T')[0],
        computedPrice
      );
    } catch (error) {
      logger.warn('Failed to send booking confirmation email', { bookingId: booking.id });
    }

    writeAuditLog({
      userId: req.user.id,
      action: 'CREATE',
      entityType: 'Booking',
      entityId: booking.id,
      carId,
      changes: { bookingNumber: booking.bookingNumber, totalPrice: computedPrice },
      req,
    });

    return sendSuccess(res, booking, 'Booking created successfully', 201);
  }

  async cancel(req: AuthRequest, res: Response) {
    const { id } = req.params;
    if (!isValidUUID(id)) {
      throw new NotFoundError('Booking');
    }

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      throw new NotFoundError('Booking');
    }

    const isStaff = req.user?.role === 'ADMIN' || req.user?.role === 'EMPLOYEE';
    if (!isStaff && booking.customerId !== req.user?.id) {
      throw new AuthorizationError();
    }

    assertTransition(booking.bookingStatus, 'CANCELLED');

    const [updated] = await prisma.$transaction([
      prisma.booking.update({
        where: { id },
        data: { bookingStatus: 'CANCELLED' },
        include: BOOKING_INCLUDE,
      }),
      prisma.car.update({
        where: { id: booking.carId },
        data: { status: 'AVAILABLE' },
      }),
    ]);

    // Notify admins if customer cancelled; notify customer if staff cancelled
    const isCustomerCancel = req.user?.id === booking.customerId;
    const notificationRecipient = isCustomerCancel ? null : booking.customerId;
    if (notificationRecipient) {
      const cancelNotification = await prisma.notification.create({
        data: {
          userId: notificationRecipient,
          type: 'BOOKING_CANCELLED',
          title: 'Booking cancelled',
          message: `Booking ${booking.bookingNumber} has been cancelled`,
          relatedId: booking.id,
        },
      });
      broadcastNotification(notificationRecipient, cancelNotification);
    }

    writeAuditLog({
      userId: req.user!.id,
      action: 'CANCEL',
      entityType: 'Booking',
      entityId: booking.id,
      carId: booking.carId,
      req,
    });

    return sendSuccess(res, updated, 'Booking cancelled successfully');
  }

  async approve(req: AuthRequest, res: Response) {
    const { id } = req.params;
    if (!isValidUUID(id)) {
      throw new NotFoundError('Booking');
    }

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      throw new NotFoundError('Booking');
    }

    assertTransition(booking.bookingStatus, 'CONFIRMED');

    const [updated] = await prisma.$transaction([
      prisma.booking.update({
        where: { id },
        data: { bookingStatus: 'CONFIRMED' },
        include: BOOKING_INCLUDE,
      }),
      prisma.car.update({
        where: { id: booking.carId },
        data: { status: 'RESERVED' },
      }),
    ]);

    // Notify the customer
    const approvalNotification = await prisma.notification.create({
      data: {
        userId: booking.customerId,
        type: 'BOOKING_APPROVED',
        title: 'Booking approved',
        message: `Your booking ${booking.bookingNumber} has been approved`,
        relatedId: booking.id,
      },
    });

    broadcastBookingApproved(booking.customerId, updated);
    broadcastNotification(booking.customerId, approvalNotification);

    writeAuditLog({
      userId: req.user!.id,
      action: 'APPROVE',
      entityType: 'Booking',
      entityId: booking.id,
      carId: booking.carId,
      req,
    });

    try {
      await emailService.sendBookingApproved(
        updated.customer.email,
        updated.bookingNumber,
        `${updated.car.brand} ${updated.car.model}`,
        updated.pickupTime,
        updated.pickupLocation
      );
    } catch (error) {
      logger.warn('Failed to send booking approval email', { bookingId: booking.id });
    }

    return sendSuccess(res, updated, 'Booking approved successfully');
  }

  async reject(req: AuthRequest, res: Response) {
    const { id } = req.params;
    if (!isValidUUID(id)) {
      throw new NotFoundError('Booking');
    }

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      throw new NotFoundError('Booking');
    }

    assertTransition(booking.bookingStatus, 'REJECTED');

    const reason = req.body.reason || 'Requested dates are no longer available';

    const updated = await prisma.booking.update({
      where: { id },
      data: { bookingStatus: 'REJECTED' },
      include: BOOKING_INCLUDE,
    });

    const rejectionNotification = await prisma.notification.create({
      data: {
        userId: booking.customerId,
        type: 'BOOKING_REJECTED',
        title: 'Booking rejected',
        message: reason,
        relatedId: booking.id,
      },
    });

    broadcastBookingRejected(booking.customerId, updated);
    broadcastNotification(booking.customerId, rejectionNotification);

    writeAuditLog({
      userId: req.user!.id,
      action: 'REJECT',
      entityType: 'Booking',
      entityId: booking.id,
      carId: booking.carId,
      changes: { reason },
      req,
    });

    try {
      await emailService.sendBookingRejected(updated.customer.email, updated.bookingNumber, reason);
    } catch (error) {
      logger.warn('Failed to send booking rejection email', { bookingId: booking.id });
    }

    return sendSuccess(res, updated, 'Booking rejected successfully');
  }

  async activate(req: AuthRequest, res: Response) {
    const { id } = req.params;
    if (!isValidUUID(id)) {
      throw new NotFoundError('Booking');
    }

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      throw new NotFoundError('Booking');
    }

    assertTransition(booking.bookingStatus, 'ACTIVE');

    const [updated] = await prisma.$transaction([
      prisma.booking.update({
        where: { id },
        data: { bookingStatus: 'ACTIVE' },
        include: BOOKING_INCLUDE,
      }),
      prisma.car.update({
        where: { id: booking.carId },
        data: { status: 'RENTED' },
      }),
    ]);

    const notification = await prisma.notification.create({
      data: {
        userId: booking.customerId,
        type: 'BOOKING_APPROVED',
        title: 'Booking activated',
        message: `Your booking ${booking.bookingNumber} is now active — pickup confirmed`,
        relatedId: booking.id,
      },
    });
    broadcastNotification(booking.customerId, notification);

    writeAuditLog({
      userId: req.user!.id,
      action: 'ACTIVATE',
      entityType: 'Booking',
      entityId: booking.id,
      carId: booking.carId,
      req,
    });

    return sendSuccess(res, updated, 'Booking activated successfully');
  }

  async complete(req: AuthRequest, res: Response) {
    const { id } = req.params;
    if (!isValidUUID(id)) {
      throw new NotFoundError('Booking');
    }

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      throw new NotFoundError('Booking');
    }

    assertTransition(booking.bookingStatus, 'COMPLETED');

    const [updated] = await prisma.$transaction([
      prisma.booking.update({
        where: { id },
        data: { bookingStatus: 'COMPLETED', completedAt: new Date() },
        include: BOOKING_INCLUDE,
      }),
      prisma.car.update({
        where: { id: booking.carId },
        data: { status: 'AVAILABLE' },
      }),
    ]);

    const notification = await prisma.notification.create({
      data: {
        userId: booking.customerId,
        type: 'BOOKING_APPROVED',
        title: 'Booking completed',
        message: `Your booking ${booking.bookingNumber} has been completed. Thank you!`,
        relatedId: booking.id,
      },
    });
    broadcastNotification(booking.customerId, notification);

    writeAuditLog({
      userId: req.user!.id,
      action: 'COMPLETE',
      entityType: 'Booking',
      entityId: booking.id,
      carId: booking.carId,
      req,
    });

    return sendSuccess(res, updated, 'Booking completed successfully');
  }

  async return(req: AuthRequest, res: Response) {
    const { id } = req.params;
    if (!isValidUUID(id)) {
      throw new NotFoundError('Booking');
    }

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      throw new NotFoundError('Booking');
    }

    assertTransition(booking.bookingStatus, 'RETURNED');

    const [updated] = await prisma.$transaction([
      prisma.booking.update({
        where: { id },
        data: { bookingStatus: 'RETURNED', completedAt: new Date() },
        include: BOOKING_INCLUDE,
      }),
      prisma.car.update({
        where: { id: booking.carId },
        data: { status: 'AVAILABLE' },
      }),
    ]);

    const notification = await prisma.notification.create({
      data: {
        userId: booking.customerId,
        type: 'BOOKING_APPROVED',
        title: 'Vehicle returned',
        message: `Your booking ${booking.bookingNumber} — vehicle has been returned`,
        relatedId: booking.id,
      },
    });
    broadcastNotification(booking.customerId, notification);

    writeAuditLog({
      userId: req.user!.id,
      action: 'RETURN',
      entityType: 'Booking',
      entityId: booking.id,
      carId: booking.carId,
      req,
    });

    return sendSuccess(res, updated, 'Vehicle returned successfully');
  }
}

export const bookingController = new BookingController();
