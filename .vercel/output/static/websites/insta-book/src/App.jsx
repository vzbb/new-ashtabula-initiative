import { useState } from "react";
import { callGeminiAPI, extractResponseText } from "./api-client.js";
import "./App.css";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Hotel/building logo
const LogoIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="12" width="32" height="32" rx="2" fill="#34495e"/>
    <rect x="12" y="16" width="6" height="6" rx="1" fill="#ecf0f1"/>
    <rect x="22" y="16" width="6" height="6" rx="1" fill="#ecf0f1"/>
    <rect x="32" y="16" width="6" height="6" rx="1" fill="#ecf0f1"/>
    <rect x="12" y="26" width="6" height="6" rx="1" fill="#ecf0f1"/>
    <rect x="22" y="26" width="6" height="6" rx="1" fill="#3498db"/>
    <rect x="32" y="26" width="6" height="6" rx="1" fill="#ecf0f1"/>
    <rect x="20" y="36" width="8" height="8" rx="1" fill="#e74c3c"/>
    <path d="M4 12l20-8 20 8" fill="#2c3e50"/>
    <star cx="24" cy="6" r="2" fill="#f1c40f"/>
  </svg>
);

// Booking pattern
const BookingPattern = () => (
  <svg className="booking-pattern" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <g opacity="0.05">
      <rect x="20" y="20" width="30" height="40" rx="2" fill="#34495e"/>
      <rect x="70" y="10" width="30" height="40" rx="2" fill="#34495e"/>
      <rect x="120" y="25" width="30" height="40" rx="2" fill="#34495e"/>
      <rect x="170" y="15" width="25" height="40" rx="2" fill="#34495e"/>
      <rect x="15" y="80" width="35" height="45" rx="2" fill="#34495e"/>
      <rect x="70" y="70" width="30" height="45" rx="2" fill="#34495e"/>
      <rect x="125" y="85" width="35" height="45" rx="2" fill="#34495e"/>
      <rect x="170" y="75" width="25" height="45" rx="2" fill="#34495e"/>
      <rect x="25" y="145" width="30" height="40" rx="2" fill="#34495e"/>
      <rect x="75" y="140" width="30" height="40" rx="2" fill="#34495e"/>
      <rect x="130" y="150" width="30" height="40" rx="2" fill="#34495e"/>
    </g>
  </svg>
);

function App() {
  const [date, setDate] = useState("");
  const [nights, setNights] = useState(2);
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const reserve = async () => {
    setLoading(true); setError(""); setConfirm("");
    try {
      const prompt = `Write a friendly booking confirmation for a ${nights}-night stay starting ${date || 'soon'}. Include a short upsell line for room upgrade or late checkout. 80 words max.`;
      const data = await callGeminiAPI(prompt);
      const text = extractResponseText(data);
      setConfirm(text);
    } catch (e) { setError(e.message || "Failed to generate."); } finally { setLoading(false); }
  };

  return (
    <div className="page">
      <div className="bg-booking" aria-hidden="true">
        <BookingPattern />
      </div>

      <header className="header">
        <div className="logo">
          <LogoIcon />
          <div className="logo-text">
            <span className="logo-title">Insta‑Book</span>
            <span className="logo-subtitle">Confirmation</span>
          </div>
        </div>
        <div className="trust-badge">⭐⭐⭐⭐⭐ Guest Ready</div>
      </header>

      <main className="content">
        <div className="hero">
          <h1>Instant booking confirmations</h1>
          <p className="sub">AI-powered guest communications with personalized upsells.</p>
        </div>

        <div className="booking-card">
          <div className="form-row">
            <div className="form-group">
              <label>Check-in Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Nights</label>
              <div className="night-buttons">
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} className={nights === n ? 'active' : ''} onClick={() => setNights(n)}>{n}</button>
                ))}
              </div>
            </div>
          </div>

          <button className="book-btn" onClick={reserve} disabled={loading}>
            {loading ? 'Confirming...' : 'Generate Confirmation 🎉'}
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {confirm && (
          <div className="confirm-card">
            <div className="confirm-header">
              <span>🎉</span>
              <h3>Booking Confirmed!</h3>
              <span className="nights-tag">{nights} nights</span>
            </div>            
            <div className="confirm-body">
              <pre>{confirm}</pre>
            </div>            
            <div className="confirm-actions">
              <button className="btn-secondary">📧 Send Email</button>
              <button className="btn-primary">💳 Enable Payment</button>
            </div>
          </div>
        )}

        <div className="features">
          <div className="feature">
            <span>⚡</span>
            <h4>Instant</h4>
            <p>5-second output</p>
          </div>
          <div className="feature">
            <span>💎</span>
            <h4>Upsells</h4>
            <p>More revenue</p>
          </div>
          <div className="feature">
            <span>💬</span>
            <h4>Personal</h4>
            <p>Guest-friendly</p>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>Hospitality AI • Ashtabula County, OH</p>
      </footer>
    </div>
  );
}

export default App;