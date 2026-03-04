import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import './jobs/emailJob';
import authRoutes from './modules/auth/auth.routes';
import creditsRoutes from './modules/credits/credits.routes';
import usersRoutes from './modules/users/users.routes';
import statsRoutes from './modules/stats/stats.routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/api/', limiter);

app.use('/api/auth', authRoutes);
app.use('/api/credits', creditsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/stats', statsRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
