import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from './errorHandler';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const appError: AppError = new Error('Validation error');
        appError.statusCode = 400;
        appError.message = error.errors.map((e) => e.message).join(', ');
        next(appError);
      } else {
        next(error);
      }
    }
  };
};
