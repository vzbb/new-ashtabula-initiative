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


// Lawn Mower Logo SVG
const LogoIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="logo-icon">
    <rect x="8" y="32" width="36" height="20" rx="3" fill="#4ade80" stroke="#22c55e" strokeWidth="2"/>
    <circle cx="16" cy="52" r="6" fill="#5c4033"/>
    <circle cx="16" cy="52" r="3" fill="#8b7355"/>
    <circle cx="40" cy="52" r="6" fill="#5c4033"/>
    <circle cx="40" cy="52" r="3" fill="#8b7355"/>
    <rect x="44" y="24" width="12" height="8" rx="2" fill="#fbbf24"/>
    <path d="M14 32c0-12 8-20 16-20s16 8 16 20" stroke="#22c55e" strokeWidth="3" fill="none"/>
    <path d="M20 18c2-4 6-6 10-6s8 2 10 6" stroke="#16a34a" strokeWidth="2" fill="none"/>
    <ellipse cx="30" cy="20" rx="3" ry="5" fill="#22c55e"/>
    <ellipse cx="38" cy="18" rx="2" ry="4" fill="#16a34a"/>
    <ellipse cx="26" cy="22" rx="2" ry="4" fill="#4ade80"/>
  </svg>
);

const LeafIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
  </svg>
);

const BoltIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

const TrendUpIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
);

function App() {
  const [acres, setAcres] = useState(0.25);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const price = (acres * 120).toFixed(0);

  const quote = async () => {
    setLoading(true);
    setError("");
    setSummary("");
    try {
      const prompt = `Write a concise lawn service quote summary for ${acres} acres at $${price}/week. Include upsell for edging or fertilization. 60 words max.`;
      const data = await callGeminiAPI(prompt);
      const text = extractResponseText(data);
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        }
      );
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      if (!text) throw new Error("No response from Gemini.");
      setSummary(text);
    } catch (e) {
      setError(e.message || "Failed to generate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="background-pattern" aria-hidden="true">
        <svg className="grass-bg" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="grassPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M20 80 Q25 50 20 30" stroke="#86efac" strokeWidth="2" fill="none" opacity="0.3"/>
              <path d="M30 85 Q35 45 28 25" stroke="#4ade80" strokeWidth="2" fill="none" opacity="0.4"/>
              <path d="M45 82 Q50 55 42 35" stroke="#22c55e" strokeWidth="2" fill="none" opacity="0.3"/>
              <path d="M60 85 Q65 50 58 28" stroke="#86efac" strokeWidth="2" fill="none" opacity="0.35"/>
              <path d="M75 80 Q80 45 72 32" stroke="#4ade80" strokeWidth="2" fill="none" opacity="0.3"/>
              <ellipse cx="25" cy="90" rx="3" ry="2" fill="#16a34a" opacity="0.2"/>
              <ellipse cx="50" cy="92" rx="4" ry="2" fill="#22c55e" opacity="0.25"/>
              <ellipse cx="70" cy="88" rx="3" ry="2" fill="#16a34a" opacity="0.2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grassPattern)"/>
        </svg>
      </div>
      
      <div className="container">
        <header className="header">
          <div className="brand">
            <LogoIcon />
            <div className="brand-text">
              <span className="brand-name">FreshCut</span>
              <span className="brand-tagline">Professional Lawn Care</span>
            </div>
          </div>
        </header>

        <main className="main-content">
          <section className="hero-card">
            <div className="hero-content">
              <p className="eyebrow">Instant Quote Generator</p>
              <h1>Get Your Lawn Service Quote in Seconds</h1>
              <p className="sub">Professional mowing, edging, and fertilization services tailored to your yard.</p>
              
              <div className="hero-actions">
                <button className="primary" onClick={quote} disabled={loading}>
                  <span>{loading ? "Generating..." : "Generate Quote"}</span>
                </button>
                <button className="ghost">Book Weekly Service</button>
              </div>
              
              <div className="trust">
                <span className="trust-item"><LeafIcon /> Gemini AI Powered</span>
                <span className="trust-item"><BoltIcon /> 5-Second Quote</span>
                <span className="trust-item"><TrendUpIcon /> Upsell Options</span>
              </div>
            </div>
            
            <div className="input-card">
              <h3>Yard Details</h3>
              <label>
                <span>Property Size (acres)</span>
                <input 
                  type="number" 
                  value={acres} 
                  onChange={(e) => setAcres(+e.target.value)}
                  min="0.1"
                  step="0.1"
                />
              </label>
              <div className="price-display">
                <span className="price-label">Estimated Weekly</span>
                <span className="price-value">${price}</span>
              </div>
            </div>
          </section>

          <section className="result-card">
            <div className="card-header">
              <h2>Your Personalized Quote</h2>
              <span className="pill">AI Generated</span>
            </div>
            {error && <div className="error">{error}</div>}
            {summary ? (
              <div className="output">{summary}</div>
            ) : (
              <div className="empty-state">
                <LeafIcon />
                <p>Enter your yard details and click "Generate Quote" to see your personalized estimate.</p>
              </div>
            )}
          </section>

          <section className="features">
            <div className="feature">
              <div className="feature-icon">⚡</div>
              <h3>Faster Close</h3>
              <p>Instant quotes reduce price friction and win more customers.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">📈</div>
              <h3>Higher Ticket</h3>
              <p>Smart upsells for edging, fertilization, and seasonal care.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🤖</div>
              <h3>Less Admin</h3>
              <p>Automated quote copy saves hours of manual work.</p>
            </div>
          </section>
        </main>

        <footer className="footer">
          <p>FreshCut Lawn Services • Serving Ashtabula County, OH</p>
          <p className="footer-meta">Professional • Reliable • Affordable</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
