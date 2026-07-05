import { useState } from "react";
import { callGeminiAPI, extractResponseText } from "./api-client.js";
import "./App.css";

const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

// Simple barn-inspired logo SVG for the farmers market
const FarmLogo = () => (
  <svg width="48" height="48" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* Warm cream circle background */}
    <circle cx="50" cy="50" r="48" fill="#FDF8F0" />
    <circle cx="50" cy="50" r="44" fill="none" stroke="#1B5E20" strokeWidth="2.5" />
    
    {/* Barn silhouette */}
    <g transform="translate(50, 44)">
      <path d="M-24 18 L0 -16 L24 18" fill="#8B2E1A" />
      <rect x="-18" y="4" width="36" height="22" fill="#8B2E1A" />
      <rect x="-6" y="10" width="12" height="16" fill="#C75B3A" rx="1" />
      <line x1="0" y1="-16" x2="0" y2="-20" stroke="#FFC107" strokeWidth="2" />
      <circle cx="0" cy="-22" r="3" fill="#FFC107" />
    </g>
    
    {/* Wheat stalks left */}
    <g transform="translate(22, 62)" opacity="0.8">
      <path d="M0 0 Q-2 -10 0 -18" stroke="#1B5E20" strokeWidth="1.5" fill="none" />
      <ellipse cx="-2" cy="-10" rx="2.5" ry="5" fill="#FFC107" />
      <ellipse cx="2" cy="-6" rx="2.5" ry="5" fill="#FFC107" />
    </g>
    
    {/* Wheat stalks right */}
    <g transform="translate(78, 62)" opacity="0.8">
      <path d="M0 0 Q2 -10 0 -18" stroke="#1B5E20" strokeWidth="1.5" fill="none" />
      <ellipse cx="2" cy="-10" rx="2.5" ry="5" fill="#FFC107" />
      <ellipse cx="-2" cy="-6" rx="2.5" ry="5" fill="#FFC107" />
    </g>
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
      {/* Hero Background */}
      <div className="hero-bg" aria-hidden="true">
        <picture>
          <source srcSet="/harvest/hero.webp" type="image/webp" />
          <img src="/harvest/hero.jpg" alt="" className="hero-image" />
        </picture>
        <div className="hero-overlay" />
      </div>

      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <FarmLogo />
            <div className="logo-text">
              <span className="logo-title">Ashtabula Farmers Market</span>
              <span className="logo-subtitle">Harvest Alert System</span>
            </div>
          </div>
          <div className="farmers-market-badge">
            <img src="/harvest/badge-icon.svg" alt="" className="badge-icon" />
            ASHTABULA COUNTY APPROVED
          </div>
        </div>
      </header>

      <main className="content">
        {/* Hero Section */}
        <div className="hero">
          <h1>Fresh From the Farm to Your Table</h1>
          <p className="sub">AI-powered harvest alerts with pickup CTAs for Ashtabula County growers. Notify buyers at peak freshness.</p>
        </div>

        {/* Alert Card with Glassmorphism */}
        <div className="alert-card">
          <div className="crop-section">
            <label>Select Your Crop</label>
            <div className="crop-grid">
              {crops.map(c => (
                <button 
                  key={c} 
                  className={`crop-btn ${crop === c ? 'active' : ''}`} 
                  onClick={() => setCrop(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <button className="generate-btn" onClick={generate} disabled={loading}>
            {loading ? (
              <span className="btn-loading">
                <span className="spinner" />
                Generating Alert...
              </span>
            ) : '🌾 Generate Harvest Alert'}
          </button>
        </div>

        {error && <div className="alert-error">{error}</div>}

        {alert && (
          <div className="result-card">
            <div className="result-header">
              <span className="result-icon">📢</span>
              <h3>Harvest Alert</h3>
              <span className="crop-tag">{crop}</span>
            </div>            
            <div className="result-body">
              <pre>{alert}</pre>
            </div>            
            <div className="result-actions">
              <button className="btn-secondary" onClick={() => navigator.clipboard?.writeText(alert)}>📋 Copy</button>
              <button className="btn-primary">📧 Send to Buyers</button>
            </div>
          </div>
        )}

        {/* Feature Cards with Glassmorphism */}
        <div className="features">
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h4>More Sales</h4>
            <p>Reach buyers fast when your crop is at its peak.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌱</div>
            <h4>Less Waste</h4>
            <p>Move product quickly with timely harvest alerts.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h4>Simple Ops</h4>
            <p>One-click alerts that connect growers with buyers.</p>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-divider" />
        <p className="county-name">Ashtabula Farmers Market</p>
        <p>Ashtabula County Board of Commissioners</p>
        <p className="footer-year">© 2026 Ashtabula County, OH</p>
      </footer>
    </div>
  );
}

export default App;
