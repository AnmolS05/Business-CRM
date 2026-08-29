import { GoogleGenAI } from '@google/genai';
import { envConfig } from '../config/env';
import { PROMPTS } from '../config/prompts';

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
 * Interface representing a structured file attachment for multimodal Gemini 3.1 Flash Lite analysis.
 */
export interface FileAnalysisPayload {
  buffer: Buffer;
  mimeType: string;
  originalname: string;
}

/**
 * Core AI Service layer encapsulating interactions with Google Gemini AI.
 * Implements singleton pattern for efficient client reuse.
 */
class GeminiService {
  private client: GoogleGenAI | null = null;
  private static instance: GeminiService;

  private constructor() {}

  /**
   * Retrieves the singleton instance of GeminiService.
   */
  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  /**
   * Lazy-initializes and retrieves the underlying GoogleGenAI client.
   */
  private getClient(): GoogleGenAI {
    if (!this.client) {
      const apiKey = envConfig.getGeminiApiKey();
      this.client = new GoogleGenAI({ apiKey });
    }
    return this.client;
  }

  /**
   * Generates a polite, respectful WhatsApp follow-up draft tailored to Indian enterprise clients.
   *
   * @param {WhatsAppFollowUpRequest} params Deal details including client name, product category, and value.
   * @returns {Promise<string>} Generated text message suitable for WhatsApp communication.
   */
  public async generateWhatsAppFollowUp(params: WhatsAppFollowUpRequest): Promise<string> {
    const ai = this.getClient();
    const { client_name, product_category, deal_value, stage } = params;

    const prompt = PROMPTS.WHATSAPP_FOLLOW_UP(
      client_name, 
      product_category || 'our services', 
      deal_value || 0, 
      stage || 'Lead'
    );

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
    });

    return response.text || '';
  }

  /**
   * Synthesizes business performance data into actionable strategic recommendations.
   *
   * @param {BusinessRecommendationsRequest} params Summary figures including top category and totals.
   * @returns {Promise<string>} Concise bulleted strategic recommendations.
   */
  public async generateBusinessRecommendations(params: BusinessRecommendationsRequest): Promise<string> {
    const ai = this.getClient();
    const { topProduct, topProductRevenue, totalSales, totalExpenses } = params;

    const prompt = PROMPTS.BUSINESS_RECOMMENDATIONS(
      topProduct || 'General',
      topProductRevenue || 0,
      totalSales || 0,
      totalExpenses || 0
    );

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
    });

    return response.text || '';
  }

  /**
   * Analyzes financial document files (PDFs, images, CSVs, TXT) and returns structured analysis.
   *
   * @param {FileAnalysisPayload} file File payload containing buffer, MIME type, and filename.
   * @returns {Promise<string>} Raw output text combining Markdown summary and optional JSON chart data.
   */
  public async analyzeDocumentFile(file: FileAnalysisPayload): Promise<string> {
    const ai = this.getClient();
    const base64Data = file.buffer.toString('base64');
    let mimeType = file.mimeType;

    // Fallback MIME type resolution if unmapped or application/octet-stream
    if (!mimeType || mimeType === 'application/octet-stream') {
      const ext = file.originalname.toLowerCase();
      if (ext.endsWith('.pdf')) mimeType = 'application/pdf';
      else if (ext.endsWith('.png')) mimeType = 'image/png';
      else if (ext.endsWith('.jpg') || ext.endsWith('.jpeg')) mimeType = 'image/jpeg';
      else if (ext.endsWith('.csv')) mimeType = 'text/csv';
      else mimeType = 'text/plain';
    }

    const prompt = PROMPTS.DOCUMENT_ANALYSIS(file.originalname);

    const inlinePart = {
      inlineData: {
        mimeType,
        data: base64Data,
      },
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: { parts: [inlinePart, { text: prompt }] },
    });

    return response.text || 'Unable to parse document summary.';
  }
}

export const geminiService = GeminiService.getInstance();
