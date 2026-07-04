import { useState, useEffect } from "react";
import { callOpenRouterAPI, isOpenRouterConfigured } from "../../../shared/api-client";
import "./App.css";

// === City of Ashtabula Seal ===
const CitySeal = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="City of Ashtabula Seal">
    <defs>
      <linearGradient id="seal-bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1B3A5C"/>
        <stop offset="100%" stopColor="#0F2440"/>
      </linearGradient>
    </defs>
    {/* Outer ring */}
    <circle cx="100" cy="100" r="98" fill="url(#seal-bg)" stroke="#C8A84E" strokeWidth="3"/>
    <circle cx="100" cy="100" r="88" fill="none" stroke="#C8A84E" strokeWidth="1.5"/>
    {/* Inner ring */}
    <circle cx="100" cy="100" r="68" fill="none" stroke="#C8A84E" strokeWidth="1" opacity="0.6"/>
    {/* Bridge icon */}
    <path d="M60 120 L60 85 Q60 75 70 75 L80 75 L80 120 M120 120 L120 85 Q120 75 130 75 L140 75 L140 120" stroke="#C8A84E" strokeWidth="2.5" fill="none"/>
    <path d="M70 120 L130 120" stroke="#C8A84E" strokeWidth="2"/>
    <path d="M60 120 L55 130 M140 120 L145 130" stroke="#C8A84E" strokeWidth="2"/>
    {/* Water waves */}
    <path d="M55 125 Q65 118 75 125 Q85 132 95 125 Q105 118 115 125 Q125 132 135 125 Q145 118 145 125" stroke="#C8A84E" strokeWidth="1" fill="none" opacity="0.5"/>
    {/* Center star */}
    <polygon points="100,38 104,50 117,50 107,58 110,70 100,62 90,70 93,58 83,50 96,50" fill="#C8A84E"/>
    {/* Text on outer ring - top */}
    <text x="100" y="22" textAnchor="middle" fill="#C8A84E" fontSize="11" fontFamily="serif" fontWeight="700" letterSpacing="2">CITY OF ASHTABULA</text>
    {/* Text on outer ring - bottom */}
    <text x="100" y="185" textAnchor="middle" fill="#C8A84E" fontSize="8" fontFamily="serif" fontWeight="600" letterSpacing="1.5">EST. 1891</text>
    {/* Gear teeth on inner ring */}
    <g stroke="#C8A84E" strokeWidth="1" opacity="0.4">
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(angle => (
        <line key={angle} x1={100 + 80 * Math.cos(angle * Math.PI / 180)} y1={100 + 80 * Math.sin(angle * Math.PI / 180)} x2={100 + 75 * Math.cos(angle * Math.PI / 180)} y2={100 + 75 * Math.sin(angle * Math.PI / 180)}/>
      ))}
    </g>
  </svg>
);

function App() {
  const [brief, setBrief] = useState("Structural review for 10k sq ft warehouse");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [apiConfigured, setApiConfigured] = useState(false);

  useEffect(() => {
    setApiConfigured(isOpenRouterConfigured());
  }, []);

  const analyze = async () => {
    if (!apiConfigured) { setError("API key not configured. Contact the Engineering Division for access."); return; }
    setLoading(true); setError(""); setSummary("");
    try {
      const text = await callOpenRouterAPI({
        prompt: `You are the City of Ashtabula Engineering Division. Summarize key engineering considerations for: ${brief}. Provide 3 professional bullet points and a recommended next step. 90 words max.`,
        system: "You are a municipal engineering assistant for the City of Ashtabula. Respond in a clear, professional, public-service tone. Use 'we' for the Engineering Division.",
        model: "google/gemini-2.5-flash-lite"
      });
      setSummary(text);
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  };

  return (
    <div className="page">
      {/* Hero Section */}
      <section className="hero" style={{ '--hero-image': 'url(/hero.webp)' }}>
        <div className="hero-overlay" />
        <div className="hero-grid" aria-hidden="true" />
        
        <header className="header">
          <div className="logo">
            <CitySeal size={48} />
            <div className="logo-text">
              <span className="logo-title">City of Ashtabula Engineering Division</span>
              <span className="logo-subtitle">Building a Better Ashtabula</span>
            </div>
          </div>
        </header>

        <div className="hero-content">
          <div className="jurisdiction-badges">
            <span className="jurisdiction-badge">City</span>
            <span className="jurisdiction-badge">County</span>
            <span className="jurisdiction-badge">Zoning</span>
          </div>
          <h1>Fast technical summaries for residents &amp; contractors</h1>
          <p className="hero-subtitle">
            AI‑powered engineering insights that communicate complexity with clarity.
          </p>
          <div className="trust-badges">
            <div className="badge badge-glass">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              AI‑Powered Guidance
            </div>
            <div className="badge badge-glass">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              Fast Response
            </div>
            <div className="badge badge-glass">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Clear Guidance
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="content">
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
              <button className="secondary" onClick={() => window.location.href = "tel:4409927132"}>Call Engineering Division</button>
            </div>
          </div>

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
              <h3>Engineering Analysis</h3>
              <span className="version-badge">AI Guidance</span>
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
                <p>Enter your project brief and click "Generate Summary" to receive AI-powered guidance from the Engineering Division.</p>
              </div>
            )}
          </div>
        </div>

        <div className="features">
          <div className="feature" style={{'--accent-color': 'var(--signal-blue)'}}>
            <div className="feature-num">01</div>
            <h4>Permit Clarity</h4>
            <p>We help you understand which permits apply to your project and how to navigate city requirements.</p>
          </div>
          <div className="feature" style={{'--accent-color': 'var(--signal-blue)'}}>
            <div className="feature-num">02</div>
            <h4>Faster Reviews</h4>
            <p>Reduce back‑and‑forth with stakeholders and approval boards using clear, structured summaries.</p>
          </div>
          <div className="feature" style={{'--accent-color': 'var(--teal)'}}>
            <div className="feature-num">03</div>
            <h4>Infrastructure Guidance</h4>
            <p>From driveways to drainage, we provide next steps to move your project from plan to execution.</p>
          </div>
        </div>

        <div className="disclaimer">
          <p><strong>Disclaimer:</strong> This AI-powered guidance is provided as a courtesy by the City of Ashtabula Engineering Division. It is not a substitute for official engineering review or legal advice. Always consult with a licensed engineer for your specific project.</p>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-line" />
        <div className="footer-content">
          <CitySeal size={32} />
          <div className="footer-text">
            <p className="footer-name">City of Ashtabula Engineering Division</p>
            <p className="footer-address">123 W 44th St, Ashtabula, OH 44004 | (440) 992-7132</p>
            <p className="footer-hours">Mon-Fri 7:30 AM - 4:00 PM</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
