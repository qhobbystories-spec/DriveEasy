# AMK Motors & AutoCare - Backend API

## Overview

Production-ready backend for the AMK Motors & AutoCare platform, built with Node.js, Express, TypeScript, MySQL, Prisma ORM, and Socket.IO.

### Key Features

✅ **Enterprise Architecture**
- MVC Pattern with Clean Architecture
- Repository Pattern for data access
- Service layer for business logic
- Middleware for cross-cutting concerns

✅ **Security**
- JWT Authentication with Refresh Tokens
- Role-Based Access Control (RBAC)
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation & sanitization

✅ **Real-Time Features**
- Socket.IO for live notifications
- Real-time booking updates
- Instant admin alerts

✅ **Email Integration**
- HTML email templates
- Automated notifications
- Booking confirmations
- Password reset emails
- Contact message replies

✅ **File Management**
- Cloudinary integration
- Multi-image uploads
- Secure file handling

✅ **Database**
- MySQL with Prisma ORM
- Complete schema with relationships
- Indexes for performance
- Migrations & seeding

## Tech Stack

| Component | Technology |
|-----------|-------------|
| **Runtime** | Node.js 18+ |
| **Language** | TypeScript |
| **Framework** | Express.js |
| **Database** | MySQL |
| **ORM** | Prisma |
| **Authentication** | JWT |
| **Real-time** | Socket.IO |
| **File Storage** | Cloudinary |
| **Email** | Nodemailer |
| **Validation** | Express Validator |
| **Security** | Helmet, bcrypt |
| **Logging** | Morgan |
| **Testing** | Jest |

## Folder Structure

```
backend/
├── src/
│   ├── app.ts                          # Express app setup
│   ├── config/
│   │   └── environment.ts              # Environment variables
│   ├── controllers/                    # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── car.controller.ts
│   │   ├── booking.controller.ts
│   │   ├── payment.controller.ts
│   │   ├── review.controller.ts
│   │   ├── contact.controller.ts
│   │   ├── dashboard.controller.ts
│   │   ├── wishlist.controller.ts
│   │   ├── coupon.controller.ts
│   │   └── notification.controller.ts
│   ├── routes/                         # Route definitions
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── car.routes.ts
│   │   ├── booking.routes.ts
│   │   ├── payment.routes.ts
│   │   ├── review.routes.ts
│   │   ├── contact.routes.ts
│   │   ├── dashboard.routes.ts
│   │   ├── wishlist.routes.ts
│   │   ├── coupon.routes.ts
│   │   └── notification.routes.ts
│   ├── services/                       # Business logic
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── car.service.ts
│   │   ├── booking.service.ts
│   │   ├── payment.service.ts
│   │   ├── review.service.ts
│   │   ├── contact.service.ts
│   │   ├── email.service.ts
│   │   ├── file.service.ts
│   │   ├── notification.service.ts
│   │   └── coupon.service.ts
│   ├── repositories/                   # Data access
│   │   ├── user.repository.ts
│   │   ├── car.repository.ts
│   │   ├── booking.repository.ts
│   │   ├── payment.repository.ts
│   │   ├── review.repository.ts
│   │   ├── contact.repository.ts
│   │   ├── coupon.repository.ts
│   │   └── audit.repository.ts
│   ├── middleware/                     # Middleware
│   │   ├── auth.middleware.ts
│   │   ├── errorHandler.ts
│   │   ├── validation.ts
│   │   ├── logging.ts
│   │   └── rateLimiter.ts
│   ├── validators/                     # Input validation
│   │   ├── auth.validator.ts
│   │   ├── user.validator.ts
│   │   ├── car.validator.ts
│   │   ├── booking.validator.ts
│   │   ├── payment.validator.ts
│   │   ├── review.validator.ts
│   │   └── contact.validator.ts
│   ├── interfaces/                     # TypeScript interfaces
│   │   ├── IUser.ts
│   │   ├── ICar.ts
│   │   ├── IBooking.ts
│   │   ├── IPayment.ts
│   │   └── IResponse.ts
│   ├── types/                          # Type definitions
│   │   ├── index.ts
│   │   └── express.d.ts
│   ├── utils/                          # Utility functions
│   │   ├── jwt.ts
│   │   ├── hash.ts
│   │   ├── validators.ts
│   │   ├── formatters.ts
│   │   └── generators.ts
│   ├── emails/                         # Email templates
│   │   ├── welcome.template.ts
│   │   ├── booking.template.ts
│   │   ├── passwordReset.template.ts
│   │   └── contact.template.ts
│   ├── sockets/                        # Socket.IO handlers
│   │   └── handlers.ts
│   ├── prisma/                         # Prisma client
│   │   └── client.ts
│   ├── constants/                      # Constants
│   │   ├── messages.ts
│   │   ├── errors.ts
│   │   └── httpCodes.ts
│   └── helpers/                        # Helper functions
│       ├── pagination.ts
│       ├── response.ts
│       └── fileHelper.ts
├── prisma/
│   ├── schema.prisma                   # Database schema
│   ├── migrations/                     # Database migrations
│   └── seed.ts                         # Database seeding
├── tests/
│   ├── unit/
│   └── integration/
├── .env.example                        # Environment template
├── .eslintrc.json                      # ESLint config
├── .prettierrc                         # Prettier config
├── package.json
├── tsconfig.json
└── README.md
```

