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


// SVG Logo Component
const PolicyPalLogo = () => (
  <svg className="logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* Shield Background */}
    <path
      d="M50 5 L85 18 L85 45 Q85 70 50 90 Q15 70 15 45 L15 18 Z"
      fill="#2980b9"
      stroke="#1a3a52"
      strokeWidth="3"
    />
    {/* Inner Shield */}
    <path
      d="M50 15 L75 25 L75 45 Q75 65 50 78 Q25 65 25 45 L25 25 Z"
      fill="#ffffff"
      opacity="0.95"
    />
    {/* Checkmark */}
    <path
      d="M32 48 L42 58 L65 32"
      fill="none"
      stroke="#27ae60"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Decorative lines */}
    <path d="M50 15 L50 25" stroke="#2980b9" strokeWidth="2" opacity="0.3"/>
    <path d="M50 78 L50 85" stroke="#2980b9" strokeWidth="2" opacity="0.3"/>
  </svg>
);

function App() {
  const [policy, setPolicy] = useState("Homeowners policy renewal");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const summarize = async () => {
    setLoading(true);
    setError("");
    setSummary("");
    try {
      const prompt = `Summarize the policy note: ${policy}. Provide 3 bullet highlights and a CTA to review coverage. 70 words max.`;
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
        <PolicyPalLogo />
        <span className="brand-name">Policy Pal</span>
      </div>
      
      <header className="hero">
        <div className="hero-content">
          <span className="eyebrow">✓ Trusted Insurance Tool</span>
          <h1>Clear policy summaries clients understand</h1>
          <p className="sub">Gemini‑powered highlights + review CTA for better retention</p>
          
          <div className="input-card">
            <h3>📋 Policy Details</h3>
            <label>Enter policy note or renewal information</label>
            <input 
              value={policy} 
              onChange={(e) => setPolicy(e.target.value)}
              placeholder="e.g., Homeowners policy renewal details..."
            />
          </div>
          
          <div className="hero-actions">
            <button className="primary" onClick={summarize} disabled={loading}>
              {loading ? "⏳ Summarizing…" : "✨ Generate Summary"}
            </button>
            <button className="ghost" onClick={() => alert("Calendar integration coming soon! For now, copy the summary and schedule via your CRM.")} aria-label="Schedule a policy review">📅 Schedule Review</button>
          </div>
          
          <div className="trust">
            <span>🛡️ Secure Processing</span>
            <span>⚡ 5‑Second Output</span>
            <span>✅ Better Retention</span>
          </div>
        </div>
      </header>
      
      <section className="card">
        <div className="card-head">
          <h2>📄 Summary</h2>
          <span className="pill">Gemini AI</span>
        </div>
        {error && <div className="error">⚠️ {error}</div>}
        {summary ? (
          <pre className="output">{summary}</pre>
        ) : (
          <p className="muted">Your policy summary will appear here after generation...</p>
        )}
      </section>
      
      <section className="grid">
        <div className="tile">
          <h3>🎯 Client Clarity</h3>
          <p>Easy-to-understand policy highlights that build trust</p>
        </div>
        <div className="tile">
          <h3>🔄 Better Retention</h3>
          <p>Improve renewal conversations with clear summaries</p>
        </div>
        <div className="tile">
          <h3>⏱️ Less Admin</h3>
          <p>Automated summaries save hours of manual work</p>
        </div>
      </section>
      
      <footer className="footer">
        <div>🛡️ Policy Pal • Professional Insurance Tools</div>
        <div style={{marginTop: '8px', opacity: 0.7}}>Ashtabula County, OH</div>
      </footer>
    </div>
  );
}

export default App;
