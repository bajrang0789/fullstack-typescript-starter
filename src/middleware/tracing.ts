// Request tracing with correlation IDs
import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

export interface TracedRequest extends Request {
  correlationId?: string;
}

export const tracingMiddleware = (
  req: TracedRequest,
  res: Response,
  next: NextFunction
): void => {
  const correlationId = (req.headers['x-correlation-id'] as string) || crypto.randomUUID();
  req.correlationId = correlationId;
  res.setHeader('x-correlation-id', correlationId);
  next();
};
