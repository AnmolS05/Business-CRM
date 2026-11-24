import express, { Express } from 'express';
import cors from 'cors';
import compression from 'compression';

import apiRoutes from './routes/index';
import { apiNotFoundHandler, globalErrorHandler } from './middleware/errorHandler';

/**
 * Creates and configures the core Express application instance.
 * Attaches standard middleware, modular API routers, and global error handlers.
 *
 * @returns {Express} Configured Express application instance.
 */
export function createApp(): Express {
  const app = express();

  // Express Middleware
  app.use(cors());
  app.use(compression());
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // Mount Modular API Routers
  // Support both /api prefixed routes and direct routes for serverless rewrites
  app.use('/api', apiRoutes);
  app.use(apiRoutes);

  // API Error & Fallback Middleware
  app.use('/api/*', apiNotFoundHandler);
  app.use(globalErrorHandler);

  return app;
}

export const app = createApp();
export default app;
