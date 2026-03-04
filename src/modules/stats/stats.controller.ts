import { Response, NextFunction } from 'express';
import { db } from '../../config/database';
import { statsService } from './stats.service';
import { AuthRequest } from '../../middleware/auth';

export const statsController = {
  async getDashboard(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const user = await db('users').where({ id: userId }).select('role').first();
      const role = (user?.role || 'client') as 'admin' | 'commercial' | 'client';
      const stats = await statsService.getDashboard(userId, role);
      res.status(200).json({ success: true, data: stats });
    } catch (error) {
      next(error);
    }
  },
};
