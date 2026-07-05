import { useState, useEffect, useCallback } from "react";
import "./App.css";
import { callOpenRouterAPI, extractResponseText } from "./api-client.js";

// ============================================
// SVG ICONS
// ============================================
function CitySeal({ size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M25 2 L5 10 V22 C5 35 25 48 25 48 C25 48 45 35 45 22 V10 L25 2Z" fill="#1e3a5f" stroke="#d4af37" strokeWidth="1.5"/>
      <path d="M25 5 L8 12 V22 C8 33 25 44 25 44 C25 44 42 33 42 22 V12 L25 5Z" fill="none" stroke="#d4af37" strokeWidth="0.5" opacity="0.6"/>
      <rect x="20" y="28" width="10" height="12" fill="#ffffff"/>
      <rect x="22" y="16" width="6" height="12" fill="#ffffff"/>
      <path d="M21 16 L25 10 L29 16 Z" fill="#d4af37"/>
      <path d="M25 12 L35 8 L25 10 Z" fill="#d4af37" opacity="0.8"/>
      <path d="M25 12 L15 8 L25 10 Z" fill="#d4af37" opacity="0.6"/>
      <rect x="23" y="34" width="4" height="6" fill="#1e3a5f"/>
      <rect x="24" y="20" width="2" height="3" fill="#1e3a5f"/>
      <path d="M8 38 Q14 35 20 38 T32 38 T42 36" stroke="#d4af37" strokeWidth="1" fill="none" opacity="0.8"/>
      <path d="M10 42 Q16 39 22 42 T34 42 T40 40" stroke="#d4af37" strokeWidth="0.8" fill="none" opacity="0.6"/>
    </svg>
  );
}

function FooterSeal({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M25 2 L5 10 V22 C5 35 25 48 25 48 C25 48 45 35 45 22 V10 L25 2Z" fill="#ffffff" opacity="0.8"/>
      <rect x="22" y="20" width="6" height="16" fill="#1e3a5f"/>
      <path d="M21 20 L25 14 L29 20 Z" fill="#d4af37"/>
    </svg>
  );
}

// ============================================
// LICENSE DATA
// ============================================
const LICENSE_TYPES = [
  { id: "business", name: "Business License", icon: "🏢", desc: "General business operations, retail, office" },
  { id: "contractor", name: "Contractor License", icon: "🔨", desc: "Construction, remodeling, trade work" },
  { id: "food", name: "Food Service Permit", icon: "🍽️", desc: "Restaurant, café, food truck, catering" },
  { id: "liquor", name: "Liquor License", icon: "🍷", desc: "Bar, tavern, beer & wine sales" },
  { id: "event", name: "Event Permit", icon: "🎉", desc: "Special events, festivals, street fairs" },
  { id: "home", name: "Home Occupation", icon: "🏠", desc: "Home-based business, freelance, remote" },
];

// ============================================
// STEP INDICATOR
// ============================================
const STEPS = ["Welcome", "License Type", "Details", "Your Guide", "Next Steps"];

function StepIndicator({ current, onGoTo }) {
  return (
    <nav className="step-indicator" aria-label="Wizard progress">
      {STEPS.map((label, i) => (
        <button
          key={i}
          className={`step-dot${i === current ? " active" : ""}${i < current ? " completed" : ""}`}
          onClick={() => onGoTo(i)}
          aria-label={`Go to ${label}`}
          aria-current={i === current ? "step" : undefined}
        >
          <span className="step-label">{label}</span>
        </button>
      ))}
    </nav>
  );
}

