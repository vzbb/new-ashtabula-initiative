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


// SVG Logo - Truck with Water Splash
const TruckWashLogo = () => (
  <svg className="logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* Water Splash Background */}
    <circle cx="20" cy="25" r="8" fill="#e3f2fd" opacity="0.6" />
    <circle cx="80" cy="20" r="10" fill="#b3e5fc" opacity="0.5" />
    <circle cx="75" cy="40" r="6" fill="#e1f5fe" opacity="0.5" />
    <circle cx="15" cy="45" r="7" fill="#b3e5fc" opacity="0.4" />
    {/* Truck Body */}
    <rect x="20" y="45" width="60" height="28" rx="4" fill="#0288d1" />
    <rect x="20" y="45" width="35" height="28" rx="4" fill="#01579b" />
    {/* Windshield */}
    <rect x="57" y="48" width="20" height="18" rx="2" fill="#e1f5fe" />
    {/* Water Spray */}
    <ellipse cx="10" cy="55" rx="8" ry="12" fill="#00bcd4" opacity="0.6" /
    >
    <ellipse cx="8" cy="52" rx="5" ry="8" fill="#4dd0e1" opacity="0.5" /
    >
    <ellipse cx="12" cy="60" rx="4" ry="6" fill="#80deea" opacity="0.4" /
    >
    {/* Soap Bubbles */}
    <circle cx="70" cy="38" r="4" fill="white" opacity="0.7" /
    >
    <circle cx="78" cy="45" r="3" fill="white" opacity="0.6" /
    >
    <circle cx="25" cy="42" r="3.5" fill="white" opacity="0.5" /
    >
    {/* Wheels */}
    <circle cx="32" cy="75" r="8" fill="#37474f" /
    >
    <circle cx="32" cy="75" r="4" fill="#b0bec5" /
    >
    <circle cx="68" cy="75" r="8" fill="#37474f" /
    >
    <circle cx="68" cy="75" r="4" fill="#b0bec5" /
    >
    {/* Shine Lines */}
    <path d="M25 48 L30 48 M35 48 L40 48" stroke="white" strokeWidth="1.5" opacity="0.5" /
    >
    <path d="M25 52 L32 52" stroke="white" strokeWidth="1.5" opacity="0.4" /
    >
  </svg>
);

// Icons
const DropletIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.74 5.88a7.81 7.81 0 0 1 2.23 5.48 7.94 7.94 0 0 1-16 0 7.81 7.81 0 0 1 2.23-5.48L12 2.69z"/></svg>;

const ClockIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;

const StarIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;

function App() {
  const [truckType, setTruckType] = useState("Semi Truck");
  const [date, setDate] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const bookWash = async () => {
    setLoading(true);
    setError("");
    setConfirmation("");
    try {
      const prompt = `Write a truck wash booking confirmation for a ${truckType} on ${date || 'the requested date'}. Include wash time estimate and location details. Keep under 80 words.`;
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
        <TruckWashLogo />
        <span className="brand-name">Truck Wash Pro</span>
      </div>

      <header className="hero">
        <div className="hero-content">
          <span className="eyebrow">🚛 Professional Cleaning</span>
          <h1>Book Your Truck Wash</h1>
          <p className="sub">Gemini‑powered booking confirmations for spotless fleet maintenance</p>
          
          <div className="input-card">
            <h3>🧼 Wash Details</h3>
            <div className="form-row">
              <div>
                <label>Truck Type</label>
                <select value={truckType} onChange={(e) => setTruckType(e.target.value)}>
                  <option>Semi Truck</option>
                  <option>Box Truck</option>
                  <option>Dump Truck</option>
                  <option>Tanker</option>
                  <option>Flatbed</option>
                </select>
              </div>
              <div>
                <label>Preferred Date</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            </div>
          </div>
          
          <div className="hero-actions">
            <button className="primary" onClick={bookWash} disabled={loading}>
              {loading ? "⏳ Booking…" : "🚿 Book Wash"}
            </button>
            <button className="ghost">📞 Call Now</button>
          </div>
          
          <div className="trust">
            <span><DropletIcon /> Quality Soap</span>
            <span><ClockIcon /> Fast Service</span>
            <span><StarIcon /> Spotless Results</span>
          </div>
        </div>
      </header>

      <section className="card">
        <div className="card-head">
          <h2>📋 Booking Confirmation</h2>
          <span className="pill">Gemini AI</span>
        </div>
        {error && <div className="error">⚠️ {error}</div>}
        {confirmation ? (
          <pre className="output">{confirmation}</pre>
        ) : (
          <p className="muted">Your booking confirmation will appear here...</p>
        )}
      </section>

      <section className="grid">
        <div className="tile">
          <div className="tile-icon">🧼</div>
          <h3>Premium Soap</h3>
          <p>Industrial-grade cleaning solutions</p>
        </div>
        <div className="tile">
          <div className="tile-icon">⚡</div>
          <h3>Quick Turnaround</h3>
          <p>Back on the road in under an hour</p>
        </div>
        <div className="tile">
          <div className="tile-icon">✨</div>
          <h3>Spotless Finish</h3>
          <p>Professional detailing included</p>
        </div>
      </section>

      <footer className="footer">
        <div>Truck Wash Pro • Ashtabula County, OH</div>
      </footer>
    </div>
  );
}

export default App;
