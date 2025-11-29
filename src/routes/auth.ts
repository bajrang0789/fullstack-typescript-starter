// Authentication routes
import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { hashPassword, comparePassword } from '../auth/password';
import { generateToken } from '../auth/jwt';
import { prisma } from '../db/client';
import { logger } from '../monitoring/logger';
import { OperationalError } from '../middleware/error';

export const authRouter = Router();

// Validation schemas
const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

// Register new user
authRouter.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = registerSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new OperationalError('User with this email already exists', 409);
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword }
    });

    // Generate token
    const token = generateToken({ id: user.id, email: user.email });

    logger.info('User registered', { userId: user.id, email: user.email });

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user.id, email: user.email },
      token
    });
  } catch (error) {
    next(error);
  }
});

// Login user
authRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new OperationalError('Invalid email or password', 401);
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      throw new OperationalError('Invalid email or password', 401);
    }

    // Generate token
    const token = generateToken({ id: user.id, email: user.email });

    logger.info('User logged in', { userId: user.id, email: user.email });

    res.json({
      message: 'Login successful',
      user: { id: user.id, email: user.email },
      token
    });
  } catch (error) {
    next(error);
  }
});
