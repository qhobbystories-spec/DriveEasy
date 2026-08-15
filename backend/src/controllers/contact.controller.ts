import { Request, Response } from 'express';
import { ContactStatus } from '@prisma/client';
import prisma from '../prisma/client';
import { sendSuccess, sendPaginated, sendError } from '../utils/response';
import { getPaginationParams } from '../utils/pagination';
import { NotFoundError, ValidationError } from '../utils/errors';
import { AuthRequest } from '../middleware/auth.middleware';
import { isValidUUID, validateEmail } from '../utils/validators';
import { emailService } from '../services/email.service';
import { logger } from '../utils/logger';
import { broadcastNewMessage } from '../sockets/handlers';

export class ContactController {
  async create(req: Request, res: Response) {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      throw new ValidationError('name, email and message are required');
    }
    if (String(name).length > 200) {
      throw new ValidationError('Name must be under 200 characters');
    }
    if (!validateEmail(String(email))) {
      throw new ValidationError('Invalid email address');
    }
    if (String(message).length > 5000) {
      throw new ValidationError('Message must be under 5000 characters');
    }
    if (subject && String(subject).length > 200) {
      throw new ValidationError('Subject must be under 200 characters');
    }
    if (phone && String(phone).length > 20) {
      throw new ValidationError('Phone must be under 20 characters');
    }

    const contact = await prisma.contact.create({
      data: { name, email, phone, subject, message },
    });

    broadcastNewMessage(contact);

    return sendSuccess(res, contact, 'Message sent successfully', 201);
  }

  async list(req: AuthRequest, res: Response) {
    const page = parseInt(String(req.query.page ?? '1'));
    const limit = parseInt(String(req.query.limit ?? '20'));
    const { skip } = getPaginationParams(page, limit);

    const status = req.query.status as ContactStatus | undefined;
    const where = status ? { status } : {};

    const [messages, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.contact.count({ where }),
    ]);

    return sendPaginated(res, messages, total, page, limit, 'Messages retrieved successfully');
  }

  async getById(req: AuthRequest, res: Response) {
    const { id } = req.params;
    if (!isValidUUID(id)) {
      throw new NotFoundError('Message');
    }

    const message = await prisma.contact.findUnique({ where: { id } });
    if (!message) {
      throw new NotFoundError('Message');
    }

    return sendSuccess(res, message, 'Message retrieved successfully');
  }

  async reply(req: AuthRequest, res: Response) {
    const { id } = req.params;
    if (!isValidUUID(id)) {
      throw new NotFoundError('Message');
    }

    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }

    const { reply } = req.body;
    if (!reply) {
      throw new ValidationError('Reply text is required');
    }

    const message = await prisma.contact.findUnique({ where: { id } });
    if (!message) {
      throw new NotFoundError('Message');
    }

    const updated = await prisma.contact.update({
      where: { id },
      data: {
        reply,
        status: 'REPLIED',
        repliedAt: new Date(),
        repliedBy: req.user.id,
      },
    });

    try {
      await emailService.sendContactReply(message.email, message.subject, reply);
    } catch (error) {
      logger.warn('Failed to send contact reply email', { contactId: id });
    }

    return sendSuccess(res, updated, 'Reply sent successfully');
  }

  async markRead(req: AuthRequest, res: Response) {
    const { id } = req.params;
    if (!isValidUUID(id)) {
      throw new NotFoundError('Message');
    }

    const message = await prisma.contact.findUnique({ where: { id } });
    if (!message) {
      throw new NotFoundError('Message');
    }

    const updated = await prisma.contact.update({
      where: { id },
      data: { status: 'READ' },
    });

    return sendSuccess(res, updated, 'Message marked as read');
  }
}

export const contactController = new ContactController();
