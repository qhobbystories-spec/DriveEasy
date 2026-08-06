import crypto from 'crypto';

const randomPart = (length: number): string =>
  crypto.randomBytes(length).toString('hex').toUpperCase();

export const generateBookingNumber = (): string => {
  const timestamp = Date.now().toString().slice(-6);
  return `BK-${timestamp}-${randomPart(3)}`;
};

export const generateTransactionId = (): string => {
  const timestamp = Date.now().toString().slice(-6);
  return `TXN-${timestamp}-${randomPart(3)}`;
};

export const generateReceiptNumber = (): string => {
  const timestamp = Date.now().toString().slice(-6);
  return `RCP-${timestamp}-${randomPart(3)}`;
};

export const generateInvoiceNumber = (): string => {
  const timestamp = Date.now().toString().slice(-6);
  return `INV-${timestamp}-${randomPart(3)}`;
};

export const generateUUID = (): string => crypto.randomUUID();

export const generateVerificationToken = (): string =>
  crypto.randomBytes(32).toString('hex');

export const generateResetToken = (): string =>
  crypto.randomBytes(32).toString('hex');
