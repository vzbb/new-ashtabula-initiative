import { useState } from "react";
import {
  callGeminiAPI,
  extractResponseText,
  getErrorMessage,
  isAPIConfigured,
} from "./api-client.js";
import "./App.css";

const issueOptions = [
  "Unit ready follow-up",
  "Failed inspection repair",
  "Heating or plumbing issue",
  "Voucher documentation update",
];

const priorityOptions = [
  "Routine",
  "Needs review this week",
  "Urgent health and safety",
];

const programHighlights = [
  "HCV and public housing landlord coordination",
  "Inspection and document readiness support",
  "Affordable housing mission with clear communication",
  "Community-focused follow-up for safe units",
];

const values = [
  "Honesty",
  "Dignity",
  "Respect",
  "Exceptional communication",
  "Care",
  "Responsiveness",
];

const workflowCards = [
  {
    title: "Landlord update intake",
    detail:
      "Capture the unit, issue, and urgency so AMHA staff can respond with a consistent landlord-facing message.",
  },
  {
    title: "Compliance-ready guidance",
    detail:
      "Frame repairs and documentation around safe housing, voucher readiness, and inspection follow-through.",
  },
  {
    title: "Clear next-step reply",
    detail:
      "Send a concise update that helps landlords know what happens next, what to prepare, and who will follow up.",
  },
];

function buildFallbackReply({ property, issueType, priority, detail }) {
  return `AMHA Landlord Portal update

Property
- ${property}

Current issue
- ${issueType}
- Priority level: ${priority}

Recommended next step
- AMHA staff should confirm receipt, review any required repair or voucher documentation, and advise whether the unit needs an inspection follow-up before approval.

Landlord guidance
- Please keep the unit in safe, rentable condition and have repair notes, photos, or contractor updates ready if requested.

Case note
- ${detail || "No additional details were provided."}`;
}

