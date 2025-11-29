// Test setup and global fixtures
import { prisma } from '../src/db/client';

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-that-is-at-least-32-characters-long';

beforeAll(async () => {
  console.log('Setting up tests...');
});

afterAll(async () => {
  // Cleanup database connections
  await prisma.$disconnect();
});
