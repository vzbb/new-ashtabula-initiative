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


// SVG Logo - Art Frame with Brush
const PortfolioLogo = () => (
  <svg className="logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* Frame */}
    <rect x="15" y="15" width="70" height="70" rx="4" fill="#2d2d2d" stroke="#9b59b6" strokeWidth="3" />
    <rect x="22" y="22" width="56" height="56" rx="2" fill="#1a1a1a" />
    {/* Canvas */}
    <rect x="28" y="28" width="44" height="44" rx="1" fill="#f5f5f5" />
    {/* Art on Canvas */}
    <circle cx="45" cy="45" r="8" fill="#e91e63" opacity="0.7" />
    <rect x="52" y="38" width="12" height="20" fill="#9b59b6" opacity="0.6" />
    <path d="M35 60 Q50 50 65 60" stroke="#ffd700" strokeWidth="3" fill="none" />
    {/* Paint Brush */}
    <rect x="72" y="55" width="4" height="25" rx="2" fill="#8d6e63" transform="rotate(-30 74 67)" />
    <path d="M68 75 L72 82 L76 75 Q72 78 68 75" fill="#333" transform="rotate(-30 72 78)" />
    {/* Paint Splatters */}
    <circle cx="12" cy="30" r="3" fill="#e91e63" opacity="0.5" />
    <circle cx="88" cy="70" r="4" fill="#9b59b6" opacity="0.4" />
  </svg>
);

// Icons
const PaletteIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 10 10c0 2-1 3-2 3s-2-1-2-3V8a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v2c0 2-1 3-2 3s-2-1-2-3A10 10 0 0 1 12 2z"/></svg>;

const ImageIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;

const SparklesIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>;

function App() {
  const [project, setProject] = useState("Brand identity for coffee shop");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateDescription = async () => {
    setLoading(true);
    setError("");
    setDescription("");
    try {
      const prompt = `Write a compelling portfolio description for a creative project: "${project}". Include the concept, approach, and outcome. Make it sound professional and artistic. Keep under 100 words.`;
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
        <PortfolioLogo />
        <span className="brand-name">Visual <span>Portfolio</span></span>
      </div>

      <header className="hero">
        <div className="hero-content">
          <span className="eyebrow">🎨 Creative Showcase</span>
          <h1>Showcase Your Work</h1>
          <p className="sub">Gemini‑powered portfolio descriptions that capture your creative vision</p>
          
          {/* Gallery Preview */}
          <div className="gallery-preview">
            <div className="gallery-item">🎨</div>
            <div className="gallery-item">📸</div>
            <div className="gallery-item">✏️</div>
            <div className="gallery-item">🖼️</div>
            <div className="gallery-item">🎭</div>
            <div className="gallery-item">💎</div>
          </div>
          
          <div className="input-card">
            <h3>📝 Project Details</h3>
            <label>Describe your project or artwork</label>
            <input 
              value={project} 
              onChange={(e) => setProject(e.target.value)} 
              placeholder="e.g., Brand identity for coffee shop"
            />
          </div>
          
          <div className="hero-actions">
            <button className="primary" onClick={generateDescription} disabled={loading}>
              {loading ? "✨ Creating…" : "🎨 Generate Description"}
            </button>
            <button className="ghost">📁 View Gallery</button>
          </div>
          
          <div className="trust">
            <span><PaletteIcon /> Creative</span>
            <span><ImageIcon /> Portfolio</span>
            <span><SparklesIcon /> AI Powered</span>
          </div>
        </div>
      </header>

      <section className="card">
        <div className="card-head">
          <h2>📝 Project Description</h2>
          <span className="pill">Portfolio</span>
        </div>
        {error && <div className="error">⚠️ {error}</div>}
        {description ? (
          <pre className="output">{description}</pre>
        ) : (
          <p className="muted">Enter project details to generate a compelling portfolio description...</p>
        )}
      </section>

      <section className="grid">
        <div className="tile">
          <div className="tile-icon">🎯</div>
          <h3>Compelling Copy</h3>
          <p>AI-crafted descriptions that captivate viewers</p>
        </div>
        <div className="tile">
          <div className="tile-icon">⚡</div>
          <h3>Save Time</h3>
          <p>Focus on creating, not writing</p>
        </div>
        <div className="tile">
          <div className="tile-icon">🌟</div>
          <h3>Professional Tone</h3>
          <p>Gallery-ready descriptions every time</p>
        </div>
      </section>

      <footer className="footer">
        <div>Visual Portfolio • Creative Professionals</div>
      </footer>
    </div>
  );
}

export default App;
