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

const needs = ["Food Pantry", "Clothing Bank", "Utility Assistance", "Spiritual Support", "Youth Programs", "Re-entry Help"];

// SVG Icons
const CompassIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
  </svg>
);

const ZapIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

// SVG Logo - G.O. Benevolence Engine
const GOLogo = () => (
  <svg className="logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* Background Circle */}
    <circle cx="50" cy="50" r="45" fill="#e0f2f1" />
    {/* Compass Outer Ring */}
    <circle cx="50" cy="50" r="38" fill="none" stroke="#00897b" strokeWidth="3" />
    {/* Cardinal markers */}
    <path d="M50 15 L53 22 L50 20 L47 22 Z" fill="#ffc107" />
    {/* Stylized G.O. */}
    <text x="50" y="58" textAnchor="middle" fill="#00897b" fontSize="24" fontWeight="bold" fontFamily="Arial">G.O.</text>
    {/* Heart */}
    <path
      d="M50 68 C45 61 35 64 35 72 C35 80 50 88 50 88 C50 88 65 80 65 72 C65 64 55 61 50 68"
      fill="#e74c3c"
      stroke="#c0392b"
      strokeWidth="1"
    />
  </svg>
);

function App() {
  const [need, setNeed] = useState(needs[0]);
  const [zip, setZip] = useState("44004");
  const [results, setResults] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const find = async () => {
    setLoading(true);
    setError("");
    setResults("");
    try {
      const prompt = `You are a compassionate navigator for the G.O. Community Development Corporation in Ashtabula. Help residents in the Station Ave area find immediate help and neighborhood support. Suggest 3 local resources in Ashtabula County, OH for need: ${need} near ZIP ${zip}. Provide name + short description. Keep it under 120 words.`;
      const data = await callGeminiAPI(prompt);
      const text = extractResponseText(data);
      if (!text) throw new Error("No response from Gemini.");
      setResults(text);
    } catch (e) {
      setError(e.message || "Failed to generate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="header">
        <GOLogo />
        <span className="brand-name">G.O. <span>Benevolence Engine</span></span>
      </div>
      
      <header className="hero">
        <div className="hero-content">
          <span className="eyebrow">⭐ Growth & Opportunity</span>
          <h1>Neighborhood Resource Navigator</h1>
          <p className="sub">The G.O. helps you find the essentials for a better life in our neighborhood.</p>
          
          <div className="input-card">
            <h3>🔍 Search Resources</h3>
            <div className="form-row">
              <div>
                <label>ZIP Code</label>
                <input value={zip} onChange={(e) => setZip(e.target.value)} placeholder="44004" />
              </div>
              <div>
                <label>Need Type</label>
                <select value={need} onChange={(e) => setNeed(e.target.value)}>
                  {needs.map((n) => (<option key={n}>{n}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="hero-actions">
            <button className="primary" onClick={find} disabled={loading}>
              {loading ? "⏳ Matching…" : "✨ Find Resources"}
            </button>
            <button className="ghost" onClick={() => alert("Intake system integration coming soon! Copy the results and paste into your CRM for now.")} aria-label="Add results to client intake">📋 Add to Intake</button>
          </div>
          
          <div className="trust">
            <span><CompassIcon /> Geo-Aware</span>
            <span><ZapIcon /> Gemini AI</span>
            <span><CheckIcon /> 60-Second Intake</span>
          </div>
        </div>
      </header>

      <section className="card">
        <div className="card-head">
          <h2>📍 Resource Matches</h2>
          <span className="pill">Gemini AI</span>
        </div>
        {error && <div className="error">⚠️ {error}</div>}
        {results ? (
          <pre className="output">{results}</pre>
        ) : (
          <p className="muted">Enter your location and need to find matching resources...</p>
        )}
      </section>

      <section className="grid">
        <div className="tile">
          <div className="tile-icon">👥</div>
          <h3>Reduce Drop‑off</h3>
          <p>Give clients a clear list of next steps immediately</p>
        </div>
        <div className="tile">
          <div className="tile-icon">⏱️</div>
          <h3>Staff Efficiency</h3>
          <p>Less time searching, more time helping people</p>
        </div>
        <div className="tile">
          <div className="tile-icon">🛡️</div>
          <h3>Reliable Referrals</h3>
          <p>Standardized resources and consistent handoffs</p>
        </div>
      </section>

      <footer className="footer">
        <div>G.O. Community Development Corp • Station Ave, Ashtabula</div>
      </footer>
    </div>
  );
}

export default App;
