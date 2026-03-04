import { Router } from 'express';
import { creditsController } from './credits.controller';
import { validate } from '../../middleware/validate';
import { authenticate } from '../../middleware/auth';
import { createCreditSchema, getCreditsSchema } from './credits.schema';

const router = Router();

router.post('/', authenticate, validate(createCreditSchema), creditsController.create);
router.get('/', authenticate, validate(getCreditsSchema), creditsController.findAll);
router.get('/:id', authenticate, creditsController.findById);

export default router;
