import dotenv from 'dotenv';

dotenv.config();

const isProduction = () => process.env.NODE_ENV === 'production';

export const config = {
  // Server
  port: parseInt(process.env.PORT || '5000'),
  nodeEnv: process.env.NODE_ENV || 'development',

  // Database
  databaseUrl: process.env.DATABASE_URL,

  // JWT
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-key',
  jwtExpire: process.env.JWT_EXPIRE || '24h',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
  jwtRefreshExpire: process.env.JWT_REFRESH_EXPIRE || '7d',

  // Email
  smtpHost: process.env.SMTP_HOST,
  smtpPort: parseInt(process.env.SMTP_PORT || '587'),
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
  emailFrom: process.env.EMAIL_FROM || 'noreply@amkmotors.com',

  // URLs
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  backendUrl: process.env.BACKEND_URL || 'http://localhost:5000',

  // Rate Limiting
  rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '15'),
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),

  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
};

// Validate required environment variables
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
];

const INSECURE_SECRETS = new Set(['dev-secret-key', 'dev-refresh-secret']);

if (isProduction()) {
  requiredEnvVars.forEach(envVar => {
    const value = process.env[envVar];
    if (!value || INSECURE_SECRETS.has(value)) {
      console.warn(
        `[config] Missing or insecure environment variable: ${envVar}. Set a strong value before running in production.`
      );
    }
  });
} else if (
  !process.env.JWT_SECRET ||
  process.env.JWT_SECRET === 'dev-secret-key' ||
  !process.env.JWT_REFRESH_SECRET ||
  process.env.JWT_REFRESH_SECRET === 'dev-refresh-secret'
) {
  console.warn(
    '[config] Using development fallback JWT secrets. Set JWT_SECRET and JWT_REFRESH_SECRET before deploying.'
  );
}
