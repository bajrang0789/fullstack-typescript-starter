// Authentication middleware for protected routes
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../auth/jwt';
import { logger } from '../monitoring/logger';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Missing or invalid authorization header' });
      return;
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      res.status(401).json({ error: 'Token not provided' });
      return;
    }

    const decoded = verifyToken(token) as { id: string; email: string };
    req.user = decoded;
    next();
  } catch (error) {
    logger.warn('Authentication failed', { error });
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
