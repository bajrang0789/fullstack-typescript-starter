// User CRUD endpoints
import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authMiddleware, AuthenticatedRequest } from '../../../middleware/auth';
import { prisma } from '../../../db/client';
import { OperationalError } from '../../../middleware/error';
import { logger } from '../../../monitoring/logger';

export const userRouter = Router();

// Apply auth middleware to all routes
userRouter.use(authMiddleware);

// Validation schema for user updates
const updateUserSchema = z.object({
  email: z.string().email('Invalid email format').optional()
});

// Get current user profile
userRouter.get('/me', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new OperationalError('User not found', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, createdAt: true, updatedAt: true }
    });

    if (!user) {
      throw new OperationalError('User not found', 404);
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
});

// Get user by ID (admin only - to be expanded)
userRouter.get('/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // For now, users can only access their own profile
    if (req.user?.id !== id) {
      throw new OperationalError('Access denied', 403);
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, createdAt: true, updatedAt: true }
    });

    if (!user) {
      throw new OperationalError('User not found', 404);
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
});

// Update user
userRouter.patch('/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Users can only update their own profile
    if (req.user?.id !== id) {
      throw new OperationalError('Access denied', 403);
    }

    const data = updateUserSchema.parse(req.body);

    // Check if email is already taken
    if (data.email) {
      const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
      if (existingUser && existingUser.id !== id) {
        throw new OperationalError('Email already in use', 409);
      }
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: { id: true, email: true, createdAt: true, updatedAt: true }
    });

    logger.info('User updated', { userId: id });

    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    next(error);
  }
});

// Delete user
userRouter.delete('/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Users can only delete their own account
    if (req.user?.id !== id) {
      throw new OperationalError('Access denied', 403);
    }

    await prisma.user.delete({ where: { id } });

    logger.info('User deleted', { userId: id });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
});
