import { Router } from 'express';
import { usersController } from './users.controller';
import { validate } from '../../middleware/validate';
import { authenticate, requireAdmin } from '../../middleware/auth';
import { createUserSchema, updateUserSchema } from './users.schema';

const router = Router();

router.get('/clients', authenticate, usersController.getClients);
router.get('/commercials', authenticate, usersController.getCommercials);
router.get('/', authenticate, requireAdmin, usersController.getAll);
router.post('/', authenticate, requireAdmin, validate(createUserSchema), usersController.create);
router.put('/:id', authenticate, requireAdmin, validate(updateUserSchema), usersController.update);

export default router;
