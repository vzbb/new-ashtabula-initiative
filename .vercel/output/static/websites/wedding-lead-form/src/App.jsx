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


// SVG Logo - Rings with Flowers
const WeddingLogo = () => (
  <svg className="logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* Background */}
    <circle cx="50" cy="50" r="45" fill="#fffef5" stroke="#d4af37" strokeWidth="2" />
    {/* Rings */}
    <ellipse cx="40" cy="50" rx="15" ry="20" fill="none" stroke="#d4af37" strokeWidth="4" />
    <ellipse cx="60" cy="50" rx="15" ry="20" fill="none" stroke="#c39ea0" strokeWidth="4" />
    <ellipse cx="40" cy="50" rx="15" ry="20" fill="none" stroke="#d4af37" strokeWidth="1.5" opacity="0.5" />
    <ellipse cx="60" cy="50" rx="15" ry="20" fill="none" stroke="#c39ea0" strokeWidth="1.5" opacity="0.5" />
    {/* Diamond */}
    <path d="M40 28 L35 35 L40 30 L45 35 Z" fill="#e8f4f8" stroke="#b0c4de" strokeWidth="1" />
    {/* Flowers */}
    <circle cx="25" cy="25" r="8" fill="#fadbd8" />
    <circle cx="25" cy="25" r="4" fill="#fff" />
    <circle cx="75" cy="25" r="8" fill="#fadbd8" />
    <circle cx="75" cy="25" r="4" fill="#fff" />
    <circle cx="20" cy="75" r="6" fill="#e8b4b8" />
    <circle cx="80" cy="75" r="6" fill="#e8b4b8" />
    {/* Leaves */}
    <ellipse cx="30" cy="20" rx="4" ry="2" fill="#a8d5a2" transform="rotate(-30 30 20)" />
    <ellipse cx="70" cy="20" rx="4" ry="2" fill="#a8d5a2" transform="rotate(30 70 20)" />
  </svg>
);

// Icons
const HeartIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;

const CalendarIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;

const SparklesIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>;

function App() {
  const [names, setNames] = useState("Sarah & Michael");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("Ashtabula Harbor");
  const [proposal, setProposal] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateProposal = async () => {
    setLoading(true);
    setError("");
    setProposal("");
    try {
      const prompt = `Write an elegant wedding services proposal for ${names}'s wedding on ${date || 'their special day'} at ${venue}. Include a warm introduction, services overview, and next steps. Keep under 120 words, romantic but professional tone.`;
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
        <WeddingLogo />
        <span className="brand-name">Wedding Planner</span>
      </div>

      <header className="hero">
        <div className="hero-content">
          <span className="eyebrow">💍 Wedding Services</span>
          <h1>Your Dream Wedding Begins Here</h1>
          <p className="sub">Gemini‑powered proposals for your perfect day in Ashtabula</p>
          
          <div className="input-card">
            <h3>💕 Couple Details</h3>
            <div className="form-row">
              <div>
                <label>Couple Names</label>
                <input value={names} onChange={(e) => setNames(e.target.value)} placeholder="Sarah & Michael" />
              </div>
              <div>
                <label>Wedding Date</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            </div>
            <div style={{marginTop: '20px'}}>
              <label>Venue / Location</label>
              <input value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Ashtabula Harbor" />
            </div>
          </div>
          
          <div className="hero-actions">
            <button className="primary" onClick={generateProposal} disabled={loading}>
              {loading ? "✨ Creating…" : "💍 Generate Proposal"}
            </button>
            <button className="ghost">📞 Schedule Consultation</button>
          </div>
          
          <div className="trust">
            <span><HeartIcon /> Romantic</span>
            <span><CalendarIcon /> Organized</span>
            <span><SparklesIcon /> Magical</span>
          </div>
        </div>
      </header>

      <section className="card">
        <div className="card-head">
          <h2>📝 Wedding Proposal</h2>
          <span className="pill">Gemini AI</span>
        </div>
        {error && <div className="error">⚠️ {error}</div>}
        {proposal ? (
          <pre className="output">{proposal}</pre>
        ) : (
          <p className="muted">Your personalized wedding proposal will appear here...</p>
        )}
      </section>

      <section className="grid">
        <div className="tile">
          <div className="tile-icon">🌸</div>
          <h3>Floral Design</h3>
          <p>Custom arrangements for your special day</p>
        </div>
        <div className="tile">
          <div className="tile-icon">📸</div>
          <h3>Photography</h3>
          <p>Capture every precious moment</p>
        </div>
        <div className="tile">
          <div className="tile-icon">🎵</div>
          <h3>Entertainment</h3>
          <p>Music and celebration planning</p>
        </div>
      </section>

      <footer className="footer">
        <div>Wedding Planner • Creating Memories in Ashtabula</div>
      </footer>
    </div>
  );
}

export default App;
