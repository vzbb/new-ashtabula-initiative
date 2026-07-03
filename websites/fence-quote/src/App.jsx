import { useEffect, useState } from "react";
import { callGeminiAPI, extractResponseText } from "./api-client.js";
import "./App.css";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const geminiService = {
  async generateContent(prompt) {
    if (!apiKey || apiKey === "undefined") throw new Error("API key not configured.");
    const data = await callGeminiAPI(prompt);
    const text = extractResponseText(data);
    return text;
  },
};

const BRAND_NAME = "Miller's Integrity Construction LLC";
const BRAND_TAGLINE = "Amish craftsmanship. Honest quotes. Built to last.";
const BRAND_CONTACT = "440-321-7595";
const SERVICE_AREA = "Ashtabula, Portage, Geauga, Lake, and Cuyahoga counties";
const SAME_DAY_PROMISE = "Same-day quote follow-up for qualified fence projects";
const BRAND_SPECIALTY = "Split rail, cedar privacy, vinyl, chain link, and custom farm fencing";

// Fence/picket logo
const LogoIcon = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="12" width="4" height="28" rx="1" fill="#8b5a2b" />
    <rect x="20" y="12" width="4" height="28" rx="1" fill="#8b5a2b" />
    <rect x="32" y="12" width="4" height="28" rx="1" fill="#8b5a2b" />
    <rect x="40" y="12" width="4" height="28" rx="1" fill="#8b5a2b" />
    <rect x="6" y="18" width="40" height="3" rx="1" fill="#6d4c41" />
    <rect x="6" y="32" width="40" height="3" rx="1" fill="#6d4c41" />
    <path d="M10 12l-2-4h4l-2 4zM22 12l-2-4h4l-2 4zM34 12l-2-4h4l-2 4zM42 12l-2-4h4l-2 4z" fill="#5d4037" />
    <circle cx="26" cy="6" r="4" fill="#87ceeb" />
  </svg>
);

