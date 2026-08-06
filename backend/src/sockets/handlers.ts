import { Server as HTTPServer } from 'http';
import { Socket, Server as SocketIOServer } from 'socket.io';
import { config } from '../config/environment';
import { logger } from '../utils/logger';

export let io: SocketIOServer;

export const initializeSocket = (httpServer: HTTPServer) => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: config.frontendUrl,
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  io.on('connection', (socket: Socket) => {
    logger.info(`User connected: ${socket.id}`);

    // Join user room
    socket.on('join-user', (userId: string) => {
      socket.join(`user-${userId}`);
      logger.debug(`User ${userId} joined their room`);
    });

    // Join admin room
    socket.on('join-admin', () => {
      socket.join('admin-room');
      logger.debug(`Admin joined admin room`);
    });

    // Leave room
    socket.on('leave-room', (room: string) => {
      socket.leave(room);
      logger.debug(`User left room: ${room}`);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.id}`);
    });

    // Handle errors
    socket.on('error', (error: any) => {
      logger.error('Socket error', error);
    });
  });

  return io;
};

export const emitToUser = (userId: string, event: string, data: any) => {
  if (io) {
    io.to(`user-${userId}`).emit(event, data);
  }
};

export const emitToAdmin = (event: string, data: any) => {
  if (io) {
    io.to('admin-room').emit(event, data);
  }
};

export const emitToAll = (event: string, data: any) => {
  if (io) {
    io.emit(event, data);
  }
};

export const broadcastNotification = (userId: string, notification: any) => {
  emitToUser(userId, 'notification:new', notification);
};

export const broadcastBookingRequest = (bookingData: any) => {
  emitToAdmin('booking:new', bookingData);
};

export const broadcastBookingApproved = (userId: string, bookingData: any) => {
  emitToUser(userId, 'booking:approved', bookingData);
};

export const broadcastBookingRejected = (userId: string, bookingData: any) => {
  emitToUser(userId, 'booking:rejected', bookingData);
};

export const broadcastPaymentConfirmed = (userId: string, paymentData: any) => {
  emitToUser(userId, 'payment:confirmed', paymentData);
};

export const broadcastMessageReply = (userId: string, messageData: any) => {
  emitToUser(userId, 'message:reply', messageData);
};

export const broadcastReviewSubmitted = (reviewData: any) => {
  emitToAdmin('review:submitted', reviewData);
};

export const broadcastNewMessage = (messageData: any) => {
  emitToAdmin('message:new', messageData);
};
