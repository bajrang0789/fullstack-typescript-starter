// Express server setup
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middleware/error';
import { healthRouter } from './routes/health';
import { authRouter } from './routes/auth';
import { userRouter } from './routes/api/v1/users';
import { httpLogStream, logger } from './monitoring/logger';

const app: Application = express();

// Security middleware
app.use(helmet());

// CORS configuration - restrict origins in production
const corsOptions = {
  origin: process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
    : process.env.NODE_ENV === 'production' 
      ? false // Block all in production if not configured
      : true,  // Allow all in development
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging using centralized httpLogStream
app.use(morgan('combined', { stream: httpLogStream }));

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
