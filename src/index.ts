// Application entry point
import app from './server';
import { logger } from './monitoring/logger';
import { prisma } from './db/client';

// Export the app for testing
export { app };

// Application metadata
export const appInfo = {
  name: 'fullstack-typescript-starter',
  version: process.env.npm_package_version || '1.0.0',
  environment: process.env.NODE_ENV || 'development'
};

// Graceful shutdown handling
const gracefulShutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);
  
  try {
    await prisma.$disconnect();
    logger.info('Database disconnected successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown', { error });
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
