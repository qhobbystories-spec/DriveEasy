import {
  generateBookingNumber,
  generateTransactionId,
  generateVerificationToken,
  generateResetToken,
} from '../generators';
import { validateEmail, validatePassword } from '../validators';

describe('generators', () => {
  it('generates unique booking numbers with the expected prefix', () => {
    const a = generateBookingNumber();
    const b = generateBookingNumber();
    expect(a).toMatch(/^BK-/);
    expect(a).not.toBe(b);
  });

  it('generates transaction ids with the expected prefix', () => {
    expect(generateTransactionId()).toMatch(/^TXN-/);
  });

  it('generates cryptographically strong verification tokens', () => {
    const token = generateVerificationToken();
    expect(token).toMatch(/^[0-9a-f]{64}$/);
    expect(token).not.toBe(generateVerificationToken());
  });

  it('generates cryptographically strong reset tokens', () => {
    const token = generateResetToken();
    expect(token).toMatch(/^[0-9a-f]{64}$/);
    expect(token).not.toBe(generateResetToken());
  });
});

describe('validators', () => {
  it('validates email addresses', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('not-an-email')).toBe(false);
  });

  it('enforces a minimum password length of 8', () => {
    expect(validatePassword('password123')).toBe(true);
    expect(validatePassword('short')).toBe(false);
  });
});
