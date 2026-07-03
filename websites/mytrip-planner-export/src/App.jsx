import { useState, useEffect } from "react";
import "./App.css";
import { generateItinerary, validateApiConfig } from "./config/api.js";

// Document with Airplane Logo
const LogoIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="logo-icon">
    <rect x="12" y="8" width="40" height="48" rx="4" fill="#0d9488" stroke="#0f766e" strokeWidth="2"/>
    <rect x="18" y="16" width="28" height="32" rx="2" fill="#f0fdfa"/>
    <path d="M40 44 L32 28 L28 36 L24 32" stroke="#0d9488" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M48 16 L56 12 L52 20 L56 20 L44 28 L40 24 Z" fill="#f59e0b"/>
    <circle cx="24" cy="24" r="4" fill="#f59e0b" opacity="0.8"/>
    <rect x="20" y="40" width="16" height="4" rx="1" fill="#0d9488" opacity="0.5"/>
  </svg>
);

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const ShareIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"/>
    <circle cx="6" cy="12" r="3"/>
    <circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);

const FileIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
);

function App() {
  const [theme, setTheme] = useState("Family");
  const [days, setDays] = useState("2");
  const [itinerary, setItinerary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [configError, setConfigError] = useState("");

  useEffect(() => {
    const configCheck = validateApiConfig();
    if (!configCheck.valid) {
      setConfigError(configCheck.error);
    }
  }, []);

  const generate = async () => {
    const configCheck = validateApiConfig();
    if (!configCheck.valid) {
      setError(configCheck.error);
      return;
    }
    
    setLoading(true);
    setError("");
    setItinerary("");
    
    try {
      const text = await generateItinerary(theme, days);
      setItinerary(text);
    } catch (e) {
      setError(e.message || "Failed to generate itinerary.");
    } finally {
      setLoading(false);
    }
  };

  const downloadItinerary = () => {
    const blob = new Blob([itinerary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `itinerary-${theme.toLowerCase().replace(/\s+/g, '-')}-${days}days.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page">
      <div className="background-pattern" aria-hidden="true">
        <svg className="stamp-bg" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="stampPattern" x="0" y="0" width="140" height="100" patternUnits="userSpaceOnUse">
              <rect x="10" y="20" width="30" height="40" rx="2" fill="none" stroke="#0d9488" strokeWidth="1" opacity="0.1"/>
              <circle cx="60" cy="50" r="20" fill="none" stroke="#f59e0b" strokeWidth="1" opacity="0.08"/>
              <text x="55" y="55" fill="#0d9488" fontSize="12" opacity="0.1">✈</text>
              <rect x="90" y="30" width="35" height="50" rx="3" fill="none" stroke="#0d9488" strokeWidth="1" opacity="0.1" strokeDasharray="3 2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#stampPattern)"/>
        </svg>
      </div>

      <div className="container">
        <header className="header">
          <div className="brand">
            <LogoIcon />
            <div className="brand-text">
              <span className="brand-name">MyTrip Export</span>
              <span className="brand-tagline">Plan • Export • Share</span>
            </div>
          </div>
        </header>

        <main className="main-content">
          <section className="hero-card">
            <div className="hero-content">
              <p className="eyebrow">Export-Ready Itineraries</p>
              <h1>Create & Export Trip Plans</h1>
              <p className="sub">Generate detailed itineraries and export them for sharing with travel companions.</p>
              
              <div className="trust">
                <span className="trust-item"><FileIcon /> PDF Ready</span>
                <span className="trust-item"><ShareIcon /> Easy Share</span>
                <span className="trust-item"><DownloadIcon /> Download</span>
              </div>
            </div>
            
            <div className="input-card">
              <h3>Trip Details</h3>
              
              <label>
                <span>Theme</span>
                <input value={theme} onChange={(e) => setTheme(e.target.value)} />
              </label>
              
              <label>
                <span>Days</span>
                <input type="number" value={days} onChange={(e) => setDays(e.target.value)} min="1" max="14" />
              </label>
              
              <button className="primary" onClick={generate} disabled={loading}>
                {loading ? "Generating..." : "Generate Itinerary"}
              </button>
            </div>
          </section>

          <section className="result-card">
            <div className="card-header">
              <h2>Your Itinerary</h2>
              <span className="pill">AI Generated</span>
            </div>
            
            {configError && <div className="error">⚠️ {configError}</div>}
            {error && <div className="error">{error}</div>}
            
            {itinerary ? (
              <>
                <div className="output">{itinerary}</div>
                <div className="export-actions">
                  <button className="secondary" onClick={downloadItinerary}>
                    <DownloadIcon /> Download TXT
                  </button>
                </div>
              </>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📄</div>
                <p>Enter trip details to generate an export-ready itinerary.</p>
              </div>
            )}
          </section>

          <section className="features">
            <div className="feature">
              <div className="feature-icon">📱</div>
              <h3>Mobile Ready</h3>
              <p>Export formats work on any device.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🔗</div>
              <h3>Share Easily</h3>
              <p>Send to friends and family instantly.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🖨️</div>
              <h3>Print Friendly</h3>
              <p>Optimized for printing and offline use.</p>
            </div>
          </section>
        </main>

        <footer className="footer">
          <p>MyTrip Planner Export • Ashtabula CVB</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
