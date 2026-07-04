import { useState } from "react";
import "./App.css";

const assetBase = import.meta.env.BASE_URL;

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const API_CONFIG = {
  TIMEOUT_MS: 30000,
  MAX_RETRIES: 3,
  INITIAL_RETRY_DELAY_MS: 1000,
  MAX_RETRY_DELAY_MS: 10000,
  RATE_LIMIT_STATUS: 429,
  RETRYABLE_STATUS_CODES: [408, 429, 500, 502, 503, 504],
};

const JURISDICTIONS = [
  {
    value: "county",
    label: "County Coordination",
    office: "Ashtabula County Planning & Development Department",
    contact: "(440) 576-3737",
    note: "Use when you need township contacts, zoning resolution links, or county-level routing help.",
  },
  {
    value: "city",
    label: "City of Ashtabula",
    office: "City of Ashtabula Zoning Department",
    contact: "(440) 992-7118",
    note: "City permits often involve a zoning review timeline of up to one week before pickup and fees.",
  },
  {
    value: "township",
    label: "Township Zoning",
    office: "Township zoning office",
    contact: "County directory support",
    note: "Best for most township parcels. The county keeps the zoning directory used to route residents correctly.",
  },
];

const PROJECT_OPTIONS = [
  {
    value: "Detached garage or outbuilding",
    summary:
      "Expect zoning review for setbacks, lot coverage, and placement. Larger structures may also trigger building permit coordination.",
  },
  {
    value: "Deck, patio, or home addition",
    summary:
      "Review usually focuses on setbacks, accessory structure rules, and whether building permit review must follow zoning approval.",
  },
  {
    value: "Swimming pool installation",
    summary:
      "Pools commonly need zoning confirmation for placement, fencing, and distance from property lines before work begins.",
  },
  {
    value: "New business occupancy or site change",
    summary:
      "Business projects often need zoning use review plus confirmation that site conditions and parking align with the applicable district.",
  },
  {
    value: "Lot split or property redevelopment",
    summary:
      "Redevelopment questions usually require parcel-specific review, district verification, and coordination across township or city staff.",
  },
];

const COUNTY_FACTS = [
  "Coordinates zoning information across 27 townships",
  "Maintains zoning contact directory and township resolution links",
  "Three townships do not have township zoning resolutions: Monroe, Richmond, and Windsor",
  "Supports residents, contractors, and township officials with routing and education",
];

const DEPARTMENT_SERVICES = [
  "Comprehensive township zoning contact directory",
  "Township zoning resolution links when digital editions are available",
  "Referral support when specific questions belong with township zoning officials",
  "County-level intake framing for routing, permit prep, and public education",
];

const CONTACT_CARDS = [
  {
    title: "County Planning & Development",
    details: ["25 W Jefferson St", "Jefferson, OH 44047", "(440) 576-3737"],
  },
  {
    title: "City of Ashtabula Zoning",
    details: ["4250 Lake Ave", "Ashtabula, OH 44004", "(440) 992-7118"],
  },
  {
    title: "Department Positioning",
    details: ["Official, institutional, trustworthy", "Process-oriented intake", "County-first routing"],
  },
];

const OFFICIAL_REFERENCES = [
  {
    label: "County zoning page",
    href: "https://www.ashtabulacounty.us/278/Zoning",
    note: "Primary county source for zoning contacts, resolutions, and coordination support.",
  },
  {
    label: "City of Ashtabula zoning",
    href: "https://www.cityofashtabula.com/zoning",
    note: "Municipal permit process reference, including the one-week review timeline and submission methods.",
  },
];

const PROCESS_STANDARDS = [
  "County role: coordinate township contacts, education, and zoning resolution access.",
  "City role: review city-specific zoning permits, often on a timeline of up to one week.",
  "Applicant prep: bring a site plan, property details, and the correct jurisdiction before requesting determinations.",
];

const delay = (ms) => {
  const jitter = Math.random() * 200;
  return new Promise((resolve) => setTimeout(resolve, ms + jitter));
};

const getBackoffDelay = (retryCount) => {
  const exponentialDelay = API_CONFIG.INITIAL_RETRY_DELAY_MS * 2 ** retryCount;
  return Math.min(exponentialDelay, API_CONFIG.MAX_RETRY_DELAY_MS);
};

const fetchWithTimeout = async (url, options = {}, timeoutMs = API_CONFIG.TIMEOUT_MS) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

