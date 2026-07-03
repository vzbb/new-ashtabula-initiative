import { useState } from "react";
import { callGeminiAPI, extractResponseText } from "./api-client.js";
import "./App.css";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Professional Compass Logo
const LogoIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#1e5799" strokeWidth="2"/>
    <path d="M16.2426 7.75738L10.5858 10.5858L7.75738 16.2426L13.4142 13.4142L16.2426 7.75738Z" stroke="#1e5799" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="1" fill="#d4a017"/>
  </svg>
);

function App() {
  const [vibe, setVibe] = useState("Classic GOTL");
  const [days, setDays] = useState("2");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const packages = [
    { id: "Classic GOTL", label: "Classic GOTL", desc: "Eddie's Grill & The Strip" },
    { id: "Family Thrills", label: "Family Thrills", desc: "Adventure Zone & Arcades" },
    { id: "Wine & Dine", label: "Wine Tour", desc: "Old Firehouse & Grand River" },
    { id: "Lakefront", label: "Lakefront Relax", desc: "Town Park & The Lodge" },
    { id: "Nightlife", label: "Nightlife", desc: "The Cove & Live Music" }
  ];

  const generate = async () => {
    setLoading(true); setError(""); setPlan("");
    try {
      const prompt = `Act as the official Geneva-on-the-Lake tourism bureau. Create a ${days}-day itinerary for a "${vibe}" package. You must specifically mention real local businesses related to the theme (e.g., Adventure Zone, Eddie's Grill, The Cove, Old Firehouse Winery, The Lodge at Geneva-on-the-Lake). Include 4-6 bullet points of activities and dining, followed by a professional CTA to book lodging. Keep it to 100 words max.`;
      const data = await callGeminiAPI(prompt);
      const text = extractResponseText(data);
      setPlan(text);
    } catch (e) { setError(e.message || "Failed to generate itinerary. Please try again."); } finally { setLoading(false); }
  };

  return (
    <div className="page">
      {/* Hero Section with background image */}
      <div className="hero-background">
        <div className="hero-overlay"></div>
      </div>

      <header className="header">
        <div className="container header-container">
          <div className="logo">
            <LogoIcon />
            <div className="logo-text">
              <span className="logo-title">Visit Geneva-on-the-Lake</span>
              <span className="logo-subtitle">Official Tourism Bureau</span>
            </div>
          </div>
          <nav className="main-nav">
            <a href="#attractions">Attractions</a>
            <a href="#dining">Dining</a>
            <a href="#lodging">Lodging</a>
            <a href="#events">Events</a>
          </nav>
        </div>
      </header>

      <main className="content container">
        <div className="hero">
          <div className="hero-badge">Welcome to Ohio's First Summer Resort</div>          
          <h1>Your Lake Erie Getaway Awaits</h1>          
          <p className="sub">Discover authentic waterfront charm, thrilling attractions, and world-class wineries. Plan your perfect weekend in Geneva-on-the-Lake with our official itinerary builder.</p>
        </div>

        <div className="main-grid">
          {/* Left Column: Itinerary Builder */}
          <div className="planner-section">
            <div className="planner-card">
              <h2>Build Your Itinerary</h2>
              <p className="section-desc">Select a curated package and duration to receive a custom schedule featuring real GOTL businesses.</p>
              
              <div className="vibe-section">
                <h3>Select a Package</h3>            
                <div className="vibe-grid">
                  {packages.map(p => (
                    <button
                      key={p.id}
                      className={`vibe-btn ${vibe === p.id ? 'active' : ''}`}
                      onClick={() => setVibe(p.id)}
                    >
                      <span className="vibe-label">{p.label}</span>
                      <span className="vibe-desc">{p.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="days-section">
                <h3>Duration</h3>            
                <div className="days-buttons">
                  {["1", "2", "3", "7"].map(d => (
                    <button
                      key={d}
                      className={`day-btn ${days === d ? 'active' : ''}`}
                      onClick={() => setDays(d)}
                    >
                      {d} Day{d !== "1" && 's'}
                    </button>
                  ))}
                </div>
              </div>

              <button className="generate-btn" onClick={generate} disabled={loading}>
                {loading ? 'Curating Your Experience...' : 'Generate Itinerary'}
              </button>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            {plan && (
              <div className="itinerary-card" id="your-plan">
                <div className="itinerary-header">
                  <div className="itinerary-title-group">
                    <h3>Your {days}-Day {vibe} Itinerary</h3>
                    <span className="official-tag">Official Guide</span>
                  </div>
                </div>            
                <div className="itinerary-content">
                  <pre>{plan}</pre>
                </div>            
                <div className="itinerary-actions">
                  <button className="btn-outline">Email Plan</button>
                  <button className="btn-primary">Book at The Lodge</button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Featured Attractions */}
          <div className="featured-section">
            <div className="section-header">
              <h2>Featured Attractions</h2>
              <a href="#all" className="view-all">View All →</a>
            </div>
            
            <div className="features-stack">
              <div className="feature-card">
                <div className="feature-image ad-zone"></div>
                <div className="feature-info">
                  <h4>Adventure Zone</h4>
                  <p>Family fun center featuring go-karts, mini-golf, bumper boats, and the largest arcade on the strip.</p>
                  <a href="#book" className="feature-link">Get Passes</a>
                </div>
              </div>
              
              <div className="feature-card">
                <div className="feature-image eddies"></div>
                <div className="feature-info">
                  <h4>Eddie's Grill</h4>
                  <p>A 1950s style retro diner serving legendary footlong hot dogs and root beer since 1950.</p>
                  <a href="#menu" className="feature-link">View Menu</a>
                </div>
              </div>

              <div className="feature-card">
                <div className="feature-image wineries"></div>
                <div className="feature-info">
                  <h4>Old Firehouse Winery</h4>
                  <p>Lakefront winery featuring an actual 1920s firehouse, craft wines, and spectacular sunset views.</p>
                  <a href="#tasting" className="feature-link">Book Tasting</a>
                </div>
              </div>

              <div className="feature-card">
                <div className="feature-image cove"></div>
                <div className="feature-info">
                  <h4>The Cove Niteclub</h4>
                  <p>The premier live music destination in GOTL. Catch the best regional bands every weekend.</p>
                  <a href="#schedule" className="feature-link">Music Schedule</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="container footer-content">
          <div className="footer-brand">
            <LogoIcon />
            <div>
              <strong>Visit Geneva-on-the-Lake</strong>
              <p>Ohio's First Summer Resort</p>
            </div>
          </div>
          <div className="footer-links">
            <a href="#contact">Contact Us</a>
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#partner">Partner With Us</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Official Geneva-on-the-Lake Tourism Bureau. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;