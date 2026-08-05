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
