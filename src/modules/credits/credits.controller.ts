import { Response, NextFunction } from 'express';
import { db } from '../../config/database';
import { creditsService } from './credits.service';
import { CreateCreditInput, GetCreditsQuery } from './credits.schema';
import { AuthRequest } from '../../middleware/auth';

export const creditsController = {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const user = await db('users').where({ id: userId }).select('role').first();
      if (user?.role !== 'commercial' && user?.role !== 'admin') {
        const error: any = new Error('Only commercials and admins can create credits');
        error.statusCode = 403;
        throw error;
      }
      const data = req.body as CreateCreditInput & { registered_by?: string };
      const commercialId = user?.role === 'admin' && data.registered_by ? data.registered_by : userId;
      const credit = await creditsService.create(data, commercialId);
      res.status(201).json({
        success: true,
        data: credit,
      });
    } catch (error) {
      next(error);
    }
  },

  async findById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.userId!;
      const user = await db('users').where({ id: userId }).select('role').first();
      const credit = await creditsService.findById(id);
      if (!credit) {
        const error: any = new Error('Credit not found');
        error.statusCode = 404;
        throw error;
      }
      if (user?.role === 'commercial' && credit.registered_by !== userId) {
        const error: any = new Error('Access denied');
        error.statusCode = 403;
        throw error;
      }
      if (user?.role === 'client' && credit.client_id !== userId) {
        const error: any = new Error('Access denied');
        error.statusCode = 403;
        throw error;
      }
      res.status(200).json({
        success: true,
        data: credit,
      });
    } catch (error) {
      next(error);
    }
  },

  async findAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const query = req.query as unknown as GetCreditsQuery;
      const userId = req.userId!;
      const user = await db('users').where({ id: userId }).select('role').first();
      const userRole = user?.role as string | undefined;
      const result = await creditsService.findAll(query, userId, userRole);
      res.status(200).json({
        success: true,
        data: result.credits,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  },
};
