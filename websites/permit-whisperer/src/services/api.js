/**
 * Permit Whisperer - AI API Service (OpenRouter)
 * Handles all AI interactions via OpenRouter with proper error handling.
 * Uses google/gemini-2.5-flash-lite through OpenRouter — not the Gemini API directly.
 */

const API_BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = 'google/gemini-2.5-flash-lite';

/**
 * Custom error class for API errors
 */
export class APIError extends Error {
  constructor(message, code, details = null) {
    super(message);
    this.name = 'APIError';
    this.code = code;
    this.details = details;
  }
}

/**
 * Check if the OpenRouter API key is configured
 */
export function isApiKeyConfigured() {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  return apiKey && apiKey !== 'your_openrouter_api_key_here' && apiKey.length > 10;
}

/**
 * Get user-friendly error message based on error type
 */
function getErrorMessage(error, fallbackMessage = 'Unable to get an answer. Please try again.') {
  // Network errors
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return 'Network connection issue. Please check your internet connection and try again.';
  }
  
  // API-specific errors
  if (error.message?.includes('API key not valid')) {
    return 'API key is invalid or expired. Please contact support.';
  }
  
  if (error.message?.includes('quota')) {
    return 'Daily API quota exceeded. Please try again tomorrow.';
  }
  
  if (error.message?.includes('rate limit')) {
    return 'Too many requests. Please wait a moment and try again.';
  }
  
  return fallbackMessage;
}

/**
 * Generate a permit-related answer using OpenRouter API
 */
export async function generatePermitAnswer(question, context = {}) {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  
  if (!isApiKeyConfigured()) {
    throw new APIError(
      'API key not configured',
      'AUTH_ERROR',
      { message: 'Please add your OpenRouter API key to the .env file' }
    );
  }

  const prompt = buildPrompt(question, context);
  
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Permit Whisperer',
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 400) {
        throw new APIError(
          'Invalid request',
          'BAD_REQUEST',
          errorData
        );
      }
      
      if (response.status === 401 || response.status === 403) {
        throw new APIError(
          'API key invalid',
          'AUTH_ERROR',
          errorData
        );
      }
      
      if (response.status === 429) {
        throw new APIError(
          'Rate limit exceeded',
          'RATE_LIMIT',
          errorData
        );
      }
      
      throw new APIError(
        `API request failed: ${response.status}`,
        'API_ERROR',
        errorData
      );
    }

    const data = await response.json();
    
    if (data?.choices?.[0]?.finish_reason === 'content_filter') {
      throw new APIError(
        'Request blocked by safety filters',
        'SAFETY_BLOCKED',
        { reason: data?.choices?.[0]?.finish_reason }
      );
    }
    
    const text = data?.choices?.[0]?.message?.content;
    
    if (!text) {
      throw new APIError(
        'Empty response from AI',
        'EMPTY_RESPONSE'
      );
    }
    
    return {
      answer: text.trim(),
      citations: extractCitations(text),
      confidence: 'high'
    };
    
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    
    // Wrap unknown errors
    throw new APIError(
      getErrorMessage(error),
      'UNKNOWN_ERROR',
      { originalError: error.message }
    );
  }
}

/**
 * Build the prompt for permit questions
 */
function buildPrompt(question) {
  const basePrompt = `You are Permit Whisperer, an AI assistant for the Ashtabula County Permits Department. 

Your job is to provide clear, accurate answers about building permits, zoning, and municipal regulations for Ashtabula, Ohio.

GUIDELINES:
- Answer in 2-4 sentences
- Include specific code citations when possible (e.g., "Code §12.4" or "Zoning Ordinance §5.2")
- If you're uncertain, acknowledge it and suggest contacting the permits office
- Be professional but conversational
- Focus on actionable information
- Do not generate harassing, hateful, or abusive content

COMMON ASHTABULA PERMIT RULES (for reference):
- Fences under 6ft: No permit required
- Fences 6ft+: Permit required, must comply with setback
- Decks attached to house: Always require permit
- Sheds under 120 sq ft: No permit required
- Sheds 120+ sq ft: Permit required
- Driveway repairs: No permit for same material
- New driveway: Permit required
- Interior renovations: Permit required for structural, electrical, plumbing
- Roof replacement: Permit required

QUESTION: ${question}`;

  return basePrompt;
}

/**
 * Extract citation references from the answer
 */
function extractCitations(text) {
  const citationRegex = /(?:Code|Ordinance|§)\\s*[\\d.]+[A-Z]?/gi;
  const matches = text.match(citationRegex) || [];
  return [...new Set(matches)]; // Remove duplicates
}

/**
 * Test the API connection
 */
export async function testApiConnection() {
  try {
    await generatePermitAnswer("What is your purpose?");
    return { success: true, message: 'API connection successful' };
  } catch (error) {
    return { 
      success: false, 
      message: error.message,
      code: error.code 
    };
  }
}
