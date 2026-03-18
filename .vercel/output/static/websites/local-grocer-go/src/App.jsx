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


// Shopping Basket with Veggies Logo
const LogoIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="logo-icon">
    <path d="M8 24h48l-8 32H16L8 24z" fill="#f39c12" stroke="#e67e22" strokeWidth="2"/>
    <path d="M20 24V14a6 6 0 0 1 12 0v10" stroke="#8b4513" strokeWidth="3" fill="none" strokeLinecap="round"/>
    <path d="M32 24V12a6 6 0 0 1 12 0v12" stroke="#8b4513" strokeWidth="3" fill="none" strokeLinecap="round"/>
    <circle cx="24" cy="44" r="8" fill="#e74c3c"/>
    <path d="M20 40c2-2 6-2 8 0" stroke="#c0392b" strokeWidth="1.5" fill="none"/>
    <ellipse cx="40" cy="46" rx="6" ry="8" fill="#f39c12"/>
    <path d="M40 38v16" stroke="#e67e22" strokeWidth="1.5"/>
    <path d="M34 46h12" stroke="#e67e22" strokeWidth="1.5"/>
    <rect x="18" y="50" width="8" height="6" rx="1" fill="#27ae60"/>
    <rect x="36" y="52" width="6" height="4" rx="1" fill="#f1c40f"/>
  </svg>
);

const CartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/>
    <circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

function App() {
  const [items, setItems] = useState("Milk, Eggs, Apples, Bread");
  const [store, setStore] = useState("Johnson's Market");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateConfirmation = async () => {
    if (!items.trim()) {
      setError("Please enter your grocery list");
      return;
    }
    
    setLoading(true);
    setError("");
    setSummary("");
    try {
      const prompt = `Write a friendly grocery pickup confirmation for ${store}. Items: ${items}. Include estimated pickup time window (e.g., "ready for pickup between 2-4 PM"), substitution policy, and a warm closing. 80 words max.`;
      
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
      setError(e.message || "Failed to generate confirmation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="background-pattern" aria-hidden="true">
        <svg className="produce-bg" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="producePattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="25" cy="25" r="12" fill="#e74c3c" opacity="0.1"/>
              <path d="M25 13c-3 0-5 2-6 5 4-1 8-1 12 0-1-3-3-5-6-5z" fill="#27ae60" opacity="0.2"/>
              <ellipse cx="75" cy="35" rx="8" ry="14" fill="#f39c12" opacity="0.12" transform="rotate(30 75 35)"/>
              <path d="M70 25 Q75 20 80 25" stroke="#27ae60" strokeWidth="2" fill="none" opacity="0.2"/>
              <rect x="20" y="70" width="12" height="18" rx="2" fill="#f1c40f" opacity="0.1" transform="rotate(-10 26 79)"/>
              <path d="M26 70 L26 65" stroke="#27ae60" strokeWidth="2" opacity="0.15"/>
              <circle cx="70" cy="75" r="10" fill="#9b59b6" opacity="0.08"/>
              <path d="M65 68 Q70 65 75 68" stroke="#27ae60" strokeWidth="1.5" fill="none" opacity="0.15"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#producePattern)"/>
        </svg>
      </div>
      
      <div className="container">
        <header className="header">
          <div className="brand">
            <LogoIcon />
            <div className="brand-text">
              <span className="brand-name">Local Grocer Go</span>
              <span className="brand-tagline">Fresh • Local • Fast</span>
            </div>
          </div>
        </header>

        <main className="main-content">
          <section className="hero-card">
            <div className="hero-content">
              <p className="eyebrow">Curbside Pickup</p>
              <h1>Your Groceries, Ready When You Are</h1>
              <p className="sub">Generate personalized pickup confirmations with time windows and substitution policies.</p>
              
              <div className="trust">
                <span className="trust-item"><CartIcon /> AI Powered</span>
                <span className="trust-item"><ClockIcon /> Exact Times</span>
                <span className="trust-item"><CheckIcon /> Less Confusion</span>
              </div>
            </div>
            
            <div className="input-card">
              <h3>Order Details</h3>
              
              <label>
                <span>Store Name</span>
                <input 
                  type="text" 
                  value={store} 
                  onChange={(e) => setStore(e.target.value)}
                  placeholder="e.g., Johnson's Market"
                />
              </label>
              
              <label>
                <span>Your Grocery List</span>
                <textarea 
                  value={items} 
                  onChange={(e) => setItems(e.target.value)}
                  placeholder="Enter items separated by commas"
                  rows={4}
                />
              </label>
              
              <button 
                className="primary" 
                onClick={generateConfirmation} 
                disabled={loading}
              >
                {loading ? "Drafting..." : "Generate Confirmation"}
              </button>
            </div>
          </section>

          <section className="result-card">
            <div className="card-header">
              <h2>Pickup Confirmation</h2>
              <span className="pill">AI Generated</span>
            </div>
            
            {error && <div className="error">{error}</div>}
            
            {summary ? (
              <div className="output">{summary}</div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🛒</div>
                <p>Enter your grocery list to generate a personalized pickup confirmation with timing and substitution details.</p>
              </div>
            )}
          </section>

          <section className="features">
            <div className="feature">
              <div className="feature-icon">⏱️</div>
              <h3>Faster Pickup</h3>
              <p>Clear time windows reduce wait times and improve experience.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🔄</div>
              <h3>Smart Substitutions</h3>
              <p>Automatic substitution policy included for out-of-stock items.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">📱</div>
              <h3>Text Ready</h3>
              <p>Copy and paste directly into SMS or email to customers.</p>
            </div>
          </section>
        </main>

        <footer className="footer">
          <p>Local Grocer Go • Supporting Ashtabula County Markets</p>
          <p className="footer-meta">Fresh • Local • Community</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
