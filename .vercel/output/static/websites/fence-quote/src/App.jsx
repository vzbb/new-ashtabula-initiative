import { useState, useEffect } from "react";
import { callGeminiAPI, extractResponseText } from "./api-client.js";
import "./App.css";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const geminiService = {
  async generateContent(prompt) {
    if (!apiKey || apiKey === 'undefined') throw new Error("API key not configured.");
      const data = await callGeminiAPI(prompt);
      const text = extractResponseText(data);
    return text;
  }
};

// Fence/picket logo
const LogoIcon = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="12" width="4" height="28" rx="1" fill="#8b5a2b"/>
    <rect x="20" y="12" width="4" height="28" rx="1" fill="#8b5a2b"/>
    <rect x="32" y="12" width="4" height="28" rx="1" fill="#8b5a2b"/>
    <rect x="40" y="12" width="4" height="28" rx="1" fill="#8b5a2b"/>
    <rect x="6" y="18" width="40" height="3" rx="1" fill="#6d4c41"/>
    <rect x="6" y="32" width="40" height="3" rx="1" fill="#6d4c41"/>
    <path d="M10 12l-2-4h4l-2 4zM22 12l-2-4h4l-2 4zM34 12l-2-4h4l-2 4zM42 12l-2-4h4l-2 4z" fill="#5d4037"/>
    <circle cx="26" cy="6" r="4" fill="#87ceeb"/>
  </svg>
);

// Property line pattern
const FencePattern = () => (
  <svg className="fence-pattern" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g opacity="0.06">
      <path d="M0 30h100M0 50h100M0 70h100" stroke="#8b5a2b" strokeWidth="1" strokeDasharray="5 5"/>
      <rect x="10" y="10" width="3" height="30" fill="#8b5a2b"/>
      <rect x="30" y="10" width="3" height="30" fill="#8b5a2b"/>
      <rect x="50" y="10" width="3" height="30" fill="#8b5a2b"/>
      <rect x="70" y="10" width="3" height="30" fill="#8b5a2b"/>
      <rect x="90" y="10" width="3" height="30" fill="#8b5a2b"/>
      <rect x="20" y="60" width="3" height="30" fill="#8b5a2b"/>
      <rect x="40" y="60" width="3" height="30" fill="#8b5a2b"/>
      <rect x="60" y="60" width="3" height="30" fill="#8b5a2b"/>
      <rect x="80" y="60" width="3" height="30" fill="#8b5a2b"/>
    </g>
  </svg>
);

function App() {
  const [linearFeet, setLinearFeet] = useState(100);
  const [material, setMaterial] = useState("cedar");
  const [height, setHeight] = useState("6ft");
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const materials = [
    { id: "cedar", label: "Cedar", price: "$" },
    { id: "vinyl", label: "Vinyl", price: "$$" },
    { id: "aluminum", label: "Aluminum", price: "$$$" },
    { id: "chainlink", label: "Chain Link", price: "$" }
  ];

  const heights = ["4ft", "6ft", "8ft"];

  const getQuote = async () => {
    setLoading(true); setError(""); setQuote("");
    try {
      const prompt = `Generate a brief fence quote summary for ${linearFeet} linear feet of ${height} ${material} fence. Include estimated price range, timeline, and a CTA to schedule consultation. 80 words max.`;
      const text = await geminiService.generateContent(prompt);
      setQuote(text);
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  };

  return (
    <div className="page">
      <div className="bg-fence" aria-hidden="true">
        <FencePattern />
      </div>

      <header className="header">
        <div className="logo">
          <LogoIcon />
          <div className="logo-text">
            <span className="logo-title">FenceQuote</span>
            <span className="logo-subtitle">Instant Estimates</span>
          </div>
        </div>
      </header>

      <main className="content">
        <div className="hero">
          <h1>Get your fence quote in minutes</h1>
          <p className="sub">AI-powered estimates for property owners in Ashtabula County. Know your costs before you commit.</p>
        </div>

        <div className="quote-card">
          <div className="card-section">
            <div className="section-title">
              <span className="section-icon">📏</span>
              <h3>Project Size</h3>
            </div>            
            <div className="slider-wrap">
              <input 
                type="range" 
                min="20" 
                max="500" 
                step="10" 
                value={linearFeet}
                onChange={(e) => setLinearFeet(Number(e.target.value))}
              />
              <div className="slider-value">{linearFeet} linear feet</div>
            </div>
          </div>

          <div className="card-section">
            <div className="section-title">
              <span className="section-icon">🌲</span>
              <h3>Material</h3>
            </div>
            <div className="material-grid">
              {materials.map(m => (
                <button
                  key={m.id}
                  className={`material-btn ${material === m.id ? 'active' : ''}`}
                  onClick={() => setMaterial(m.id)}
                >
                  <span className="material-name">{m.label}</span>
                  <span className="material-price">{m.price}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="card-section">
            <div className="section-title">
              <span className="section-icon">📐</span>
              <h3>Height</h3>
            </div>
            <div className="height-buttons">
              {heights.map(h => (
                <button
                  key={h}
                  className={`height-btn ${height === h ? 'active' : ''}`}
                  onClick={() => setHeight(h)}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>

          <div className="generate-wrap">
            <button className="quote-btn" onClick={getQuote} disabled={loading}>
              {loading ? 'Calculating...' : 'Get Instant Quote →'}
            </button>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {quote && (
          <div className="result-card">
            <div className="result-header">
              <div className="result-icon">📋</div>
              <h3>Your Fence Estimate</h3>
            </div>            
            <div className="result-body">
              <pre>{quote}</pre>
            </div>            
            <div className="result-actions">
              <button className="btn-outline">Email Quote</button>
              <button className="btn-solid">Schedule Consultation</button>
            </div>
          </div>
        )}

        <div className="features">
          <div className="feature">
            <div className="feature-icon">⚡</div>
            <h4>Instant Pricing</h4>
            <p>No waiting for callbacks</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🎯</div>
            <h4>Local Rates</h4>
            <p>Ashtabula County pricing</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🔒</div>
            <h4>No Commitment</h4>
            <p>Free estimates, always</p>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-line" />
        <p>Ashtabula County • Professional Fencing Estimates</p>
      </footer>
    </div>
  );
}

export default App;