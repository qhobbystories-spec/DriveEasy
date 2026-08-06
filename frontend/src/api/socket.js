import { io } from 'socket.io-client';
import { getToken } from './client';

let socket = null;

export function connectSocket(userId, { onNotification, onBookingUpdate, onPaymentConfirmed, onNewMessage } = {}) {
  if (socket?.connected) return socket;

  const token = getToken();
  if (!token) return null;

  socket = io(import.meta.env.VITE_API_URL || window.location.origin, {
    transports: ['websocket', 'polling'],
    auth: { token },
  });

  socket.on('connect', () => {
    if (userId) {
      socket.emit('join-user', userId);
    }
  });

  if (onNotification) socket.on('notification:new', onNotification);
  if (onBookingUpdate) {
    socket.on('booking:new', onBookingUpdate);
    socket.on('booking:approved', onBookingUpdate);
    socket.on('booking:rejected', onBookingUpdate);
  }
  if (onPaymentConfirmed) socket.on('payment:confirmed', onPaymentConfirmed);
  if (onNewMessage) socket.on('message:new', onNewMessage);

  return socket;
}

export function joinAdminRoom() {
  if (socket?.connected) {
    socket.emit('join-admin');
  }
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getSocket() {
  return socket;
}
