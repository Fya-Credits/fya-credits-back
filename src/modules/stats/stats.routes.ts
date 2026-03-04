import { Router } from 'express';
import { statsController } from './stats.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.get('/', authenticate, statsController.getDashboard);

export default router;
