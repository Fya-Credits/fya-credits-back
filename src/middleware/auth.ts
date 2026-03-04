import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../config/database';
import { env } from '../config/env';
import { AppError } from './errorHandler';

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('No token provided');
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, env.jwt.secret) as { userId: string };

    req.userId = decoded.userId;
    next();
  } catch (error) {
    const appError: AppError = error as AppError;
    appError.statusCode = 401;
    appError.message = 'Invalid or expired token';
    next(appError);
  }
};

export const requireAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.userId) {
      const error: AppError = new Error('Unauthorized');
      error.statusCode = 401;
      return next(error);
    }

    const user = await db('users').where({ id: req.userId }).select('role').first();

    if (!user || user.role !== 'admin') {
      const error: AppError = new Error('Admin access required');
      error.statusCode = 403;
      return next(error);
    }

    req.userRole = user.role;
    next();
  } catch (error) {
    next(error);
  }
};
