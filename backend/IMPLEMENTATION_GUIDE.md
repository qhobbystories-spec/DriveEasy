# Backend Implementation Guide

## Quick Start

This guide explains how to complete the backend implementation started in this repository.

## Files Already Created

✅ Core Configuration
- `src/app.ts` - Express app setup
- `src/config/environment.ts` - Environment variables
- `.env.example` - Template

✅ Database
- `prisma/schema.prisma` - Complete database schema
- All models, relationships, indexes, enums

✅ Utilities
- `src/utils/errors.ts` - Custom error classes
- `src/utils/logger.ts` - Logging utility
- `src/utils/jwt.ts` - JWT token generation/verification
- `src/utils/hash.ts` - Password hashing
- `src/utils/generators.ts` - ID/number generators

✅ Middleware
- `src/middleware/auth.middleware.ts` - Authentication & authorization
- `src/middleware/errorHandler.ts` - Error handling

✅ Documentation
- `README.md` - Complete API documentation
- `IMPLEMENTATION_GUIDE.md` - This file

## Files to Create

### 1. Additional Middleware

**`src/middleware/logging.ts`**
```typescript
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.path}`, {
      status: res.statusCode,
      duration: `${duration}ms`,
    });
  });
  
  next();
};
```

**`src/middleware/validation.ts`**
```typescript
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ValidationError } from '../utils/errors';

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    throw new ValidationError(errors.array()[0].msg);
  }
  
  next();
};
```

**`src/middleware/rateLimiter.ts`**
```typescript
import rateLimit from 'express-rate-limit';
import { config } from '../config/environment';

export const generalLimiter = rateLimit({
  windowMs: config.rateLimitWindow * 60 * 1000,
  max: config.rateLimitMaxRequests,
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts, please try again later.',
});
```

### 2. Repositories

**`src/repositories/user.repository.ts`**
```typescript
import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

export class UserRepository {
  async create(data: any): Promise<User> {
    return await prisma.user.create({ data });
  }

  async findById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({ where: { email } });
  }

  async update(id: string, data: any): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async list(skip: number = 0, take: number = 10): Promise<User[]> {
    return await prisma.user.findMany({
      where: { deletedAt: null },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }
}

export const userRepository = new UserRepository();
```

Create similar repositories for:
- `Car.repository.ts`
- `Booking.repository.ts`
- `Payment.repository.ts`
- `Review.repository.ts`
- `Contact.repository.ts`
- `Coupon.repository.ts`
- `AuditLog.repository.ts`

### 3. Services

**`src/services/auth.service.ts`**
```typescript
import { userRepository } from '../repositories/user.repository';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateAuthTokens } from '../utils/jwt';
import { AuthenticationError, ConflictError } from '../utils/errors';

export class AuthService {
  async register(email: string, password: string, firstName: string, lastName: string, phone?: string) {
    // Check if user exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictError('Email already in use');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      role: 'CUSTOMER',
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateAuthTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return { user, accessToken, refreshToken };
  }

  async login(email: string, password: string) {
    // Find user
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AuthenticationError('Invalid credentials');
    }

    // Verify password
    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      throw new AuthenticationError('Invalid credentials');
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateAuthTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return { user, accessToken, refreshToken };
  }
}

export const authService = new AuthService();
```

Create similar services for:
- `Car.service.ts`
- `Booking.service.ts`
- `Payment.service.ts`
- `Review.service.ts`
- `Contact.service.ts`
- `Email.service.ts`
- `File.service.ts`
- `Notification.service.ts`
- `Coupon.service.ts`

### 4. Controllers

**`src/controllers/auth.controller.ts`**
```typescript
import { Request, Response } from 'express';
import { authService } from '../services/auth.service';

export class AuthController {
  async register(req: Request, res: Response) {
    const { email, password, firstName, lastName, phone } = req.body;
    
    const { user, accessToken, refreshToken } = await authService.register(
      email,
      password,
      firstName,
      lastName,
      phone
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: { user, accessToken },
    });
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const { user, accessToken, refreshToken } = await authService.login(email, password);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { user, accessToken },
    });
  }

  async logout(req: Request, res: Response) {
    res.clearCookie('refreshToken');
    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  }
}

export const authController = new AuthController();
```

Create similar controllers for:
- `Car.controller.ts`
- `Booking.controller.ts`
- `Payment.controller.ts`
- `Review.controller.ts`
- `Contact.controller.ts`
- `Dashboard.controller.ts`
- `Wishlist.controller.ts`
- `Coupon.controller.ts`
- `Notification.controller.ts`

### 5. Routes

**`src/routes/auth.routes.ts`**
```typescript
import { Router } from 'express';
import { body } from 'express-validator';
import { authController } from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validation';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post(
  '/register',
  authLimiter,
  [
    body('email').isEmail().toLowerCase(),
    body('password').isLength({ min: 8 }),
    body('firstName').notEmpty(),
    body('lastName').notEmpty(),
  ],
  validateRequest,
  (req, res, next) => authController.register(req, res).catch(next)
);

router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().toLowerCase(),
    body('password').notEmpty(),
  ],
  validateRequest,
  (req, res, next) => authController.login(req, res).catch(next)
);

router.post('/logout', (req, res, next) => authController.logout(req, res).catch(next));

