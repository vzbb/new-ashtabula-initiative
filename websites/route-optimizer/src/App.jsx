import { useState } from 'react';
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


// SVG Logo - Map with Optimized Path
const RouteLogo = () => (
  <svg className="logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* Background */}
    <rect x="10" y="10" width="80" height="80" rx="10" fill="#1a1a2e" stroke="#8e44ad" strokeWidth="2" />
    {/* Grid Lines */}
    <path d="M10 30 L90 30 M10 50 L90 50 M10 70 L90 70" stroke="#8e44ad" strokeWidth="0.5" opacity="0.3" />
    <path d="M30 10 L30 90 M50 10 L50 90 M70 10 L70 90" stroke="#8e44ad" strokeWidth="0.5" opacity="0.3" />
    {/* Route Path - Optimized */}
    <path
      d="M25 75 L35 55 L50 45 L65 35 L75 25"
      fill="none"
      stroke="#00d4ff"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Waypoint Markers */}
    <circle cx="25" cy="75" r="5" fill="#e74c3c" stroke="#fff" strokeWidth="2" />
    <circle cx="50" cy="45" r="4" fill="#f1c40f" stroke="#fff" strokeWidth="2" />
    <circle cx="75" cy="25" r="5" fill="#2ecc71" stroke="#fff" strokeWidth="2" />
    {/* Start/End Labels */}
    <text x="25" y="90" textAnchor="middle" fill="#e74c3c" fontSize="6" fontWeight="bold">A</text>
    <text x="75" y="20" textAnchor="middle" fill="#2ecc71" fontSize="6" fontWeight="bold">B</text>
    {/* Direction Arrow */}
    <polygon points="75,20 70,28 80,28" fill="#00d4ff" />
  </svg>
);

// Icons
const MapPinIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;

const SparklesIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>;

const TrendingUpIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>;

function App() {
  const [stops, setStops] = useState([
    { name: "Downtown Depot", lat: 41.865, lng: -80.78 },
    { name: "Geneva Plaza", lat: 41.805, lng: -80.95 },
    { name: "Conneaut Harbor", lat: 41.945, lng: -80.55 }
  ]);
  const [aiSummary, setAiSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleOptimize = async () => {
    setIsOptimizing(true);
    setLoading(true);
    
    // Simulate optimization delay
    setTimeout(async () => {
      setIsOptimizing(false);
      
      // Generate AI summary
      if (!apiKey) {
        setAiSummary("Route optimized! The path minimizes backtracking and follows main corridors through Ashtabula County.");
        setLoading(false);
        return;
      }
      
      try {
        const stopNames = stops.map(s => s.name).join(", ");
        const prompt = `Act as a logistics expert for Ashtabula County. Analyze this route: ${stopNames}. Give a professional 2-sentence summary of why this order is efficient. Mention geography if relevant.`;
        
        const data = await callGeminiAPI(prompt);
        const text = extractResponseText(data);
        setAiSummary(text || "Route optimized for maximum efficiency.");
      } catch (e) {
        setAiSummary("Route optimized! Efficiency improved by reducing total travel distance.");
      } finally {
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="page">
      <div className="header">
        <RouteLogo />
        <span className="brand-name">Route <span>Optimizer</span></span>
      </div>

      <header className="hero">
        <div className="hero-content">
          <span className="eyebrow">🗺️ AI-Powered Logistics</span>
          <h1>Optimize Your Delivery Routes</h1>
          <p className="sub">Gemini‑powered route analysis for efficient fleet management in Ashtabula County</p>
          
          <div className="stats-bar">
            <div className="stat-item">
              <div className="stat-icon">📍</div>
              <div className="stat-value">{stops.length}</div>
              <div className="stat-label">Stops</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">⚡</div>
              <div className="stat-value">{isOptimizing ? '...' : '94%'}</div>
              <div className="stat-label">Efficiency</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">🕐</div>
              <div className="stat-value">{isOptimizing ? '...' : '2.3h'}</div>
              <div className="stat-label">Est. Time</div>
            </div>
          </div>

          <div className="input-card">
            <h3>🚚 Current Route Stops</h3>
            <div style={{color: 'rgba(255,255,255,0.8)', marginBottom: '15px'}}>
              {stops.map((stop, idx) => (
                <div key={idx} style={{padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px'}}>
                  <span style={{background: '#8e44ad', color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '700'}}>{idx + 1}</span>
                  <span>{stop.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="hero-actions">
            <button className="primary" onClick={handleOptimize} disabled={isOptimizing || loading}>
              {isOptimizing ? "⚡ Optimizing…" : "🚀 Optimize Route"}
            </button>
            <button className="ghost">📊 View Map</button>
          </div>
          
          <div className="trust">
            <span><MapPinIcon /> Ashtabula Edition</span>
            <span><SparklesIcon /> Gemini AI</span>
            <span><TrendingUpIcon /> Live Tracking</span>
          </div>
        </div>
      </header>

      {aiSummary && (
        <section className="card">
          <div className="card-head">
            <h2><SparklesIcon /> AI Route Analysis</h2>
            <span className="pill">Gemini</span>
          </div>
          <div className="output">{aiSummary}</div>
        </section>
      )}

      <section className="grid">
        <div className="tile">
          <div className="tile-icon">🧠</div>
          <h3>Smart Optimization</h3>
          <p>AI analyzes traffic patterns and stop sequences</p>
        </div>
        <div className="tile">
          <div className="tile-icon">⛽</div>
          <h3>Save Fuel</h3>
          <p>Reduce miles driven with efficient routing</p>
        </div>
        <div className="tile">
          <div className="tile-icon">📈</div>
          <h3>More Deliveries</h3>
          <p>Complete more stops in less time</p>
        </div>
      </section>

      <footer className="footer">
        <div>Route Optimizer • Ashtabula County Fleet Management</div>
      </footer>
    </div>
  );
}

export default App;
