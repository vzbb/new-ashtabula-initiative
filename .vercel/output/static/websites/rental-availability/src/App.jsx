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


// SVG Logo - House with Key
const RentalLogo = () => (
  <svg className="logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* House Frame */}
    <path
      d="M50 10 L85 35 L85 80 Q85 85 80 85 L20 85 Q15 85 15 80 L15 35 Z"
      fill="#f5f0e8"
      stroke="#6b5b4f"
      strokeWidth="3"
    />
    {/* Roof */}
    <path
      d="M10 38 L50 5 L90 38"
      fill="none"
      stroke="#3498db"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Door */}
    <rect x="40" y="55" width="20" height="30" rx="3" fill="#3498db" />
    {/* Door Knob */}
    <circle cx="55" cy="72" r="2" fill="#f5f0e8" />
    {/* Window */}
    <rect x="22" y="45" width="14" height="14" rx="2" fill="#e8f4f8" stroke="#6b5b4f" strokeWidth="2" />
    <path d="M29 45 L29 59 M22 52 L36 52" stroke="#6b5b4f" strokeWidth="1.5" />
    {/* Key Icon */}
    <g transform="translate(62, 42)">
      <circle cx="8" cy="8" r="6" fill="none" stroke="#27ae60" strokeWidth="2.5" />
      <circle cx="8" cy="8" r="2" fill="#27ae60" />
      <path d="M12 12 L22 22 M18 22 L22 22 M22 18 L22 22" stroke="#27ae60" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </g>
    {/* Chimney */}
    <rect x="65" y="15" width="10" height="15" rx="2" fill="#6b5b4f" />
    {/* Smoke */}
    <circle cx="70" cy="10" r="3" fill="#bbb" opacity="0.5" />
    <circle cx="75" cy="6" r="2" fill="#bbb" opacity="0.4" />
  </svg>
);

function App() {
  const [max, setMax] = useState(1000);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async () => {
    setLoading(true);
    setError("");
    setSummary("");
    try {
      const prompt = `Summarize rental options in Ashtabula County under $${max}. Provide 3 short bullets and a next-step CTA. 80 words max.`;
      const data = await callGeminiAPI(prompt);
      const text = extractResponseText(data);
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
      <div className="header">
        <RentalLogo />
        <span className="brand-name">Rental Finder</span>
      </div>
      
      <header className="hero">
        <div className="hero-content">
          <span className="eyebrow">🏠 Find Your Perfect Home</span>
          <h1>Get renters matched faster</h1>
          <p className="sub">Gemini‑powered rental summaries + next‑step guidance for quick placement</p>
          
          <div className="input-card">
            <h3>💰 Monthly Budget</h3>
            <label>Maximum monthly rent you're comfortable with</label>
            <input 
              type="number" 
              value={max} 
              onChange={(e) => setMax(+e.target.value)}
              placeholder="e.g., 1000"
            />
          </div>
          
          <div className="hero-actions">
            <button className="primary" onClick={analyze} disabled={loading}>
              {loading ? "🔍 Searching…" : "✨ Find Rentals"}
            </button>
            <button className="ghost" onClick={() => alert("Property listing feature coming soon! Contact us at listings@ashtabularentals.com")} aria-label="List your property for rent">🏡 List a Property</button>
          </div>
          
          <div className="trust">
            <span>🏠 Local Listings</span>
            <span>⚡ Fast Results</span>
            <span>✅ Verified Rentals</span>
          </div>
        </div>
      </header>

      <section className="card">
        <div className="card-head">
          <h2>📋 Available Rentals</h2>
          <span className="pill">Gemini AI</span>
        </div>
        {error && <div className="error">⚠️ {error}</div>}
        {summary ? (
          <pre className="output">{summary}</pre>
        ) : (
          <p className="muted">Enter your budget above to see available rental options in Ashtabula County...</p>
        )}
      </section>

      <section className="grid">
        <div className="tile">
          <h3>📉 Reduce Vacancy</h3>
          <p>Speed up renter matching with smart recommendations</p>
        </div>
        <div className="tile">
          <h3>🎯 Better Fit</h3>
          <p>Clear budget alignment helps find the right match</p>
        </div>
        <div className="tile">
          <h3>🤝 Less Admin</h3>
          <p>Automated responses save time for everyone</p>
        </div>
      </section>

      <footer className="footer">
        <div>🏠 Rental Availability Finder • Connecting People & Homes</div>
        <div style={{marginTop: '8px', opacity: 0.7}}>Ashtabula County, OH</div>
      </footer>
    </div>
  );
}

export default App;
