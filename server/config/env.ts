import dotenv from 'dotenv';

dotenv.config();

/**
 * Server configuration object holding environment variables and application defaults.
 */
export const envConfig = {
  /**
   * Port on which the HTTP server listens.
   */
  port: parseInt(process.env.PORT || '3000', 10),

  /**
   * Current execution environment ('development' | 'production' | 'test').
   */
  nodeEnv: process.env.NODE_ENV || 'development',

  /**
   * Retrieves the Gemini API key from environment variables.
   *
   * @throws {Error} If GEMINI_API_KEY environment variable is not configured.
   * @returns {string} Configured Gemini API key.
   */
  getGeminiApiKey(): string {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is missing.');
    }
    return apiKey;
  },
};
