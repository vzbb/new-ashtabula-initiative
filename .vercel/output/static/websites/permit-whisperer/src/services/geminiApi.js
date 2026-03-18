/**
 * Permit Whisperer - Gemini API Service
 * Handles all AI interactions with proper error handling and fallbacks
 */

const API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';
const DEFAULT_MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-1.5-flash';

/**
 * Custom error class for API errors
 */
export class GeminiAPIError extends Error {
  constructor(message, code, details = null) {
    super(message);
    this.name = 'GeminiAPIError';
    this.code = code;
    this.details = details;
  }
}

/**
 * Check if the Gemini API key is configured
 */
export function isApiKeyConfigured() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  return apiKey && apiKey !== 'your_gemini_api_key_here' && apiKey.length > 10;
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
 * Generate a permit-related answer using Gemini API
 */
export async function generatePermitAnswer(question, context = {}) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!isApiKeyConfigured()) {
    throw new GeminiAPIError(
      'API key not configured',
      'AUTH_ERROR',
      { message: 'Please add your Gemini API key to the .env file' }
    );
  }

  const prompt = buildPrompt(question, context);
  
  try {
    const response = await fetch(
      `${API_BASE_URL}/models/${DEFAULT_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ 
            role: 'user',
            parts: [{ text: prompt }] 
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 500,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            }
          ]
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 400) {
        throw new GeminiAPIError(
          'Invalid request',
          'BAD_REQUEST',
          errorData
        );
      }
      
      if (response.status === 401 || response.status === 403) {
        throw new GeminiAPIError(
          'API key invalid',
          'AUTH_ERROR',
          errorData
        );
      }
      
      if (response.status === 429) {
        throw new GeminiAPIError(
          'Rate limit exceeded',
          'RATE_LIMIT',
          errorData
        );
      }
      
      throw new GeminiAPIError(
        `API request failed: ${response.status}`,
        'API_ERROR',
        errorData
      );
    }

    const data = await response.json();
    
    // Check for blocked content
    if (data.promptFeedback?.blockReason) {
      throw new GeminiAPIError(
        'Request blocked by safety filters',
        'SAFETY_BLOCKED',
        { reason: data.promptFeedback.blockReason }
      );
    }
    
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      throw new GeminiAPIError(
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
    if (error instanceof GeminiAPIError) {
      throw error;
    }
    
    // Wrap unknown errors
    throw new GeminiAPIError(
      getErrorMessage(error),
      'UNKNOWN_ERROR',
      { originalError: error.message }
    );
  }
}

/**
 * Build the prompt for permit questions
 */
function buildPrompt(question, context) {
  const basePrompt = `You are Permit Whisperer, an AI assistant for the Ashtabula County Permits Department. 

Your job is to provide clear, accurate answers about building permits, zoning, and municipal regulations for Ashtabula, Ohio.

GUIDELINES:
- Answer in 2-4 sentences
- Include specific code citations when possible (e.g., "Code §12.4" or "Zoning Ordinance §5.2")
- If you're uncertain, acknowledge it and suggest contacting the permits office
- Be professional but conversational
- Focus on actionable information

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
  const citationRegex = /(?:Code|Ordinance|§)\s*[\d.]+[A-Z]?/gi;
  const matches = text.match(citationRegex) || [];
  return [...new Set(matches)]; // Remove duplicates
}

/**
 * Get a mock answer for testing/demo without API
 */
export function getMockAnswer(question) {
  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.includes('fence')) {
    return {
      answer: "Fences under 6 feet tall don't require a permit in Ashtabula. For fences 6 feet or taller, you'll need a permit and must comply with setback requirements from property lines. Code §12.4",
      citations: ['Code §12.4'],
      confidence: 'high'
    };
  }
  
  if (lowerQuestion.includes('deck')) {
    return {
      answer: "All attached decks require a building permit in Ashtabula County, regardless of size. You'll also need to comply with setback requirements and may need a zoning review. Code §8.3",
      citations: ['Code §8.3'],
      confidence: 'high'
    };
  }
  
  if (lowerQuestion.includes('shed')) {
    return {
      answer: "Sheds under 120 square feet don't require a permit. For sheds 120 square feet or larger, you need a building permit and must follow setback requirements. Zoning Ordinance §5.2",
      citations: ['Zoning Ordinance §5.2'],
      confidence: 'high'
    };
  }
  
  return {
    answer: "That's a great question about permits. For the most accurate and up-to-date information, I recommend contacting the Ashtabula County Permits Office directly at (440) 992-1438 or visiting the office during business hours.",
    citations: [],
    confidence: 'low'
  };
}

/**
 * Test the API connection
 */
export async function testApiConnection() {
  try {
    const result = await generatePermitAnswer("What is your purpose?");
    return { success: true, message: 'API connection successful' };
  } catch (error) {
    return { 
      success: false, 
      message: error.message,
      code: error.code 
    };
  }
}
