import { useState } from "react";
import { callGeminiAPI, extractResponseText } from "./api-client.js";
import "./App.css";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Wrench/tools logo
const LogoIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 14c0-5.5 4.5-10 10-10 2.5 0 4.8.9 6.6 2.4l-4.6 4.6 2.8 2.8 4.6-4.6c1.5 1.8 2.4 4.1 2.4 6.6 0 5.5-4.5 10-10 10-1.8 0-3.5-.5-5-1.3L14 38l-4-4 6.8-10.7c-.8-1.5-1.3-3.2-1.3-5z" fill="#e67e22" stroke="#d35400" strokeWidth="2"/>
    <circle cx="36" cy="36" r="8" fill="#34495e"/>
    <rect x="34" y="30" width="4" height="12" rx="1" fill="#ecf0f1"/>
    <rect x="30" y="34" width="12" height="4" rx="1" fill="#ecf0f1"/>
  </svg>
);

// Tools pattern
const ToolsPattern = () => (
  <svg className="tools-pattern" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <g opacity="0.06">
      <rect x="20" y="20" width="4" height="20" fill="#34495e" transform="rotate(45 22 30)"/>
      <rect x="60" y="10" width="4" height="20" fill="#e67e22" transform="rotate(-30 62 20)"/>
      <rect x="100" y="25" width="4" height="20" fill="#34495e" transform="rotate(15 102 35)"/>
      <rect x="150" y="15" width="4" height="20" fill="#e67e22" transform="rotate(-45 152 25)"/>
      <rect x="30" y="80" width="4" height="20" fill="#e67e22" transform="rotate(60 32 90)"/>
      <rect x="80" y="70" width="4" height="20" fill="#34495e" transform="rotate(-15 82 80)"/>
      <rect x="130" y="85" width="4" height="20" fill="#e67e22" transform="rotate(30 132 95)"/>
      <rect x="170" y="75" width="4" height="20" fill="#34495e" transform="rotate(-60 172 85)"/>
      <circle cx="40" cy="140" r="8" fill="#34495e"/>
      <circle cx="90" cy="155" r="8" fill="#e67e22"/>
      <circle cx="145" cy="145" r="8" fill="#34495e"/>
      <circle cx="180" cy="170" r="8" fill="#e67e22"/>
    </g>
  </svg>
);

function App() {
  const [unit, setUnit] = useState("A‑3");
  const [issue, setIssue] = useState("Leaky faucet");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const create = async () => {
    setLoading(true); setError(""); setReply("");
    try {
      const prompt = `Write a concise maintenance ticket confirmation for unit ${unit} with issue ${issue}. Include expected response window and emergency guidance. 70 words max.`;
      const data = await callGeminiAPI(prompt);
      const text = extractResponseText(data);
      setReply(text);
    } catch (e) { setError(e.message || "Failed to generate."); } finally { setLoading(false); }
  };

  const issues = ["Leaky faucet", "No heat", "Clogged drain", "Broken appliance", "Electrical issue"];

  return (
    <div className="page">
      <div className="bg-tools" aria-hidden="true">
        <ToolsPattern />
      </div>

      <header className="header">
        <div className="logo">
          <LogoIcon />
          <div className="logo-text">
            <span className="logo-title">Landlord Repair</span>
            <span className="logo-subtitle">Queue</span>
          </div>
        </div>
        <div className="urgency-badge">🔧 Fast Response</div>
      </header>

      <main className="content">
        <div className="hero">
          <h1>Streamline maintenance requests</h1>
          <p className="sub">AI-powered ticket confirmations with response times and emergency guidance.</p>
        </div>

        <div className="ticket-card">
          <div className="form-section">
            <div className="form-group">
              <label>Unit Number</label>
              <input type="text" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="e.g., A-3" />
            </div>

            <div className="form-group">
              <label>Issue Type</label>
              <div className="issue-grid">
                {issues.map(i => (
                  <button key={i} className={issue === i ? 'active' : ''} onClick={() => setIssue(i)}>{i}</button>
                ))}
              </div>
            </div>
          </div>

          <button className="create-btn" onClick={create} disabled={loading}>
            {loading ? 'Creating Ticket...' : '📋 Create Ticket'}
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {reply && (
          <div className="reply-card">
            <div className="reply-header">
              <span>✓</span>
              <h3>Ticket Confirmed</h3>
              <span className="unit-tag">{unit}</span>
            </div>            
            <div className="reply-body">
              <pre>{reply}</pre>
            </div>            
            <div className="reply-actions">
              <button className="btn-secondary">📧 Send to Tenant</button>
              <button className="btn-primary">👷 Assign Contractor</button>
            </div>
          </div>
        )}

        <div className="features">
          <div className="feature">
            <span>⚡</span>
            <h4>Fast</h4>
            <p>Instant responses</p>
          </div>
          <div className="feature">
            <span>📱</span>
            <h4>Clear</h4>
            <p>Tenant-friendly</p>
          </div>
          <div className="feature">
            <span>🚨</span>
            <h4>Smart</h4>
            <p>Emergency routing</p>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>Property Management • Ashtabula County, OH</p>
      </footer>
    </div>
  );
}

export default App;