// Property line pattern
const FencePattern = () => (
  <svg className="fence-pattern" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g opacity="0.06">
      <path d="M0 30h100M0 50h100M0 70h100" stroke="#8b5a2b" strokeWidth="1" strokeDasharray="5 5" />
      <rect x="10" y="10" width="3" height="30" fill="#8b5a2b" />
      <rect x="30" y="10" width="3" height="30" fill="#8b5a2b" />
      <rect x="50" y="10" width="3" height="30" fill="#8b5a2b" />
      <rect x="70" y="10" width="3" height="30" fill="#8b5a2b" />
      <rect x="90" y="10" width="3" height="30" fill="#8b5a2b" />
      <rect x="20" y="60" width="3" height="30" fill="#8b5a2b" />
      <rect x="40" y="60" width="3" height="30" fill="#8b5a2b" />
      <rect x="60" y="60" width="3" height="30" fill="#8b5a2b" />
      <rect x="80" y="60" width="3" height="30" fill="#8b5a2b" />
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
    { id: "chainlink", label: "Chain Link", price: "$" },
  ];

  const heights = ["4ft", "6ft", "8ft"];

  useEffect(() => {
    document.title = `${BRAND_NAME} | Fence Quote`;
  }, []);

  const getQuote = async () => {
    setLoading(true);
    setError("");
    setQuote("");
    try {
      const prompt = `Write a concise fence quote summary for ${BRAND_NAME}. Project: ${linearFeet} linear feet of ${height} ${material} fence. Emphasize Amish craftsmanship, split rail or custom fabrication when relevant, include an estimated range, timeline, and a direct CTA to call ${BRAND_CONTACT}. Keep it under 85 words and sound trustworthy, local, and specific to Ashtabula County.`;
      const text = await geminiService.generateContent(prompt);
      setQuote(text);
    } catch {
      const materialLabel = materials.find((item) => item.id === material)?.label ?? material;
      setQuote(
        `For a ${linearFeet}-foot ${height} ${materialLabel.toLowerCase()} fence, ${BRAND_NAME} would typically start with a same-day follow-up and a site-specific range after layout review. Expect the strongest fit for split rail, cedar, vinyl, and custom agricultural runs. Call ${BRAND_CONTACT} to confirm measurements, gates, terrain, and scheduling in ${SERVICE_AREA}.`
      );
      setError("");
    } finally {
      setLoading(false);
    }
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
            <span className="logo-title">{BRAND_NAME}</span>
            <span className="logo-subtitle">{BRAND_TAGLINE}</span>
          </div>
        </div>
        <div className="header-meta">
          <span className="header-badge">{SERVICE_AREA}</span>
          <span className="header-badge">Call {BRAND_CONTACT}</span>
        </div>
      </header>

      <main className="content">
        <div className="hero">
          <p className="eyebrow">Fence Quote Assistant</p>
          <h1>Get a Miller&apos;s Integrity fence quote in minutes</h1>
          <p className="sub">
            Amish craftsmanship, split-rail expertise, and clean estimates for homeowners and farms
            across Ashtabula County and the surrounding service area.
          </p>
          <div className="hero-tags" aria-label="Buyer-specific trust signals">
            <span>20+ years experience</span>
            <span>References available</span>
            <span>Satisfaction guaranteed</span>
          </div>
        </div>

        <section className="trust-row" aria-label="Brand highlights">
          <article>
            <strong>20+ years</strong>
            <span>of craftsmanship and construction experience</span>
          </article>
          <article>
            <strong>Split rail + custom</strong>
            <span>specialty work that fits the buyer profile</span>
          </article>
          <article>
            <strong>Same-day follow-up</strong>
            <span>{SAME_DAY_PROMISE}</span>
          </article>
        </section>

        <section className="pitch-grid" aria-label="Why Miller's Integrity">
          <article className="pitch-card">
            <span className="pitch-kicker">Best fit</span>
            <h3>Built for rural property owners and clean residential installs</h3>
            <p>
              Use this flow to scope split rail, cedar, vinyl, chain link, and custom runs without
              losing the craftsmanship story that makes Miller&apos;s Integrity distinct.
            </p>
          </article>
          <article className="pitch-card">
            <span className="pitch-kicker">Confidence layer</span>
            <h3>References available and workmanship-first positioning</h3>
            <p>
              The page now speaks like a local builder&apos;s estimate intake, not a generic SaaS
              calculator. That makes it stronger for buyer demos and easier to white-label later.
            </p>
          </article>
        </section>

        <section className="service-strip" aria-label="Core Miller's Integrity selling points">
          <article>
            <strong>Specialty</strong>
            <span>{BRAND_SPECIALTY}</span>
          </article>
          <article>
            <strong>Service area</strong>
            <span>{SERVICE_AREA}</span>
          </article>
          <article>
            <strong>Next step</strong>
            <span>Call {BRAND_CONTACT} for layout review, gates, terrain, and scheduling.</span>
          </article>
        </section>

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
              {materials.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={`material-btn ${material === m.id ? "active" : ""}`}
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
              {heights.map((h) => (
                <button
                  key={h}
                  type="button"
                  className={`height-btn ${height === h ? "active" : ""}`}
                  onClick={() => setHeight(h)}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>

          <div className="generate-wrap">
            <button className="quote-btn" onClick={getQuote} disabled={loading} type="button">
              {loading ? "Calculating..." : "Get Miller's Quote →"}
            </button>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {quote && (
          <div className="result-card">
            <div className="result-header">
              <div className="result-icon">📋</div>
              <h3>Miller&apos;s Integrity Estimate</h3>
            </div>
            <div className="result-body">
              <pre>{quote}</pre>
            </div>
            <div className="result-actions">
              <button className="btn-outline" type="button">
                Call {BRAND_CONTACT}
              </button>
              <button className="btn-solid" type="button">
                Schedule Consultation
              </button>
            </div>
          </div>
        )}

        <div className="features">
          <div className="feature">
            <div className="feature-icon">⚡</div>
            <h4>Fast quote intake</h4>
            <p>Simple project scoping without losing the local, family-owned feel</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🎯</div>
            <h4>Craftsmanship fit</h4>
            <p>Built around Amish craftsmanship, split rail work, and custom fabrication</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🔒</div>
            <h4>Clear next step</h4>
            <p>Free estimates, references available, and a direct call path to the crew</p>
          </div>
        </div>

        <section className="process-strip" aria-label="How Miller's Integrity uses this">
          <div>
            <strong>1. Scope the footage</strong>
            <span>Capture layout, material, and height before a call-back.</span>
          </div>
          <div>
            <strong>2. Confirm site details</strong>
            <span>Review gates, terrain, and craftsmanship details with the customer.</span>
          </div>
          <div>
            <strong>3. Move to schedule</strong>
            <span>Turn the quote into a same-day follow-up and on-site consultation.</span>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-line" />
        <p>{BRAND_NAME} • Fence quotes for {SERVICE_AREA}</p>
        <p className="footer-contact">
          Call {BRAND_CONTACT} • 20+ years of Amish fence and carpentry craftsmanship
        </p>
      </footer>
    </div>
  );
}

export default App;
