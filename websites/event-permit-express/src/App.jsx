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

const fallbackChecklists = {
  wedding: [
    "Reserve the Expo Center or Pavilion and confirm your preferred date range with fairgrounds staff.",
    "Plan for the $250 refundable security deposit plus the building rental tier that matches your event day.",
    "Submit a venue layout showing ceremony, reception, catering, and parking flow.",
    "Provide certificate of insurance and confirm any alcohol service plan with your licensed vendor.",
    "Finalize vendor access, cleanup timing, and next-business-day walk-through before approval."
  ],
  trade_show: [
    "Choose the Expo Center or Commercial Building based on guest count, power needs, and overhead-door access.",
    "Submit vendor count, booth layout, and load-in / load-out schedule for review.",
    "Provide certificate of insurance and any fire-safety or temporary structure details.",
    "Confirm tables, chairs, kitchen access, and staffing expectations with the fairgrounds team.",
    "Review deposit timing, signage rules, and post-event cleanup requirements before booking."
  ],
  livestock: [
    "Confirm which livestock buildings, show barns, or arena spaces are required for your event dates.",
    "Provide animal count, arrival timing, pen or stall plan, and wash or feed access needs.",
    "Submit proof of insurance plus any health, safety, or veterinary documentation required for exhibitors.",
    "Coordinate trailer circulation, public access areas, and staffing coverage with fairgrounds operations.",
    "Review deposit, cleanup, and manure or waste handling expectations before final approval."
  ],
  horse_show: [
    "Reserve the outdoor arena, practice ring, and horse barns needed for the show schedule.",
    "Submit stall count, trailer parking plan, announcer or sound requirements, and admission flow.",
    "Provide insurance, rider release documents, and any vendor or concession plans.",
    "Confirm arrival windows, arena prep, and restroom or camping needs with the fairgrounds office.",
    "Review deposit terms, cleanup standards, and post-event inspection timing before confirmation."
  ],
  festival: [
    "Choose the Pavilion, Grandstand, or multi-building footprint that fits your attendance and vendor plan.",
    "Submit a site map covering food vendors, entertainment, emergency access, and crowd circulation.",
    "Provide insurance, amplified sound details, and any alcohol, tent, or temporary structure information.",
    "Coordinate public parking, electrical needs, restrooms, and overnight security with fairgrounds staff.",
    "Review deposit, setup windows, and cleanup expectations before your permit packet is finalized."
  ],
  swap_meet: [
    "Confirm the Commercial Building, outdoor footprint, and vendor spacing needed for your swap meet.",
    "Submit vendor count, access plan, and any electrical or loading requirements.",
    "Provide certificate of insurance and note any food service, tents, or amplified sound needs.",
    "Coordinate setup, parking flow, and public entry timing with the fairgrounds office.",
    "Review deposit, cleanup responsibilities, and signage rules before booking is approved."
  ]
};

function buildFallbackChecklist(eventType, attendees, needs) {
  const lines = fallbackChecklists[eventType] || fallbackChecklists.festival;
  const selectedNeeds = Object.entries(needs)
    .filter(([, enabled]) => enabled)
    .map(([key]) => key.replace("_", " "));

  return [
    `1. Event profile: ${eventType.replace("_", " ")} for approximately ${attendees} attendees at the Ashtabula County Fairgrounds.`,
    ...lines.map((line, index) => `${index + 2}. ${line}`),
    `7. Special requests to confirm: ${selectedNeeds.length ? selectedNeeds.join(", ") : "no extra permit flags selected yet"}.`,
    "8. Final step: email or call the fairgrounds team to confirm date availability, deposit timing, and your preferred building package."
  ].join("\n");
}

// Ashtabula County Fairgrounds Mark
function FairgroundsLogo({ size = 50 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="5" y="8" width="40" height="34" rx="6" fill="#8B4513" stroke="#D4A574" strokeWidth="1.5" />
      <path d="M10 22 L25 11 L40 22" stroke="#FAF8F5" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <rect x="15" y="22" width="20" height="12" fill="#FAF8F5" opacity="0.95" />
      <rect x="21" y="27" width="8" height="7" fill="#8B4513" />
      <path d="M14 39 C18 36, 22 36, 25 39 C28 36, 32 36, 36 39" stroke="#2E7D32" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="39" cy="14" r="3" fill="#D4A574" />
    </svg>
  );
}