function App() {
  const assetBase = import.meta.env.BASE_URL;
  const logoSrc = `${assetBase}assets/amha-logo.png`;

  const [property, setProperty] = useState("Harbor Ridge Apartments - Unit 14B");
  const [issueType, setIssueType] = useState(issueOptions[1]);
  const [priority, setPriority] = useState(priorityOptions[1]);
  const [detail, setDetail] = useState(
    "Owner completed bathroom vent repair and repainting after inspection notes. Needs confirmation on whether reinspection can be scheduled this week for HCV approval.",
  );
  const [reply, setReply] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sourceNote, setSourceNote] = useState("Demo-ready local response");

  const apiConfigured = isAPIConfigured();

  const createReply = async () => {
    setLoading(true);
    setError("");

    const fallback = buildFallbackReply({
      property,
      issueType,
      priority,
      detail,
    });

    if (!apiConfigured) {
      setReply(fallback);
      setSourceNote("Demo-ready local response");
      setLoading(false);
      return;
    }

    try {
      const prompt = `You are preparing a landlord response for Ashtabula Metropolitan Housing Authority (AMHA).

Property: ${property}
Issue type: ${issueType}
Priority: ${priority}
Detail: ${detail || "No detail provided"}

Requirements:
- Professional, community-focused, compliance-aware tone
- Reflect AMHA's mission of clean and safe affordable housing
- Use these section headings exactly: Property, Current issue, Recommended next step, Landlord guidance
- Mention inspection or documentation follow-up when relevant
- Keep it under 170 words
- Plain text only`;

      const data = await callGeminiAPI(prompt);
      const text = extractResponseText(data).trim();
      setReply(text || fallback);
      setSourceNote(text ? "Generated with live AI copy" : "Demo-ready local response");
    } catch (apiError) {
      setReply(fallback);
      setSourceNote("Live API unavailable, showing local demo response");
      setError(getErrorMessage(apiError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="page">
        <header className="hero-card">
          <div className="hero-copy">
            <div className="eyebrow">AMHA Landlord Portal</div>
            <div className="brand-row">
              <img
                src={logoSrc}
                alt="Ashtabula Metropolitan Housing Authority"
                className="brand-logo"
              />
              <div>
                <p className="brand-kicker">Clean and safe affordable housing</p>
                <h1>Help landlords keep units compliant, responsive, and voucher-ready.</h1>
              </div>
            </div>
            <p className="hero-text">
              A buyer-specific AMHA portal concept for landlord communication,
              repair follow-up, and inspection-aware unit readiness across public
              housing and Housing Choice Voucher workflows.
            </p>

            <div className="hero-stats">
              <div>
                <strong>4 AMHA programs</strong>
                <span>HCV, public housing, USDA housing, capital fund</span>
              </div>
              <div>
                <strong>Inspection-aware</strong>
                <span>built for readiness, repairs, and follow-up</span>
              </div>
              <div>
                <strong>Community-first</strong>
                <span>designed around residents, landlords, and stakeholders</span>
              </div>
            </div>
          </div>

          <aside className="hero-panel">
            <div className="panel-badge">Housing authority workflow</div>
            <h2>Built for landlords working with AMHA, not generic property tech.</h2>
            <ul className="bullet-list">
              {programHighlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="panel-note">
              AMHA&apos;s mission is to provide Ashtabula County residents clean and
              safe affordable housing while keeping landlord communication responsive
              and program-ready.
            </p>
            <div className="value-grid">
              {values.map((value) => (
                <span key={value} className="value-chip">{value}</span>
              ))}
            </div>
          </aside>
        </header>

        <main className="content-grid">
          <section className="workspace-card">
            <div className="section-heading">
              <p className="section-label">Landlord case workspace</p>
              <h2>Prepare a clear AMHA follow-up message.</h2>
            </div>

            <div className="form-grid">
              <label className="field">
                <span>Property or unit</span>
                <input
                  type="text"
                  value={property}
                  onChange={(event) => setProperty(event.target.value)}
                  placeholder="Property name or unit"
                />
              </label>

              <div className="field">
                <span>Issue type</span>
                <div className="pill-row">
                  {issueOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={option === issueType ? "pill active" : "pill"}
                      onClick={() => setIssueType(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="field field-full">
                <span>Priority</span>
                <div className="pill-row">
                  {priorityOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={option === priority ? "pill active" : "pill"}
                      onClick={() => setPriority(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <label className="field field-full">
                <span>Case detail</span>
                <textarea
                  value={detail}
                  onChange={(event) => setDetail(event.target.value)}
                  rows={6}
                  placeholder="Describe the repair, inspection note, landlord update, or voucher-readiness question."
                />
              </label>
            </div>

            <div className="cta-row">
              <button className="primary-cta" type="button" onClick={createReply} disabled={loading}>
                {loading ? "Preparing AMHA response..." : "Generate landlord response"}
              </button>
              <p className="helper-text">
                {apiConfigured
                  ? "Live AI is configured. The portal falls back to a polished local response if the API is unavailable."
                  : "No live API key detected, so the portal uses a polished local demo response."}
              </p>
            </div>

            {error && <div className="alert">{error}</div>}
          </section>

          <section className="reply-card">
            <div className="reply-head">
              <div>
                <p className="section-label">AMHA response draft</p>
                <h2>Professional, responsive, and compliance-aware.</h2>
              </div>
              <span className="source-tag">{sourceNote}</span>
            </div>

            <div className="reply-body">
              {reply ? (
                <pre>{reply}</pre>
              ) : (
                <div className="empty-state">
                  <h3>Preview the landlord update AMHA sends next</h3>
                  <p>
                    Generate a sample response to show how the portal can turn
                    repair and inspection updates into a clear landlord-facing message.
                  </p>
                </div>
              )}
            </div>
          </section>

          <section className="insight-card">
            <div className="section-heading">
              <p className="section-label">Why this fits AMHA</p>
              <h2>Shaped around housing authority responsibilities and values.</h2>
            </div>
            <div className="feature-grid">
              <article className="feature-item">
                <h3>Voucher participation support</h3>
                <p>Helps landlords stay aligned with HCV readiness, paperwork expectations, and communication flow.</p>
              </article>
              <article className="feature-item">
                <h3>Safe-unit follow-up</h3>
                <p>Keeps repairs and inspection notes framed around safe, clean, affordable housing outcomes.</p>
              </article>
              <article className="feature-item">
                <h3>Stakeholder communication</h3>
                <p>Supports clearer coordination across landlords, residents, and AMHA staff without sounding generic.</p>
              </article>
            </div>
          </section>

          <section className="journey-card">
            <div className="section-heading">
              <p className="section-label">Portal flow</p>
              <h2>Pitch the operational improvement, not just the form.</h2>
            </div>
            <div className="journey-grid">
              {workflowCards.map((card) => (
                <article key={card.title} className="journey-step">
                  <h3>{card.title}</h3>
                  <p>{card.detail}</p>
                </article>
              ))}
            </div>
          </section>
        </main>

        <footer className="footer">
          <p>AMHA landlord portal concept for Ashtabula Metropolitan Housing Authority.</p>
          <p>Focused on safe housing, landlord communication, inspections, and voucher-ready unit follow-up.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
