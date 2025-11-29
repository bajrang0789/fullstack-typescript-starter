// Test data factories
import { User } from '@prisma/client';

interface UserFactoryOptions {
  id?: string;
  email?: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

let userCounter = 0;

export const createUser = (overrides?: UserFactoryOptions): User => {
  userCounter++;
  const now = new Date();
  
  return {
    id: overrides?.id ?? `user-${userCounter}-${Date.now()}`,
    email: overrides?.email ?? `test${userCounter}@example.com`,
    password: overrides?.password ?? '$2b$12$hashedpassword',
    createdAt: overrides?.createdAt ?? now,
    updatedAt: overrides?.updatedAt ?? now,
    ...overrides
  };
};

export const createUsers = (count: number, overrides?: UserFactoryOptions): User[] => {
  return Array.from({ length: count }, (_, index) => 
    createUser({ 
      ...overrides, 
      email: overrides?.email ? `${index}-${overrides.email}` : undefined 
    })
  );
};

export const resetUserCounter = (): void => {
  userCounter = 0;
};
