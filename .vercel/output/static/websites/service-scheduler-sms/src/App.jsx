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


// SVG Logo - Phone with Message Bubbles
const SMSLogo = () => (
  <svg className="logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* Phone Frame */}
    <rect x="25" y="10" width="50" height="80" rx="8" fill="#075e54" />
    <rect x="28" y="18" width="44" height="64" rx="4" fill="#f0f2f5" />
    {/* Screen Notch */}
    <rect x="42" y="12" width="16" height="4" rx="2" fill="#128c7e" />
    {/* Home Button */}
    <circle cx="50" cy="86" r="3" fill="#128c7e" />
    {/* Chat Bubbles */}
    <ellipse cx="45" cy="38" rx="15" ry="10" fill="#dcf8c6" />
    <path d="M55 45 L58 48 L55 46" fill="#dcf8c6" />
    <ellipse cx="58" cy="58" rx="14" ry="9" fill="white" stroke="#e0e0e0" strokeWidth="0.5" />
    <path d="M45 64 L42 67 L45 65" fill="white" />
    {/* SMS Icon */}
    <rect x="60" y="65" width="25" height="20" rx="5" fill="#25d366" />
    <path d="M68 72 L73 77 L78 70" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    {/* Notification Badge */}
    <circle cx="75" cy="65" r="8" fill="#e74c3c" />
    <text x="75" y="68" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">1</text>
  </svg>
);

// Icons
const MessageIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;

const ZapIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;

const PhoneIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;

function App() {
  const [service, setService] = useState("HVAC Tune-Up");
  const [phone, setPhone] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateSMS = async () => {
    setLoading(true);
    setError("");
    setReply("");
    try {
      const prompt = `Write a short SMS appointment confirmation for ${service}. Include arrival window and brief prep note. Keep under 160 characters for SMS.`;
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
        <SMSLogo />
        <span className="brand-name">SMS Scheduler</span>
      </div>

      <header className="hero">
        <div className="hero-content">
          <span className="eyebrow">📱 SMS-First Scheduling</span>
          <h1>Send Confirmations via Text</h1>
          <p className="sub">Gemini‑powered SMS confirmations for instant customer communication</p>
          
          <div className="input-card">
            <h3>✉️ Message Details</h3>
            <div className="form-row">
              <div>
                <label>Service Type</label>
                <input value={service} onChange={(e) => setService(e.target.value)} placeholder="HVAC Tune-Up" />
              </div>
              <div>
                <label>Phone Number</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(440) 555-0123" />
              </div>
            </div>
          </div>
          
          <div className="hero-actions">
            <button className="primary" onClick={generateSMS} disabled={loading}>
              {loading ? "⏳ Generating…" : "✉️ Generate SMS"}
            </button>
            <button className="ghost">📤 Send Now</button>
          </div>
          
          <div className="trust">
            <span><MessageIcon /> SMS Ready</span>
            <span><ZapIcon /> Gemini AI</span>
            <span><PhoneIcon /> Instant Delivery</span>
          </div>
        </div>
      </header>

      <section className="card">
        <div className="card-head">
          <h2>📱 SMS Preview</h2>
          <span className="pill">160 chars max</span>
        </div>
        {error && <div className="error">⚠️ {error}</div>}
        <div className="chat-preview">
          {reply ? (
            <div className="chat-bubble sent">
              {reply}
              <div className="chat-time">✓✓ 2:45 PM</div>
            </div>
          ) : (
            <p className="muted">SMS preview will appear here...</p>
          )}
        </div>
      </section>

      <section className="grid">
        <div className="tile">
          <div className="tile-icon">📱</div>
          <h3>High Open Rate</h3>
          <p>SMS has 98% open rate vs 20% for email</p>
        </div>
        <div className="tile">
          <div className="tile-icon">⚡</div>
          <h3>Instant Delivery</h3>
          <p>Messages delivered in seconds, not hours</p>
        </div>
        <div className="tile">
          <div className="tile-icon">🎯</div>
          <h3>No App Needed</h3>
          <p>Works on every phone, no download required</p>
        </div>
      </section>

      <footer className="footer">
        <div>SMS Scheduler • Ashtabula County, OH</div>
      </footer>
    </div>
  );
}

export default App;
