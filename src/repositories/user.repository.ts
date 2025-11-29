// User repository pattern
import { prisma } from '../db/client';
import { User } from '@prisma/client';
import { hashPassword } from '../auth/password';

export interface CreateUserInput {
  email: string;
  password: string;
}

export interface UpdateUserInput {
  email?: string;
  password?: string;
}

export type SafeUser = Omit<User, 'password'>;

export class UserRepository {
  async findById(id: string): Promise<SafeUser | null> {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email }
    });
  }

  async create(data: CreateUserInput): Promise<SafeUser> {
    const hashedPassword = await hashPassword(data.password);
    return prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async update(id: string, data: UpdateUserInput): Promise<SafeUser> {
    const updateData: UpdateUserInput = { ...data };
    
    if (data.password) {
      updateData.password = await hashPassword(data.password);
    }

    return prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id }
    });
  }

  async findAll(skip = 0, take = 10): Promise<SafeUser[]> {
    return prisma.user.findMany({
      skip,
      take,
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async count(): Promise<number> {
    return prisma.user.count();
  }
}

// Singleton instance
export const userRepository = new UserRepository();
