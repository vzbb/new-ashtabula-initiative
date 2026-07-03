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


// SVG Logo - Calendar with Checkmark
const SchedulerLogo = () => (
  <svg className="logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* Calendar Background */}
    <rect x="15" y="20" width="70" height="65" rx="8" fill="#2563eb" />
    <rect x="15" y="20" width="70" height="50" rx="8" fill="white" />
    {/* Calendar Top Bar */}
    <rect x="15" y="20" width="70" height="15" rx="8" fill="#1d4ed8" />
    <rect x="15" y="28" width="70" height="10" fill="#1d4ed8" />
    {/* Calendar Rings */}
    <rect x="25" y="12" width="8" height="12" rx="2" fill="#f97316" />
    <rect x="67" y="12" width="8" height="12" rx="2" fill="#f97316" />
    {/* Calendar Grid Lines */}
    <path d="M25 40 L25 65 M42 40 L42 65 M58 40 L58 65 M75 40 L75 65" stroke="#e2e8f0" strokeWidth="1" />
    <path d="M20 48 L80 48 M20 56 L80 56" stroke="#e2e8f0" strokeWidth="1" />
    {/* Checkmark */}
    <circle cx="65" cy="72" r="18" fill="#10b981" />
    <path d="M56 72 L62 78 L74 66" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    {/* Date Highlight */}
    <rect x="43" y="50" width="12" height="12" rx="3" fill="#f97316" opacity="0.8" />
  </svg>
);

// Icons
const CalendarIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;

const ZapIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;

const CheckIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;

const FileTextIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;

function App() {
  const [service, setService] = useState("HVAC Tune-Up");
  const [date, setDate] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const confirm = async () => {
    setLoading(true);
    setError("");
    setReply("");
    try {
      const prompt = `Write a concise service appointment confirmation for ${service} on ${date || 'the scheduled date'}. Include arrival window and prep note. 70 words max.`;
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
        <SchedulerLogo />
        <span className="brand-name">Service Scheduler</span>
      </div>

      <header className="hero">
        <div className="hero-content">
          <span className="eyebrow">📅 Professional Scheduling</span>
          <h1>Convert Inquiries Into Booked Jobs</h1>
          <p className="sub">Gemini‑powered confirmations + prep notes for better service delivery</p>
          
          <div className="input-card">
            <h3>🛠️ Schedule Appointment</h3>
            <div className="form-row">
              <div>
                <label>Service Type</label>
                <input value={service} onChange={(e) => setService(e.target.value)} placeholder="HVAC Tune-Up" />
              </div>
              <div>
                <label>Preferred Date</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            </div>
          </div>
          
          <div className="hero-actions">
            <button className="primary" onClick={confirm} disabled={loading}>
              {loading ? "⏳ Generating…" : "✨ Create Confirmation"}
            </button>
            <button className="ghost">📱 Enable SMS</button>
          </div>
          
          <div className="trust">
            <span><CalendarIcon /> Gemini AI</span>
            <span><ZapIcon /> 5-Second Output</span>
            <span><CheckIcon /> More Bookings</span>
          </div>
        </div>
      </header>

      <section className="card">
        <div className="card-head">
          <h2><FileTextIcon /> Confirmation</h2>
          <span className="pill">Gemini AI</span>
        </div>
        {error && <div className="error">⚠️ {error}</div>}
        {reply ? (
          <pre className="output">{reply}</pre>
        ) : (
          <p className="muted">Your appointment confirmation will appear here...</p>
        )}
      </section>

      <section className="grid">
        <div className="tile">
          <div className="tile-icon">⚡</div>
          <h3>Faster Response</h3>
          <p>Instant confirmations reduce customer churn</p>
        </div>
        <div className="tile">
          <div className="tile-icon">📝</div>
          <h3>Clear Prep</h3>
          <p>Fewer reschedules with proper preparation notes</p>
        </div>
        <div className="tile">
          <div className="tile-icon">🤖</div>
          <h3>Less Admin</h3>
          <p>Automated messaging saves hours of work</p>
        </div>
      </section>

      <footer className="footer">
        <div>Service Scheduler • Local Business Tools</div>
        <div style={{marginTop: '8px', opacity: 0.7}}>Ashtabula County, OH</div>
      </footer>
    </div>
  );
}

export default App;
