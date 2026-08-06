import { body } from 'express-validator';

export const bookingCreateValidator = [
  body('carId')
    .notEmpty().withMessage('Car ID is required'),
  body('pickupLocation')
    .trim()
    .notEmpty().withMessage('Pickup location is required'),
  body('pickupDate')
    .notEmpty().withMessage('Pickup date is required')
    .isISO8601().withMessage('Pickup date must be a valid date'),
  body('returnDate')
    .notEmpty().withMessage('Return date is required')
    .isISO8601().withMessage('Return date must be a valid date'),
  body('pickupTime')
    .optional()
    .trim(),
  body('returnTime')
    .optional()
    .trim(),
  body('insurance')
    .optional()
    .isBoolean().withMessage('Insurance must be a boolean'),
  body('driverRequired')
    .optional()
    .isBoolean().withMessage('Driver required must be a boolean'),
  body('numberOfDrivers')
    .optional()
    .isInt({ min: 0, max: 5 }).withMessage('Number of drivers must be between 0 and 5'),
  body('specialRequest')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Special request must be at most 1000 characters'),
];
