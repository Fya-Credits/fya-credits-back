import app from './app';
import { env } from './config/env';

const server = app.listen(env.port, () => {
  console.log(`[Server] Running on port ${env.port}`);
  console.log(`[Server] Environment: ${env.nodeEnv}`);
});

process.on('SIGTERM', () => {
  console.log('[Server] SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('[Server] HTTP server closed');
  });
});
