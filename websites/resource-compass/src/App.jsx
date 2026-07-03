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

const needs = ["Transportation", "Stable Housing", "Childcare", "Employment", "Debt Reduction", "Healthy Food"];

// Ashtabula Circles Logo Component
const CirclesLogo = ({ size = 50 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="35" cy="50" r="25" fill="none" stroke="#005596" strokeWidth="4" />
    <circle cx="65" cy="50" r="25" fill="none" stroke="#27ae60" strokeWidth="4" />
    <circle cx="50" cy="35" r="25" fill="none" stroke="#ffd700" strokeWidth="4" opacity="0.8" />
    <path d="M45 50 L55 50 M50 45 L50 55" stroke="#005596" strokeWidth="2" />
  </svg>
);

function App() {
  const [zip, setZip] = useState("44004");
  const [need, setNeed] = useState(needs[0]);
  const [results, setResults] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const find = async () => {
    setLoading(true);
    setError("");
    setResults("");
    try {
      const prompt = `You are a supportive coach for the Ashtabula County Circles initiative. Your goal is to help 'Circle Leaders' find social capital and 3 local resources in Ashtabula County for ${need} near ZIP ${zip}. Focus on resources that help move from surviving to thriving. Provide name + short description + contact if possible. 120 words max.`;
      const data = await callGeminiAPI(prompt);
      const text = extractResponseText(data);
      setResults(text);
    } catch (e) {
      setError(e.message || "Failed to generate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="bg-pattern" aria-hidden="true" />

      <header className="header">
        <div className="logo">
          <CirclesLogo />
          <div className="logo-text">
            <span className="logo-title">Ashtabula Circles</span>
            <span className="logo-subtitle">Circle Navigator</span>
          </div>
        </div>
        <div className="official-badge">Collaborative</div>
      </header>

      <main className="content">
        <section className="hero">
          <div className="hero-eyebrow">🌱 From Surviving to Thriving</div>
          <h1>Find the Capital to Thrive</h1>
          <p>Connecting Circle Leaders with the community resources and social capital they need to succeed.</p>
        </section>
        
        <div className="input-card">
          <h3>🧭 Find Resources</h3>
          <div className="form-row">
            <div>
              <label>ZIP Code</label>
              <input value={zip} onChange={(e) => setZip(e.target.value)} placeholder="44004" />
            </div>
            <div>
              <label>Type of Help Needed</label>
              <select value={need} onChange={(e) => setNeed(e.target.value)}>
                {needs.map((n) => (<option key={n} value={n}>{n}</option>))}
              </select>
            </div>
          </div>
          
          <div className="btn-group">
            <button className="btn btn-primary" onClick={find} disabled={loading}>
              {loading ? "🧭 Finding…" : "✨ Find Resources"}
            </button>
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        {results && (
          <div className="results-card">
            <h3>📍 Resources Near {zip}</h3>
            <pre>{results}</pre>
          </div>
        )}

        <div className="features">
          <div className="feature">
            <span>🏥</span>
            <h4>Health Services</h4>
            <p>Medical & mental health</p>
          </div>
          <div className="feature">
            <span>🏠</span>
            <h4>Housing Support</h4>
            <p>Shelter & utilities</p>
          </div>
          <div className="feature">
            <span>💼</span>
            <h4>Employment</h4>
            <p>Jobs & training</p>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p className="footer-text">Ashtabula County Circles • Bridges Out of Poverty</p>
        <p className="footer-subtext">© 2026 Ashtabula County Family and Children First Council</p>
      </footer>
    </div>
  );
}

export default App;
