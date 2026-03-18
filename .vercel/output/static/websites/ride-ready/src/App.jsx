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


// SVG Logo - Bus with Speed Lines
const RideReadyLogo = () => (
  <svg className="logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* Speed Lines */}
    <path d="M5 25 L25 25 M5 35 L20 35" stroke="#2ecc71" strokeWidth="2" opacity="0.5" />
    <path d="M5 65 L25 65 M5 75 L20 75" stroke="#2ecc71" strokeWidth="2" opacity="0.5" />
    {/* Bus Body */}
    <rect x="25" y="20" width="60" height="55" rx="8" fill="#2c3e50" stroke="#2ecc71" strokeWidth="2" />
    {/* Windows */}
    <rect x="32" y="28" width="20" height="18" rx="3" fill="#34495e" stroke="#2ecc71" strokeWidth="1" />
    <rect x="58" y="28" width="20" height="18" rx="3" fill="#34495e" stroke="#2ecc71" strokeWidth="1" />
    {/* Door */}
    <rect x="42" y="50" width="16" height="25" rx="2" fill="#1a252f" />
    <line x1="50" y1="50" x2="50" y2="75" stroke="#2ecc71" strokeWidth="1" />
    {/* Wheels */}
    <circle cx="38" cy="80" r="8" fill="#2c3e50" stroke="#2ecc71" strokeWidth="2" />
    <circle cx="38" cy="80" r="4" fill="#2ecc71" />
    <circle cx="72" cy="80" r="8" fill="#2c3e50" stroke="#2ecc71" strokeWidth="2" />
    <circle cx="72" cy="80" r="4" fill="#2ecc71" />
    {/* Headlight */}
    <rect x="82" y="55" width="4" height="10" rx="1" fill="#f1c40f" />
    {/* Route Display */}
    <rect x="35" y="14" width="40" height="8" rx="2" fill="#1a252f" stroke="#2ecc71" strokeWidth="1" />
    <text x="55" y="20" textAnchor="middle" fill="#2ecc71" fontSize="5" fontWeight="bold">RIDE</text>
  </svg>
);

// Icons
const BusIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="6" width="18" height="12" rx="2"/><line x1="6" y1="18" x2="6" y2="21"/><line x1="18" y1="18" x2="18" y2="21"/><line x1="6" y1="10" x2="18" y2="10"/><line x1="6" y1="14" x2="9" y2="14"/><line x1="15" y1="14" x2="18" y2="14"/></svg>;

const PhoneIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;

const ZapIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;

const ClockIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;

function App() {
  const [from, setFrom] = useState("Downtown");
  const [to, setTo] = useState("Hospital");
  const [time, setTime] = useState("Now");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const lookup = async () => {
    setLoading(true);
    setError("");
    setAnswer("");
    try {
      const prompt = `You are a transit assistant for Ashtabula County, OH. Provide the next 2 departures from ${from} to ${to} around ${time}. Return short, SMS-ready output.`;
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
      setAnswer(text);
    } catch (e) {
      setError(e.message || "Failed to generate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="header">
        <RideReadyLogo />
        <span className="brand-name">Ride Ready</span>
      </div>
      
      <header className="hero">
        <div className="hero-content">
          <span className="eyebrow">🚌 Transit Assistant</span>
          <h1>Instant Transit Answers</h1>
          <p className="sub">Gemini‑powered schedule lookup for Ashtabula County transit</p>
          
          <div className="input-card">
            <h3>🗺️ Trip Details</h3>
            <div className="form-row">
              <div>
                <label>From</label>
                <input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="Downtown" />
              </div>
              <div>
                <label>To</label>
                <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="Hospital" />
              </div>
              <div>
                <label>Time</label>
                <input value={time} onChange={(e) => setTime(e.target.value)} placeholder="Now" />
              </div>
            </div>
          </div>
          
          <div className="hero-actions">
            <button className="primary" onClick={lookup} disabled={loading}>
              {loading ? "⏳ Checking…" : "🚌 Get Next Bus"}
            </button>
            <button className="ghost" onClick={() => alert("SMS alerts coming soon! For now, copy the schedule and text it to yourself.")} aria-label="Enable SMS alerts">📱 Enable SMS</button>
          </div>
          
          <div className="trust">
            <span><BusIcon /> Gemini AI</span>
            <span><PhoneIcon /> SMS-Ready</span>
            <span><ZapIcon /> 5-Second Output</span>
          </div>
        </div>
      </header>

      <section className="card">
        <div className="card-head">
          <h2><ClockIcon /> Next Departures</h2>
          <span className="pill">Live</span>
        </div>
        {error && <div className="error">⚠️ {error}</div>}
        {answer ? (
          <pre className="output">{answer}</pre>
        ) : (
          <p className="muted">Enter your trip details to see next available departures...</p>
        )}
      </section>

      <section className="grid">
        <div className="tile">
          <div className="tile-icon">📞</div>
          <h3>Reduce Calls</h3>
          <p>Answer common schedule questions instantly</p>
        </div>
        <div className="tile">
          <div className="tile-icon">📱</div>
          <h3>Better Access</h3>
          <p>Works for seniors and low-bandwidth phones</p>
        </div>
        <div className="tile">
          <div className="tile-icon">✓</div>
          <h3>Fewer Missed Rides</h3>
          <p>Clear timing improves transit reliability</p>
        </div>
      </section>

      <footer className="footer">
        <div>ACTS Transit • Ashtabula County, OH</div>
      </footer>
    </div>
  );
}

export default App;
