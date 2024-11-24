// Secure search endpoints with parameterized queries
export const search = async (query: string) => {
  // Use parameterized queries to prevent SQL injection
  return prisma.$queryRaw`SELECT * FROM users WHERE name LIKE ${`%${query}%`}`;
};
