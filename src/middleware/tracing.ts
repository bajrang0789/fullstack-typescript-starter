// Request tracing with correlation IDs
import { v4 as uuidv4 } from 'uuid';

export const tracingMiddleware = (req: any, res: any, next: any) => {
  req.correlationId = req.headers['x-correlation-id'] || uuidv4();
  res.setHeader('x-correlation-id', req.correlationId);
  next();
};
