// Secure search endpoints with parameterized queries
import { prisma } from '../db/client';

export const searchUsers = async (query: string): Promise<unknown[]> => {
  // Use parameterized queries to prevent SQL injection
  const searchPattern = `%${query}%`;
  return prisma.$queryRaw`SELECT id, email, "createdAt", "updatedAt" FROM "User" WHERE email LIKE ${searchPattern}`;
};
