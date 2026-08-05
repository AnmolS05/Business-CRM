import { GoogleGenAI } from '@google/genai';
import { envConfig } from '../config/env';

/**
 * Initializes and returns a GoogleGenAI SDK client instance using configured credentials.
 *
 * @returns {GoogleGenAI} Configured GoogleGenAI client instance.
 */
export function getGemmaClient(): GoogleGenAI {
  const apiKey = envConfig.getGeminiApiKey();
  return new GoogleGenAI({ apiKey });
}

/**
 * Interface representing the parameters required to generate a WhatsApp follow-up draft.
 */
export interface WhatsAppFollowUpRequest {
  client_name: string;
  product_category?: string;
  deal_value?: number;
  stage?: string;
}

/**
 * Interface representing the payload required to generate business strategy recommendations.
 */
export interface BusinessRecommendationsRequest {
  topProduct?: string;
  topProductRevenue?: number;
  totalSales?: number;
  totalExpenses?: number;
}

/**
 * Interface representing a structured file attachment for multimodal Gemini 2.5 Flash Lite analysis.
 */
export interface FileAnalysisPayload {
  buffer: Buffer;
  mimeType: string;
  originalname: string;
}

/**
 * Generates a polite, respectful WhatsApp follow-up draft tailored to Indian enterprise clients.
 *
 * @param {WhatsAppFollowUpRequest} params Deal details including client name, product category, and value.
 * @returns {Promise<string>} Generated text message suitable for WhatsApp communication.
 */
export async function generateWhatsAppFollowUp(params: WhatsAppFollowUpRequest): Promise<string> {
