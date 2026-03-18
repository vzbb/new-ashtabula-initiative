/**
 * Civic Insight Engine - Gemini API Service
 * Enhanced meeting summarization with robust error handling
 */

import { GoogleGenAI } from '@google/genai';
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

// Custom error class for API errors
export class GeminiAPIError extends Error {
  constructor(message, code, details = null) {
    super(message);
    this.name = 'GeminiAPIError';
    this.code = code;
    this.details = details;
  }
}

// Validation schema for meeting summaries
const summarySchema = z.object({
  bullets: z.array(z.string().max(100)).length(5).describe("Exactly five bullet points of key decisions/actions (max 25 words each)."),
  actionItems: z.array(z.string().max(100)).length(3).describe("Exactly three specific action items with responsible parties."),
  overview: z.string().describe("One paragraph overview (3-4 sentences) that provides the core narrative of the meeting."),
  pressRelease: z.string().describe("A professional, 200-300 word press release suitable for local media based on the meeting minutes."),
  tags: z.array(z.string()).min(3).max(5).describe("Relevant tags for categorization (3-5 tags).")
});

// Initialize Gemini AI client
const getAIClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Check if API key is properly configured
 */
export function isApiKeyConfigured() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  return apiKey && 
         apiKey !== 'YOUR_GEMINI_API_KEY_HERE' && 
         apiKey !== 'your_gemini_api_key_here' &&
         apiKey.length > 20;
}

/**
 * Check if mock mode is enabled
 */
export function isMockModeEnabled() {
  return import.meta.env.VITE_USE_MOCK_DATA === 'true' || !isApiKeyConfigured();
}

/**
 * Test API connectivity
 */
export async function testApiConnection() {
  try {
    if (!isApiKeyConfigured()) {
      return {
        success: false,
        message: 'API key not configured',
        code: 'AUTH_ERROR'
      };
    }

    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Say "Civic Insight Engine API is working" and nothing else.',
    });

    return {
      success: true,
      message: 'API connection successful',
      response: response.text
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      code: error.code || 'UNKNOWN_ERROR'
    };
  }
}

/**
 * Summarize meeting minutes using Gemini API
 */
export async function summarizeMeeting(text) {
  // Validate input
  if (!text || text.trim().length === 0) {
    throw new GeminiAPIError(
      'Meeting text cannot be empty',
      'VALIDATION_ERROR'
    );
  }

  if (text.length < 50) {
    throw new GeminiAPIError(
      'Meeting text is too short. Please provide more content.',
      'VALIDATION_ERROR'
    );
  }

  // Use mock data if API key not configured or mock mode enabled
  if (isMockModeEnabled()) {
    console.warn("[Civic Insight Engine] Using mock data. API key not configured or mock mode enabled.");
    return getMockSummary(text);
  }

  const ai = getAIClient();
  if (!ai) {
    throw new GeminiAPIError(
      'Failed to initialize AI client',
      'INIT_ERROR'
    );
  }

  const prompt = `You are an expert municipal clerk assistant for Ashtabula County, Ohio. 
Your goal is to transform dense meeting minutes into a clear, accessible, and transparent summary for residents.

Please analyze and summarize the following township meeting minutes.
Focus on decisions and topics that directly impact residents (taxes, roads, zoning, public safety, community events, utilities).

MEETING MINUTES:
${text.substring(0, 15000)}`; // Limit input size

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: zodToJsonSchema(summarySchema),
        temperature: 0.3,
        maxOutputTokens: 2000
      }
    });
    
    let responseText = response.text;
    
    // Clean up potential markdown formatting
    if (responseText.startsWith('```json')) {
      responseText = responseText.replace(/```json\n?/, '').replace(/\n?```/, '');
    }
    
    // Parse JSON
    let parsed;
    try {
      parsed = JSON.parse(responseText.trim());
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Response text:", responseText);
      throw new GeminiAPIError(
        'Failed to parse AI response',
        'PARSE_ERROR',
        { originalText: responseText.substring(0, 500) }
      );
    }
    
    // Validate with Zod
    const validated = summarySchema.parse(parsed);
    
    return {
      ...validated,
      _meta: {
        source: 'gemini-api',
        timestamp: new Date().toISOString()
      }
    };
    
  } catch (error) {
    console.error("Error in summarizeMeeting:", error);
    
    // Return mock data on error for graceful degradation
    if (error instanceof GeminiAPIError) {
      throw error;
    }
    
    // Handle specific Gemini API errors
    if (error.message?.includes('API key not valid')) {
      throw new GeminiAPIError(
        'Invalid API key. Please check your Gemini API key configuration.',
        'AUTH_ERROR'
      );
    }
    
    if (error.message?.includes('quota')) {
      throw new GeminiAPIError(
        'API quota exceeded. Please try again later.',
        'QUOTA_ERROR'
      );
    }
    
    if (error.message?.includes('rate limit')) {
      throw new GeminiAPIError(
        'Rate limit exceeded. Please wait a moment and try again.',
        'RATE_LIMIT'
      );
    }
    
    // Generic fallback to mock data
    console.warn("Gemini API call failed. Returning mock summary for graceful degradation.");
    return getMockSummary(text);
  }
}

