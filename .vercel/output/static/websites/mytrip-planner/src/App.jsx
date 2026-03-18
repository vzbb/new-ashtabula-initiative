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


// Suitcase with Map Logo
const LogoIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="logo-icon">
    <rect x="8" y="16" width="48" height="40" rx="4" fill="#16a085" stroke="#0e6655" strokeWidth="2"/>
    <rect x="20" y="8" width="24" height="12" rx="2" fill="#0e6655"/>
    <rect x="12" y="24" width="40" height="28" rx="2" fill="#e67e22" opacity="0.9"/>
    <path d="M16 30 L24 38 L32 30 L40 42 L48 34" stroke="#f4e4c1" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="22" cy="26" r="3" fill="#f4e4c1"/>
    <circle cx="40" cy="36" r="2" fill="#f4e4c1"/>
    <rect x="26" y="12" width="12" height="4" rx="1" fill="#7dcea0"/>
  </svg>
);

const MapIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="1 6 1 22 8 18 16 22 21 18 21 2 14 6 6 2 1 6"/>
    <line x1="8" y1="18" x2="8" y2="6"/>
    <line x1="16" y1="22" x2="16" y2="6"/>
  </svg>
);

const CompassIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
  </svg>
);

const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const TRIP_TYPES = [
  { id: "weekend", name: "Weekend Getaway", icon: "🎒" },
  { id: "business", name: "Business Trip", icon: "💼" },
  { id: "family", name: "Family Vacation", icon: "👨‍👩‍👧‍👦" },
  { id: "adventure", name: "Adventure Travel", icon: "🏔️" },
  { id: "romantic", name: "Romantic Escape", icon: "💕" },
];

function App() {
  const [destination, setDestination] = useState("Ashtabula, OH");
  const [tripType, setTripType] = useState("weekend");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateItinerary = async () => {
    if (!destination.trim()) {
      setError("Please enter a destination");
      return;
    }
    
    setLoading(true);
    setError("");
    setSummary("");
    try {
      const typeName = TRIP_TYPES.find(t => t.id === tripType)?.name || tripType;
      const prompt = `Create a ${typeName.toLowerCase()} itinerary for ${destination}. Include: top 3 must-see attractions, recommended local restaurants, best time to visit, and a packing tip. Make it enthusiastic and practical. 100 words max.`;
      
      const data = await callGeminiAPI(prompt);
      const text = extractResponseText(data);
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        }
      );
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      if (!text) throw new Error("No response from Gemini.");
      setSummary(text);
    } catch (e) {
      setError(e.message || "Failed to generate itinerary.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="background-pattern" aria-hidden="true">
        <svg className="map-bg" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="mapPattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              <path d="M0 60 L30 40 L60 60 L90 35 L120 60" fill="none" stroke="#16a085" strokeWidth="1" opacity="0.15"/>
              <path d="M0 90 L40 70 L80 95 L120 75" fill="none" stroke="#e67e22" strokeWidth="1" opacity="0.12"/>
              <circle cx="30" cy="30" r="4" fill="#16a085" opacity="0.2"/>
              <path d="M30 26 L30 34 M26 30 L34 30" stroke="#0e6655" strokeWidth="1.5"/>
              <circle cx="90" cy="90" r="3" fill="#e67e22" opacity="0.2"/>
              <path d="M90 87 L90 93 M87 90 L93 90" stroke="#d35400" strokeWidth="1"/>
              <rect x="55" y="55" width="10" height="10" fill="none" stroke="#16a085" strokeWidth="1" opacity="0.1" transform="rotate(45 60 60)"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mapPattern)"/>
        </svg>
      </div>
      
      <div className="container">
        <header className="header">
          <div className="brand">
            <LogoIcon />
            <div className="brand-text">
              <span className="brand-name">MyTrip Planner</span>
              <span className="brand-tagline">Adventure Awaits</span>
            </div>
          </div>
        </header>

        <main className="main-content">
          <section className="hero-card">
            <div className="hero-content">
              <p className="eyebrow">AI Travel Assistant</p>
              <h1>Plan Your Perfect Adventure</h1>
              <p className="sub">Discover hidden gems, local favorites, and must-see attractions for any destination.</p>
              
              <div className="trust">
                <span className="trust-item"><MapIcon /> Local Insights</span>
                <span className="trust-item"><CompassIcon /> Smart Routes</span>
                <span className="trust-item"><SunIcon /> Weather Tips</span>
              </div>
            </div>
            
            <div className="input-card">
              <h3>Trip Details</h3>
              
              <label>
                <span>Destination</span>
                <input 
                  type="text" 
                  value={destination} 
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Where are you going?"
                />
              </label>
              
              <label>
                <span>Trip Type</span>
                <select 
                  value={tripType} 
                  onChange={(e) => setTripType(e.target.value)}
                  className="select-input"
                >
                  {TRIP_TYPES.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.icon} {type.name}
                    </option>
                  ))}
                </select>
              </label>
              
              <button 
                className="primary" 
                onClick={generateItinerary} 
                disabled={loading}
              >
                {loading ? "Planning..." : "Create Itinerary"}
              </button>
            </div>
          </section>

          <section className="result-card">
            <div className="card-header">
              <h2>Your Personalized Itinerary</h2>
              <span className="pill">AI Generated</span>
            </div>
            
            {error && <div className="error">{error}</div>}
            
            {summary ? (
              <div className="output">{summary}</div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">✈️</div>
                <p>Enter your destination and trip type to generate a personalized travel itinerary with local recommendations.</p>
              </div>
            )}
          </section>

          <section className="features">
            <div className="feature">
              <div className="feature-icon">🗺️</div>
              <h3>Hidden Gems</h3>
              <p>Discover local favorites beyond the tourist traps.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🍽️</div>
              <h3>Local Eats</h3>
              <p>Restaurant recommendations for every budget and taste.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🎒</div>
              <h3>Smart Packing</h3>
              <p>Weather-aware packing tips for your destination.</p>
            </div>
          </section>
        </main>

        <footer className="footer">
          <p>MyTrip Planner • Explore Ashtabula County & Beyond</p>
          <p className="footer-meta">Adventure • Discovery • Memories</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
