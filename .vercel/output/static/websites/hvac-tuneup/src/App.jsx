import { useState } from "react";
import { callGeminiAPI, extractResponseText } from "./api-client.js";
import "./App.css";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Thermometer/HVAC logo
const LogoIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="6" width="8" height="28" rx="4" fill="#e8f4f8" stroke="#487eb0" strokeWidth="2"/>
    <circle cx="24" cy="38" r="8" fill="#e67e22" stroke="#d35400" strokeWidth="2"/>
    <rect x="22" y="20" width="4" height="12" rx="2" fill="#e67e22"/>
    <path d="M32 12h8M32 18h6M32 24h8" stroke="#487eb0" strokeWidth="2" strokeLinecap="round"/>
    <path d="M8 12h8M10 18h6M8 24h8" stroke="#487eb0" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Gear pattern
const GearPattern = () => (
  <svg className="gear-pattern" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <g opacity="0.06">
      <circle cx="30" cy="30" r="15" fill="none" stroke="#487eb0" strokeWidth="2"/>
      <path d="M30 10v6M30 44v6M10 30h6M44 30h6M16 16l4 4M40 40l4 4M16 44l4-4M40 16l4-4" stroke="#487eb0" strokeWidth="2"/>
      <circle cx="100" cy="60" r="20" fill="none" stroke="#e67e22" strokeWidth="2"/>
      <path d="M100 35v8M100 77v8M75 60h8M117 60h8M83 43l5 5M112 72l5 5M83 77l5-5M112 48l5-5" stroke="#e67e22" strokeWidth="2"/>
      <circle cx="170" cy="40" r="12" fill="none" stroke="#487eb0" strokeWidth="2"/>
      <path d="M170 24v5M170 51v5M154 40h5M181 40h5" stroke="#487eb0" strokeWidth="2"/>
      <circle cx="50" cy="120" r="18" fill="none" stroke="#e67e22" strokeWidth="2"/>
      <path d="M50 97v7M50 137v7M27 120h7M67 120h7" stroke="#e67e22" strokeWidth="2"/>
      <circle cx="150" cy="140" r="22" fill="none" stroke="#487eb0" strokeWidth="2"/>
      <path d="M150 113v9M150 158v9M123 140h9M168 140h9" stroke="#487eb0" strokeWidth="2"/>
    </g>
  </svg>
);

function App() {
  const [date, setDate] = useState("");
  const [service, setService] = useState("Furnace");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const services = ["Furnace", "AC", "Heat Pump", "Boiler", "Ductwork"];

  const confirm = async () => {
    setLoading(true); setError(""); setSummary("");
    try {
      const prompt = `Write a concise HVAC tune-up confirmation for ${service} on ${date || 'the scheduled date'}. Include one preventive maintenance tip and an upsell for filter package. 70 words max.`;
      const data = await callGeminiAPI(prompt);
      const text = extractResponseText(data);
      setSummary(text);
    } catch (e) { setError(e.message || "Failed to generate."); } finally { setLoading(false); }
  };

  return (
    <div className="page">
      <div className="bg-gears" aria-hidden="true">
        <GearPattern />
      </div>

      <header className="header">
        <div className="logo">
          <LogoIcon />
          <div className="logo-text">
            <span className="logo-title">HVAC Tune‑Up</span>
            <span className="logo-subtitle">Scheduler</span>
          </div>
        </div>
      </header>

      <main className="content">
        <div className="hero">
          <h1>Book more tune‑ups with smart confirmations</h1>
          <p className="sub">AI-powered service confirmations with maintenance tips and upsell suggestions.</p>
        </div>

        <div className="booking-card">
          <div className="form-section">
            <div className="form-group">
              <label>Service Type</label>
              <div className="service-grid">
                {services.map(s => (
                  <button
                    key={s}
                    className={`service-btn ${service === s ? 'active' : ''}`}
                    onClick={() => setService(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Preferred Date</label>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <button className="confirm-btn" onClick={confirm} disabled={loading}>
            {loading ? 'Generating Confirmation...' : 'Generate Confirmation →'}
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {summary && (
          <div className="confirmation-card">
            <div className="conf-header">
              <div className="conf-icon">✓</div>
              <h3>Service Confirmation</h3>
              <span className="service-tag">{service}</span>
            </div>            
            <div className="conf-content">
              <pre>{summary}</pre>
            </div>            
            <div className="conf-actions">
              <button className="btn-secondary">📧 Email to Customer</button>
              <button className="btn-primary">📅 Add to Calendar</button>
            </div>
          </div>
        )}

        <div className="features">
          <div className="feature">
            <div className="feature-icon">🔧</div>
            <h4>Professional</h4>
            <p>Polished, consistent messaging</p>
          </div>
          <div className="feature">
            <div className="feature-icon">💡</div>
            <h4>Smart Tips</h4>
            <p>Helpful maintenance advice</p>
          </div>
          <div className="feature">
            <div className="feature-icon">💰</div>
            <h4>Upsells</h4>
            <p>Natural add-on suggestions</p>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-accent">
          <svg viewBox="0 0 100 10" preserveAspectRatio="none">
            <path d="M0 5 Q25 0 50 5 T100 5" fill="none" stroke="#e67e22" strokeWidth="2"/>
          </svg>
        </div>
        <p>HVAC Professionals • Ashtabula County, OH</p>
      </footer>
    </div>
  );
}

export default App;