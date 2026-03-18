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


// SVG Logo - Car in Parking Spot
const ParkingLogo = () => (
  <svg className="logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* Parking Spot Lines */}
    <path d="M20 85 L20 15 M80 85 L80 15" stroke="#1976d2" strokeWidth="4" strokeLinecap="round" />
    <path d="M20 85 L80 85" stroke="#1976d2" strokeWidth="4" strokeLinecap="round" />
    {/* Parking Spot Surface */}
    <rect x="24" y="15" width="52" height="68" fill="#eceff1" />
    {/* Car */}
    <rect x="35" y="35" width="30" height="40" rx="6" fill="#37474f" />
    <rect x="38" y="40" width="24" height="18" rx="2" fill="#b0bec5" />
    {/* Wheels */}
    <circle cx="38" cy="70" r="5" fill="#263238" />
    <circle cx="62" cy="70" r="5" fill="#263238" />
    {/* Headlights */}
    <rect x="36" y="45" width="2" height="4" fill="#fff176" />
    <rect x="62" y="45" width="2" height="4" fill="#fff176" />
    {/* Available Indicator */}
    <circle cx="50" cy="22" r="6" fill="#2ecc71" />
    <path d="M47 22 L50 25 L54 19" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    {/* P Sign */}
    <rect x="8" y="25" width="12" height="18" rx="2" fill="#1976d2" />
    <text x="14" y="38" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">P</text>
  </svg>
);

// Icons
const MapPinIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;

const ClockIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;

const CreditCardIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>;

function App() {
  const [destination, setDestination] = useState("Downtown Ashtabula");
  const [duration, setDuration] = useState("2 hours");
  const [results, setResults] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const findParking = async () => {
    setLoading(true);
    setError("");
    setResults("");
    try {
      const prompt = `Suggest 3 parking options near ${destination} in Ashtabula County for ${duration}. Include location, approximate cost, and walking distance to destination. Keep under 100 words.`;
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
        <ParkingLogo />
        <span className="brand-name">Parking Finder</span>
      </div>

      <header className="hero">
        <div className="hero-content">
          <span className="eyebrow">🅿️ Smart Parking</span>
          <h1>Find Visitor Parking</h1>
          <p className="sub">Gemini‑powered parking recommendations for Ashtabula destinations</p>
          
          <div className="input-card">
            <h3>🚗 Where Are You Going?</h3>
            <div className="form-row">
              <div>
                <label>Destination</label>
                <input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Downtown Ashtabula" />
              </div>
              <div>
                <label>Duration</label>
                <input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="2 hours" />
              </div>
            </div>
          </div>
          
          <div className="hero-actions">
            <button className="primary" onClick={findParking} disabled={loading}>
              {loading ? "🔍 Finding…" : "🅿️ Find Parking"}
            </button>
            <button className="ghost">📍 View Map</button>
          </div>
          
          <div className="trust">
            <span><MapPinIcon /> Local Spots</span>
            <span><ClockIcon /> Real-Time</span>
            <span><CreditCardIcon /> Price Info</span>
          </div>
        </div>
      </header>

      <section className="card">
        <div className="card-head">
          <h2>📍 Parking Options</h2>
          <span className="pill">Available</span>
        </div>
        {error && <div className="error">⚠️ {error}</div>}
        {results ? (
          <pre className="output">{results}</pre>
        ) : (
          <p className="muted">Enter your destination to see nearby parking options...</p>
        )}
      </section>

      <section className="grid">
        <div className="tile">
          <div className="tile-icon">💰</div>
          <h3>Best Rates</h3>
          <p>Compare prices to find affordable options</p>
        </div>
        <div className="tile">
          <div className="tile-icon">🚶</div>
          <h3>Walk Distance</h3>
          <p>Know how far you'll walk to your destination</p>
        </div>
        <div className="tile">
          <div className="tile-icon">⏱️</div>
          <h3>Time Limits</h3>
          <p>Check parking duration restrictions</p>
        </div>
      </section>

      <footer className="footer">
        <div>Visitor Parking Finder • Ashtabula County, OH</div>
      </footer>
    </div>
  );
}

export default App;
