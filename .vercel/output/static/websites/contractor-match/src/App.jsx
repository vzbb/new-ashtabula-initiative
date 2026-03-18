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


// Chamber of Commerce Network Logo SVG
const ChamberLogo = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="46" fill="#003366" />
    <circle cx="50" cy="50" r="42" fill="none" stroke="#d4af37" strokeWidth="2" />
    <circle cx="50" cy="50" r="8" fill="#d4af37" />
    <circle cx="50" cy="25" r="5" fill="#ffffff" />
    <circle cx="72" cy="38" r="5" fill="#ffffff" />
    <circle cx="72" cy="62" r="5" fill="#ffffff" />
    <circle cx="50" cy="75" r="5" fill="#ffffff" />
    <circle cx="28" cy="62" r="5" fill="#ffffff" />
    <circle cx="28" cy="38" r="5" fill="#ffffff" />
    <line x1="50" y1="50" x2="50" y2="25" stroke="#d4af37" strokeWidth="2" />
    <line x1="50" y1="50" x2="72" y2="38" stroke="#d4af37" strokeWidth="2" />
    <line x1="50" y1="50" x2="72" y2="62" stroke="#d4af37" strokeWidth="2" />
    <line x1="50" y1="50" x2="50" y2="75" stroke="#d4af37" strokeWidth="2" />
    <line x1="50" y1="50" x2="28" y2="62" stroke="#d4af37" strokeWidth="2" />
    <line x1="50" y1="50" x2="28" y2="38" stroke="#d4af37" strokeWidth="2" />
    <path d="M50 25 L72 38 L72 62 L50 75 L28 62 L28 38 Z" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.5" />
    <path d="M25 70 Q50 55 75 70" fill="none" stroke="#d4af37" strokeWidth="2" opacity="0.8" />
  </svg>
);

function App() {
  const [trade, setTrade] = useState("Roofing");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const match = async () => {
    setLoading(true);
    setError("");
    setResult("");
    try {
      const prompt = `Create a short contractor match summary for ${trade} in Ashtabula County, OH. Provide 2-3 bullet points and a next-step CTA. 70 words max.`;
      const data = await callGeminiAPI(prompt);
      const text = extractResponseText(data);
      setResult(text);
    } catch (e) {
      setError(e.message || "Failed to generate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      {/* Chamber Header */}
      <header className="chamber-header">
        <div className="chamber-header-content">
          <div className="chamber-logo">
            <ChamberLogo size={40} />
            <div className="chamber-logo-text">
              <span className="chamber-logo-title">Contractor Match</span>
              <span className="chamber-logo-subtitle">Ashtabula Chamber Business Tool</span>
            </div>
          </div>
          <div className="chamber-badge">Chamber Member Resource</div>
        </div>
      </header>

      <header className="hero">
        <div>
          <div className="hero-certification">🏆 Chamber Certified Business Tool</div>
          <p className="eyebrow">Welcome to Your Chamber Business Assistant</p>
          <h1>Connect Homeowners with Vetted Pros</h1>
          <p className="sub">
            Exclusive Chamber Member Resource — Connecting Ashtabula Businesses with 
            trusted contractors. Gemini‑powered matching + quote request CTA.
          </p>
          <div className="member-stats">
            <span className="stats-badge">Join 400+ Chamber Members Using This Tool</span>
          </div>
          <div className="hero-actions">
            <button className="primary" onClick={match} disabled={loading}>
              {loading ? "Matching…" : "Find Pros"}
            </button>
            <button className="ghost">Claim Your Chamber Member Benefit</button>
          </div>
          <div className="trust">
            <span>🧰 Gemini API</span>
            <span>⚡ 5‑second output</span>
            <span>✅ Chamber Vetted</span>
          </div>
        </div>
        <div className="hero-card">
          <h3>Trade Type</h3>
          <input value={trade} onChange={(e) => setTrade(e.target.value)} placeholder="e.g., Roofing, Plumbing" />
        </div>
      </header>

      <section className="card">
        <div className="card-head">
          <h2>Contractor Matches</h2>
          <span className="pill">Member Benefit</span>
        </div>
        {error && <div className="error">{error}</div>}
        {result ? <pre className="output">{result}</pre> : <p className="muted">Matches appear here. Member Benefit — Powered by Your Chamber.</p>}
      </section>

      <section className="grid">
        <div className="tile">
          <div className="tile-icon">🤝</div>
          <h3>Higher Conversion</h3>
          <p>Clear next step for homeowners.</p>
        </div>
        <div className="tile">
          <div className="tile-icon">🛡️</div>
          <h3>Trust & Safety</h3>
          <p>Chamber-vetted pro positioning.</p>
        </div>
        <div className="tile">
          <div className="tile-icon">⚡</div>
          <h3>Lead Velocity</h3>
          <p>Faster quote requests.</p>
        </div>
      </section>

      <section className="member-cta-section">
        <div className="cta-box">
          <h3>Ready to Grow Your Business?</h3>
          <p>Join 400+ Chamber members using our business tools.</p>
          <button className="btn-chamber-cta">Claim Your Chamber Member Benefit</button>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <p className="footer-main">© 2026 Ashtabula Area Chamber of Commerce. All rights reserved.</p>
          <p className="footer-tagline">Connecting Businesses. Building Community.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
