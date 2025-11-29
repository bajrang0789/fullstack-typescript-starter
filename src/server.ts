// Express server setup
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middleware/error';
import { healthRouter } from './routes/health';
import { authRouter } from './routes/auth';
import { userRouter } from './routes/api/v1/users';
import { logger } from './monitoring/logger';

const app: Application = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(morgan('combined', {
  stream: { write: (message: string) => logger.info(message.trim()) }
}));

// Health check route
app.use('/health', healthRouter);

// API routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

// Global error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}

export default app;
