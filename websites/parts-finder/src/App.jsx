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


// Gear with Wrench Logo
const LogoIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="logo-icon">
    <circle cx="32" cy="32" r="16" fill="#5d6d7e" stroke="#34495e" strokeWidth="2"/>
    <circle cx="32" cy="32" r="8" fill="#ecf0f1"/>
    <path d="M32 8v8M32 48v8M8 32h8M48 32h8M15 15l6 6M43 43l6 6M15 49l6-6M43 21l6-6" stroke="#5d6d7e" strokeWidth="4" strokeLinecap="round"/>
    <rect x="44" y="20" width="16" height="6" rx="1" fill="#bdc3c7" transform="rotate(45 52 23)"/>
    <rect x="52" y="14" width="8" height="12" rx="1" fill="#c0392b" transform="rotate(45 56 20)"/>
  </svg>
);

const WrenchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
  </svg>
);

const BoxIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);

const TruckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13"/>
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
    <circle cx="5.5" cy="18.5" r="2.5"/>
    <circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);

function App() {
  const [query, setQuery] = useState("Alternator for 2015 Ford F-150");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const search = async () => {
    setLoading(true);
    setError("");
    setResult("");
    try {
      const prompt = `Write a professional parts availability response for: ${query}. Include availability status, price estimate, and next step to reserve or order. Professional auto parts tone. 60 words max.`;
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
      <div className="background-pattern" aria-hidden="true">
        <svg className="gear-bg" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="gearPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="20" fill="none" stroke="#5d6d7e" strokeWidth="1" opacity="0.15"/>
              <circle cx="50" cy="50" r="12" fill="none" stroke="#bdc3c7" strokeWidth="1" opacity="0.1"/>
              <path d="M50 25v10M50 65v10M25 50h10M65 50h10M32 32l7 7M61 61l7 7M32 68l7-7M61 39l7-7" stroke="#5d6d7e" strokeWidth="2" opacity="0.1" strokeLinecap="round"/>
              <rect x="20" y="20" width="8" height="4" fill="#c0392b" opacity="0.08"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#gearPattern)"/>
        </svg>
      </div>

      <div className="container">
        <header className="header">
          <div className="brand">
            <LogoIcon />
            <div className="brand-text">
              <span className="brand-name">Parts Finder</span>
              <span className="brand-tagline">Professional Auto Parts</span>
            </div>
          </div>
        </header>

        <main className="main-content">
          <section className="hero-card">
            <div className="hero-content">
              <p className="eyebrow">Inventory Search</p>
              <h1>Find Parts Fast. Close Sales Faster.</h1>
              <p className="sub">AI-powered parts lookup with instant availability and reservation options.</p>
              
              <div className="trust">
                <span className="trust-item"><WrenchIcon /> Expert Lookup</span>
                <span className="trust-item"><BoxIcon /> Real Stock</span>
                <span className="trust-item"><TruckIcon /> Fast Delivery</span>
              </div>
            </div>
            
            <div className="input-card">
              <h3>Part Query</h3>
              <label>
                <span>What do you need?</span>
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g., Brake pads 2018 Honda Civic" />
              </label>
              <button className="primary" onClick={search} disabled={loading}>
                {loading ? "Searching..." : "Check Availability"}
              </button>
            </div>
          </section>

          <section className="result-card">
            <div className="card-header">
              <h2>Availability Response</h2>
              <span className="pill">AI Generated</span>
            </div>
            {error && <div className="error">{error}</div>}
            {result ? (
              <div className="output">{result}</div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🔧</div>
                <p>Enter a part query to check availability and get pricing information.</p>
              </div>
            )}
          </section>

          <section className="features">
            <div className="feature">
              <div className="feature-icon">⚡</div>
              <h3>Faster Close</h3>
              <p>Instant availability messaging reduces wait times.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🤖</div>
              <h3>Less Admin</h3>
              <p>Automated responses save staff time.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">✓</div>
              <h3>Better Service</h3>
              <p>Clear next steps for every customer.</p>
            </div>
          </section>
        </main>

        <footer className="footer">
          <p>Ace Parts Company • Ashtabula County, OH</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
