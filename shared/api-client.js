/**
 * NAI API Client - Robust API integration with retry logic, rate limiting, and error handling
 * Use this module for all Gemini API calls across NAI sites
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
 * Call Gemini API with robust error handling, retry logic, and rate limiting protection
 * @param {string} prompt - The prompt text to send
 * @param {string} model - Gemini model to use (default: gemini-1.5-flash)
 * @param {number} retryCount - Internal retry counter (do not set manually)
 * @returns {Promise<Object>} API response data
 * @throws {Error} After all retries exhausted or non-retryable error
 */
export const callGeminiAPI = async (prompt, model = 'gemini-1.5-flash', retryCount = 0) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('API key not configured. Please check your environment settings.');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  };

  try {
    const response = await fetchWithTimeout(url, options, API_CONFIG.TIMEOUT_MS);

    if (response.status === API_CONFIG.RATE_LIMIT_STATUS) {
      if (retryCount < API_CONFIG.MAX_RETRIES) {
        const backoffDelay = getBackoffDelay(retryCount);
        await delay(backoffDelay);
        return callGeminiAPI(prompt, model, retryCount + 1);
      }
      throw new Error('Rate limit exceeded. Please wait a moment and try again.');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `API error: ${response.status}`;
      
      if (API_CONFIG.RETRYABLE_STATUS_CODES.includes(response.status) && retryCount < API_CONFIG.MAX_RETRIES) {
        const backoffDelay = getBackoffDelay(retryCount);
        await delay(backoffDelay);
        return callGeminiAPI(prompt, model, retryCount + 1);
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error('No response content received from API.');
    }
    
    return data;

  } catch (error) {
    if (isRetryable(error) && retryCount < API_CONFIG.MAX_RETRIES) {
      const backoffDelay = getBackoffDelay(retryCount);
      await delay(backoffDelay);
      return callGeminiAPI(prompt, model, retryCount + 1);
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

export const extractResponseText = (responseData) => {
  return responseData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
};

export const isAPIConfigured = () => {
  return !!import.meta.env.VITE_GEMINI_API_KEY;
};

export const getErrorMessage = (error) => {
  return error?.message || 'An unexpected error occurred. Please try again.';
};

export default {
  callGeminiAPI,
  extractResponseText,
  isAPIConfigured,
  getErrorMessage,
  API_CONFIG
};