function App() {
  const [eventType, setEventType] = useState("festival");
  const [attendees, setAttendees] = useState(50);
  const [needs, setNeeds] = useState({ alcohol: false, street_closure: false, tents: false, amplified_sound: false });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleNeed = (key) => setNeeds(prev => ({ ...prev, [key]: !prev[key] }));

  const generate = async () => {
    setLoading(true); setError(""); setResult("");
    try {
      const prompt = `You are the event-booking and permit coordinator for the Ashtabula County Fairgrounds in Jefferson, Ohio. Generate a concise numbered checklist for a ${eventType.replace('_', ' ')} with ${attendees} attendees. Requirements: ${Object.entries(needs).filter(([, enabled]) => enabled).map(([k]) => k.replace('_', ' ')).join(', ') || 'none'}. Reference fairgrounds-style venue intake needs like deposit timing, insurance, layout/site map, vendor coordination, and building-specific logistics. Keep under 150 words.`;
      const text = apiKey && apiKey !== "undefined"
        ? await geminiService.generateContent(prompt)
        : buildFallbackChecklist(eventType, attendees, needs);
      setResult(text);
    } catch {
      setResult(buildFallbackChecklist(eventType, attendees, needs));
      setError("Showing a fairgrounds-ready fallback checklist while live AI planning is unavailable.");
    } finally { setLoading(false); }
  };

  const eventTypes = [
    { id: "festival", label: "Festival", icon: "🎪" },
    { id: "wedding", label: "Wedding", icon: "💍" },
    { id: "trade_show", label: "Trade Show", icon: "🛍️" },
    { id: "horse_show", label: "Horse Show", icon: "🐎" },
    { id: "livestock", label: "Livestock Event", icon: "🐄" },
    { id: "swap_meet", label: "Swap Meet", icon: "🧺" }
  ];

  return (
    <div className="app-container">
      <div className="bg-wave-pattern"></div>

      {/* Official Banner */}
      <div className="official-banner">
        <div className="official-banner-content">
          <span className="official-banner-seal">★</span>
          <span>Ashtabula County Fairgrounds Venue Intake Demo</span>
          <span className="official-banner-seal">★</span>
        </div>
      </div>

      {/* Header */}
      <header className="municipal-header">
        <div className="header-content">
          <div className="city-logo">
            <FairgroundsLogo size={50} />
            <div className="city-logo-text">
              <span className="city-logo-title">Ashtabula County Fairgrounds</span>
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
            <div className="hero-eyebrow">Venue Booking & Special Events Intake</div>
            <h1 className="hero-title">Plan Your Fairgrounds Checklist Before You Book</h1>
            <p className="hero-subtitle">
              Built for weddings, festivals, trade shows, livestock events, and seasonal fairgrounds rentals in Jefferson.
            </p>
            <div className="divider"></div>
            <div className="hero-stats">
              <div className="hero-stat">
                <strong>450 guests</strong>
                <span>Expo Center capacity</span>
              </div>
              <div className="hero-stat">
                <strong>$250 deposit</strong>
                <span>Typical refundable hold</span>
              </div>
              <div className="hero-stat">
                <strong>Multi-building</strong>
                <span>Grandstand, pavilion, barns, arenas</span>
              </div>
            </div>
          </section>

          <section className="municipal-card trust-strip">
            <div className="municipal-card-body trust-strip-body">
              <div>
                <h2 className="trust-strip-title">Your Event. Our Grounds. Permitted.</h2>
                <p className="trust-strip-copy">
                  Use this intake demo to see what the fairgrounds team will need for layouts, deposits, insurance, vendors, and building coordination before your booking call.
                </p>
              </div>
              <div className="trust-strip-grid">
                <div className="trust-pill">Expo Center, Pavilion, Grandstand, barns</div>
                <div className="trust-pill">Weddings, auctions, horse shows, fairs</div>
                <div className="trust-pill">Jefferson, Ohio fairgrounds operations</div>
              </div>
            </div>
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
                  <span className="form-label" style={{ margin: 0 }}>What type of fairgrounds event?</span>
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
                  <span className="form-label" style={{ margin: 0 }}>What special approvals or logistics are involved?</span>
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
                <div className="alert alert-warning" style={{ marginBottom: '16px' }}>
                  {error}
                </div>
              )}

              <button
                className="btn btn-primary btn-lg"
                onClick={generate}
                disabled={loading}
                style={{ width: '100%' }}
              >
                {loading ? "Generating Checklist…" : "📋 Generate Fairgrounds Checklist"}
              </button>
            </div>
          </div>

          {/* Results Card */}
          {result && (
            <div className="municipal-card animate-in">
              <div className="municipal-card-header">
                <span className="municipal-card-title">Your Permit Checklist</span>
                <span className="badge badge-gold">Ashtabula County Fairgrounds</span>
              </div>
              <div className="municipal-card-body">
                <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', lineHeight: 1.7, margin: 0 }}>
                  {result}
                </pre>
              </div>
              <div className="municipal-card-footer" style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button className="btn btn-outline" onClick={() => window.print()}>Print Checklist</button>
                <button className="btn btn-secondary">Contact Fairgrounds Team →</button>
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
              { icon: '🏛️', title: 'Venue Aware', desc: 'Built around real fairgrounds buildings and event types' },
              { icon: '📋', title: 'Checklist Ready', desc: 'Deposits, layouts, insurance, and vendor needs in one view' },
              { icon: '🤝', title: 'Staff Friendly', desc: 'Prepared for the call, not guessing at the process' },
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
              <div className="footer-title">Ashtabula County Fairgrounds</div>
              <div className="footer-subtitle">Event Permit Express — Venue Intake Demo</div>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-links">
              <a href="https://www.ashtabulafair.com/" className="footer-link">Fairgrounds</a>
              <a href="mailto:ashtafair@windstream.net" className="footer-link">Email Team</a>
              <a href="tel:4408586667" className="footer-link">440-858-6667</a>
            </div>
            <p className="footer-copyright">
              Demo concept for Ashtabula County Fairgrounds event intake and venue booking.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
