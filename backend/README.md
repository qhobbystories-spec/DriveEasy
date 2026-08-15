# AMK Motors & AutoCare - Backend API

Production-ready Express + TypeScript backend for the DriveEasy car rental platform.

## Tech Stack

| Component | Technology |
|-----------|-------------|
| Runtime | Node.js 18+ |
| Language | TypeScript |
| Framework | Express.js |
| Database | MySQL |
| ORM | Prisma |
| Authentication | JWT (access + refresh) |
| Real-time | Socket.IO |
| Email | Nodemailer |
| Validation | Express Validator |
| Security | Helmet, bcrypt, CORS |
| Testing | Jest |

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env   # edit with your values

# Setup database
npx prisma generate
npx prisma migrate dev

# (Optional) Seed database
npx ts-node prisma/seed.ts

# Start development server
npm run dev
```

Server runs on `http://localhost:5000`.

## Project Structure

```
backend/
├── src/
│   ├── app.ts                    # Express app + middleware
│   ├── server.ts                 # HTTP + Socket.IO server
│   ├── prisma/client.ts          # Prisma singleton
│   ├── config/environment.ts     # Env config
│   ├── controllers/              # Request handlers (11 controllers)
│   ├── routes/                   # Route definitions (12 route files)
│   ├── services/email.service.ts # Nodemailer email logic
│   ├── middleware/               # auth, errorHandler, rateLimit, validation, logging
│   ├── validators/              # express-validator schemas
│   ├── sockets/handlers.ts      # Socket.IO event handlers
│   ├── types/index.ts           # Shared types
│   ├── utils/                   # jwt, hash, validators, errors, pagination, logger
│   └── constants/               # messages, errors, httpCodes
├── prisma/
│   ├── schema.prisma            # 15 models
│   └── seed.ts                  # Database seeder
├── package.json
└── tsconfig.json
```

## API Endpoints (73 routes)

| Group | Prefix | Routes |
|-------|--------|--------|
| Auth | `/api/auth` | register, login, logout, refresh-token, forgot-password, reset-password, verify-email, change-password |
| Users | `/api/users` | CRUD, profile, avatar |
| Cars | `/api/cars` | CRUD, archive/restore, images, search, categories |
| Bookings | `/api/bookings` | CRUD, approve/reject/complete, by status |
| Payments | `/api/payments` | CRUD, verify, refund, by booking |
| Reviews | `/api/reviews` | CRUD, by car, like |
| Contacts | `/api/contacts` | list, send, reply, mark-read |
| Dashboard | `/api/dashboard` | stats, revenue, bookings, cars, customers, reviews |
| Wishlist | `/api/wishlist` | get, add, remove |
| Coupons | `/api/coupons` | CRUD, validate |
| Notifications | `/api/notifications` | list, mark-read, mark-all-read, delete |
| Spare Parts | `/api/spare-parts` | CRUD, by vehicle |
| Towing | `/api/towing-vehicles` | CRUD, by type |

## Authentication

- **JWT access tokens** (24h expiry) in `Authorization: Bearer <token>` header
- **Refresh token rotation** on `/auth/refresh-token`
- **bcrypt** password hashing (10 rounds)
- **RBAC**: Admin, Employee, Customer roles

## Booking Workflow

1. Customer selects car and dates
2. System calculates pricing, validates coupon
3. Booking created (`PENDING` status), car status → `RESERVED`
4. Admin approves → email sent, customer pays
5. On pickup → `ACTIVE`, car → `RENTED`
6. On return → `COMPLETED`, car → `AVAILABLE`

## Real-Time (Socket.IO)

Admin receives: `booking:new`, `message:new`, `payment:received`, `review:submitted`
Customer receives: `booking:approved`, `booking:rejected`, `payment:confirmed`

## Environment Variables

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=mysql://user:password@localhost:3306/amk_motors_db
JWT_SECRET=your-secret
JWT_REFRESH_SECRET=your-refresh-secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@amkmotors.com
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (ts-node-dev) |
| `npm run build` | Compile TypeScript |
| `npm start` | Run compiled output |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Run migrations |
| `npm run prisma:seed` | Seed database |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |
| `npm test` | Jest |
