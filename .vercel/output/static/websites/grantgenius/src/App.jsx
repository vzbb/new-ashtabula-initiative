import { useState } from "react";
import { callGeminiAPI, extractResponseText } from "./api-client.js";
import "./App.css";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Graduation cap/achievement logo
const LogoIcon = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M26 4L4 18l22 14 22-14L26 4z" fill="#1e3a5f"/>
    <path d="M8 22v14l18 10 18-10V22" stroke="#1e3a5f" strokeWidth="3" fill="none"/>
    <circle cx="26" cy="36" r="4" fill="#f59e0b"/>
    <path d="M38 12l6-4v12" stroke="#1e3a5f" strokeWidth="2" fill="none"/>
    <circle cx="44" cy="8" r="3" fill="#f59e0b"/>
  </svg>
);

// Success/confetti pattern
const SuccessPattern = () => (
  <svg className="success-pattern" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <g opacity="0.08">
      <star points="20,20 22,26 28,26 23,30 25,36 20,32 15,36 17,30 12,26 18,26" fill="#f59e0b"/>
      <rect x="40" y="40" width="4" height="4" fill="#1e3a5f" transform="rotate(45 42 42)"/>
      <rect x="80" y="20" width="4" height="4" fill="#f59e0b" transform="rotate(45 82 22)"/>
      <rect x="140" y="60" width="4" height="4" fill="#1e3a5f" transform="rotate(45 142 62)"/>
      <rect x="30" y="100" width="4" height="4" fill="#f59e0b" transform="rotate(45 32 102)"/>
      <rect x="160" y="120" width="4" height="4" fill="#1e3a5f" transform="rotate(45 162 122)"/>
      <rect x="60" y="160" width="4" height="4" fill="#f59e0b" transform="rotate(45 62 162)"/>
      <polygon points="170,30 172,36 178,36 173,40 175,46 170,42 165,46 167,40 162,36 168,36" fill="#f59e0b"/>
      <polygon points="100,80 102,86 108,86 103,90 105,96 100,92 95,96 97,90 92,86 98,86" fill="#1e3a5f"/>
      <polygon points="50,140 52,146 58,146 53,150 55,156 50,152 45,156 47,150 42,146 48,146" fill="#f59e0b"/>
    </g>
  </svg>
);

function App() {
  const [url, setUrl] = useState("");
  const [mission, setMission] = useState("");
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");

  const generate = async () => {
    setLoading(true); setError(""); setDraft("");
    try {
      const prompt = `You are a grant writer. Create a concise draft outline with 5 sections (Need, Goals, Approach, Budget Rationale, Impact) for this grant: ${url}. Organization mission: ${mission}. Keep it under 200 words.`;
      const data = await callGeminiAPI(prompt);
      const text = extractResponseText(data);
      setDraft(text);
    } catch (e) { setError(e.message || "Failed to generate."); } finally { setLoading(false); }
  };

  return (
    <div className="page">
      <div className="bg-success" aria-hidden="true">
        <SuccessPattern />
      </div>

      <header className="header">
        <div className="logo">
          <LogoIcon />
          <div className="logo-text">
            <span className="logo-title">Grant</span>
            <span className="logo-subtitle">Genius</span>
          </div>
        </div>
        <div className="tagline">AI Grant Writing Assistant</div>
      </header>

      <main className="content">
        <div className="hero">
          <h1>Win more grants with AI‑assisted narratives</h1>
          <p className="sub">Paste a grant URL, add your mission, and get a clean, funder‑ready outline in minutes.</p>
        </div>

        <div className="input-card">
          <div className="form-group">
            <label>
              <span className="label-icon">🔗</span>
              Grant URL
            </label>
            <input 
              type="url" 
              value={url} 
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="form-group">
            <label>
              <span className="label-icon">🎯</span>
              Your Mission
            </label>
            <textarea 
              value={mission} 
              onChange={(e) => setMission(e.target.value)}
              placeholder="Briefly describe your organization's mission..."
              rows={3}
            />
          </div>

          <button 
            className="generate-btn" 
            onClick={generate} 
            disabled={loading || !url}
          >
            {loading ? 'Crafting Your Draft...' : '✨ Generate Draft Outline'}
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {draft && (
          <div className="draft-card">
            <div className="draft-header">
              <div className="draft-icon">📝</div>
              <h3>Your Grant Draft Outline</h3>
              <span className="ai-badge">AI Generated</span>
            </div>            
            <div className="draft-content">
              <pre>{draft}</pre>
            </div>            
            <div className="draft-actions">
              <button className="btn-outline">📋 Copy</button>
              <button className="btn-outline">💾 Save</button>
              <button className="btn-primary">✏️ Edit in Docs</button>
            </div>
          </div>
        )}

        <div className="features">
          <div className="feature">
            <div className="feature-num">5</div>
            <h4>Key Sections</h4>
            <p>Need, Goals, Approach, Budget, Impact</p>
          </div>
          <div className="feature">
            <div className="feature-num">200</div>
            <h4>Words Max</h4>
            <p>Concise, funder-ready format</p>
          </div>
          <div className="feature">
            <div className="feature-num">⚡</div>
            <h4>Fast Draft</h4>
            <p>Minutes, not hours</p>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-star">⭐</div>
        <p>Helping nonprofits secure funding • New Ashtabula Initiative</p>
      </footer>
    </div>
  );
}

export default App;