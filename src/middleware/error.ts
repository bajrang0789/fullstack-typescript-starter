// Global error handling middleware
import { Request, Response, NextFunction } from 'express';
import { logger } from '../monitoring/logger';
import { ZodError } from 'zod';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Log the error
  logger.error('Error occurred', {
    message: err.message,
    stack: err.stack,
    statusCode: err.statusCode
  });

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Validation failed',
      details: err.errors.map(e => ({
        path: e.path.join('.'),
        message: e.message
      }))
    });
    return;
  }

  // Handle operational errors
  if (err.isOperational) {
    res.status(err.statusCode || 400).json({
      error: err.message
    });
    return;
  }

  // Handle unknown errors
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;

  res.status(statusCode).json({ error: message });
};

// Custom error class for operational errors
export class OperationalError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