// ============================================
// HERO SCREEN (Screen 0)
// ============================================
function HeroScreen({ onGoTo }) {
  return (
    <div className={`screen${true ? " active" : ""}`} id="screen-hero">
      <div className="screen-hero">
        <div className="hero-bg" style={{ backgroundImage: "url('/ashtabula-harbor-aerial.png')" }}></div>
        <div className="hero-bg-overlay"></div>
        <div className="hero-bg-gradient"></div>

        <div className="official-banner">
          <div className="official-banner-content">
            <span className="official-banner-seal">★</span>
            <span>Official Licensing Portal of the City of Ashtabula</span>
            <span className="official-banner-seal">★</span>
          </div>
        </div>

        <header className="municipal-header">
          <div className="header-content">
            <div className="city-logo">
              <CitySeal size={44} />
              <div className="city-logo-text">
                <span className="city-logo-title">City of Ashtabula</span>
                <span className="city-logo-subtitle">License Wizard</span>
              </div>
            </div>
            <div className="hero-nav">
              <button className="hero-nav-btn" onClick={() => onGoTo(1)}>License Types</button>
              <button className="hero-nav-btn primary" onClick={() => onGoTo(2)}>Get Started →</button>
            </div>
          </div>
        </header>

        <div className="hero-content">
          <div className="hero-eyebrow">Business Development Services</div>
          <h1 className="hero-title">Your License<br /><span>Simplified</span></h1>
          <p className="hero-subtitle">
            Navigate Ashtabula's business licensing requirements with confidence.
            Get personalized guidance, fee estimates, and step-by-step checklists — from application to approval.
          </p>
          <div className="hero-cta-group">
            <button className="hero-cta primary" onClick={() => onGoTo(2)}>
              Start Your License Guide →
            </button>
            <button className="hero-cta secondary" onClick={() => onGoTo(1)}>
              Browse License Types
            </button>
          </div>
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-value">15+</div>
            <div className="hero-stat-label">License Types</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">48h</div>
            <div className="hero-stat-label">Typical Processing</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">$0</div>
            <div className="hero-stat-label">Consultation Fee</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">100%</div>
            <div className="hero-stat-label">Ashtabula-Specific</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// LICENSE SELECTION (Screen 1)
// ============================================
function LicenseSelection({ selected, onSelect, onGoTo }) {
  return (
    <div className="screen-section">
      <div className="photo-bg-layer" style={{ backgroundImage: "url('/bridge-st-park-walkway.jpg')" }}></div>

      <header className="municipal-header" style={{ position: "sticky" }}>
        <div className="header-content">
          <div className="city-logo">
            <CitySeal size={44} />
            <div className="city-logo-text">
              <span className="city-logo-title">City of Ashtabula</span>
              <span className="city-logo-subtitle">License Wizard</span>
            </div>
          </div>
          <div className="hero-nav">
            <button className="hero-nav-btn" onClick={() => onGoTo(0)}>← Back</button>
            <button className="hero-nav-btn primary" onClick={() => onGoTo(2)}>Continue →</button>
          </div>
        </div>
      </header>

      <div className="section-header">
        <div className="section-eyebrow">Step 1 of 4</div>
        <h2 className="section-title">What type of license do you need?</h2>
        <p className="section-subtitle">Select the category that best describes your business. Don't worry — you can change this later.</p>
      </div>

      <div className="license-grid">
        {LICENSE_TYPES.map((lt) => (
          <div
            key={lt.id}
            className={`license-card${selected === lt.id ? " selected" : ""}`}
            onClick={() => onSelect(lt.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(lt.id); } }}
          >
            <div className="license-check">✓</div>
            <div className="license-icon">{lt.icon}</div>
            <div className="license-name">{lt.name}</div>
            <div className="license-desc">{lt.desc}</div>
          </div>
        ))}
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">📋</div>
          <div className="feature-title">Checklist Format</div>
          <div className="feature-desc">Clear step-by-step requirements you can track and complete at your own pace.</div>
        </div>
        <div className="feature-card">
          <div className="feature-icon">💰</div>
          <div className="feature-title">Fee Estimates</div>
          <div className="feature-desc">Know the costs upfront with detailed fee breakdowns for every license type.</div>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📞</div>
          <div className="feature-title">Direct Contacts</div>
          <div className="feature-desc">Phone numbers, emails, and office hours for the right city departments.</div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// BUSINESS FORM (Screen 2)
// ============================================
function BusinessForm({ licenseType, businessName, businessAddress, businessType, employees, onUpdate, onGoTo, onSubmit, loading, error }) {
  const licenseLabel = LICENSE_TYPES.find(l => l.id === licenseType)?.name || licenseType;

  return (
    <div className="screen-section centered">
      <div className="photo-bg-layer" style={{ backgroundImage: "url('/west_5th_street.jpg')" }}></div>

      <header className="municipal-header" style={{ position: "sticky" }}>
        <div className="header-content">
          <div className="city-logo">
            <CitySeal size={36} />
            <div className="city-logo-text">
              <span className="city-logo-title">City of Ashtabula</span>
              <span className="city-logo-subtitle">License Wizard</span>
            </div>
          </div>
          <div className="hero-nav">
            <button className="hero-nav-btn" onClick={() => onGoTo(1)}>← Back</button>
            <button className="hero-nav-btn special" onClick={() => onGoTo(3)}>Skip → Results</button>
          </div>
        </div>
      </header>

      <div className="form-container">
        <div className="section-header" style={{ marginBottom: 32 }}>
          <div className="section-eyebrow">Step 2 of 4</div>
          <h2 className="section-title">Tell us about your business</h2>
          <p className="section-subtitle">We'll use this to create a personalized licensing guide.</p>
        </div>

        <div className="form-card">
          <div className="form-card-header">
            <h2>Business Information</h2>
            <p>License type: <strong>{licenseLabel}</strong></p>
          </div>
          <div className="form-card-body">
            <div className="form-group">
              <label className="form-label" htmlFor="bizName">Business Name</label>
              <input
                type="text"
                className="form-input"
                id="bizName"
                placeholder="e.g. Ashtabula River Cafe"
                value={businessName}
                onChange={(e) => onUpdate("businessName", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="bizAddr">Business Address</label>
              <input
                type="text"
                className="form-input"
                id="bizAddr"
                placeholder="e.g. 123 Bridge Street"
                value={businessAddress}
                onChange={(e) => onUpdate("businessAddress", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="bizType">Business Type</label>
              <select
                className="form-select"
                id="bizType"
                value={businessType}
                onChange={(e) => onUpdate("businessType", e.target.value)}
              >
                <option value="llc">Limited Liability Company (LLC)</option>
                <option value="sole-prop">Sole Proprietorship</option>
                <option value="corporation">Corporation</option>
                <option value="partnership">Partnership</option>
                <option value="nonprofit">Nonprofit</option>
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="employees">Employees (including owner)</label>
              <select
                className="form-select"
                id="employees"
                value={employees}
                onChange={(e) => onUpdate("employees", e.target.value)}
              >
                <option value="1">Just me (1)</option>
                <option value="2-5">2-5 employees</option>
                <option value="6-20">6-20 employees</option>
                <option value="21-50">21-50 employees</option>
                <option value="51+">51+ employees</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">{error}</div>
        )}

        <div style={{ textAlign: "center", marginTop: 32 }}>
          <button
            className="btn btn-gold btn-lg"
            onClick={onSubmit}
            disabled={loading || !businessName.trim()}
          >
            {loading ? (
              <><span className="loading-spinner"></span> Generating Guide…</>
            ) : (
              "Generate My License Guide →"
            )}
          </button>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 12 }}>
            No account needed. Your information is not stored.
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// GUIDE RESULTS (Screen 3)
// ============================================
function GuideResults({ guideData, licenseType, businessName, onGoTo }) {
  const licenseLabel = LICENSE_TYPES.find(l => l.id === licenseType)?.name || licenseType;

  if (!guideData) return null;

  return (
    <div className="screen-section">
      <div className="photo-bg-layer" style={{ backgroundImage: "url('/bridge-st-park-gazebo.jpg')" }}></div>

      <header className="municipal-header" style={{ position: "sticky" }}>
        <div className="header-content">
          <div className="city-logo">
            <CitySeal size={36} />
            <div className="city-logo-text">
              <span className="city-logo-title">City of Ashtabula</span>
              <span className="city-logo-subtitle">License Wizard</span>
            </div>
          </div>
          <div className="hero-nav">
            <button className="hero-nav-btn" onClick={() => onGoTo(2)}>← Edit Details</button>
            <button className="hero-nav-btn primary" onClick={() => onGoTo(4)}>Next Steps →</button>
          </div>
        </div>
      </header>

      <div className="section-header">
        <div className="section-eyebrow">Step 3 of 4</div>
        <h2 className="section-title">Your Personalized License Guide</h2>
        <p className="section-subtitle">Here's your step-by-step checklist for <strong>{businessName || "your business"}</strong>.</p>
      </div>

      <div className="results-container">
        {guideData.feeSummary && (
          <div className="guide-card" style={{ animationDelay: "0s" }}>
            <div className="guide-card-header">
              <h2>{licenseType ? `${LICENSE_TYPES.find(l => l.id === licenseType)?.icon || "📄"} ${licenseLabel} — Summary` : "License Summary"}</h2>
              <span className="guide-badge">AI-Generated Guide</span>
            </div>
            <div className="guide-card-body">
              {guideData.feeSummary.length > 0 && (
                <div className="fee-grid">
                  {guideData.feeSummary.map((item, i) => (
                    <div key={i} className="fee-item">
                      <div className="fee-value">{item.value}</div>
                      <div className="fee-label">{item.label}</div>
                    </div>
                  ))}
                </div>
              )}
              {guideData.jurisdiction && (
                <div className="jurisdiction-info" dangerouslySetInnerHTML={{ __html: guideData.jurisdiction }} />
              )}
            </div>
          </div>
        )}

        {guideData.steps && guideData.steps.length > 0 && (
          <div className="guide-card">
            <div className="guide-card-header dark">
              <h2>📋 Step-by-Step Checklist</h2>
              <span className="guide-badge">{guideData.steps.length} Steps</span>
            </div>
            <div className="guide-card-body">
              {guideData.steps.map((step, i) => (
                <div key={i} className={`guide-step${step.completed ? " completed" : ""}`}>
                  <div className="guide-step-number">{i + 1}</div>
                  <div className="guide-step-content">
                    <div className="guide-step-title">{step.title}</div>
                    <div className="guide-step-desc">{step.description}</div>
                  </div>
                  <div className={`guide-step-status${step.completed ? "" : " pending"}`}>
                    {step.completed ? "✓ Complete" : "Pending"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {guideData.aiText && !guideData.steps && (
          <div className="guide-card">
            <div className="guide-card-header">
              <h2>📋 License Guide</h2>
              <span className="guide-badge">AI Generated</span>
            </div>
            <div className="guide-card-body">
              <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", lineHeight: 1.7, margin: 0, fontSize: "0.9rem" }}>
                {guideData.aiText}
              </pre>
            </div>
          </div>
        )}

        <div style={{ textAlign: "center" }}>
          <button className="btn btn-gold btn-lg" onClick={() => onGoTo(4)}>
            View Next Steps →
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// NEXT STEPS (Screen 4)
// ============================================
function NextSteps({ licenseType, businessName, guideData, onGoTo }) {
  const licenseLabel = LICENSE_TYPES.find(l => l.id === licenseType)?.name || licenseType;

  return (
    <div className="screen-section centered">
      <div className="photo-bg-layer" style={{ backgroundImage: "url('/war-memorial-mural.jpg')" }}></div>

      <header className="municipal-header" style={{ position: "sticky" }}>
        <div className="header-content">
          <div className="city-logo">
            <CitySeal size={36} />
            <div className="city-logo-text">
              <span className="city-logo-title">City of Ashtabula</span>
              <span className="city-logo-subtitle">License Wizard</span>
            </div>
          </div>
          <div className="hero-nav">
            <button className="hero-nav-btn" onClick={() => onGoTo(3)}>← Back to Guide</button>
            <button className="hero-nav-btn" onClick={() => onGoTo(0)}>Start Over</button>
          </div>
        </div>
      </header>

      <div className="results-container">
        <div className="cta-card">
          <div className="cta-card-content">
            <div className="cta-icon">✅</div>
            <h2 className="cta-title">You're on the right track!</h2>
            <p className="cta-subtitle">
              Your personalized {licenseLabel.toLowerCase()} guide for {businessName || "your business"} has been generated.
              Here's what to do next to get your Ashtabula business license.
            </p>
            <div className="cta-btn-group">
              <button className="hero-cta primary" onClick={() => window.print()}>
                📄 Download Checklist
              </button>
              <button
                className="hero-cta secondary"
                style={{ color: "var(--white)", borderColor: "rgba(255,255,255,0.3)" }}
                onClick={() => onGoTo(0)}
              >
                Start Another Search
              </button>
            </div>
          </div>
        </div>

        <div className="guide-card" style={{ marginTop: 24 }}>
          <div className="guide-card-header dark">
            <h2>🏛️ City of Ashtabula — Licensing Office</h2>
          </div>
          <div className="guide-card-body">
            <div className="contact-grid">
              <div>
                <div className="contact-item-label">📍 Address</div>
                <div className="contact-item-value">
                  4400 Main Avenue<br />
                  Ashtabula, OH 44004
                </div>
              </div>
              <div>
                <div className="contact-item-label">📞 Phone</div>
                <div className="contact-item-value">
                  (440) 992-7195<br />
                  <span className="contact-item-sub">Mon–Fri, 8:00 AM – 4:00 PM</span>
                </div>
              </div>
              <div>
                <div className="contact-item-label">🌐 Online</div>
                <div className="contact-item-value">
                  cityofashtabula.org/business<br />
                  <span className="contact-item-sub">Download application forms</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="guide-card">
          <div className="guide-card-body">
            <div className="helpful-links">
              <span className="helpful-link">
                <span className="helpful-link-icon">🛡️</span> Ohio Secretary of State
              </span>
              <span className="helpful-link">
                <span className="helpful-link-icon">💰</span> Ashtabula County Treasurer
              </span>
              <span className="helpful-link">
                <span className="helpful-link-icon">🏦</span> Small Business Development Center
              </span>
            </div>
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 20 }}>
          ⚠️ Always verify current requirements with official city offices. Fees and processes may change.
        </p>
      </div>

      <footer className="municipal-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <FooterSeal size={28} />
            <span className="footer-title">City of Ashtabula — License Wizard</span>
          </div>
          <div className="footer-links">
            <a href="#" className="footer-link">Business Licensing Guide</a>
            <a href="#" className="footer-link">City Clerk</a>
            <a href="#" className="footer-link">City Website</a>
            <a href="#" className="footer-link">Accessibility</a>
          </div>
          <p className="footer-copyright">
            © 2026 City of Ashtabula, Ohio. All rights reserved.<br />
            Photos: Various contributors, CC BY-SA (Wikimedia Commons). Built by Noirsys for the New Ashtabula Initiative.
          </p>
        </div>
      </footer>
    </div>
  );
}

// ============================================
// FALLBACK GUIDE DATA (offline-ready)
// ============================================
function buildFallbackGuide(licenseType, businessName) {
  const type = LICENSE_TYPES.find(l => l.id === licenseType) || LICENSE_TYPES[0];
  return {
    feeSummary: [
      { value: "$185", label: "Application Fee" },
      { value: "$150", label: "Annual Renewal" },
      { value: "7-14", label: "Business Days" },
      { value: "3", label: "Required Visits" },
    ],
    jurisdiction: `<strong>📍 Jurisdiction:</strong> City of Ashtabula, Ohio — Health Department (440-992-7392)<br><strong>📋 Department:</strong> Building & Zoning Services, 4400 Main Avenue, Ashtabula, OH 44004`,
    steps: [
      { title: "Pre-Application Consultation", description: "Schedule a free 15-minute consultation with the appropriate department to discuss your business concept.", completed: true },
      { title: "Business Entity Registration", description: "Register your business with the Ohio Secretary of State (ohiosos.gov) and obtain your Ohio Tax ID.", completed: true },
      { title: `Submit ${type.name} Application`, description: "Complete the application form. Include all required documentation and the applicable fee.", completed: false },
      { title: "Facility Inspection", description: "Pass a health and safety inspection by the appropriate county department.", completed: false },
      { title: "Zoning Compliance Check", description: "Verify your business location is zoned for your intended use.", completed: false },
      { title: "License Issuance & Posting", description: "Once approved, your permit will be issued and must be posted conspicuously in your establishment.", completed: false },
    ],
  };
}

// ============================================
// MAIN APP
// ============================================
function App() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [selectedLicense, setSelectedLicense] = useState("business");
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessType, setBusinessType] = useState("llc");
  const [employees, setEmployees] = useState("6-20");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [guideData, setGuideData] = useState(null);

  // Go to screen with bounds checking
  const goToScreen = useCallback((index) => {
    if (index >= 0 && index < 5) {
      setCurrentScreen(index);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goToScreen(Math.min(currentScreen + 1, 4));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToScreen(Math.max(currentScreen - 1, 0));
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentScreen, goToScreen]);

  // Form field updater
  const handleUpdate = (field, value) => {
    switch (field) {
      case "businessName": setBusinessName(value); break;
      case "businessAddress": setBusinessAddress(value); break;
      case "businessType": setBusinessType(value); break;
      case "employees": setEmployees(value); break;
      default: break;
    }
  };

  // Generate license guide via OpenRouter
  const generateGuide = async () => {
    if (!businessName.trim() && !guideData) {
      // Use fallback data even without a name
    }

    setLoading(true);
    setError("");

    try {
      const typeName = LICENSE_TYPES.find(l => l.id === selectedLicense)?.name || selectedLicense;
      const prompt = `You are the City of Ashtabula License Wizard. Generate a structured business licensing guide.

Business: "${businessName || "a new business"}"
License Type: ${typeName}
Business Type: ${businessType}
Location: Ashtabula, Ohio 44004

Return JSON only, no markdown, no explanation:
{
  "feeSummary": [{"value": "$XXX", "label": "Fee Name"}, ...],
  "jurisdiction": "<strong>📍 Jurisdiction:</strong> ...",
  "steps": [{"title": "Step Name", "description": "Step description", "completed": true/false}, ...]
}

Include 3-4 fee items, 5-6 steps (first 2 completed, rest pending). Use realistic Ashtabula-specific data.`;

      const data = await callOpenRouterAPI(prompt, "google/gemini-2.5-flash-lite");
      const text = extractResponseText(data);

      if (!text) throw new Error("No response from API.");

      // Try to parse JSON from the response
      let parsed;
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      }

      if (parsed && parsed.steps && parsed.feeSummary) {
        setGuideData(parsed);
      } else if (parsed && parsed.steps) {
        setGuideData({ ...parsed, feeSummary: parsed.feeSummary || [
          { value: "$185", label: "Application Fee" },
          { value: "$150", label: "Annual Renewal" },
          { value: "7-14", label: "Business Days" },
          { value: "3", label: "Required Visits" },
        ]});
      } else {
        // Fallback: store raw AI text
        setGuideData({ aiText: text });
      }

      goToScreen(3);
    } catch (e) {
      console.warn("API call failed, using fallback guide data:", e.message);
      // Use fallback data
      setGuideData(buildFallbackGuide(selectedLicense, businessName));
      setError("");
      goToScreen(3);
    } finally {
      setLoading(false);
    }
  };

  // Define screens as a map for rendering
  const screens = [
    <div key="s0" className={`screen${currentScreen === 0 ? " active" : ""}`}>
      <HeroScreen onGoTo={goToScreen} />
    </div>,
    <div key="s1" className={`screen${currentScreen === 1 ? " active" : ""}`}>
      <LicenseSelection
        selected={selectedLicense}
        onSelect={setSelectedLicense}
        onGoTo={goToScreen}
      />
    </div>,
    <div key="s2" className={`screen${currentScreen === 2 ? " active" : ""}`}>
      <BusinessForm
        licenseType={selectedLicense}
        businessName={businessName}
        businessAddress={businessAddress}
        businessType={businessType}
        employees={employees}
        onUpdate={handleUpdate}
        onGoTo={goToScreen}
        onSubmit={generateGuide}
        loading={loading}
        error={error}
      />
    </div>,
    <div key="s3" className={`screen${currentScreen === 3 ? " active" : ""}`}>
      {guideData ? (
        <GuideResults
          guideData={guideData}
          licenseType={selectedLicense}
          businessName={businessName}
          onGoTo={goToScreen}
        />
      ) : (
        <div className="screen-section centered">
          <div className="results-container" style={{ textAlign: "center", padding: "80px 24px" }}>
            <p>No guide data yet. Please fill in your business details first.</p>
            <button className="btn btn-primary" onClick={() => goToScreen(2)} style={{ marginTop: 16 }}>
              Go to Business Details
            </button>
          </div>
        </div>
      )}
    </div>,
    <div key="s4" className={`screen${currentScreen === 4 ? " active" : ""}`}>
      <NextSteps
        licenseType={selectedLicense}
        businessName={businessName}
        guideData={guideData}
        onGoTo={goToScreen}
      />
    </div>,
  ];

  return (
    <div className="app-container">
      {/* Glass Orbs Background */}
      <div className="glass-orb glass-orb-1"></div>
      <div className="glass-orb glass-orb-2"></div>

      {/* Step Progress Indicator */}
      <StepIndicator current={currentScreen} onGoTo={goToScreen} />

      {/* All Screens */}
      {screens}

      {/* Footer for screens that don't have one */}
      {currentScreen < 4 && (
        <footer className="municipal-footer">
          <div className="footer-content">
            <div className="footer-logo">
              <FooterSeal size={28} />
              <span className="footer-title">City of Ashtabula — License Wizard</span>
            </div>
            <div className="footer-links">
              <a href="#" className="footer-link">Business Licensing Guide</a>
              <a href="#" className="footer-link">City Clerk</a>
              <a href="#" className="footer-link">City Website</a>
              <a href="#" className="footer-link">Accessibility</a>
            </div>
            <p className="footer-copyright">
              © 2026 City of Ashtabula, Ohio. All rights reserved.<br />
              Photos: Various contributors, CC BY-SA (Wikimedia Commons). Built by Noirsys for the New Ashtabula Initiative.
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