const isRetryable = (errorOrResponse) => {
  if (errorOrResponse instanceof Response) {
    return API_CONFIG.RETRYABLE_STATUS_CODES.includes(errorOrResponse.status);
  }

  const errorMessage = errorOrResponse.message?.toLowerCase() || "";
  return (
    errorOrResponse.name === "TypeError" ||
    errorMessage.includes("fetch") ||
    errorMessage.includes("network") ||
    errorMessage.includes("failed to fetch") ||
    errorMessage.includes("timeout")
  );
};

const callOpenRouterAPI = async (prompt, model = "google/gemini-2.5-flash-lite", retryCount = 0) => {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("API key not configured.");
  }

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": window.location.origin,
      "X-Title": "NAI - Zoning Clerk",
    },
    body: JSON.stringify({
      model: model,
      messages: [{ role: "user", content: prompt }],
    }),
  };

  try {
    const response = await fetchWithTimeout(OPENROUTER_URL, options, API_CONFIG.TIMEOUT_MS);

    if (response.status === API_CONFIG.RATE_LIMIT_STATUS) {
      if (retryCount < API_CONFIG.MAX_RETRIES) {
        await delay(getBackoffDelay(retryCount));
        return callOpenRouterAPI(prompt, model, retryCount + 1);
      }
      throw new Error("Rate limit exceeded. Please wait a moment and try again.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `API error: ${response.status}`;

      if (
        API_CONFIG.RETRYABLE_STATUS_CODES.includes(response.status) &&
        retryCount < API_CONFIG.MAX_RETRIES
      ) {
        await delay(getBackoffDelay(retryCount));
        return callOpenRouterAPI(prompt, model, retryCount + 1);
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content;

    if (!text) {
      throw new Error("No response content received from API.");
    }

    return text;
  } catch (error) {
    if (isRetryable(error) && retryCount < API_CONFIG.MAX_RETRIES) {
      await delay(getBackoffDelay(retryCount));
      return callOpenRouterAPI(prompt, model, retryCount + 1);
    }

    throw error;
  }
};

const buildFallbackGuidance = ({ address, project, jurisdiction }) => {
  const jurisdictionData = JURISDICTIONS.find((item) => item.value === jurisdiction) || JURISDICTIONS[0];
  const projectData = PROJECT_OPTIONS.find((item) => item.value === project) || PROJECT_OPTIONS[0];
  const townshipNote =
    jurisdiction === "township"
      ? "If the parcel is in Monroe, Richmond, or Windsor Township, zoning may not be administered at the township level and county guidance is especially important."
      : "";
  const cityNote =
    jurisdiction === "city"
      ? "For City of Ashtabula parcels, zoning review can take up to one week before permit pickup and fee payment."
      : "";

  return [
    `Preliminary guidance for ${address}: route this request through ${jurisdictionData.office}.`,
    projectData.summary,
    "Prepare a site plan showing property lines, structure placement, and access details before formal submission.",
    cityNote || "Use the county zoning directory to confirm whether the parcel is handled by a township or municipal office.",
    townshipNote,
  ]
    .filter(Boolean)
    .join(" ");
};

function App() {
  const [address, setAddress] = useState("25 W Jefferson St, Jefferson, OH 44047");
  const [project, setProject] = useState(PROJECT_OPTIONS[0].value);
  const [jurisdiction, setJurisdiction] = useState("county");
  const [guidance, setGuidance] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [guidanceSource, setGuidanceSource] = useState("Ready for intake");

  const checkZoning = async () => {
    const fallback = buildFallbackGuidance({ address, project, jurisdiction });
    const selectedJurisdiction =
      JURISDICTIONS.find((item) => item.value === jurisdiction) || JURISDICTIONS[0];

    setLoading(true);
    setError("");
    setGuidance("");

    try {
      const prompt = `You are preparing a concise official-style zoning guidance summary for the Ashtabula County Planning & Development Department.

Primary office: Ashtabula County Planning & Development Department, 25 W Jefferson St, Jefferson, OH 44047, phone (440) 576-3737.
County facts: 27 townships are coordinated through county zoning resources. Monroe, Richmond, and Windsor do not have township zoning resolutions. The City of Ashtabula zoning department is at 4250 Lake Ave, Ashtabula, OH 44004, phone (440) 992-7118, and city review may take up to one week.

Request details:
- Address: ${address}
- Project: ${project}
- Routing mode: ${selectedJurisdiction.label}

Write 110-140 words in a calm, official tone.
Include:
1. Who likely handles the request
2. What the applicant should prepare first
3. A routing caution about county/city/township differences
4. A final next step with phone guidance
Do not invent parcel-specific zoning districts or legal determinations.`;

      const text = await callOpenRouterAPI(prompt);
      setGuidance(text);
      setGuidanceSource("AI-assisted county briefing");
    } catch (requestError) {
      setGuidance(fallback);
      setGuidanceSource("Local demo guidance");
      setError(
        "AI briefing was unavailable, so the tool switched to a local county demo summary."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="bg-wave-pattern"></div>

      <div className="official-banner">
        <div className="official-banner-content">
          <span className="official-banner-seal">AC</span>
          <span>Ashtabula County Planning &amp; Development Department</span>
          <span className="official-banner-seal">OH</span>
        </div>
      </div>

      <header className="municipal-header">
        <div className="header-content">
          <div className="city-logo">
            <img
              src={`${assetBase}ashtabula-county-logo.png`}
              alt="Ashtabula County Planning and Development Department"
              className="county-logo-image"
            />
            <div className="city-logo-text">
              <span className="city-logo-title">Ashtabula County Zoning Portal</span>
              <span className="city-logo-subtitle">County coordination for city and township routing</span>
            </div>
          </div>
          <div className="header-badge-group">
            <span className="badge badge-blue">27 townships coordinated</span>
            <span className="badge badge-red">Planning &amp; Development intake</span>
          </div>
        </div>
      </header>

      <main className="municipal-main">
        <div className="content-container">
          <section className="hero-section hero-section-county">
            <div className="hero-eyebrow">County-first zoning intake</div>
            <h1 className="hero-title">Navigate zoning. Build with confidence.</h1>
            <p className="hero-subtitle">
              Ashtabula County Zoning Portal is positioned as a department-grade intake experience
              for the Ashtabula County Planning &amp; Development Department, helping residents,
              contractors, and township officials move through county, city, and township zoning
              workflows with more confidence and less routing friction.
            </p>
            <div className="hero-stat-grid">
              <div className="hero-stat-card">
                <strong>27</strong>
                <span>townships supported by county coordination</span>
              </div>
              <div className="hero-stat-card">
                <strong>3</strong>
                <span>townships without township zoning resolutions</span>
              </div>
              <div className="hero-stat-card">
                <strong>1 week</strong>
                <span>typical City of Ashtabula review window reflected in the intake flow</span>
              </div>
            </div>
            <div className="divider"></div>
          </section>

          <section className="info-strip">
            {CONTACT_CARDS.map((card) => (
              <article key={card.title} className="info-pill">
                <p className="info-pill-label">{card.title}</p>
                {card.details.map((detail) => (
                  <p key={detail} className="info-pill-value">
                    {detail}
                  </p>
                ))}
              </article>
            ))}
          </section>

          <section className="service-grid">
            {DEPARTMENT_SERVICES.map((service) => (
              <article key={service} className="service-card">
                <span className="service-card-kicker">Planning &amp; Development</span>
                <p>{service}</p>
              </article>
            ))}
          </section>

          <div className="municipal-card">
            <div className="municipal-card-header municipal-card-header-gold">
              <span className="municipal-card-title">County routing assistant</span>
              <span className="badge badge-red">Official-style intake</span>
            </div>
            <div className="municipal-card-body">
              <div className="form-row">
                <div className="form-section">
                  <label className="form-label">Property address or township reference</label>
                  <input
                    type="text"
                    className="form-input"
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    placeholder="25 W Jefferson St, Jefferson, OH 44047"
                  />
                  <p className="form-hint">
                    Use a parcel address, township hall address, or a project location residents are
                    likely to enter.
                  </p>
                </div>
                <div className="form-section">
                  <label className="form-label">Project type</label>
                  <select
                    className="form-select"
                    value={project}
                    onChange={(event) => setProject(event.target.value)}
                  >
                    {PROJECT_OPTIONS.map((option) => (
                      <option key={option.value}>{option.value}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-section">
                <label className="form-label">Routing mode</label>
                <div className="jurisdiction-grid">
                  {JURISDICTIONS.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      className={`jurisdiction-card${
                        jurisdiction === item.value ? " jurisdiction-card-active" : ""
                      }`}
                      onClick={() => setJurisdiction(item.value)}
                    >
                      <span className="jurisdiction-card-title">{item.label}</span>
                      <span className="jurisdiction-card-office">{item.office}</span>
                      <span className="jurisdiction-card-note">{item.note}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                className="btn btn-primary btn-lg"
                onClick={checkZoning}
                disabled={loading}
                style={{ width: "100%", marginTop: "8px" }}
              >
                {loading ? "Preparing county guidance..." : "Prepare zoning briefing"}
              </button>
            </div>
          </div>

          <div className="municipal-card">
            <div className="municipal-card-header">
              <span className="municipal-card-title">Preliminary guidance</span>
              <span className="badge badge-gold">{guidanceSource}</span>
            </div>
            <div className="municipal-card-body">
              {error ? <div className="alert alert-warning">{error}</div> : null}
              {guidance ? (
                <div className="guidance-output">
                  <p>{guidance}</p>
                </div>
              ) : (
                <p className="empty-state-copy">
                  Generate a briefing to show how the County Planning &amp; Development Department can
                  guide residents, contractors, and township staff to the right zoning office with a
                  more professional digital experience.
                </p>
              )}
            </div>
          </div>

          <section className="feature-grid">
            <article className="municipal-card feature-card">
              <div className="municipal-card-body">
                <div className="feature-icon-shell">01</div>
                <h3>County coordination story</h3>
                <p>
                  The MVP is framed around the county&apos;s real role: keeping residents from getting
                  lost between township, county, and city zoning contacts.
                </p>
              </div>
            </article>
            <article className="municipal-card feature-card">
              <div className="municipal-card-body">
                <div className="feature-icon-shell">02</div>
                <h3>Township-friendly routing</h3>
                <p>
                  The interface now makes township routing explicit and calls out the three townships
                  without township zoning resolutions.
                </p>
              </div>
            </article>
            <article className="municipal-card feature-card">
              <div className="municipal-card-body">
                <div className="feature-icon-shell">03</div>
                <h3>Procurement-ready positioning</h3>
                <p>
                  Contact details, process language, and risk disclaimers are tuned for a county portal
                  instead of a generic civic utility shell.
                </p>
              </div>
            </article>
          </section>

          <section className="municipal-card">
            <div className="municipal-card-header municipal-card-header-gold">
              <span className="municipal-card-title">Department standards and official references</span>
            </div>
            <div className="municipal-card-body">
              <div className="reference-list">
                {OFFICIAL_REFERENCES.map((reference) => (
                  <a
                    key={reference.label}
                    href={reference.href}
                    className="reference-card"
                  >
                    <span className="reference-label">{reference.label}</span>
                    <span className="reference-note">{reference.note}</span>
                  </a>
                ))}
              </div>
              <div className="fact-list process-list">
                {PROCESS_STANDARDS.map((item) => (
                  <div key={item} className="fact-row">
                    <span className="fact-dot"></span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="fact-list">
                {COUNTY_FACTS.map((fact) => (
                  <div key={fact} className="fact-row">
                    <span className="fact-dot"></span>
                    <span>{fact}</span>
                  </div>
                ))}
              </div>
              <div className="alert alert-info county-note">
                Every effort is made to place the most current zoning code and routing information in
                front of users, but changes may have been made at the township level since the last
                county update. This experience is designed to guide intake and routing, not replace
                official parcel-level determinations.
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="municipal-footer">
        <div className="footer-content">
          <div className="footer-top">
            <div className="footer-seal">
              <img
                src={`${assetBase}ashtabula-county-altmark.png`}
                alt="Ashtabula County"
                className="county-altmark-image"
              />
            </div>
            <div>
              <div className="footer-title">Ashtabula County Planning &amp; Development Department</div>
              <div className="footer-subtitle">
                25 W Jefferson St, Jefferson, OH 44047 | (440) 576-3737
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-links">
              <a href="https://www.ashtabulacounty.us/278/Zoning" className="footer-link">
                County zoning page
              </a>
              <a href="https://www.cityofashtabula.com/zoning" className="footer-link">
                City zoning page
              </a>
              <a href="tel:+14405763737" className="footer-link">
                Call county office
              </a>
            </div>
            <p className="footer-copyright">
              © 2026 Ashtabula County, Ohio. Planning &amp; Development intake concept for zoning routing and public guidance.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
