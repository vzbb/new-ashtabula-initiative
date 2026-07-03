/**
 * API Configuration for Mobile Notary
 * Handles Gemini API integration with proper error handling
 */

const API_CONFIG = {
  GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY,
  GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
  TIMEOUT_MS: 30000,
};

/**
 * Validates API configuration on startup
 * @returns {Object} Validation result with status and error message if applicable
 */
export function validateApiConfig() {
  if (!API_CONFIG.GEMINI_API_KEY) {
    return {
      valid: false,
      error: 'Gemini API key is not configured. Please set VITE_GEMINI_API_KEY in your .env file.',
    };
  }
  
  if (API_CONFIG.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    return {
      valid: false,
      error: 'Please replace the placeholder API key with your actual Gemini API key.',
    };
  }
  
  return { valid: true };
}

/**
 * Generates appointment confirmation using Gemini API
 * @param {string} address - Meeting location
 * @param {string} time - Preferred meeting time
 * @returns {Promise<string>} Generated confirmation text
 */
export async function generateAppointmentConfirmation(address, time) {
  // Validate inputs
  if (!address?.trim()) {
    throw new Error('Please provide a valid meeting location.');
  }
  
  if (!time?.trim()) {
    throw new Error('Please select a preferred time.');
  }
  
  // Check API config
  const configCheck = validateApiConfig();
  if (!configCheck.valid) {
    throw new Error(configCheck.error);
  }
  
  const prompt = `Write a professional mobile notary appointment confirmation for ${address} at ${time}. Mention that we are licensed, bonded, and insured in Ashtabula County. Include a reminder to have a valid government-issued photo ID ready. 60 words max.`;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT_MS);
  
  try {
    const response = await fetch(
      `${API_CONFIG.GEMINI_API_URL}?key=${API_CONFIG.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          contents: [{ parts: [{ text: prompt }] }] 
        }),
        signal: controller.signal,
      }
    );
    
    clearTimeout(timeoutId);
    
    // Handle HTTP errors
    if (!response.ok) {
      if (response.status === 400) {
        throw new Error('Invalid request. Please check your inputs and try again.');
      } else if (response.status === 401 || response.status === 403) {
        throw new Error('API authentication failed. Please check your Gemini API key.');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      } else if (response.status >= 500) {
        throw new Error('Gemini API service is temporarily unavailable. Please try again later.');
      } else {
        throw new Error(`API error (${response.status}): ${response.statusText}`);
      }
    }
    
    const data = await response.json();
    
    // Validate response structure
    if (!data?.candidates || data.candidates.length === 0) {
      throw new Error('Received empty response from AI service. Please try again.');
    }
    
    const text = data.candidates[0]?.content?.parts?.[0]?.text?.trim();
    
    if (!text) {
      throw new Error('AI service returned empty content. Please try again.');
    }
    
    return text;
    
  } catch (error) {
    clearTimeout(timeoutId);
    
    // Handle specific error types
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please check your connection and try again.');
    }
    
    if (error.message.includes('fetch') || error.message.includes('network')) {
      throw new Error('Network error. Please check your internet connection.');
    }
    
    // Re-throw the error with its message
    throw error;
  }
}

export default API_CONFIG;
