import { userRepository } from '../repositories/user.repository';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateAuthTokens, verifyToken } from '../utils/jwt';
import { JWTPayload } from '../utils/jwt';
import { AuthenticationError, ConflictError, ValidationError } from '../utils/errors';
import { validateEmail, validatePassword } from '../utils/validators';
import { generateVerificationToken, generateResetToken } from '../utils/generators';
import { emailService } from './email.service';
import { config } from '../config/environment';
import prisma from '../prisma/client';
import { logger } from '../utils/logger';

const VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

export class AuthService {
  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone?: string
  ) {
    // Validate input
    if (!validateEmail(email)) {
      throw new ValidationError('Invalid email format');
    }

    if (!validatePassword(password)) {
      throw new ValidationError('Password must be at least 8 characters');
    }

    // Check if user exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await userRepository.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      role: 'CUSTOMER',
      isVerified: false,
    });

    logger.info('User registered', { email, userId: user.id });

    // Create verification token and send welcome email (non-fatal on failure)
    const verificationToken = generateVerificationToken();
    try {
      await prisma.verificationToken.create({
        data: {
          email: user.email,
          token: verificationToken,
          expiresAt: new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS),
        },
      });

      const verificationLink = `${config.frontendUrl}/verify-email?token=${verificationToken}`;
      await emailService.sendWelcomeEmail(user.email, user.firstName, verificationLink);
      logger.info('Verification email queued', { email: user.email });
    } catch (error) {
      logger.warn('Failed to send verification email', { email: user.email, error });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateAuthTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  }

  async login(email: string, password: string) {
    // Validate input
    if (!validateEmail(email)) {
      throw new ValidationError('Invalid email format');
    }

    // Find user
    const user = await userRepository.findByEmail(email.toLowerCase());
    if (!user) {
      throw new AuthenticationError('Invalid credentials');
    }

    // Verify password
    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      throw new AuthenticationError('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AuthenticationError('Invalid credentials');
    }

    logger.info('User logged in', { email, userId: user.id });

    // Generate tokens
    const { accessToken, refreshToken } = generateAuthTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    // Validate new password
    if (!validatePassword(newPassword)) {
      throw new ValidationError('New password must be at least 8 characters');
    }

    // Find user
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AuthenticationError('User not found');
    }

    // Verify old password
    const isValid = await comparePassword(oldPassword, user.password);
    if (!isValid) {
      throw new AuthenticationError('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await userRepository.update(userId, {
      password: hashedPassword,
    });

    logger.info('Password changed', { userId });

    return { success: true };
  }

  async refreshToken(refreshToken: string) {
    let payload: JWTPayload;
    try {
      payload = verifyToken(refreshToken, config.jwtRefreshSecret);
    } catch {
      throw new AuthenticationError('Invalid or expired refresh token');
    }

    const user = await userRepository.findById(payload.id);
    if (!user || !user.isActive) {
      throw new AuthenticationError('Invalid or expired refresh token');
    }

    const tokens = generateAuthTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: this.sanitizeUser(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async forgotPassword(email: string) {
    // Always return success so we don't leak whether an account exists
    const user = await userRepository.findByEmail(email.toLowerCase());
    if (!user) {
      return { success: true };
    }

    const token = generateResetToken();
    try {
      // Replace any previous reset tokens for this account
      await prisma.passwordResetToken.deleteMany({ where: { email: user.email } });
      await prisma.passwordResetToken.create({
        data: {
          email: user.email,
          token,
          expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
        },
      });

      const resetLink = `${config.frontendUrl}/reset-password?token=${token}`;
      await emailService.sendPasswordResetEmail(user.email, resetLink);
      logger.info('Password reset email sent', { email: user.email });
    } catch (error) {
      logger.warn('Failed to send password reset email', { email: user.email, error });
      if (config.nodeEnv !== 'production') {
        logger.info(`[dev] Password reset link for ${user.email}: ${config.frontendUrl}/reset-password?token=${token}`);
      }
    }

    return { success: true };
  }

  async resetPassword(token: string, newPassword: string) {
    if (!validatePassword(newPassword)) {
      throw new ValidationError('Password must be at least 8 characters');
    }

    const record = await prisma.passwordResetToken.findUnique({ where: { token } });
    if (!record || record.expiresAt < new Date()) {
      throw new ValidationError('Invalid or expired reset token');
    }

    const user = await userRepository.findByEmail(record.email);
    if (!user) {
      throw new ValidationError('Invalid or expired reset token');
    }

    const hashedPassword = await hashPassword(newPassword);
    await userRepository.update(user.id, { password: hashedPassword });
    await prisma.passwordResetToken.deleteMany({ where: { email: record.email } });

    logger.info('Password reset completed', { userId: user.id });

    return { success: true };
  }

  async verifyEmail(token: string) {
    const record = await prisma.verificationToken.findUnique({ where: { token } });
    if (!record || record.expiresAt < new Date()) {
      throw new ValidationError('Invalid or expired verification token');
    }

    const user = await userRepository.findByEmail(record.email);
    if (!user) {
      throw new ValidationError('Invalid or expired verification token');
    }

    await userRepository.verifyEmail(user.id);
    await prisma.verificationToken.deleteMany({ where: { email: record.email } });

    logger.info('Email verified', { userId: user.id });

    return { success: true };
  }

  private sanitizeUser(user: any) {
    const safeUser = { ...user };
    delete safeUser.password;
    return safeUser;
  }
}

export const authService = new AuthService();
