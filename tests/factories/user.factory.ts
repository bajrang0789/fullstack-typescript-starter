// Test data factories
export const createUser = (overrides?: any) => {
  return {
    id: '123',
    email: 'test@example.com',
    ...overrides
  };
};
