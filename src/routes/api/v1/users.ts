// User CRUD endpoints
import { Router, Response, NextFunction, RequestHandler } from 'express';
import { authMiddleware, AuthenticatedRequest } from '../../../middleware/auth';
import { prisma } from '../../../db/client';
import { OperationalError } from '../../../middleware/error';
import { logger } from '../../../monitoring/logger';
import { updateUserSchema, userIdSchema } from '../../../schemas/user.schema';

export const userRouter = Router();

// Apply auth middleware to all routes
userRouter.use(authMiddleware);

// Validation middleware for UUID params
const validateUserId: RequestHandler = (req, _res, next) => {
  try {
    userIdSchema.parse({ id: req.params.id });
    next();
  } catch (error) {
    next(error);
  }
};

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
userRouter.get('/:id', validateUserId, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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

// Update user - uses atomic update to avoid race conditions
// Prisma P2002 error is handled by global error middleware for duplicate emails
userRouter.patch('/:id', validateUserId, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Users can only update their own profile
    if (req.user?.id !== id) {
      throw new OperationalError('Access denied', 403);
    }

    const data = updateUserSchema.parse(req.body);

    // Atomic update - let Prisma handle unique constraint via error middleware
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
userRouter.delete('/:id', validateUserId, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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
