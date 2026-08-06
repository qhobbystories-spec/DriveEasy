import nodemailer from 'nodemailer';
import { config } from '../config/environment';
import { logger } from '../utils/logger';

const transporter = nodemailer.createTransport({
  host: config.smtpHost,
  port: config.smtpPort,
  secure: config.smtpPort === 465,
  auth: {
    user: config.smtpUser,
    pass: config.smtpPass,
  },
});

export class EmailService {
  async sendWelcomeEmail(email: string, name: string, verificationLink: string) {
    const htmlContent = this.welcomeTemplate(name, verificationLink);

    await this.send(email, 'Welcome to AMK Motors & AutoCare', htmlContent);
  }

  async sendBookingConfirmation(
    email: string,
    bookingNumber: string,
    carName: string,
    pickupDate: string,
    totalPrice: number
  ) {
    const htmlContent = this.bookingConfirmationTemplate(bookingNumber, carName, pickupDate, totalPrice);

    await this.send(email, 'Booking Confirmation', htmlContent);
  }

  async sendBookingApproved(
    email: string,
    bookingNumber: string,
    carName: string,
    pickupTime: string,
    pickupLocation: string
  ) {
    const htmlContent = this.bookingApprovedTemplate(bookingNumber, carName, pickupTime, pickupLocation);

    await this.send(email, 'Booking Approved', htmlContent);
  }

  async sendBookingRejected(email: string, bookingNumber: string, reason: string) {
    const htmlContent = this.bookingRejectedTemplate(bookingNumber, reason);

    await this.send(email, 'Booking Rejected', htmlContent);
  }

  async sendPasswordResetEmail(email: string, resetLink: string) {
    const htmlContent = this.passwordResetTemplate(resetLink);

    await this.send(email, 'Reset Your Password', htmlContent);
  }

  async sendContactReply(email: string, subject: string, reply: string) {
    const htmlContent = this.contactReplyTemplate(subject, reply);

    await this.send(email, 'We Replied to Your Message', htmlContent);
  }

  async sendPaymentConfirmation(
    email: string,
    transactionId: string,
    amount: number,
    currency: string
  ) {
    const htmlContent = this.paymentConfirmationTemplate(transactionId, amount, currency);

    await this.send(email, 'Payment Confirmed', htmlContent);
  }

  private async send(to: string, subject: string, html: string) {
    try {
      await transporter.sendMail({
        from: config.emailFrom,
        to,
        subject,
        html,
      });

      logger.info('Email sent', { to, subject });
    } catch (error) {
      logger.error('Failed to send email', { to, subject, error });
      throw error;
    }
  }

