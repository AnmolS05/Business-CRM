import { Request, Response, NextFunction } from 'express';

/**
 * Custom error structure for HTTP API exceptions.
 */
export interface HttpError extends Error {
  status?: number;
}

/**
 * Express middleware to handle unmapped API routes with a JSON 404 response.
 *
 * @param {Request} req Incoming HTTP request.
 * @param {Response} res Outgoing HTTP response.
 */
export function apiNotFoundHandler(req: Request, res: Response): void {
  res.status(404).json({ error: `API route not found: ${req.originalUrl}` });
}

/**
 * Global Express error handling middleware for formatting API errors into consistent JSON responses.
 *
 * @param {HttpError} err Error instance caught during request lifecycle.
 * @param {Request} req Incoming HTTP request.
 * @param {Response} res Outgoing HTTP response.
 * @param {NextFunction} next Next function handle.
 */
export function globalErrorHandler(
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('[API Error]:', err);
  if (res.headersSent) {
    return next(err);
  }
  const statusCode = err.status || 500;
  const message = err.message || 'An internal server error occurred.';
  res.status(statusCode).json({ error: message });
}
