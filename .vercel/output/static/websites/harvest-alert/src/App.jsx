import { useState } from "react";
import { callGeminiAPI, extractResponseText } from "./api-client.js";
import "./App.css";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Ashtabula County Seal Logo SVG
const CountySealLogo = () => (
  <svg width="48" height="48" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* Outer Blue Ring */}
    <circle cx="50" cy="50" r="48" fill="#003f87" />
    <circle cx="50" cy="50" r="44" fill="none" stroke="#ffd700" strokeWidth="2" />
    <circle cx="50" cy="50" r="40" fill="#f8f6f0" />
    
    {/* Gold Text Ring */}
    <path id="textCurve" d="M 15,50 A 35,35 0 0,1 85,50" fill="none" />
    <text fill="#003f87" fontSize="7" fontWeight="bold" fontFamily="Open Sans, sans-serif">
      <textPath href="#textCurve" startOffset="50%" textAnchor="middle">
        ASHTABULA COUNTY
      </textPath>
    </text>
    
    {/* Inner Circle */}
    <circle cx="50" cy="50" r="28" fill="none" stroke="#ffd700" strokeWidth="1.5" />
    
    {/* Lighthouse */}
    <g transform="translate(50, 38)">
      <path d="M-4 18 L-2 -8 L2 -8 L4 18 Z" fill="#003f87" />
      <path d="M-2 -8 L-5 -12 L-2 -10 Z" fill="#ffd700" />
      <path d="M2 -8 L5 -12 L2 -10 Z" fill="#ffd700" />
      <rect x="-3" y="-10" width="6" height="3" fill="#003f87" />
      <circle cx="0" cy="-8" r="1.5" fill="#ffd700" />
    </g>
    
    {/* Covered Bridge */}
    <g transform="translate(50, 55)">
      <path d="M-18 12 Q0 -5 18 12" fill="none" stroke="#8b4513" strokeWidth="3" />
      <path d="M-18 12 L-18 16 L18 16 L18 12" fill="#8b4513" />
      <rect x="-20" y="8" width="4" height="10" fill="#654321" />
      <rect x="16" y="8" width="4" height="10" fill="#654321" />
      <path d="M-20 8 L0 -2 L20 8" fill="#8b4513" />
    </g>
    
    {/* Wheat Stalks */}
    <g transform="translate(28, 65)" opacity="0.8">
      <path d="M0 0 Q2 -8 0 -15" stroke="#27ae60" strokeWidth="1.5" fill="none" />
      <ellipse cx="-2" cy="-8" rx="2" ry="4" fill="#ffd700" />
      <ellipse cx="2" cy="-5" rx="2" ry="4" fill="#ffd700" />
      <ellipse cx="0" cy="-12" rx="1.5" ry="3" fill="#ffd700" />
    </g>
    <g transform="translate(72, 65)" opacity="0.8">
      <path d="M0 0 Q-2 -8 0 -15" stroke="#27ae60" strokeWidth="1.5" fill="none" />
      <ellipse cx="2" cy="-8" rx="2" ry="4" fill="#ffd700" />
      <ellipse cx="-2" cy="-5" rx="2" ry="4" fill="#ffd700" />
      <ellipse cx="0" cy="-12" rx="1.5" ry="3" fill="#ffd700" />
    </g>
    
    {/* Lake Erie Wave */}
    <path d="M25 78 Q35 75 45 78 T65 78 T75 78" fill="none" stroke="#003f87" strokeWidth="1.5" opacity="0.5" />
    <circle cx="50" cy="50" r="2" fill="#ffd700" />
  </svg>
);

const crops = ["Corn", "Soybeans", "Wheat", "Apples", "Pumpkins"];

function App() {
  const [crop, setCrop] = useState("Corn");
  const [alert, setAlert] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    setLoading(true); setError(""); setAlert("");
    try {
      const prompt = `Write a short harvest alert for ${crop} in Ashtabula County. Include timing and a CTA to schedule pickup. 70 words max.`;
      const data = await callGeminiAPI(prompt);
      const text = extractResponseText(data);
      setAlert(text);
    } catch (e) { setError(e.message || "Failed to generate."); } finally { setLoading(false); }
  };

  return (
    <div className="page">
      <div className="bg-grain" aria-hidden="true" />

      <header className="header">
        <div className="logo">
          <CountySealLogo />
          <div className="logo-text">
            <span className="logo-title">Agricultural Services</span>
            <span className="logo-subtitle">Harvest Alert System</span>
          </div>
        </div>
        <div className="official-badge">Official</div>
      </header>

      <main className="content">
        <div className="hero">
          <h1>Notify Buyers at Peak Freshness</h1>
          <p className="sub">AI-powered harvest alerts with pickup CTAs for Ashtabula County farmers.</p>
        </div>

        <div className="alert-card">
          <div className="crop-section">
            <label>Select Crop</label>
            <div className="crop-grid">
              {crops.map(c => (
                <button key={c} className={crop === c ? 'active' : ''} onClick={() => setCrop(c)}>{c}</button>
              ))}
            </div>
          </div>

          <button className="generate-btn" onClick={generate} disabled={loading}>
            {loading ? 'Generating Alert...' : '🌾 Generate Harvest Alert'}
          </button>
        </div>

        {error && <div className="alert-error">{error}</div>}

        {alert && (
          <div className="result-card">
            <div className="result-header">
              <span>📢</span>
              <h3>Harvest Alert</h3>
              <span className="crop-tag">{crop}</span>
            </div>            
            <div className="result-body">
              <pre>{alert}</pre>
            </div>            
            <div className="result-actions">
              <button className="btn-secondary">📋 Copy</button>
              <button className="btn-primary">📧 Send to Buyers</button>
            </div>
          </div>
        )}

        <div className="features">
          <div className="feature">
            <span>💰</span>
            <h4>More Sales</h4>
            <p>Reach buyers fast</p>
          </div>
          <div className="feature">
            <span>🌱</span>
            <h4>Less Waste</h4>
            <p>Move product quickly</p>
          </div>
          <div className="feature">
            <span>⚡</span>
            <h4>Simple Ops</h4>
            <p>One-click alerts</p>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p className="county-name">Ashtabula County Agricultural Services</p>
        <p>© 2026 Ashtabula County Board of Commissioners</p>
      </footer>
    </div>
  );
}

export default App;
