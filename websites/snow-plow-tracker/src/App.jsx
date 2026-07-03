import { useState } from "react";
import "./App.css";
import mcLogo from "./assets/mc-lawncare-logo.png";

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


const DEMO_FALLBACKS = {
  "Commercial Route A":
    "Last pass completed at 5:40 AM. Salt follow-up is scheduled for 7:10 AM as storefront traffic increases along Main Avenue.",
  "Harbor & Bridge":
    "Harbor and bridge approach were cleared at 6:05 AM. A second pass is planned around 8:00 AM if lake-effect bands continue.",
  "School & Clinic Loop":
    "School and clinic loop was treated at 5:55 AM. Next ETA is 7:25 AM to keep staff parking and ambulance access open.",
  "North Route":
    "North Route was plowed at 6:15 AM. Crews are expected back through by 8:30 AM after the current commercial loop is finished.",
};

const getDemoFallback = (selectedRoute) => {
  return (
    DEMO_FALLBACKS[selectedRoute] ||
    `${selectedRoute} was serviced recently. MC Professional is monitoring accumulation and expects the next touchpoint within 90 minutes if conditions hold.`
  );
};

function App() {
  const [route, setRoute] = useState("Commercial Route A");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [apiStatus, setApiStatus] = useState(null);

  const check = async () => {
    if (!apiKey || apiKey === "your_gemini_api_key_here" || apiKey.length < 10) {
      setStatus(getDemoFallback(route));
      setApiStatus("success");
      setError("");
      return;
    }

    setLoading(true);
    setError("");
    setStatus("");
    setApiStatus(null);

    try {
      const prompt = `Write a concise snow and ice operations status update for ${route} for MC Professional Lawn Care and Snow Plowing in Ashtabula County, Ohio. Include the last pass time, the next ETA, and a professional customer-facing tone. Keep it under 60 words.`;
      
      const data = await callGeminiAPI(prompt);
      const text = extractResponseText(data);

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
        <img className="logo-image" src={mcLogo} alt="MC Professional Lawn Care and Snow Plowing" />
        <div className="brand-block">
          <span className="brand-name">MC Snow Tracker</span>
          <span className="brand-subtitle">MC Professional Lawn Care and Snow Plowing</span>
        </div>
      </div>

      <header className="hero">
        <div className="hero-content">
          <span className="eyebrow">Commercial Snow Operations</span>
          <h1>Keep Properties Clear Before The Phones Start Ringing</h1>
          <p className="sub">A buyer-specific route status demo for MC Professional's snow and ice management crews across Ashtabula County.</p>

          <div className="hero-points">
            <span>Commercial and HOA route visibility</span>
            <span>Storm-response ETAs with fallback summaries</span>
            <span>(440) 224-2448 for dispatch follow-up</span>
          </div>
          
          <div className="input-card">
            <h3>Choose An Active Snow Route</h3>
            <label>Operations Route</label>
            <select value={route} onChange={(e) => setRoute(e.target.value)}>
              <option>Commercial Route A</option>
              <option>Harbor & Bridge</option>
              <option>School & Clinic Loop</option>
              <option>North Route</option>
            </select>
          </div>
          
          <div className="hero-actions">
            <button className="primary" onClick={check} disabled={loading}>
              {loading ? "Checking Route..." : "Check Route Status"}
            </button>
            <button className="ghost">Open Dispatch Notes</button>
          </div>
          
          <div className="trust">
            <span>24/7 storm-response posture</span>
            <span>Commercial and industrial service mix</span>
            <span>Demo-safe fallback updates</span>
          </div>
        </div>
      </header>

      <section className="card">
        <div className="card-head">
          <h2>Route Status Snapshot</h2>
          <span className="pill">Live</span>
        </div>
        {error && <div className="error" role="alert">⚠️ {error}</div>}
        {apiStatus === "success" && <div className="success" role="status">Latest route summary is ready for dispatch and customer-facing updates.</div>}
        {status ? (
          <pre className="output">{status}</pre>
        ) : (
          <p className="muted">Pick a route to preview MC Professional's latest snow and ice service update.</p>
        )}
      </section>

      <section className="grid">
        <div className="tile">
          <h3>Property Managers First</h3>
          <p>Turn “where is the crew?” calls into a clear route-by-route update for commercial clients and HOAs.</p>
        </div>
        <div className="tile">
          <h3>Storm Response Confidence</h3>
          <p>Keep schools, clinics, storefronts, and lot supervisors informed as conditions shift across the county.</p>
        </div>
        <div className="tile">
          <h3>Less Dispatch Drag</h3>
          <p>Fallback summaries still keep the demo working cleanly when live AI is offline or keys are unavailable.</p>
        </div>
      </section>

      <footer className="footer">
        <div>MC Professional Lawn Care and Snow Plowing • Ashtabula, Conneaut, Geneva • (440) 224-2448</div>
      </footer>
    </div>
  );
}

export default App;
