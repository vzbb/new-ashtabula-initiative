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


// Validate API Key
const validateApiKey = () => {
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    return "Please configure your Gemini API key in the .env file (VITE_GEMINI_API_KEY)";
  }
  if (apiKey.length < 10) {
    return "Invalid API key format. Please check your Gemini API key.";
  }
  return null;
};

// SVG Logo - Plow Truck with Snow
const SnowPlowLogo = () => (
  <svg className="logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* Snow Background */}
    <circle cx="15" cy="20" r="4" fill="#bbdefb" opacity="0.6" />
    <circle cx="85" cy="15" r="5" fill="#bbdefb" opacity="0.6" />
    <circle cx="75" cy="30" r="3" fill="#bbdefb" opacity="0.5" />
    <circle cx="10" cy="35" r="3" fill="#bbdefb" opacity="0.5" />
    <circle cx="90" cy="40" r="4" fill="#bbdefb" opacity="0.4" />
    {/* Truck Body */}
    <rect x="20" y="45" width="55" height="25" rx="4" fill="#1565c0" />
    <rect x="20" y="45" width="30" height="25" rx="4" fill="#0d47a1" />
    <rect x="52" y="48" width="20" height="18" rx="2" fill="#e3f2fd" />
    {/* Plow Blade */}
    <path d="M15 60 L30 55 L30 72 L15 75 Q10 67 15 60" fill="#e67e22" />
    <path d="M15 75 L30 72" stroke="#d35400" strokeWidth="2" />
    {/* Wheels */}
    <circle cx="30" cy="72" r="6" fill="#37474f" />
    <circle cx="30" cy="72" r="3" fill="#90a4ae" />
    <circle cx="62" cy="72" r="6" fill="#37474f" />
    <circle cx="62" cy="72" r="3" fill="#90a4ae" />
    {/* Headlights */}
    <rect x="72" y="55" width="3" height="8" rx="1" fill="#fff176" />
    {/* Snow Spray */}
    <circle cx="12" cy="65" r="3" fill="white" opacity="0.8" />
    <circle cx="8" cy="70" r="2" fill="white" opacity="0.7" />
    <circle cx="6" cy="62" r="2.5" fill="white" opacity="0.6" />
    {/* Status Light */}
    <circle cx="35" cy="42" r="4" fill="#e74c3c" />
    <circle cx="35" cy="42" r="2" fill="#ffebee" />
  </svg>
);

function App() {
  const [route, setRoute] = useState("North Route");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [apiStatus, setApiStatus] = useState(null);

  const check = async () => {
    const keyError = validateApiKey();
    if (keyError) {
      setError(keyError);
      return;
    }

    setLoading(true);
    setError("");
    setStatus("");
    setApiStatus(null);

    try {
      const prompt = `Write a concise snow plow status update for ${route} in Ashtabula County, OH. Include last pass time and next ETA. Keep it under 60 words.`;
      
      const data = await callGeminiAPI(prompt);
      const text = extractResponseText(data);
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        { 
          method: "POST", 
          headers: { "Content-Type": "application/json" }, 
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) 
        }
      );

      if (!res.ok) {
        throw new Error(`API Error (${res.status}): Failed to fetch status`);
      }

      const data = await res.json();
      
      if (data.error) {
        throw new Error(`Gemini API Error: ${data.error.message || "Unknown error"}`);
      }

      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      if (!text) {
        throw new Error("No response received from Gemini");
      }
      
      setStatus(text);
      setApiStatus("success");
    } catch (e) {
      setError(e.message || "Failed to check status");
      setApiStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="header">
        <SnowPlowLogo />
        <span className="brand-name">Snow Plow Tracker</span>
      </div>

      <header className="hero">
        <div className="hero-content">
          <span className="eyebrow">❄️ Real-Time Updates</span>
          <h1>Keep Residents Informed</h1>
          <p className="sub">Gemini‑powered status updates + ETA for public works transparency</p>
          
          <div className="input-card">
            <h3>🚛 Select Route</h3>
            <label>Route Name</label>
            <input value={route} onChange={(e) => setRoute(e.target.value)} placeholder="North Route" />
          </div>
          
          <div className="hero-actions">
            <button className="primary" onClick={check} disabled={loading}>
              {loading ? "⏳ Checking…" : "🔍 Check Status"}
            </button>
            <button className="ghost">🔔 Send Alerts</button>
          </div>
          
          <div className="trust">
            <span>❄️ Live Tracking</span>
            <span>⚡ Gemini AI</span>
            <span>📱 SMS Alerts</span>
          </div>
        </div>
      </header>

      <section className="card">
        <div className="card-head">
          <h2>📊 Route Status</h2>
          <span className="pill">Live</span>
        </div>
        {error && <div className="error" role="alert">⚠️ {error}</div>}
        {apiStatus === "success" && <div className="success" role="status">✓ Status retrieved successfully</div>}
        {status ? (
          <pre className="output">{status}</pre>
        ) : (
          <p className="muted">Select a route to see current plowing status and ETA...</p>
        )}
      </section>

      <section className="grid">
        <div className="tile">
          <h3>🔍 Transparency</h3>
          <p>Clear ETAs reduce resident frustration</p>
        </div>
        <div className="tile">
          <h3>🛡️ Safety</h3>
          <p>Help residents plan safe travel routes</p>
        </div>
        <div className="tile">
          <h3>📋 Less Admin</h3>
          <p>Automated updates reduce phone calls</p>
        </div>
      </section>

      <footer className="footer">
        <div>Public Works • Ashtabula County, OH</div>
      </footer>
    </div>
  );
}

export default App;
