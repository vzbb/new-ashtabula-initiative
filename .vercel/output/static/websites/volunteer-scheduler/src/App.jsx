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


// Ashtabula County Seal Logo SVG
const CountySealLogo = ({ size = 44 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="48" fill="#003f87" />
    <circle cx="50" cy="50" r="44" fill="none" stroke="#ffd700" strokeWidth="2" />
    <circle cx="50" cy="50" r="40" fill="#f8f6f0" />
    
    <path id="textCurve" d="M 15,50 A 35,35 0 0,1 85,50" fill="none" />
    <text fill="#003f87" fontSize="7" fontWeight="bold" fontFamily="Open Sans, sans-serif">
      <textPath href="#textCurve" startOffset="50%" textAnchor="middle">ASHTABULA COUNTY</textPath>
    </text>
    
    <circle cx="50" cy="50" r="28" fill="none" stroke="#ffd700" strokeWidth="1.5" />
    
    <g transform="translate(50, 38)">
      <path d="M-4 18 L-2 -8 L2 -8 L4 18 Z" fill="#003f87" />
      <path d="M-2 -8 L-5 -12 L-2 -10 Z" fill="#ffd700" />
      <path d="M2 -8 L5 -12 L2 -10 Z" fill="#ffd700" />
      <rect x="-3" y="-10" width="6" height="3" fill="#003f87" />
      <circle cx="0" cy="-8" r="1.5" fill="#ffd700" />
    </g>
    
    <g transform="translate(50, 55)">
      <path d="M-18 12 Q0 -5 18 12" fill="none" stroke="#8b4513" strokeWidth="3" />
      <path d="M-18 12 L-18 16 L18 16 L18 12" fill="#8b4513" />
      <rect x="-20" y="8" width="4" height="10" fill="#654321" />
      <rect x="16" y="8" width="4" height="10" fill="#654321" />
      <path d="M-20 8 L0 -2 L20 8" fill="#8b4513" />
    </g>
    
    <g transform="translate(28, 65)" opacity="0.8">
      <path d="M0 0 Q2 -8 0 -15" stroke="#27ae60" strokeWidth="1.5" fill="none" />
      <ellipse cx="-2" cy="-8" rx="2" ry="4" fill="#ffd700" />
      <ellipse cx="2" cy="-5" rx="2" ry="4" fill="#ffd700" />
      <ellipse cx="0" cy="-12" rx="1.5" ry="3" fill="#ffd700" />
    </g>
    
    <g transform="translate(72, 65)" opacity="0.8">
      <path d="M0 0 Q-2 -8 0 -15" stroke="#27ae60" strokeWidth="1.5" fill="none" />
      <ellipse cx="2" cy="-8" rx="2" ry="4" fill="#ffd700" />
      <ellipse cx="-2" cy="-5" rx="2" ry="4" fill="#ffd700" />
      <ellipse cx="0" cy="-12" rx="1.5" ry="3" fill="#ffd700" />
    </g>
    
    <path d="M25 78 Q35 75 45 78 T65 78 T75 78" fill="none" stroke="#003f87" strokeWidth="1.5" opacity="0.5" />
    <circle cx="50" cy="50" r="2" fill="#ffd700" />
  </svg>
);

// Simple icons
const HeartIcon = () => <span>❤️</span>;
const CalendarIcon = () => <span>📅</span>;
const UsersIcon = () => <span>👥</span>;

function App() {
  const [event, setEvent] = useState("Food Bank Distribution");
  const [date, setDate] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const scheduleVolunteer = async () => {
    setLoading(true);
    setError("");
    setConfirmation("");
    try {
      const prompt = `Write a warm volunteer signup confirmation for "${event}" on ${date || 'the scheduled date'}. Include meeting location, what to bring, and a thank you message. Keep under 100 words.`;
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
      <div className="bg-pattern" aria-hidden="true" />

      <header className="header">
        <div className="logo">
          <CountySealLogo />
          <div className="logo-text">
            <span className="logo-title">Community Resources</span>
            <span className="logo-subtitle">Volunteer Scheduler</span>
          </div>
        </div>
        <div className="official-badge">Official</div>
      </header>

      <main className="content">
        <section className="hero">
          <div className="hero-eyebrow">🤝 Community Service</div>
          <h1>Coordinate Your Volunteers</h1>
          <p>Gemini-powered scheduling for community events and volunteer coordination</p>
        </section>
        
        <div className="input-card">
          <h3>📅 Event Details</h3>
          <div className="form-row">
            <div>
              <label>Event Name</label>
              <input value={event} onChange={(e) => setEvent(e.target.value)} placeholder="Food Bank Distribution" />
            </div>
            <div>
              <label>Event Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </div>
          
          <div className="btn-group">
            <button className="btn btn-primary" onClick={scheduleVolunteer} disabled={loading}>
              {loading ? "⏳ Creating…" : "✨ Create Confirmation"}
            </button>
            <button className="btn btn-secondary">📧 Email Volunteers</button>
          </div>
          
          <div className="trust">
            <span><HeartIcon /> Community</span>
            <span><CalendarIcon /> Organized</span>
            <span><UsersIcon /> Connected</span>
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        {confirmation && (
          <div className="confirmation-card">
            <h3>✅ Volunteer Confirmation</h3>
            <pre>{confirmation}</pre>
          </div>
        )}

        <div className="features">
          <div className="feature">
            <span>📝</span>
            <h4>Easy Signup</h4>
            <p>Simple volunteer registration</p>
          </div>
          <div className="feature">
            <span>📨</span>
            <h4>Auto Confirmations</h4>
            <p>Instant email responses</p>
          </div>
          <div className="feature">
            <span>📊</span>
            <h4>Track Hours</h4>
            <p>Volunteer time tracking</p>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p className="footer-text">Ashtabula County Community Resources</p>
        <p className="footer-subtext">© 2026 Ashtabula County Board of Commissioners</p>
      </footer>
    </div>
  );
}

export default App;
