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


// City of Ashtabula Logo Component
function CityOfAshtabulaLogo({ size = 50 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M25 2 L5 10 V22 C5 35 25 48 25 48 C25 48 45 35 45 22 V10 L25 2Z"
        fill="#1e3a5f"
        stroke="#d4af37"
        strokeWidth="1.5"
      />
      <path
        d="M25 5 L8 12 V22 C8 33 25 44 25 44 C25 44 42 33 42 22 V12 L25 5Z"
        fill="none"
        stroke="#d4af37"
        strokeWidth="0.5"
        opacity="0.6"
      />
      <rect x="20" y="28" width="10" height="12" fill="#ffffff" />
      <rect x="22" y="16" width="6" height="12" fill="#ffffff" />
      <path d="M21 16 L25 10 L29 16 Z" fill="#d4af37" />
      <path d="M25 12 L35 8 L25 10 Z" fill="#d4af37" opacity="0.8" />
      <path d="M25 12 L15 8 L25 10 Z" fill="#d4af37" opacity="0.6" />
      <rect x="23" y="34" width="4" height="6" fill="#1e3a5f" />
      <rect x="24" y="20" width="2" height="3" fill="#1e3a5f" />
      <path d="M8 38 Q14 35 20 38 T32 38 T42 36" stroke="#d4af37" strokeWidth="1" fill="none" opacity="0.8" />
      <path d="M10 42 Q16 39 22 42 T34 42 T40 40" stroke="#d4af37" strokeWidth="0.8" fill="none" opacity="0.6" />
    </svg>
  );
}

// Icons
const BuildingIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><line x1="10" y1="6" x2="10" y2="6"/><line x1="14" y1="6" x2="14" y2="6"/><line x1="10" y1="10" x2="10" y2="10"/><line x1="14" y1="10" x2="14" y2="10"/><line x1="10" y1="14" x2="10" y2="14"/><line x1="14" y1="14" x2="14" y2="14"/></svg>;

const FileTextIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;

const CheckCircleIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;

function App() {
  const [address, setAddress] = useState("123 Main Street");
  const [project, setProject] = useState("Home renovation addition");
  const [guidance, setGuidance] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const checkZoning = async () => {
    setLoading(true);
    setError("");
    setGuidance("");
    try {
      const prompt = `You are a zoning clerk for the City of Ashtabula, Ohio. Provide zoning guidance for ${project} at ${address}. Include permit requirements, zoning district info, and next steps. Keep under 120 words, official but helpful tone.`;
      const data = await callGeminiAPI(prompt);
      const text = extractResponseText(data);
    } catch (e) {
      setError(e.message || "Failed to generate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="bg-wave-pattern"></div>

      {/* Official Banner */}
      <div className="official-banner">
        <div className="official-banner-content">
          <span className="official-banner-seal">★</span>
          <span>Official Zoning Portal of the City of Ashtabula</span>
          <span className="official-banner-seal">★</span>
        </div>
      </div>

      {/* Header */}
      <header className="municipal-header">
        <div className="header-content">
          <div className="city-logo">
            <CityOfAshtabulaLogo size={50} />
            <div className="city-logo-text">
              <span className="city-logo-title">City of Ashtabula</span>
              <span className="city-logo-subtitle">Zoning Clerk</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="municipal-main">
        <div className="content-container">
          {/* Hero Section */}
          <section className="hero-section">
            <div className="hero-eyebrow">Planning & Zoning Department</div>
            <h1 className="hero-title">Zoning & Permit Guidance</h1>
            <p className="hero-subtitle">
              Get official zoning information and permit requirements for your property 
              in the City of Ashtabula.
            </p>
            <div className="divider"></div>
          </section>

          {/* Input Card */}
          <div className="municipal-card">
            <div className="municipal-card-header municipal-card-header-gold">
              <span className="municipal-card-title">📋 Project Information</span>
            </div>
            <div className="municipal-card-body">
              <div className="form-row">
                <div className="form-section">
                  <label className="form-label">Property Address</label>
                  <input
                    type="text"
                    className="form-input"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Main Street"
                  />
                </div>
                <div className="form-section">
                  <label className="form-label">Project Type</label>
                  <select
                    className="form-select"
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                  >
                    <option>Home renovation addition</option>
                    <option>New construction</option>
                    <option>Fence installation</option>
                    <option>Deck/patio construction</option>
                    <option>Business signage</option>
                    <option>Property subdivision</option>
                  </select>
                </div>
              </div>

              <button
                className="btn btn-primary btn-lg"
                onClick={checkZoning}
                disabled={loading}
                style={{ width: '100%', marginTop: '8px' }}
              >
                {loading ? "⏳ Processing…" : "📋 Get Zoning Info"}
              </button>
            </div>
          </div>

          {/* Results Card */}
          <div className="municipal-card">
            <div className="municipal-card-header">
              <span className="municipal-card-title">📄 Zoning Guidance</span>
              {guidance && <span className="badge badge-gold">Official</span>}
            </div>
            <div className="municipal-card-body">
              {error && (
                <div className="alert alert-error">
                  <strong>⚠️ {error}</strong>
                </div>
              )}
              {guidance ? (
                <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', lineHeight: 1.7, margin: 0 }}>
                  {guidance}
                </pre>
              ) : (
                <p style={{ color: '#64748b', margin: 0, textAlign: 'center', padding: '20px' }}>
                  Enter your project details above to receive official zoning guidance…
                </p>
              )}
            </div>
          </div>

          {/* Features Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '16px',
            marginTop: '32px'
          }}>
            {[
              { icon: <BuildingIcon />, title: 'Permit Requirements', desc: 'Understand what permits you need' },
              { icon: <FileTextIcon />, title: 'Zoning Districts', desc: 'Learn about your property\'s zoning' },
              { icon: <CheckCircleIcon />, title: 'Next Steps', desc: 'Clear guidance on the approval process' },
            ].map((feature) => (
              <div key={feature.title} className="municipal-card" style={{ marginBottom: 0 }}>
                <div className="municipal-card-body" style={{ textAlign: 'center' }}>
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    background: '#e8f4f8', 
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px',
                    color: '#1e3a5f'
                  }}>
                    {feature.icon}
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1e3a5f', marginBottom: '8px' }}>
                    {feature.title}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="municipal-footer">
        <div className="footer-content">
          <div className="footer-top">
            <div className="footer-seal">
              <svg width="24" height="24" viewBox="0 0 50 50" fill="none">
                <path d="M25 5 L8 12 V22 C8 33 25 44 25 44 C25 44 42 33 42 22 V12 L25 5Z" fill="#ffffff" />
                <rect x="22" y="20" width="6" height="16" fill="#1e3a5f" />
                <path d="M21 20 L25 14 L29 20 Z" fill="#d4af37" />
              </svg>
            </div>
            <div>
              <div className="footer-title">City of Ashtabula</div>
              <div className="footer-subtitle">Zoning Clerk — Planning & Zoning Department</div>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-links">
              <a href="#" className="footer-link">Zoning Office</a>
              <a href="#" className="footer-link">Building Department</a>
              <a href="#" className="footer-link">City Website</a>
            </div>
            <p className="footer-copyright">
              © 2026 City of Ashtabula, Ohio. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
