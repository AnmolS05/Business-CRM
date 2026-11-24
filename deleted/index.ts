import { app } from '../server/app';
import type { Request, Response } from 'express';

/**
 * Vercel Serverless Function entry point exporting the configured Express application.
 * Handles all serverless HTTP requests dispatched by the Vercel edge network.
 *
 * @param {Request} req Incoming HTTP request object.
 * @param {Response} res Outgoing HTTP response object.
 * @returns {void | Promise<void>}
 */
export default function handler(req: Request, res: Response): void {
  return app(req, res);
}
