/**
 * NAI API Client - Robust API integration with retry logic, rate limiting, and error handling
 * Routes all AI calls through OpenRouter for provider-agnostic flexibility.
 * callGeminiAPI is retained as a backward-compatible alias that translates response formats.
 */

// API Configuration Constants
const API_CONFIG = {
  TIMEOUT_MS: 30000,
  MAX_RETRIES: 3,
  INITIAL_RETRY_DELAY_MS: 1000,
  MAX_RETRY_DELAY_MS: 10000,
  RATE_LIMIT_STATUS: 429,
  RETRYABLE_STATUS_CODES: [408, 429, 500, 502, 503, 504],
};

// Map old model names to OpenRouter model IDs (all provider-agnostic)
const MODEL_MAP = {
  'gemini-1.5-flash': 'google/gemini-2.5-flash-lite',
  'gemini-2.0-flash': 'google/gemini-2.5-flash-lite',
  'gemini-1.5-pro': 'google/gemini-2.5-flash',
};

/**
 * Resolve model name — handle old Gemini names and pass through others
 */
const resolveModel = (model) => MODEL_MAP[model] || model;

/**
 * Delay utility with jitter to prevent thundering herd
 * @param {number} ms - Base milliseconds to delay
 * @returns {Promise<void>}
 */
const delay = (ms) => {
  const jitter = Math.random() * 200;
  return new Promise(resolve => setTimeout(resolve, ms + jitter));
};

/**
 * Calculate exponential backoff delay
 * @param {number} retryCount - Current retry attempt (0-indexed)
 * @returns {number} Delay in milliseconds
 */
const getBackoffDelay = (retryCount) => {
  const exponentialDelay = API_CONFIG.INITIAL_RETRY_DELAY_MS * Math.pow(2, retryCount);
  return Math.min(exponentialDelay, API_CONFIG.MAX_RETRY_DELAY_MS);
};

/**
 * Fetch with timeout support
 * @param {string} url - URL to fetch
 * @param {Object} options - Fetch options
 * @param {number} timeoutMs - Timeout in milliseconds
 * @returns {Promise<Response>}
 */
const fetchWithTimeout = async (url, options = {}, timeoutMs = API_CONFIG.TIMEOUT_MS) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

/**
 * Check if an error is retryable
 * @param {Error|Response} errorOrResponse - Error object or Response
 * @returns {boolean}
 */
const isRetryable = (errorOrResponse) => {
  if (errorOrResponse instanceof Response) {
    return API_CONFIG.RETRYABLE_STATUS_CODES.includes(errorOrResponse.status);
  }
  const errorMessage = errorOrResponse.message?.toLowerCase() || '';
  return (
    errorOrResponse.name === 'TypeError' ||
    errorMessage.includes('fetch') ||
    errorMessage.includes('network') ||
    errorMessage.includes('failed to fetch') ||
    errorMessage.includes('timeout')
  );
};

/**
 * Call OpenRouter API with robust error handling, retry logic, and rate limiting protection
 * @param {string} prompt - The prompt text to send
 * @param {string} model - Model ID to use (default: google/gemini-2.5-flash-lite)
 * @param {number} retryCount - Internal retry counter (do not set manually)
 * @returns {Promise<Object>} API response data (OpenAI-compatible format)
 * @throws {Error} After all retries exhausted or non-retryable error
 */
export const callOpenRouterAPI = async (prompt, model = 'google/gemini-2.5-flash-lite', retryCount = 0) => {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  
  if (!apiKey) {
    throw new Error('API key not configured. Please check your environment settings.');
  }

  const url = 'https://openrouter.ai/api/v1/chat/completions';
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: resolveModel(model),
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
    })
  };

  try {
    const response = await fetchWithTimeout(url, options, API_CONFIG.TIMEOUT_MS);

    if (response.status === API_CONFIG.RATE_LIMIT_STATUS) {
      if (retryCount < API_CONFIG.MAX_RETRIES) {
        const backoffDelay = getBackoffDelay(retryCount);
        await delay(backoffDelay);
        return callOpenRouterAPI(prompt, model, retryCount + 1);
      }
      throw new Error('Rate limit exceeded. Please wait a moment and try again.');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `API error: ${response.status}`;
      
      if (API_CONFIG.RETRYABLE_STATUS_CODES.includes(response.status) && retryCount < API_CONFIG.MAX_RETRIES) {
        const backoffDelay = getBackoffDelay(retryCount);
        await delay(backoffDelay);
        return callOpenRouterAPI(prompt, model, retryCount + 1);
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    const text = data?.choices?.[0]?.message?.content;
    if (!text) {
      throw new Error('No response content received from API.');
    }
    
    return data;

  } catch (error) {
    if (isRetryable(error) && retryCount < API_CONFIG.MAX_RETRIES) {
      const backoffDelay = getBackoffDelay(retryCount);
      await delay(backoffDelay);
      return callOpenRouterAPI(prompt, model, retryCount + 1);
    }

    let userMessage = 'An error occurred while processing your request.';
    
    if (error.message?.includes('timeout')) {
      userMessage = 'Request timed out. Please check your connection and try again.';
    } else if (error.message?.includes('Rate limit')) {
      userMessage = error.message;
    } else if (error.message?.includes('API key')) {
      userMessage = error.message;
    } else if (error.message?.includes('No response content')) {
      userMessage = error.message;
    }
    
    throw new Error(userMessage);
  }
};

/**
 * Call Gemini API — backward-compatible wrapper that routes through OpenRouter
 * Translates OpenRouter response format to Gemini format for existing callers.
 * @param {string} prompt - The prompt text to send
 * @param {string} model - Model to use (default: gemini-1.5-flash, mapped to OpenRouter ID)
 * @param {number} retryCount - Internal retry counter (do not set manually)
 * @returns {Promise<Object>} API response data (Gemini-compatible format)
 * @throws {Error} After all retries exhausted or non-retryable error
 */
export const callGeminiAPI = async (prompt, model = 'gemini-1.5-flash', retryCount = 0) => {
  const openRouterModel = resolveModel(model);
  const data = await callOpenRouterAPI(prompt, openRouterModel, retryCount);
  
  // Translate OpenRouter (OpenAI-format) response to Gemini format for backward compatibility
  return {
    candidates: [{
      content: {
        parts: [{ text: data?.choices?.[0]?.message?.content || '' }]
      }
    }]
  };
};

/**
 * Extract response text from API response data
 * Handles both Gemini format and OpenRouter (OpenAI) format
 * @param {Object} responseData - API response data
 * @returns {string} Extracted text
 */
export const extractResponseText = (responseData) => {
  // Gemini format: candidates[0].content.parts[0].text
  const geminiText = responseData?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (geminiText) return geminiText;
  
  // OpenRouter / OpenAI format: choices[0].message.content
  const openRouterText = responseData?.choices?.[0]?.message?.content;
  if (openRouterText) return openRouterText;
  
  return '';
};

export const isAPIConfigured = () => {
  return !!import.meta.env.VITE_OPENROUTER_API_KEY;
};

export const getErrorMessage = (error) => {
  return error?.message || 'An unexpected error occurred. Please try again.';
};

export default {
  callOpenRouterAPI,
  callGeminiAPI,
  extractResponseText,
  isAPIConfigured,
  getErrorMessage,
  API_CONFIG
};
