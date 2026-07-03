import { useState, useEffect } from "react";
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
  if (!apiKey || apiKey === 'undefined') {
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
    return text;
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
// === End NAI API Client ===

const geminiService = {
  async generateContent(prompt) {
    return await callGeminiAPI(prompt);
  }
};

// Engineering logo - gear with blueprint style
const LogoIcon = () => (
  <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="25" cy="25" r="22" stroke="#475569" strokeWidth="2" fill="#f8fafc" strokeDasharray="4 2"/>
    <circle cx="25" cy="25" r="16" stroke="#3b82f6" strokeWidth="2.5" fill="none"/>
    <path d="M25 9v6M25 35v6M9 25h6M35 25h6M13.6 13.6l4.2 4.2M32.2 32.2l4.2 4.2M13.6 36.4l4.2-4.2M32.2 17.8l4.2-4.2" stroke="#475569" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="25" cy="25" r="6" fill="#3b82f6"/>
  </svg>
);

function App() {
  const [brief, setBrief] = useState("Structural review for 10k sq ft warehouse");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [apiConfigured, setApiConfigured] = useState(true);

  useEffect(() => {
    if (!apiKey || apiKey === 'undefined') setApiConfigured(false);
  }, []);

  const analyze = async () => {
    if (!apiConfigured) { setError("API key not configured."); return; }
    setLoading(true); setError(""); setSummary("");
    try {
      const prompt = `Summarize key engineering considerations for: ${brief}. Provide 3 bullets and a CTA to schedule review. 90 words max.`;
      const text = await geminiService.generateContent(prompt);
      setSummary(text);
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  };

  return (
    <div className="page">
      <div className="bg-grid" aria-hidden="true">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="blueprint" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#blueprint)"/>
        </svg>
      </div>

      <header className="header">
        <div className="logo">
          <LogoIcon />
          <div className="logo-text">
            <span className="logo-title">Engineer's Assistant</span>
            <span className="logo-subtitle">AI-Powered Technical Analysis</span>
          </div>
        </div>
      </header>

      <main className="content">
        <div className="hero">
          <h1>Fast technical summaries for clients</h1>
          <p className="sub">Gemini‑powered engineering insights that communicate complexity with clarity.</p>
          
          <div className="trust-badges">
            <div className="badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              Gemini API
            </div>
            <div className="badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              5‑second output
            </div>
            <div className="badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Clear guidance
            </div>
          </div>
        </div>

        <div className="input-section">
          <div className="input-card">
            <div className="input-header">
              <div className="input-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
              </div>
              <label>Project Brief</label>
            </div>            
            <textarea 
              value={brief} 
              onChange={(e) => setBrief(e.target.value)}
              rows={4}
              placeholder="Describe your engineering project..."
            />
            <div className="input-actions">
              <button className="primary" onClick={analyze} disabled={loading}>
                {loading ? (
                  <>
                    <svg className="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" strokeDasharray="60" strokeDashoffset="20"/>
                    </svg>
                    Analyzing…
                  </>
                ) : (
                  <>Generate Summary →</>
                )}
              </button>
              <button className="secondary">Book Consult</button>
            </div>
          </div>

          {!apiConfigured && (
            <div className="alert alert-warning">
              <strong>⚠️ Setup Required:</strong> Copy .env.example to .env and add your Gemini API key.
            </div>
          )}
          {error && <div className="alert alert-error">{error}</div>}

          <div className="result-card">
            <div className="result-header">
              <div className="result-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
              </div>
              <h3>Analysis Summary</h3>
              <span className="version-badge">Gemini 1.5 Flash</span>
            </div>
            {summary ? (
              <div className="result-content">
                <pre>{summary}</pre>
              </div>
            ) : (
              <div className="result-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <path d="M9 12h6M9 16h6M9 8h3" strokeLinecap="round"/>
                </svg>
                <p>Enter your project brief and click "Generate Summary" to see AI-powered analysis.</p>
              </div>
            )}
          </div>
        </div>

        <div className="features">
          <div className="feature">
            <div className="feature-num">01</div>
            <h4>Clarity</h4>
            <p>Short, client‑ready notes that translate technical complexity.</p>
          </div>
          <div className="feature">
            <div className="feature-num">02</div>
            <h4>Faster Reviews</h4>
            <p>Reduce back‑and‑forth with stakeholders and approval boards.</p>
          </div>
          <div className="feature">
            <div className="feature-num">03</div>
            <h4>More Projects</h4>
            <p>Clear next steps help you move from proposal to execution.</p>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-line" />
        <p>Local Engineers • Ashtabula County, OH</p>
      </footer>
    </div>
  );
}

export default App;