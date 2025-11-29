// Test setup and global fixtures
import { prisma } from '../src/db/client';
import { logger } from '../src/monitoring/logger';

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-that-is-at-least-32-characters-long';

beforeAll(async () => {
  logger.info('Setting up tests...');
});

afterAll(async () => {
  // Cleanup database connections
  await prisma.$disconnect();
});
