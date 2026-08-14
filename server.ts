import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

import { envConfig } from './server/config/env';
import apiRoutes from './server/routes/index';
import { apiNotFoundHandler, globalErrorHandler } from './server/middleware/errorHandler';

const app = express();

// Express Request Body Parsing
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Mount Modular API Routers
app.use('/api', apiRoutes);

// API Error & Fallback Middleware
app.use('/api/*', apiNotFoundHandler);
app.use(globalErrorHandler);

/**
 * Initializes the HTTP server and attaches Vite HMR middleware in development mode or static SPA fallback in production.
 */
async function startServer(): Promise<void> {
  if (envConfig.nodeEnv !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(envConfig.port, '0.0.0.0', () => {
    console.log(`[Server]: Listening on http://0.0.0.0:${envConfig.port} (env: ${envConfig.nodeEnv})`);
  });
}

startServer().catch((err) => {
  console.error('[Server Initialization Error]:', err);
  process.exit(1);
});