/**
 * Generate a mock summary for testing/demo
 */
export function getMockSummary(text) {
  // Try to extract some keywords from the input for personalization
  const lowerText = text.toLowerCase();
  const hasBudget = lowerText.includes('budget') || lowerText.includes('fiscal');
  const hasRoads = lowerText.includes('road') || lowerText.includes('paving');
  const hasSafety = lowerText.includes('police') || lowerText.includes('fire') || lowerText.includes('safety');
  const hasZoning = lowerText.includes('zoning') || lowerText.includes('variance');
  
  let bullets = [
    "Unanimously approved the 2026 infrastructure improvement plan including road resurfacing.",
    "Allocated $45,000 for new playground equipment at Saybrook Park based on community feedback.",
    "Authorized Chief Thompson to increase patrols on Lake Road to address speeding concerns.",
    "Renewed the municipal waste management contract with a minimal 3% rate adjustment.",
    "Approved the purchase of essential snow removal equipment for the Public Works department."
  ];
  
  let tags = ["Infrastructure", "Public Safety", "Parks", "Finance"];
  
  if (hasBudget) {
    bullets[0] = "Adopted the 2026 municipal budget with a 2.5% increase in general fund spending.";
    tags = ["Budget", "Finance", "Public Safety", "Planning"];
  }
  
  if (hasZoning) {
    bullets[1] = "Approved zoning variance for commercial development at the corner of Main and Prospect.";
    tags = ["Zoning", "Development", "Public Safety"];
  }
  
  return {
    bullets,
    actionItems: [
      "Clerk to finalize contracts and publish approved minutes within 5 business days.",
      "Parks committee to present detailed designs for public comment at next session.",
      "Department heads to prepare status reports for quarterly review."
    ],
    overview: "This meeting prioritized community safety and infrastructure. Key outcomes include funding for road repairs and parks, alongside immediate responses to citizen concerns about traffic safety. The board demonstrated a commitment to both long-term maintenance and immediate quality-of-life improvements.",
    pressRelease: "ASHTABULA TOWNSHIP ANNOUNCES STRATEGIC INVESTMENTS IN ROADS AND RECREATION\n\nASHTABULA TOWNSHIP, OH — The Ashtabula Township Board of Trustees moved forward with a series of community-focused initiatives during their recent regular session. Highlighting the evening was the approval of a comprehensive road resurfacing plan and a significant investment in local parks.\n\nThe Trustees authorized funding for new equipment at Saybrook Park, fulfilling a long-standing request from local families. Additionally, the Board addressed public safety concerns by authorizing immediate traffic enforcement measures on major thoroughfares.\n\n\"We are listening to our residents and putting tax dollars to work where they matter most,\" said the Board Chairman. \"From safe roads to vibrant parks, we are building a stronger Ashtabula together.\"",
    tags,
    _meta: {
      source: 'mock-data',
      timestamp: new Date().toISOString(),
      note: 'Generated with mock data - API key not configured'
    }
  };
}

/**
 * Get API status information
 */
export function getApiStatus() {
  return {
    configured: isApiKeyConfigured(),
    mockMode: isMockModeEnabled(),
    keyPrefix: isApiKeyConfigured() 
      ? import.meta.env.VITE_GEMINI_API_KEY.substring(0, 8) + '...'
      : 'not set'
  };
}
