import { useState } from "react";
import "./App.css";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// === NAI API Client - Robust Error Handling & Retry Logic ===
const API_CONFIG = {
  TIMEOUT_MS: 30000,
  MAX_RETRIES: 3,
  INITIAL_RETRY_DELAY_MS: 1000,
  MAX_RETRY_DELAY_MS: 10000,
  RATE_LIMIT_STATUS: 429,
  RETRYABLE_STATUS_CODES: [408, 429, 500, 502, 503, 504],
};

const delay = (ms) => {
  const jitter = Math.random() * 200;
  return new Promise(resolve => setTimeout(resolve, ms + jitter));
};

const getBackoffDelay = (retryCount) => {
  const exponentialDelay = API_CONFIG.INITIAL_RETRY_DELAY_MS * Math.pow(2, retryCount);
  return Math.min(exponentialDelay, API_CONFIG.MAX_RETRY_DELAY_MS);
};

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

const callGeminiAPI = async (prompt, model = 'gemini-1.5-flash', retryCount = 0) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('API key not configured. Please check your environment settings.');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
  };

  try {
    const response = await fetchWithTimeout(url, options, API_CONFIG.TIMEOUT_MS);

    if (response.status === API_CONFIG.RATE_LIMIT_STATUS) {
      if (retryCount < API_CONFIG.MAX_RETRIES) {
        await delay(getBackoffDelay(retryCount));
        return callGeminiAPI(prompt, model, retryCount + 1);
      }
      throw new Error('Rate limit exceeded. Please wait a moment and try again.');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `API error: ${response.status}`;
      if (API_CONFIG.RETRYABLE_STATUS_CODES.includes(response.status) && retryCount < API_CONFIG.MAX_RETRIES) {
        await delay(getBackoffDelay(retryCount));
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
      await delay(getBackoffDelay(retryCount));
      return callGeminiAPI(prompt, model, retryCount + 1);
    }

    let userMessage = 'An error occurred while processing your request.';
    if (error.message?.includes('timeout')) {
      userMessage = 'Request timed out. Please check your connection and try again.';
    } else if (error.message?.includes('Rate limit') || error.message?.includes('API key') || error.message?.includes('No response content')) {
      userMessage = error.message;
    }
    throw new Error(userMessage);
  }
};

const extractResponseText = (responseData) => {
  return responseData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
};
// === End NAI API Client ===


// SVG Logo - Bell with Service Star
const ConciergeLogo = () => (
  <svg className="logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* Background Circle */}
    <circle cx="50" cy="50" r="45" fill="#faf8f5" stroke="#d4af37" strokeWidth="2" />
    {/* Bell */}
    <path d="M50 20 C35 20 30 30 30 40 L30 60 L20 70 L80 70 L70 60 L70 40 C70 30 65 20 50 20" fill="#1a1a1a" />
    <ellipse cx="50" cy="72" rx="15" ry="8" fill="#d4af37" />
    <circle cx="50" cy="78" r="4" fill="#1a1a1a" />
    {/* Bell Clapper */}
    <circle cx="50" cy="82" r="3" fill="#d4af37" />
    {/* Service Star */}
    <path d="M65 30 L67 36 L73 36 L68 40 L70 46 L65 42 L60 46 L62 40 L57 36 L63 36 Z" fill="#d4af37" />
    {/* Shine Lines */}
    <path d="M38 35 Q35 40 38 45" stroke="#d4af37" strokeWidth="2" fill="none" />
    <path d="M62 35 Q65 40 62 45" stroke="#d4af37" strokeWidth="2" fill="none" /
    >
  </svg>
);

// Icons
const BellIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>;

const SparklesIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>;

const StarIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;

function App() {
  const [request, setRequest] = useState("Restaurant reservation for 4 tonight");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRequest = async () => {
    setLoading(true);
    setError("");
    setResponse("");
    try {
      const prompt = `You are a luxury hotel concierge. Respond to this guest request: "${request}". Provide 3 helpful suggestions with contact info or next steps. Be warm, professional, and concise (under 100 words).`;
      const data = await callGeminiAPI(prompt);
      const text = extractResponseText(data);
    } catch (e) {
      setError(e.message || "Failed to generate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="header">
        <ConciergeLogo />
        <span className="brand-name">Virtual Concierge</span>
      </div>

      <header className="hero">
        <div className="hero-content">
          <span className="eyebrow">🌟 At Your Service</span>
          <h1>Your Personal Assistant</h1>
          <p className="sub">Gemini‑powered concierge for recommendations and local expertise</p>
          
          <div className="input-card">
            <h3>🎯 How May I Assist You?</h3>
            <label>Describe your request or need</label>
            <textarea 
              value={request} 
              onChange={(e) => setRequest(e.target.value)} 
              placeholder="e.g., Restaurant reservation, local attractions, transportation..."
              rows={4}
            />
          </div>
          
          <div className="hero-actions">
            <button className="primary" onClick={handleRequest} disabled={loading}>
              {loading ? "⏳ Assisting…" : "✨ Get Recommendations"}
            </button>
            <button className="ghost">📞 Call Concierge</button>
          </div>
          
          <div className="trust">
            <span><BellIcon /> 24/7 Service</span>
            <span><SparklesIcon /> Gemini AI</span>
            <span><StarIcon /> Premium Quality</span>
          </div>
        </div>
      </header>

      <section className="card">
        <div className="card-head">
          <h2>📋 Your Recommendations</h2>
          <span className="pill">Concierge</span>
        </div>
        {error && <div className="error">⚠️ {error}</div>}
        {response ? (
          <pre className="output">{response}</pre>
        ) : (
          <p className="muted">Your personalized recommendations will appear here...</p>
        )}
      </section>

      <section className="grid">
        <div className="tile">
          <div className="tile-icon">🍽️</div>
          <h3>Dining</h3>
          <p>Restaurant reservations and culinary recommendations</p>
        </div>
        <div className="tile">
          <div className="tile-icon">🎭</div>
          <h3>Entertainment</h3>
          <p>Local events, shows, and attractions</p>
        </div>
        <div className="tile">
          <div className="tile-icon">🚗</div>
          <h3>Transportation</h3>
          <p>Car services, directions, and travel planning</p>
        </div>
      </section>

      <footer className="footer">
        <div>Virtual Concierge • Luxury Service for Ashtabula</div>
      </footer>
    </div>
  );
}

export default App;
