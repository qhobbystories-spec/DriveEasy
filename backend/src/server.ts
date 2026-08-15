import http from 'http';
import app from './app';
import { config } from './config/environment';
import { logger } from './utils/logger';
import { initializeSocket } from './sockets/handlers';
import prisma from './prisma/client';

const httpServer = http.createServer(app);

// Initialize Socket.IO
initializeSocket(httpServer);

const start = async () => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    logger.info('Database connected successfully');
  } catch (error) {
    if (config.nodeEnv === 'production') {
      logger.error('Failed to connect to database — continuing without DB', error);
    } else {
      logger.warn(
        'Database connection failed. Starting server without database (development mode).',
        error
      );
    }
  }

  try {
    // Start server
    httpServer.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`, {
        environment: config.nodeEnv,
        url: `http://localhost:${config.port}`,
      });
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  httpServer.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  logger.info('SIGINT signal received: closing HTTP server');
  httpServer.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
});

// Unhandled rejection handler
process.on('unhandledRejection', (reason: unknown) => {
  const message = reason instanceof Error ? reason.message : String(reason);
  const stack = reason instanceof Error ? reason.stack : undefined;
  logger.error('Unhandled Rejection', { message, stack });
  process.exit(1);
});

// Start application
start();

export default httpServer;
