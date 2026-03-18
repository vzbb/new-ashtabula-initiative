import { useState } from "react";
import { callGeminiAPI, extractResponseText } from "./api-client.js";
import "./App.css";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Dirt/materials logo
const LogoIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 40l8-24 8 16 8-12 8 20H8z" fill="#8b4513" stroke="#654321" strokeWidth="2"/>
    <circle cx="16" cy="16" r="6" fill="#6b4423"/>
    <circle cx="32" cy="20" r="5" fill="#5d4037"/>
    <rect x="4" y="38" width="40" height="6" rx="2" fill="#4a7c59"/>
    <path d="M10 38v-5M20 38v-8M30 38v-6M38 38v-4" stroke="#4a7c59" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Construction/dirt pattern
const DirtPattern = () => (
  <svg className="dirt-pattern" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <g opacity="0.08">
      <circle cx="30" cy="30" r="8" fill="#8b4513"/>
      <circle cx="70" cy="50" r="6" fill="#6b4423"/>
      <circle cx="120" cy="25" r="10" fill="#5d4037"/>
      <circle cx="170" cy="45" r="7" fill="#8b4513"/>
      <circle cx="25" cy="90" r="9" fill="#6b4423"/>
      <circle cx="80" cy="110" r="8" fill="#5d4037"/>
      <circle cx="140" cy="95" r="6" fill="#8b4513"/>
      <circle cx="180" cy="120" r="8" fill="#6b4423"/>
      <circle cx="40" cy="160" r="7" fill="#5d4037"/>
      <circle cx="100" cy="170" r="9" fill="#8b4513"/>
      <circle cx="160" cy="165" r="8" fill="#6b4423"/>
    </g>
  </svg>
);

function App() {
  const [yards, setYards] = useState(5);
  const [type, setType] = useState("Topsoil");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const types = ["Topsoil", "Fill Dirt", "Mulch", "Gravel", "Sand"];

  const getQuote = async () => {
    setLoading(true); setError(""); setSummary("");
    try {
      const prompt = `Write a short material quote summary for ${yards} cubic yards of ${type}. Include price range and delivery window. 60 words max.`;
      const data = await callGeminiAPI(prompt);
      const text = extractResponseText(data);
      setSummary(text);
    } catch (e) { setError(e.message || "Failed to generate."); } finally { setLoading(false); }
  };

  return (
    <div className="page">
      <div className="bg-dirt" aria-hidden="true">
        <DirtPattern />
      </div>

      <header className="header">
        <div className="logo">
          <LogoIcon />
          <div className="logo-text">
            <span className="logo-title">Instant Dirt</span>
            <span className="logo-subtitle">Quote</span>
          </div>
        </div>
      </header>

      <main className="content">
        <div className="hero">
          <h1>Fast material quotes that close jobs</h1>
          <p className="sub">AI-powered summaries with delivery windows for Ashtabula County contractors.</p>
        </div>

        <div className="quote-card">
          <div className="form-section">
            <div className="form-group">
              <label>Material Type</label>
              <div className="type-grid">
                {types.map(t => (
                  <button key={t} className={type === t ? 'active' : ''} onClick={() => setType(t)}>{t}</button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Quantity: {yards} cubic yards</label>
              <input 
                type="range" 
                min="1" 
                max="50" 
                value={yards}
                onChange={(e) => setYards(Number(e.target.value))}
              />
              <div className="range-labels">
                <span>1</span>
                <span>25</span>
                <span>50</span>
              </div>
            </div>
          </div>

          <button className="quote-btn" onClick={getQuote} disabled={loading}>
            {loading ? 'Calculating...' : '📋 Get Quote'}
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {summary && (
          <div className="result-card">
            <div className="result-header">
              <span>🚛</span>
              <h3>Your Quote Summary</h3>
              <span className="yards-tag">{yards} yd³</span>
            </div>            
            <div className="result-body">
              <pre>{summary}</pre>
            </div>            
            <div className="result-actions">
              <button className="btn-secondary">📤 Send Quote</button>
              <button className="btn-primary">✓ Confirm Order</button>
            </div>
          </div>
        )}

        <div className="features">
          <div className="feature">
            <span>⏱️</span>
            <h4>Fast</h4>
            <p>Quotes in seconds</p>
          </div>
          <div className="feature">
            <span>💵</span>
            <h4>Accurate</h4>
            <p>Local pricing</p>
          </div>
          <div className="feature">
            <span>🚚</span>
            <h4>Delivery</h4>
            <p>Real timelines</p>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>Construction Suppliers • Ashtabula County, OH</p>
      </footer>
    </div>
  );
}

export default App;