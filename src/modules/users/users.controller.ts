import { Response, NextFunction } from 'express';
import { usersService } from './users.service';
import { CreateUserInput, UpdateUserInput } from './users.schema';
import { AuthRequest } from '../../middleware/auth';

export const usersController = {
  async getClients(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const clients = await usersService.findClients();
      res.status(200).json({ success: true, data: clients });
    } catch (error) {
      next(error);
    }
  },

  async getCommercials(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const commercials = await usersService.findCommercials();
      res.status(200).json({ success: true, data: commercials });
    } catch (error) {
      next(error);
    }
  },

  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const users = await usersService.findAll();
      res.status(200).json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  },

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = req.body as CreateUserInput;
      const user = await usersService.create(data);
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const data = req.body as UpdateUserInput;
      const user = await usersService.update(id, data);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  },
};