  private welcomeTemplate(name: string, verificationLink: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Arial', sans-serif; color: #333; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: white; border-radius: 8px; }
          .header { background: linear-gradient(135deg, #e63946 0%, #a4161a 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { padding: 30px; }
          .button { background: #e63946; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
          .footer { color: #999; font-size: 12px; text-align: center; padding: 20px; border-top: 1px solid #eee; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to AMK Motors & AutoCare</h1>
          </div>
          <div class="content">
            <p>Hello ${name},</p>
            <p>Thank you for joining AMK Motors & AutoCare. We're excited to have you on board!</p>
            <p>To get started, please verify your email address by clicking the button below:</p>
            <a href="${verificationLink}" class="button">Verify Email Address</a>
            <p>If you didn't create this account, please ignore this email.</p>
            <p>Best regards,<br><strong>AMK Motors & AutoCare Team</strong></p>
          </div>
          <div class="footer">
            <p>&copy; 2026 AMK Motors & AutoCare. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private bookingConfirmationTemplate(
    bookingNumber: string,
    carName: string,
    pickupDate: string,
    totalPrice: number
  ): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Arial', sans-serif; color: #333; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: white; border-radius: 8px; }
          .header { background: #e63946; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .details { background: #f9f9f9; padding: 20px; margin: 20px 0; border-left: 4px solid #e63946; }
          .details-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .details-row:last-child { border-bottom: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Booking Confirmation</h1>
          </div>
          <div style="padding: 30px;">
            <p>Thank you for your booking! Your reservation has been received and is pending admin approval.</p>
            <div class="details">
              <div class="details-row">
                <span><strong>Booking Number:</strong></span>
                <span>${bookingNumber}</span>
              </div>
              <div class="details-row">
                <span><strong>Vehicle:</strong></span>
                <span>${carName}</span>
              </div>
              <div class="details-row">
                <span><strong>Pickup Date:</strong></span>
                <span>${pickupDate}</span>
              </div>
              <div class="details-row">
                <span><strong>Total Price:</strong></span>
                <span><strong>GHS ${totalPrice.toFixed(2)}</strong></span>
              </div>
            </div>
            <p>You will receive a confirmation email once your booking is approved by our admin team.</p>
            <p>Best regards,<br><strong>AMK Motors & AutoCare</strong></p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private bookingApprovedTemplate(
    bookingNumber: string,
    carName: string,
    pickupTime: string,
    pickupLocation: string
  ): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Arial', sans-serif; color: #333; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: white; border-radius: 8px; }
          .header { background: #2ecc71; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .alert { background: #e8f5e9; border-left: 4px solid #2ecc71; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✓ Booking Approved!</h1>
          </div>
          <div style="padding: 30px;">
            <div class="alert">
              <p><strong>Your booking has been approved!</strong></p>
            </div>
            <p><strong>Pickup Details:</strong></p>
            <ul>
              <li><strong>Booking Number:</strong> ${bookingNumber}</li>
              <li><strong>Vehicle:</strong> ${carName}</li>
              <li><strong>Pickup Time:</strong> ${pickupTime}</li>
              <li><strong>Pickup Location:</strong> ${pickupLocation}</li>
            </ul>
            <p>Please arrive 15 minutes before your pickup time. Bring a valid ID and driver's license.</p>
            <p>Best regards,<br><strong>AMK Motors & AutoCare</strong></p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private bookingRejectedTemplate(bookingNumber: string, reason: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Arial', sans-serif; color: #333; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: white; border-radius: 8px; }
          .header { background: #e74c3c; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Booking Rejected</h1>
          </div>
          <div style="padding: 30px;">
            <p>Unfortunately, your booking (${bookingNumber}) has been rejected.</p>
            <p><strong>Reason:</strong></p>
            <p>${reason}</p>
            <p>Please feel free to submit another booking or contact our support team for assistance.</p>
            <p>Best regards,<br><strong>AMK Motors & AutoCare</strong></p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private passwordResetTemplate(resetLink: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Arial', sans-serif; color: #333; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: white; border-radius: 8px; }
          .header { background: #3498db; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .button { background: #3498db; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div style="padding: 30px;">
            <p>We received a request to reset your password. Click the button below to proceed:</p>
            <a href="${resetLink}" class="button">Reset Password</a>
            <div class="warning">
              <p><strong>⚠️ Security Notice:</strong></p>
              <p>This link will expire in 1 hour. If you didn't request this, please ignore this email.</p>
            </div>
            <p>Best regards,<br><strong>AMK Motors & AutoCare</strong></p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private contactReplyTemplate(subject: string, reply: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Arial', sans-serif; color: #333; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: white; border-radius: 8px; }
          .header { background: #e63946; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .reply-box { background: #f9f9f9; border-left: 4px solid #e63946; padding: 20px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>We've Replied to Your Message</h1>
          </div>
          <div style="padding: 30px;">
            <p><strong>Subject:</strong> ${subject}</p>
            <div class="reply-box">
              <p>${reply}</p>
            </div>
            <p>Thank you for reaching out to AMK Motors & AutoCare!</p>
            <p>Best regards,<br><strong>AMK Motors & AutoCare Team</strong></p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private paymentConfirmationTemplate(transactionId: string, amount: number, currency: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Arial', sans-serif; color: #333; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: white; border-radius: 8px; }
          .header { background: #2ecc71; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .receipt { background: #f9f9f9; padding: 20px; margin: 20px 0; border: 1px solid #ddd; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Payment Confirmed ✓</h1>
          </div>
          <div style="padding: 30px;">
            <p>Thank you for your payment! Your transaction has been processed successfully.</p>
            <div class="receipt">
              <p><strong>Transaction ID:</strong> ${transactionId}</p>
              <p><strong>Amount:</strong> ${currency} ${amount.toFixed(2)}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            <p>You will receive a detailed invoice shortly.</p>
            <p>Best regards,<br><strong>AMK Motors & AutoCare</strong></p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

export const emailService = new EmailService();
