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
    const { client_name, product_category, deal_value, stage } = req.body;
    if (!client_name) {
      res.status(400).json({ error: 'client_name is a required parameter.' });
      return;
    }

    const draft = await generateWhatsAppFollowUp({
      client_name: String(client_name),
      product_category: product_category ? String(product_category) : undefined,
      deal_value: deal_value !== undefined ? Number(deal_value) : undefined,
      stage: stage ? String(stage) : undefined,
    });

    res.json({ draft });
  } catch (err: unknown) {
    console.error('[AI WhatsApp Follow-up Error]:', err);
    const message = err instanceof Error ? err.message : 'Failed to generate WhatsApp follow-up draft.';
    res.status(500).json({ error: message });
  }
}

/**
 * Controller endpoint for generating Gemini AI business strategy recommendations.
 *
 * @param {Request} req Express request object containing business revenue & expense metrics.
 * @param {Response} res Express response object returning bulleted strategic recommendations.
 */
export async function getBusinessRecommendations(req: Request, res: Response): Promise<void> {
  try {
    const { topProduct, topProductRevenue, totalSales, totalExpenses } = req.body;

    const recommendations = await generateBusinessRecommendations({
      topProduct: topProduct ? String(topProduct) : undefined,
      topProductRevenue: topProductRevenue !== undefined ? Number(topProductRevenue) : undefined,
      totalSales: totalSales !== undefined ? Number(totalSales) : undefined,
      totalExpenses: totalExpenses !== undefined ? Number(totalExpenses) : undefined,
    });

    res.json({ recommendations });
  } catch (err: unknown) {
    console.error('[AI Recommendations Error]:', err);
    const message = err instanceof Error ? err.message : 'Failed to generate business recommendations.';
    res.status(500).json({ error: message });
  }
}

/**
 * Controller endpoint for analyzing uploaded financial documents via Gemini 3.6 Flash.
 *
 * @param {Request} req Express request object containing uploaded file in req.file.
 * @param {Response} res Express response object returning Markdown summary and chart payload.
 */
export async function analyzeDocument(req: Request, res: Response): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No document file was uploaded.' });
      return;
    }

    const markdownSummary = await analyzeDocumentFile({
      buffer: req.file.buffer,
      mimeType: req.file.mimetype,
      originalname: req.file.originalname,
