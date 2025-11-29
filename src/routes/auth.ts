// Authentication routes
import { Router, Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { hashPassword, comparePassword } from '../auth/password';
import { generateToken } from '../auth/jwt';
import { prisma } from '../db/client';
import { logger } from '../monitoring/logger';
import { OperationalError } from '../middleware/error';
import { registerSchema, loginSchema } from '../schemas/user.schema';

export const authRouter = Router();

// Rate limiting for auth endpoints to prevent brute force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: { error: 'Too many authentication attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'test' // Skip rate limiting in tests
});

// Dummy hash for constant-time comparison when user doesn't exist
// This prevents timing attacks that could reveal whether an email exists
const DUMMY_HASH = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4FhjVzS7WB8/1Qcu';

// Register new user
authRouter.post('/register', authLimiter, async (req: Request, res: Response, next: NextFunction) => {
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
authRouter.post('/login', authLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    
    // Use constant-time comparison to prevent timing attacks
    // Always compare against a hash, even if user doesn't exist
    const hashToCompare = user?.password ?? DUMMY_HASH;
    const isValidPassword = await comparePassword(password, hashToCompare);
    
    // Check both conditions together to avoid timing leaks
    if (!user || !isValidPassword) {
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
