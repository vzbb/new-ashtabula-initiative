import { useState } from "react";
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

// City of Ashtabula Logo Component
function CityOfAshtabulaLogo({ size = 50 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M25 2 L5 10 V22 C5 35 25 48 25 48 C25 48 45 35 45 22 V10 L25 2Z"
        fill="#1e3a5f"
        stroke="#d4af37"
        strokeWidth="1.5"
      />
      <path
        d="M25 5 L8 12 V22 C8 33 25 44 25 44 C25 44 42 33 42 22 V12 L25 5Z"
        fill="none"
        stroke="#d4af37"
        strokeWidth="0.5"
        opacity="0.6"
      />
      <rect x="20" y="28" width="10" height="12" fill="#ffffff" />
      <rect x="22" y="16" width="6" height="12" fill="#ffffff" />
      <path d="M21 16 L25 10 L29 16 Z" fill="#d4af37" />
      <path d="M25 12 L35 8 L25 10 Z" fill="#d4af37" opacity="0.8" />
      <path d="M25 12 L15 8 L25 10 Z" fill="#d4af37" opacity="0.6" />
      <rect x="23" y="34" width="4" height="6" fill="#1e3a5f" />
      <rect x="24" y="20" width="2" height="3" fill="#1e3a5f" />
      <path d="M8 38 Q14 35 20 38 T32 38 T42 36" stroke="#d4af37" strokeWidth="1" fill="none" opacity="0.8" />
      <path d="M10 42 Q16 39 22 42 T34 42 T40 40" stroke="#d4af37" strokeWidth="0.8" fill="none" opacity="0.6" />
    </svg>
  );
}

