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

const ShieldIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>;

const FileIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;

const ClockIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;

const LICENSE_TYPES = [
  { id: "business", name: "Business License", icon: "🏢" },
  { id: "contractor", name: "Contractor License", icon: "🔨" },
  { id: "food", name: "Food Service Permit", icon: "🍽️" },
  { id: "liquor", name: "Liquor License", icon: "🍷" },
  { id: "event", name: "Event Permit", icon: "🎉" },
];

function App() {
  const [licenseType, setLicenseType] = useState("business");
  const [businessName, setBusinessName] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateGuide = async () => {
    if (!businessName.trim()) {
      setError("Please enter your business name");
      return;
    }
    
    setLoading(true);
    setError("");
    setSummary("");
    try {
      const typeName = LICENSE_TYPES.find(l => l.id === licenseType)?.name || licenseType;
      const prompt = `Create a step-by-step guide for obtaining a ${typeName} in Ashtabula, Ohio for "${businessName}". Include required documents, fees, processing time, and contact information. Format as a clear checklist. 150 words max.`;
      
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
      setError(e.message || "Failed to generate guide.");
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
          <span>Official Licensing Portal of the City of Ashtabula</span>
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
              <span className="city-logo-subtitle">License Wizard</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="municipal-main">
        <div className="content-container">
          {/* Hero Section */}
          <section className="hero-section">
            <div className="hero-eyebrow">Business Services</div>
            <h1 className="hero-title">Navigate Licensing with Confidence</h1>
            <p className="hero-subtitle">
              Get step-by-step guidance for permits, licenses, and regulatory 
              requirements tailored to your business.
            </p>
            <div className="divider"></div>
            
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '16px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.875rem' }}>
                <ShieldIcon /> Official Requirements
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.875rem' }}>
                <FileIcon /> Document Checklists
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.875rem' }}>
                <ClockIcon /> Timeline Estimates
              </span>
            </div>
          </section>

          {/* Input Card */}
          <div className="municipal-card">
            <div className="municipal-card-header municipal-card-header-gold">
              <span className="municipal-card-title">Business Details</span>
            </div>
            <div className="municipal-card-body">
              <div className="form-section">
                <label className="form-label">License Type</label>
                <select
                  className="form-select"
                  value={licenseType}
                  onChange={(e) => setLicenseType(e.target.value)}
                >
                  {LICENSE_TYPES.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.icon} {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-section">
                <label className="form-label">Business Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Enter your business name"
                />
              </div>

              {error && (
                <div className="alert alert-error" style={{ marginBottom: '16px' }}>
                  {error}
                </div>
              )}

              <button
                className="btn btn-primary btn-lg"
                onClick={generateGuide}
                disabled={loading}
                style={{ width: '100%' }}
              >
                {loading ? "Generating Guide…" : "Get License Guide"}
              </button>
            </div>
          </div>

          {/* Results Card */}
          {summary && (
            <div className="municipal-card animate-in">
              <div className="municipal-card-header">
                <span className="municipal-card-title">Your License Guide</span>
                <span className="badge badge-gold">AI Generated</span>
              </div>
              <div className="municipal-card-body">
                <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', lineHeight: 1.7, margin: 0 }}>
                  {summary}
                </pre>
              </div>
            </div>
          )}

          {/* Features Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '16px',
            marginTop: '32px'
          }}>
            {[
              { icon: '✅', title: 'Checklist Format', desc: 'Clear step-by-step requirements you can track and complete.' },
              { icon: '💰', title: 'Fee Estimates', desc: 'Know the costs upfront with detailed fee breakdowns.' },
              { icon: '📞', title: 'Contact Info', desc: 'Direct links and phone numbers for local offices.' },
            ].map((feature) => (
              <div key={feature.title} className="municipal-card" style={{ marginBottom: 0 }}>
                <div className="municipal-card-body" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>{feature.icon}</div>
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

          {/* Disclaimer */}
          <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8', marginTop: '24px' }}>
            Always verify current requirements with official city offices.
          </p>
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
              <div className="footer-subtitle">License Wizard — Business Services</div>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-links">
              <a href="#" className="footer-link">Business Licensing</a>
              <a href="#" className="footer-link">City Clerk</a>
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
