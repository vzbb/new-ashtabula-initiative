function isAPIConfigured() {
  try {
    return !!(import.meta.env?.VITE_GEMINI_API_KEY);
  } catch {
    return false;
  }
}

const API_CONFIG = {};

async function callGeminiAPI(prompt) {
  const key = import.meta.env?.VITE_GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 512 },
    }),
  });
  if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);
  return response.json();
}

function extractResponseText(data) {
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

function getErrorMessage(error) {
  return error?.message || 'Unknown API error';
}

async function callOpenRouterAPI(prompt, options = {}) {
  const key = import.meta.env?.VITE_OPENROUTER_API_KEY;
  const model = options.model || 'google/gemini-2.5-flash-lite';
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
      'HTTP-Referer': 'https://new-ashtabula-initiative.com',
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 512,
    }),
  });
  if (!response.ok) throw new Error(`OpenRouter API error: ${response.status}`);
  return response.json();
}

export {
  callGeminiAPI,
  callOpenRouterAPI,
  extractResponseText,
  isAPIConfigured,
  getErrorMessage,
  API_CONFIG,
};

export default {
  callGeminiAPI,
  callOpenRouterAPI,
  extractResponseText,
  isAPIConfigured,
  getErrorMessage,
  API_CONFIG,
};