function App() {
  const [eventType, setEventType] = useState("block_party");
  const [attendees, setAttendees] = useState(50);
  const [needs, setNeeds] = useState({ alcohol: false, street_closure: false, tents: false, amplified_sound: false });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleNeed = (key) => setNeeds(prev => ({ ...prev, [key]: !prev[key] }));

  const generate = async () => {
    setLoading(true); setError(""); setResult("");
    try {
      const prompt = `As a municipal permitting specialist for the City of Ashtabula, Ohio, generate a permit checklist for a ${eventType.replace('_', ' ')} with ${attendees} attendees. Requirements: ${Object.entries(needs).filter(([_, v]) => v).map(([k]) => k).join(', ') || 'none'}. Format as a numbered checklist with required documents and estimated timeline. Keep under 150 words.`;
      const text = await geminiService.generateContent(prompt);
      setResult(text);
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  };

  const eventTypes = [
    { id: "block_party", label: "Block Party", icon: "🎉" },
    { id: "festival", label: "Festival", icon: "🎪" },
    { id: "concert", label: "Concert", icon: "🎵" },
    { id: "market", label: "Farmers Market", icon: "🥕" },
    { id: "parade", label: "Parade", icon: "🎊" },
    { id: "sports", label: "Sports Event", icon: "⚽" }
  ];

  return (
    <div className="app-container">
      <div className="bg-wave-pattern"></div>

      {/* Official Banner */}
      <div className="official-banner">
        <div className="official-banner-content">
          <span className="official-banner-seal">★</span>
          <span>Official Event Permit Portal of the City of Ashtabula</span>
          <span className="official-banner-seal">★</span>
        </div>
      </div>

      {/* Header */}
      <header className="municipal-header">
        <div className="header-content">
          <div className="city-logo">
            <CityOfAshtabulaLogo size={50} />
            <div className="city-logo-text">
              <span className="city-logo-title">City of Ashtabula</span>
              <span className="city-logo-subtitle">Event Permit Express</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="municipal-main">
        <div className="content-container">
          {/* Hero Section */}
          <section className="hero-section">
            <div className="hero-eyebrow">Parks & Recreation Department</div>
            <h1 className="hero-title">Get Your Permit Checklist in Seconds</h1>
            <p className="hero-subtitle">
              AI-powered event permitting for Ashtabula — know exactly what you need before you apply.
            </p>
            <div className="divider"></div>
          </section>

          {/* Event Configuration Card */}
          <div className="municipal-card">
            <div className="municipal-card-header municipal-card-header-gold">
              <span className="municipal-card-title">Event Details</span>
            </div>
            <div className="municipal-card-body">
              {/* Step 1: Event Type */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <span style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#1e3a5f',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}>1</span>
                  <span className="form-label" style={{ margin: 0 }}>What type of event?</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px' }}>
                  {eventTypes.map(evt => (
                    <button
                      key={evt.id}
                      onClick={() => setEventType(evt.id)}
                      style={{
                        padding: '12px',
                        borderRadius: '8px',
                        border: eventType === evt.id ? '2px solid #1e3a5f' : '1px solid #e2e8f0',
                        background: eventType === evt.id ? '#e8f4f8' : '#fff',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{ fontSize: '24px', marginBottom: '4px' }}>{evt.icon}</div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#2c3e50' }}>{evt.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Attendance */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <span style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#1e3a5f',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}>2</span>
                  <span className="form-label" style={{ margin: 0 }}>Expected attendance</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="1000"
                  step="10"
                  value={attendees}
                  onChange={(e) => setAttendees(Number(e.target.value))}
                  style={{ width: '100%', marginBottom: '8px' }}
                />
                <div style={{ textAlign: 'center', fontWeight: 600, color: '#1e3a5f' }}>
                  {attendees} people
                </div>
              </div>

              {/* Step 3: Needs */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <span style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#1e3a5f',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}>3</span>
                  <span className="form-label" style={{ margin: 0 }}>What do you need?</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
                  {[
                    { key: 'alcohol', label: 'Alcohol Permit', icon: '🍺' },
                    { key: 'street_closure', label: 'Street Closure', icon: '🚧' },
                    { key: 'tents', label: 'Tents/Structures', icon: '⛺' },
                    { key: 'amplified_sound', label: 'Amplified Sound', icon: '🔊' }
                  ].map(need => (
                    <button
                      key={need.key}
                      onClick={() => toggleNeed(need.key)}
                      style={{
                        padding: '12px',
                        borderRadius: '8px',
                        border: needs[need.key] ? '2px solid #d4af37' : '1px solid #e2e8f0',
                        background: needs[need.key] ? '#fefce8' : '#fff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        justifyContent: 'center'
                      }}
                    >
                      <span>{need.icon}</span>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{need.label}</span>
                      {needs[need.key] && <span style={{ color: '#d4af37', fontWeight: 600 }}>✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="alert alert-error" style={{ marginBottom: '16px' }}>
                  {error}
                </div>
              )}

              <button
                className="btn btn-primary btn-lg"
                onClick={generate}
                disabled={loading}
                style={{ width: '100%' }}
              >
                {loading ? "Generating Checklist…" : "📋 Generate Permit Checklist"}
              </button>
            </div>
          </div>

          {/* Results Card */}
          {result && (
            <div className="municipal-card animate-in">
              <div className="municipal-card-header">
                <span className="municipal-card-title">Your Permit Checklist</span>
                <span className="badge badge-gold">City of Ashtabula</span>
              </div>
              <div className="municipal-card-body">
                <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', lineHeight: 1.7, margin: 0 }}>
                  {result}
                </pre>
              </div>
              <div className="municipal-card-footer" style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button className="btn btn-outline" onClick={() => window.print()}>Print Checklist</button>
                <button className="btn btn-secondary">Apply Now →</button>
              </div>
            </div>
          )}

          {/* Features Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
            gap: '16px',
            marginTop: '32px'
          }}>
            {[
              { icon: '⚡', title: 'Instant', desc: 'No waiting for business days' },
              { icon: '📋', title: 'Complete', desc: 'All requirements included' },
              { icon: '🎯', title: 'Accurate', desc: 'Tailored to your event' },
            ].map((feature) => (
              <div key={feature.title} className="municipal-card" style={{ marginBottom: 0, textAlign: 'center' }}>
                <div className="municipal-card-body">
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>{feature.icon}</div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1e3a5f', marginBottom: '8px' }}>
                    {feature.title}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="municipal-footer">
        <div className="footer-content">
          <div className="footer-top">
            <div className="footer-seal">
              <svg width="24" height="24" viewBox="0 0 50 50" fill="none">
                <path d="M25 5 L8 12 V22 C8 33 25 44 25 44 C25 44 42 33 42 22 V12 L25 5Z" fill="#ffffff" />
                <rect x="22" y="20" width="6" height="16" fill="#1e3a5f" />
                <path d="M21 20 L25 14 L29 20 Z" fill="#d4af37" />
              </svg>
            </div>
            <div>
              <div className="footer-title">City of Ashtabula</div>
              <div className="footer-subtitle">Event Permit Express — Parks & Recreation</div>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-links">
              <a href="#" className="footer-link">Parks & Rec</a>
              <a href="#" className="footer-link">City Clerk</a>
              <a href="#" className="footer-link">City Website</a>
            </div>
            <p className="footer-copyright">
              © 2026 City of Ashtabula, Ohio. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
