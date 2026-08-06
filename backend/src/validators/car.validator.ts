import { body } from 'express-validator';

const validCategories = ['SUV', 'LUXURY', 'SEDAN', 'CONVERTIBLE', 'PICKUP', 'HATCHBACK', 'VAN', 'ELECTRIC', 'HYBRID'];
const validFuelTypes = ['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID'];
const validTransmissions = ['AUTOMATIC', 'MANUAL'];
const validStatuses = ['AVAILABLE', 'RESERVED', 'RENTED', 'MAINTENANCE', 'ARCHIVED'];

export const carCreateValidator = [
  body('brand')
    .trim()
    .notEmpty().withMessage('Brand is required')
    .isLength({ max: 100 }).withMessage('Brand must be at most 100 characters'),
  body('model')
    .trim()
    .notEmpty().withMessage('Model is required')
    .isLength({ max: 100 }).withMessage('Model must be at most 100 characters'),
  body('year')
    .isInt({ min: 1900, max: 2100 }).withMessage('Year must be between 1900 and 2100'),
  body('fuelType')
    .isIn(validFuelTypes).withMessage(`Fuel type must be one of: ${validFuelTypes.join(', ')}`),
  body('transmission')
    .isIn(validTransmissions).withMessage(`Transmission must be one of: ${validTransmissions.join(', ')}`),
  body('color')
    .trim()
    .notEmpty().withMessage('Color is required'),
  body('plateNumber')
    .trim()
    .notEmpty().withMessage('Plate number is required'),
  body('vin')
    .trim()
    .notEmpty().withMessage('VIN is required'),
  body('seats')
    .isInt({ min: 1, max: 20 }).withMessage('Seats must be between 1 and 20'),
  body('doors')
    .isInt({ min: 2, max: 6 }).withMessage('Doors must be between 2 and 6'),
  body('dailyPrice')
    .isFloat({ min: 0 }).withMessage('Daily price must be a positive number'),
  body('weeklyPrice')
    .isFloat({ min: 0 }).withMessage('Weekly price must be a positive number'),
  body('monthlyPrice')
    .isFloat({ min: 0 }).withMessage('Monthly price must be a positive number'),
  body('deposit')
    .isFloat({ min: 0 }).withMessage('Deposit must be a positive number'),
  body('category')
    .isIn(validCategories).withMessage(`Category must be one of: ${validCategories.join(', ')}`),
  body('mainImage')
    .trim()
    .notEmpty().withMessage('Main image URL is required'),
  body('location')
    .trim()
    .notEmpty().withMessage('Location is required'),
];

export const carUpdateValidator = [
  body('brand')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 }).withMessage('Brand must be between 1 and 100 characters'),
  body('model')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 }).withMessage('Model must be between 1 and 100 characters'),
  body('year')
    .optional()
    .isInt({ min: 1900, max: 2100 }).withMessage('Year must be between 1900 and 2100'),
  body('fuelType')
    .optional()
    .isIn(validFuelTypes).withMessage(`Fuel type must be one of: ${validFuelTypes.join(', ')}`),
  body('transmission')
    .optional()
    .isIn(validTransmissions).withMessage(`Transmission must be one of: ${validTransmissions.join(', ')}`),
  body('dailyPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Daily price must be a positive number'),
  body('weeklyPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Weekly price must be a positive number'),
  body('monthlyPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Monthly price must be a positive number'),
  body('deposit')
    .optional()
    .isFloat({ min: 0 }).withMessage('Deposit must be a positive number'),
  body('category')
    .optional()
    .isIn(validCategories).withMessage(`Category must be one of: ${validCategories.join(', ')}`),
  body('status')
    .optional()
    .isIn(validStatuses).withMessage(`Status must be one of: ${validStatuses.join(', ')}`),
  body('seats')
    .optional()
    .isInt({ min: 1, max: 20 }).withMessage('Seats must be between 1 and 20'),
  body('doors')
    .optional()
    .isInt({ min: 2, max: 6 }).withMessage('Doors must be between 2 and 6'),
];
