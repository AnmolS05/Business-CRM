import { Request, Response } from 'express';
import {
  generateWhatsAppFollowUp,
  generateBusinessRecommendations,
  analyzeDocumentFile,
} from '../services/gemini.service';

/**
 * Controller endpoint for generating a Gemini AI WhatsApp follow-up draft.
 *
 * @param {Request} req Express request object containing client name and deal details.
 * @param {Response} res Express response object returning generated message draft.
 */
export async function getWhatsAppFollowUp(req: Request, res: Response): Promise<void> {
  try {
