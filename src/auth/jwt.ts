// JWT token generation and validation
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { logger } from '../monitoring/logger';

export interface TokenPayload {
  id: string;
  email: string;
}

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    logger.error('JWT_SECRET environment variable is not set');
    throw new Error('JWT_SECRET is required but not configured');
  }
  if (secret.length < 32) {
    logger.warn('JWT_SECRET should be at least 32 characters for security');
  }
  return secret;
};

export const generateToken = (payload: TokenPayload, expiresIn: SignOptions['expiresIn'] = '1d'): string => {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, getJwtSecret(), options);
};

export const verifyToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as JwtPayload & TokenPayload;
    return { id: decoded.id, email: decoded.email };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    }
    throw error;
  }
};

export const decodeToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.decode(token) as TokenPayload | null;
    return decoded;
  } catch {
    return null;
  }
};
