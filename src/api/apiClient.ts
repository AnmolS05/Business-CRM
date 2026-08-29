import { Deal, Expense } from '../types';

/**
 * Standard API error class carrying status codes and server error messages.
 */
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * Helper function to parse HTTP responses and handle unexpected server errors.
 *
 * @template T
 * @param {Response} res Fetch response object.
 * @returns {Promise<T>} Parsed JSON response body.
 */
async function handleResponse<T>(res: Response): Promise<T> {
  const contentType = res.headers.get('content-type') || '';
  let data: any = {};
  
  if (contentType.includes('application/json')) {
    data = await res.json();
  } else {
    const text = await res.text();
    data = { error: text || `Server error (${res.status})` };
  }

  if (!res.ok) {
    throw new ApiError(data.error || `HTTP error ${res.status}`, res.status);
  }

  return data as T;
}

/**
 * Enhanced fetch wrapper that implements exponential backoff retries for network resilience.
 */
async function fetchWithRetry(url: string, options?: RequestInit, retries = 3, backoffMs = 300): Promise<Response> {
  try {
    const res = await fetch(url, options);
    if (!res.ok && res.status >= 500 && retries > 0) {
      throw new Error(`Server Error ${res.status}`);
    }
    return res;
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, backoffMs));
      return fetchWithRetry(url, options, retries - 1, backoffMs * 2);
    }
    throw error;
  }
}

/**
 * Fetches all sales deals from the server database.
 *
 * @returns {Promise<Deal[]>} Array of sales deal entities.
 */
export async function fetchDealsApi(): Promise<Deal[]> {
  const res = await fetchWithRetry('/api/deals');
  return handleResponse<Deal[]>(res);
}

/**
 * Sends a POST request to create a new sales deal.
 *
 * @param {Omit<Deal, 'id'>} deal New deal properties.
 * @returns {Promise<Deal>} Created deal object returned from backend.
 */
export async function createDealApi(deal: Omit<Deal, 'id'>): Promise<Deal> {
  const res = await fetchWithRetry('/api/deals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(deal),
  });
  return handleResponse<Deal>(res);
}

/**
 * Sends a PUT request to update an existing deal by ID.
 *
 * @param {string} id Unique deal identifier.
 * @param {Partial<Deal>} updates Partial deal properties to modify.
 * @returns {Promise<Deal>} Updated deal entity.
 */
export async function updateDealApi(id: string, updates: Partial<Deal>): Promise<Deal> {
  const res = await fetchWithRetry(`/api/deals/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  return handleResponse<Deal>(res);
}

/**
 * Sends a DELETE request to remove a deal by ID.
 *
 * @param {string} id Unique deal identifier.
 * @returns {Promise<void>} Resolves when deletion succeeds.
 */
export async function deleteDealApi(id: string): Promise<void> {
  const res = await fetchWithRetry(`/api/deals/${id}`, { method: 'DELETE' });
  await handleResponse<{ success: boolean }>(res);
}

/**
 * Fetches all company expense records from the server database.
 *
 * @returns {Promise<Expense[]>} Array of expense entities.
 */
export async function fetchExpensesApi(): Promise<Expense[]> {
  const res = await fetchWithRetry('/api/expenses');
  return handleResponse<Expense[]>(res);
}

/**
 * Sends a POST request to create a new expense record.
 *
 * @param {Omit<Expense, 'id'>} expense New expense fields.
 * @returns {Promise<Expense>} Created expense object returned from backend.
 */
export async function createExpenseApi(expense: Omit<Expense, 'id'>): Promise<Expense> {
  const res = await fetchWithRetry('/api/expenses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(expense),
  });
  return handleResponse<Expense>(res);
}

/**
 * Sends a PUT request to update an expense record by ID.
 *
 * @param {string} id Unique expense identifier.
 * @param {Partial<Expense>} updates Partial expense fields to modify.
 * @returns {Promise<Expense>} Updated expense entity.
 */
export async function updateExpenseApi(id: string, updates: Partial<Expense>): Promise<Expense> {
  const res = await fetchWithRetry(`/api/expenses/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  return handleResponse<Expense>(res);
}

/**
 * Sends a DELETE request to remove an expense record by ID.
 *
 * @param {string} id Unique expense identifier.
 * @returns {Promise<void>} Resolves when deletion succeeds.
 */
export async function deleteExpenseApi(id: string): Promise<void> {
  const res = await fetchWithRetry(`/api/expenses/${id}`, { method: 'DELETE' });
  await handleResponse<{ success: boolean }>(res);
}

/**
 * Sends a POST request to reset the database to sample Indian business data defaults.
 *
 * @returns {Promise<{ deals: Deal[]; expenses: Expense[] }>} Reset database records.
 */
export async function resetDatabaseApi(): Promise<{ deals: Deal[]; expenses: Expense[] }> {
  const res = await fetchWithRetry('/api/reset-db', { method: 'POST' });
  return handleResponse<{ deals: Deal[]; expenses: Expense[] }>(res);
}

/**
 * Invokes Gemini 2.5 Flash Lite to draft a WhatsApp follow-up message for a deal.
 *
 * @param {object} params Deal metadata including client name, category, value, and stage.
 * @returns {Promise<string>} Generated text message.
 */
export async function generateWhatsAppFollowUpApi(params: {
  client_name: string;
  product_category?: string;
  deal_value?: number;
  stage?: string;
}): Promise<string> {
  const res = await fetchWithRetry('/api/ai/whatsapp-followup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const data = await handleResponse<{ draft: string }>(res);
  return data.draft;
}

/**
 * Invokes Gemini 2.5 Flash Lite to generate strategic recommendations for the business.
 *
 * @param {object} params Business figures including top product, total sales, and expenses.
 * @returns {Promise<string>} Strategic recommendation string.
 */
export async function generateBusinessRecommendationsApi(params: {
  topProduct: string;
  topProductRevenue: number;
  totalSales: number;
  totalExpenses: number;
}): Promise<string> {
  const res = await fetchWithRetry('/api/ai/business-recommendations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const data = await handleResponse<{ recommendations: string }>(res);
  return data.recommendations;
}

/**
 * Uploads a financial document file for Gemini 2.5 Flash Lite multimodal analysis.
 *
 * @param {File} file Document file object (PDF, image, CSV, or TXT).
 * @returns {Promise<{ markdownSummary: string; filename: string }>} Analysis output.
 */
export async function analyzeDocumentApi(file: File): Promise<{ markdownSummary: string; filename: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetchWithRetry('/api/ai/analyze-document', {
    method: 'POST',
    body: formData,
  });

  return handleResponse<{ markdownSummary: string; filename: string }>(res);
}