export default router;
```

Create similar routes for:
- `user.routes.ts`
- `car.routes.ts`
- `booking.routes.ts`
- `payment.routes.ts`
- `review.routes.ts`
- `contact.routes.ts`
- `dashboard.routes.ts`
- `wishlist.routes.ts`
- `coupon.routes.ts`
- `notification.routes.ts`

### 6. Validators

**`src/validators/auth.validator.ts`**
```typescript
import { body } from 'express-validator';

export const registerValidator = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
];

export const loginValidator = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required'),
];
```

### 7. Interfaces

**`src/interfaces/IUser.ts`**
```typescript
import { UserRole, UserStatus } from '@prisma/client';

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  profileImage?: string;
  role: UserRole;
  isVerified: boolean;
  isActive: boolean;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface IUserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: UserRole;
  isVerified: boolean;
  isActive: boolean;
  profileImage?: string;
  createdAt: Date;
}
```

### 8. Email Templates

**`src/emails/welcome.template.ts`**
```typescript
export const welcomeEmailTemplate = (name: string, verificationLink: string): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #e63946; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f8f9fa; }
        .button { background: #e63946; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
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
          <p>To verify your email and get started, click the button below:</p>
          <a href="${verificationLink}" class="button">Verify Email</a>
          <p>If you didn't create this account, please ignore this email.</p>
          <p>Best regards,<br>AMK Motors & AutoCare Team</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
```

### 9. Socket.IO Handler

**`src/sockets/handlers.ts`**
```typescript
import { Server as HTTPServer } from 'http';
import { Socket, Server as SocketIOServer } from 'socket.io';

export let io: SocketIOServer;

export const initializeSocket = (httpServer: HTTPServer) => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });

    socket.on('join-room', (userId: string) => {
      socket.join(`user-${userId}`);
    });

    socket.on('leave-room', (userId: string) => {
      socket.leave(`user-${userId}`);
    });
  });

  return io;
};

export const notifyUser = (userId: string, event: string, data: any) => {
  io.to(`user-${userId}`).emit(event, data);
};

export const notifyAdmin = (event: string, data: any) => {
  io.to('admin-room').emit(event, data);
};
```

### 10. Prisma Seed

**`prisma/seed.ts`**
```typescript
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/hash';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const admin = await prisma.user.create({
    data: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@amkmotors.com',
      password: await hashPassword('Admin@123'),
      phone: '+233501234567',
      role: 'ADMIN',
      isVerified: true,
      isActive: true,
    },
  });

  console.log('Admin user created:', admin);

  // Create sample car
  const car = await prisma.car.create({
    data: {
      brand: 'Toyota',
      model: 'Camry',
      year: 2023,
      fuelType: 'PETROL',
      transmission: 'AUTOMATIC',
      color: 'Silver',
      plateNumber: 'GH-001-ABC',
      vin: 'VIN123456789',
      seats: 5,
      doors: 4,
      dailyPrice: 150,
      weeklyPrice: 900,
      monthlyPrice: 3500,
      deposit: 500,
      mileage: 'Unlimited',
      location: 'Accra',
      category: 'SEDAN',
      mainImage: 'https://via.placeholder.com/400x300?text=Toyota+Camry',
      description: 'Comfortable sedan for family trips',
    },
  });

  console.log('Sample car created:', car);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

## Step-by-Step Implementation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Setup database**
   ```bash
   npm run prisma:migrate
   npm run prisma:seed
   ```

3. **Create all repository files** (use template provided)

4. **Create all service files** (implement business logic)

5. **Create all controller files** (handle HTTP requests)

6. **Create all route files** (define endpoints)

7. **Add middleware** (logging, validation, rate limiting)

8. **Add email templates** (welcome, confirmation, etc.)

9. **Implement Socket.IO** (real-time notifications)

10. **Add tests**
    ```bash
    npm test
    ```

11. **Start development server**
    ```bash
    npm run dev
    ```

## Architecture Pattern

```
HTTP Request
    ↓
Route Handler
    ↓
Middleware (validation, auth)
    ↓
Controller
    ↓
Service (business logic)
    ↓
Repository (data access)
    ↓
Database
```

## Key Principles

1. **Single Responsibility** - Each class has one job
2. **Dependency Injection** - Services are injected into controllers
3. **Error Handling** - Centralized error handling
4. **Validation** - Input validated at route level
5. **Logging** - All important events logged
6. **Security** - Passwords hashed, JWT validated, rate limited

## Testing Example

```typescript
import { authService } from '../services/auth.service';

describe('AuthService', () => {
  it('should register a new user', async () => {
    const result = await authService.register(
      'test@example.com',
      'Password123',
      'John',
      'Doe'
    );

    expect(result.user.email).toBe('test@example.com');
    expect(result.accessToken).toBeDefined();
  });

  it('should throw error for duplicate email', async () => {
    await expect(
      authService.register(
        'test@example.com',
        'Password123',
        'John',
        'Doe'
      )
    ).rejects.toThrow('Email already in use');
  });
});
```

## Deployment Checklist

- [ ] Environment variables set
- [ ] Database migrations run
- [ ] CORS configured
- [ ] JWT secrets changed
- [ ] Email service configured
- [ ] Cloudinary setup
- [ ] Rate limiting enabled
- [ ] Logging setup
- [ ] HTTPS enabled
- [ ] Database backups configured
- [ ] Error monitoring (Sentry) setup
- [ ] Performance monitoring setup

## Support

For detailed examples, check:
- `/README.md` - API documentation
- Individual file templates in this guide
- Prisma documentation: https://www.prisma.io/docs
