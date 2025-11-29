// Health check endpoints
import { Router, Request, Response } from 'express';
import { prisma } from '../db/client';

export const healthRouter = Router();

// Liveness probe - is the server running?
healthRouter.get('/live', (_req: Request, res: Response) => {
  res.json({ status: 'alive', timestamp: new Date().toISOString() });
});

// Readiness probe - is the server ready to handle requests?
healthRouter.get('/ready', async (_req: Request, res: Response) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    res.json({
      status: 'ready',
      timestamp: new Date().toISOString(),
      checks: {
        database: 'connected'
      }
    });
  } catch {
    res.status(503).json({
      status: 'not ready',
      timestamp: new Date().toISOString(),
      checks: {
        database: 'disconnected'
      }
    });
  }
});

// General health check
healthRouter.get('/', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    version: process.env.npm_package_version || '1.0.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});
