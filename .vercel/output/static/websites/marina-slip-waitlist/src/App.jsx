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


// Anchor with Compass Logo
const LogoIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="logo-icon">
    <circle cx="32" cy="32" r="28" fill="#1a5276" stroke="#f1948a" strokeWidth="2"/>
    <circle cx="32" cy="32" r="24" fill="none" stroke="#5dade2" strokeWidth="1" opacity="0.5"/>
    <path d="M32 12v40M20 32h24" stroke="#f1948a" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="32" cy="18" r="4" fill="#f5b7b1"/>
    <path d="M18 26c-4 4-4 12 0 16" stroke="#aed6f1" strokeWidth="2" fill="none"/>
    <path d="M46 26c4 4 4 12 0 16" stroke="#aed6f1" strokeWidth="2" fill="none"/>
    <path d="M32 6l3 8h-6l3-8z" fill="#f1948a"/>
    <circle cx="32" cy="32" r="3" fill="#f1948a"/>
  </svg>
);

const AnchorIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="3"/>
    <line x1="12" y1="22" x2="12" y2="8"/>
    <path d="M5 12H2a10 10 0 0 0 20 0h-3"/>
  </svg>
);

const BoatIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 16l4-8h12l4 8"/>
    <path d="M6 16v4a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-4"/>
    <path d="M12 4v8"/>
    <path d="M8 4h8"/>
  </svg>
);

const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

function App() {
  const [length, setLength] = useState("24");
  const [boatType, setBoatType] = useState("motor");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateConfirmation = async () => {
    setLoading(true);
    setError("");
    setSummary("");
    try {
      const prompt = `Write a professional marina slip waitlist confirmation for a ${length}ft ${boatType} boat at Harbor Marina in Ashtabula, Ohio. Include estimated wait time, monthly rate estimate, amenities included (electric, water, WiFi), and membership upsell options. 80 words max.`;
      
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
        <svg className="nautical-bg" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="nauticalPattern" x="0" y="0" width="120" height="100" patternUnits="userSpaceOnUse">
              <path d="M0 50 Q30 40 60 50 T120 50" fill="none" stroke="#5dade2" strokeWidth="1.5" opacity="0.25"/>
              <path d="M0 70 Q30 60 60 70 T120 70" fill="none" stroke="#85c1e9" strokeWidth="1" opacity="0.2"/>
              <circle cx="30" cy="25" r="15" fill="none" stroke="#f1948a" strokeWidth="1.5" opacity="0.15"/>
              <path d="M30 10v30M15 25h30" stroke="#f1948a" strokeWidth="1" opacity="0.15"/>
              <circle cx="90" cy="75" r="12" fill="none" stroke="#f1948a" strokeWidth="1.5" opacity="0.15"/>
              <path d="M90 63v24M78 75h24" stroke="#f1948a" strokeWidth="1" opacity="0.15"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#nauticalPattern)"/>
        </svg>
      </div>
      
      <div className="container">
        <header className="header">
          <div className="brand">
            <LogoIcon />
            <div className="brand-text">
              <span className="brand-name">Harbor Marina</span>
              <span className="brand-tagline">Ashtabula's Premier Waterfront</span>
            </div>
          </div>
        </header>

        <main className="main-content">
          <section className="hero-card">
            <div className="hero-content">
              <p className="eyebrow">Slip Waitlist</p>
              <h1>Secure Your Spot on the Water</h1>
              <p className="sub">Join our waitlist for premium boat slips with instant confirmation and membership benefits.</p>
              
              <div className="trust">
                <span className="trust-item"><AnchorIcon /> Secure Slips</span>
                <span className="trust-item"><BoatIcon /> All Boat Types</span>
                <span className="trust-item"><StarIcon /> Premium Amenities</span>
              </div>
            </div>
            
            <div className="input-card">
              <h3>Boat Details</h3>
              
              <label>
                <span>Boat Length (feet)</span>
                <input 
                  type="number" 
                  value={length} 
                  onChange={(e) => setLength(e.target.value)}
                  min="12"
                  max="100"
                />
              </label>
              
              <label>
                <span>Boat Type</span>
                <select 
                  value={boatType} 
                  onChange={(e) => setBoatType(e.target.value)}
                  className="select-input"
                >
                  <option value="motor">🚤 Motorboat</option>
                  <option value="sail">⛵ Sailboat</option>
                  <option value="yacht">🛥️ Yacht</option>
                  <option value="fishing">🎣 Fishing Boat</option>
                </select>
              </label>
              
              <button 
                className="primary" 
                onClick={generateConfirmation} 
                disabled={loading}
              >
                {loading ? "Processing..." : "Join Waitlist"}
              </button>
            </div>
          </section>

          <section className="result-card">
            <div className="card-header">
              <h2>Waitlist Confirmation</h2>
              <span className="pill">AI Generated</span>
            </div>
            
            {error && <div className="error">{error}</div>}
            
            {summary ? (
              <div className="output">{summary}</div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">⚓</div>
                <p>Enter your boat details to receive a personalized waitlist confirmation with estimated availability.</p>
              </div>
            )}
          </section>

          <section className="features">
            <div className="feature">
              <div className="feature-icon">⚡</div>
              <h3>Priority Booking</h3>
              <p>Move up the list faster with our membership program.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🔌</div>
              <h3>Full Hookups</h3>
              <p>Electric, water, and WiFi at every slip.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">⛽</div>
              <h3>Fuel Dock</h3>
              <p>On-site fuel with member discounts.</p>
            </div>
          </section>
        </main>

        <footer className="footer">
          <p>Harbor Marina • Ashtabula Harbor, OH</p>
          <p className="footer-meta">Your Gateway to Lake Erie</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
