import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'express-async-errors';

import { config } from './config/environment';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/logging';
import { apiLimiter } from './middleware/rateLimit';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import carRoutes from './routes/car.routes';
import sparePartRoutes from './routes/sparePart.routes';
import towingVehicleRoutes from './routes/towingVehicle.routes';
import bookingRoutes from './routes/booking.routes';
import paymentRoutes from './routes/payment.routes';
import reviewRoutes from './routes/review.routes';
import contactRoutes from './routes/contact.routes';
import dashboardRoutes from './routes/dashboard.routes';
import wishlistRoutes from './routes/wishlist.routes';
import couponRoutes from './routes/coupon.routes';
import notificationRoutes from './routes/notification.routes';
import maintenanceRoutes from './routes/maintenance.routes';

const app: Express = express();

// ============================================
// MIDDLEWARE
// ============================================

// Security
app.use(helmet());
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// Logging
app.use(requestLogger);

// ============================================
// HEALTH CHECK
// ============================================

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// ============================================
// API ROUTES
// ============================================

app.use('/api', apiLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/parts', sparePartRoutes);
app.use('/api/towing', towingVehicleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/messages', contactRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/maintenance', maintenanceRoutes);

// ============================================
// ERROR HANDLING
// ============================================

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