## Installation

### Prerequisites

- Node.js 18+ and npm
- MySQL 8.0+
- Cloudinary account (for file uploads)
- SMTP server (Gmail, SendGrid, etc.)

### Step 1: Clone & Setup

```bash
cd backend
npm install
```

### Step 2: Environment Configuration

```bash
cp .env.example .env
# Edit .env with your values
```

### Step 3: Database Setup

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE amk_motors_db;"

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database (optional)
npm run prisma:seed
```

### Step 4: Start Development Server

```bash
npm run dev
```

Server will be running on `http://localhost:5000`

## API Endpoints

### Authentication Routes (`/api/auth`)

```
POST   /register           - User registration
POST   /login              - User login
POST   /refresh-token      - Refresh JWT
POST   /logout             - User logout
POST   /forgot-password    - Request password reset
POST   /reset-password     - Reset password
POST   /verify-email       - Verify email address
POST   /change-password    - Change password
```

### User Routes (`/api/users`)

```
GET    /                   - List all users (admin)
GET    /:id                - Get user profile
PUT    /:id                - Update profile
DELETE /:id                - Delete account (soft delete)
GET    /me                 - Get current user
PUT    /me/profile         - Update current user profile
```

### Car Routes (`/api/cars`)

```
GET    /                   - List cars with filters
GET    /:id                - Get car details
POST   /                   - Create car (admin)
PUT    /:id                - Update car (admin)
DELETE /:id                - Delete car (admin)
POST   /:id/archive        - Archive car (admin)
POST   /:id/restore        - Restore car (admin)
GET    /search             - Advanced search
GET    /categories         - Get all categories
POST   /:id/images         - Upload images
```

### Booking Routes (`/api/bookings`)

```
GET    /                   - List bookings
GET    /:id                - Get booking details
POST   /                   - Create booking
PUT    /:id                - Update booking
DELETE /:id                - Cancel booking
GET    /user/:userId       - Get user bookings
GET    /status/:status     - Get bookings by status
POST   /:id/approve        - Approve booking (admin)
POST   /:id/reject         - Reject booking (admin)
POST   /:id/complete       - Mark as complete (admin)
```

### Payment Routes (`/api/payments`)

```
GET    /                   - List payments (admin)
GET    /:id                - Get payment details
POST   /                   - Create payment
GET    /booking/:bookingId - Get booking payment
POST   /verify             - Verify payment
POST   /refund/:id         - Refund payment (admin)
```

### Review Routes (`/api/reviews`)

```
GET    /                   - List reviews
GET    /car/:carId         - Get car reviews
POST   /                   - Create review
PUT    /:id                - Update review
DELETE /:id                - Delete review
POST   /:id/like           - Like review
```

### Contact/Message Routes (`/api/messages`)

```
GET    /                   - List messages (admin)
POST   /                   - Send message
GET    /:id                - Get message details
POST   /:id/reply          - Reply to message (admin)
PUT    /:id                - Mark as read (admin)
DELETE /:id                - Delete message (admin)
```

### Dashboard Routes (`/api/dashboard`)

```
GET    /stats              - Dashboard statistics
GET    /revenue            - Revenue data
GET    /bookings           - Booking analytics
GET    /cars               - Car analytics
GET    /customers          - Customer analytics
GET    /reviews            - Review analytics
```

### Wishlist Routes (`/api/wishlist`)

```
GET    /                   - Get user wishlist
POST   /:carId             - Add to wishlist
DELETE /:carId             - Remove from wishlist
```

### Coupon Routes (`/api/coupons`)

```
GET    /                   - List coupons (admin)
POST   /                   - Create coupon (admin)
PUT    /:id                - Update coupon (admin)
DELETE /:id                - Delete coupon (admin)
POST   /validate           - Validate coupon code
```

### Notification Routes (`/api/notifications`)

```
GET    /                   - Get notifications
POST   /mark-read/:id      - Mark notification as read
PUT    /mark-all-read      - Mark all as read
DELETE /:id                - Delete notification
```

## Authentication Flow

### Registration
```
1. User sends registration request
2. Backend validates input
3. Password is hashed
4. User created in database
5. Verification email sent
6. JWT token returned
```

