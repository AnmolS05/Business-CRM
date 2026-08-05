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
  const ai = getGemmaClient();
  const { client_name, product_category, deal_value, stage } = params;

  const prompt = `Write a polite, warm, and brief WhatsApp follow-up message to ${client_name} regarding their interest in ${product_category || 'our services'} valued at ${deal_value || 0} INR. Stage: ${stage || 'Lead'}. Keep it in a respectful Indian business tone. Do not use placeholders. Keep it under 60 words and suitable for direct sending via WhatsApp.`;

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
export async function generateBusinessRecommendations(params: BusinessRecommendationsRequest): Promise<string> {
  const ai = getGemmaClient();
  const { topProduct, topProductRevenue, totalSales, totalExpenses } = params;

  const prompt = `Here is my business summary: Top Product Category is ${topProduct || 'General'} generating ${topProductRevenue || 0} INR. Total sales are ${totalSales || 0} INR. Total expenses are ${totalExpenses || 0} INR. Provide 2 highly specific, actionable recommendations in bullet points for a business owner in India to improve margins or increase sales.`;

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
export async function analyzeDocumentFile(file: FileAnalysisPayload): Promise<string> {
  const ai = getGemmaClient();
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

  const prompt = `Analyze this financial document (${file.originalname}).

Provide your response in TWO distinct parts within a single output:

PART 1: A clean markdown text summary containing:
- Executive Overview & Total Value
- Key Highlights & Financial Breakdown
- Key Trends, Anomalies, or Risks
Format all monetary values in Indian Rupees (₹) using Lakhs/Crores format where appropriate. Keep the written analysis clear, structured, and concise.

PART 2: If the document contains numerical, financial, or comparative data that can be visually compared (e.g., line items, subtotal vs tax, projected vs actual, Q1 vs Q2, expense categories, revenue streams, year-over-year figures, etc.), provide a strictly formatted JSON block wrapped in \`\`\`json ... \`\`\` code blocks containing the comparison data.

Structure the JSON EXACTLY like this:
\`\`\`json
{
  "chartTitle": "Descriptive Chart Title (e.g., Q1 vs Q2 Expense Comparison)",
  "chartType": "bar",
  "labels": ["Label 1", "Label 2", "Label 3"],
  "datasets": [
    {
      "label": "Series 1 Name (e.g., Projected (₹))",
      "data": [100000, 150000, 200000]
    },
    {
      "label": "Series 2 Name (e.g., Actual (₹))",
      "data": [95000, 160000, 210000]
    }
  ]
}
\`\`\`

Notes:
1. "chartType" MUST be either "bar" or "line".
2. All numbers inside "data" arrays must be raw numeric integers or floats (no currency symbols or string values).
3. If there are no numerical or comparative figures in the document to plot, omit the \`\`\`json block entirely.`;

  const inlinePart = {