### Login
```
1. User sends credentials
2. Backend validates credentials
3. Password verified
4. JWT token generated
5. Refresh token stored
6. Tokens returned with user data
```

### Token Refresh
```
1. Client sends expired JWT + refresh token
2. Backend validates refresh token
3. New JWT issued
4. Returned to client
```

## Booking Workflow

```
1. Customer selects car
2. Customer chooses dates
3. System calculates pricing
4. Customer applies coupon (if available)
5. Customer reviews booking
6. Booking created with PENDING status
7. Admin receives notification
8. Admin approves/rejects
9. Customer notified via email
10. If approved: car status → RESERVED, payment required
11. Payment processing
12. On pickup: booking status → ACTIVE, car status → RENTED
13. On return: booking status → COMPLETED, car status → AVAILABLE
```

## Email Templates

### Welcome Email
```
Sent when user registers
- Welcome message
- Account activation link
- Getting started guide
```

### Booking Confirmation
```
Sent after booking creation
- Booking details
- Pricing breakdown
- Payment instructions
```

### Booking Approved
```
Sent when admin approves booking
- Pickup details
- Car information
- Driver instructions
```

### Booking Rejected
```
Sent when admin rejects booking
- Rejection reason
- Available alternatives
- Support contact
```

### Password Reset
```
Sent for password recovery
- Reset link
- Expiration time
- Security notice
```

### Contact Reply
```
Sent when admin replies to message
- Reply content
- Ticket reference
- Support contact
```

## Real-Time Features (Socket.IO)

### Events Emitted to Admin

```
booking:new          - New booking request
message:new          - New contact message
payment:received     - Payment completed
review:submitted     - New review posted
```

### Events Emitted to Customer

```
booking:approved     - Booking approved
booking:rejected     - Booking rejected
booking:cancelled    - Booking cancelled
payment:confirmed    - Payment confirmed
message:reply        - Message replied
```

## Security Features

### Password Security
- Minimum 8 characters
- Hashed with bcrypt (10 rounds)
- Salt included

### JWT Security
- HS256 algorithm
- 24h expiration
- Refresh token rotation
- Secure cookie storage

### Rate Limiting
- 100 requests per 15 minutes
- Stricter for auth endpoints
- IP-based tracking

### Input Validation
- All endpoints validated
- Sanitization of HTML
- Type checking
- Length constraints

### CORS
- Configured origin
- Credentials allowed
- Methods whitelist

### SQL Injection Prevention
- Parameterized queries (Prisma)
- No raw queries
- Input validation

### XSS Prevention
- HTML sanitization
- Content-Security-Policy headers
- Output encoding

## Database Relationships

```
User
├── Bookings (1:N)
├── Payments (1:N)
├── Reviews (1:N)
├── Messages (1:N)
├── Wishlist (1:N)
└── Notifications (1:N)

Car
├── Images (1:N)
├── Bookings (1:N)
├── Reviews (1:N)
└── Wishlist (1:N)

Booking
├── User (N:1)
├── Car (N:1)
└── Payment (1:1)

Payment
├── Booking (N:1)
└── User (N:1)

Review
├── Car (N:1)
└── User (N:1)

Wishlist
├── User (N:1)
└── Car (N:1)
```

## Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=mysql://user:password@localhost:3306/amk_motors_db

# JWT
JWT_SECRET=your-super-secret-key
JWT_EXPIRE=24h
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRE=7d

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@amkmotors.com

# Cloudinary
CLOUDINARY_NAME=your-name
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret

# URLs
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

## Running in Production

### Build
```bash
npm run build
```

### Start
```bash
npm start
```

### Environment
- Set NODE_ENV=production
- Use secure JWT secrets
- Enable HTTPS
- Configure production database
- Set up proper logging
- Enable rate limiting
- Use production email service

## Testing

### Run Tests
```bash
npm test
```

### Watch Mode
```bash
npm run test:watch
```

### Coverage
```bash
npm run test:coverage
```

## Code Quality

### Lint
```bash
npm run lint
```

### Format
```bash
npm run format
```

### Type Check
```bash
npm run type-check
```

## Troubleshooting

### Database Connection Issues
```bash
# Check MySQL is running
mysql -u root -p

# Verify DATABASE_URL in .env
# Format: mysql://user:password@host:port/database
```

### Prisma Issues
```bash
# Regenerate Prisma client
npm run prisma:generate

# Reset database (development only)
npx prisma db push --force-reset
```

### Email Not Sending
- Verify SMTP credentials
- Check firewall/port access
- Enable "Less secure apps" for Gmail
- Use app-specific passwords

### JWT Errors
- Check JWT_SECRET is set
- Verify token not expired
- Ensure Authorization header format: "Bearer <token>"

## Support

For issues or questions, please contact support@amkmotors.com

## License

Proprietary - AMK Motors & AutoCare
