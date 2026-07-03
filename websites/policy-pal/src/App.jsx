import { useState } from "react";
import {
  callGeminiAPI,
  extractResponseText,
  getErrorMessage,
  isAPIConfigured,
} from "./api-client.js";
import "./App.css";

const coverageFocusOptions = [
  "Homeowners renewal",
  "Auto bundle review",
  "Business property policy",
  "Life insurance comparison",
];

const carrierLensOptions = [
  "Single-carrier renewal",
  "Multi-carrier comparison",
  "Client-facing review prep",
];

const heritagePoints = [
  "Founded in 1828 and still family-owned in Ashtabula",
  "Built for independent agents comparing coverage across carriers",
  "Supports accounts ranging from one car to multi-state operations",
];

const workflowCards = [
  {
    title: "Coverage snapshot",
    detail:
      "Highlights what is protected, where the limits matter, and which exposures deserve a second look before the client meeting.",
  },
  {
    title: "Exclusions and gaps",
    detail:
      "Calls out the plain-language exceptions that can easily get missed when a renewal or new quote comes in quickly.",
  },
  {
    title: "Review-ready next step",
    detail:
      "Ends with a clean recommendation the agent can bring into the follow-up conversation with confidence.",
  },
];

const featureList = [
  "5-second policy summary draft",
  "Coverage and exclusion callouts",
  "Multi-carrier comparison framing",
  "Client-friendly renewal review prep",
];

function buildFallbackSummary({ policyType, carrierLens, clientName, policyNotes }) {
  const customer = clientName.trim() || "the client";
  const note = policyNotes.trim();

  return `Policy review for ${customer}

Coverage focus
- ${policyType} reviewed through a ${carrierLens.toLowerCase()} lens.
- Current draft appears aligned with the client's core protection needs, but limit structure and deductible fit should be confirmed before binding.

Watch items
- Review exclusions, endorsement changes, and any valuation assumptions that could affect claim expectations.
- Confirm whether recent property, vehicle, business, or household changes create an exposure gap.

Recommended next step
- Schedule a short coverage review and walk ${customer} through the summary in plain language before renewal.

Agent note
- ${note || "Use this space to paste renewal notes, carrier observations, or key coverage questions."}`;
}

function App() {
  const assetBase = import.meta.env.BASE_URL;
  const logoSrc = `${assetBase}assets/kollhoff-logo.png`;
  const [clientName, setClientName] = useState("Miller Family Properties");
  const [policyType, setPolicyType] = useState(coverageFocusOptions[2]);
  const [carrierLens, setCarrierLens] = useState(carrierLensOptions[1]);
  const [policyNotes, setPolicyNotes] = useState(
    "Commercial property renewal for two locations. Carrier raised deductible, added water backup sublimit, and changed business interruption wording.",
  );
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sourceNote, setSourceNote] = useState("Demo-ready local summary");

  const apiConfigured = isAPIConfigured();

  const summarize = async () => {
    setLoading(true);
    setError("");

    const fallback = buildFallbackSummary({
      policyType,
      carrierLens,
      clientName,
      policyNotes,
    });

    if (!apiConfigured) {
      setSummary(fallback);
      setSourceNote("Demo-ready local summary");
      setLoading(false);
      return;
    }

    try {
      const prompt = `You are assisting Kollhoff Insurance Agency, an independent family-owned insurance agency founded in 1828 in Ashtabula, Ohio.

Create a concise internal policy review summary for an insurance agent.
Client: ${clientName || "Client"}
Coverage type: ${policyType}
Review lens: ${carrierLens}
Policy notes: ${policyNotes || "No notes provided"}

Requirements:
- Professional but plainspoken
- Use these sections exactly: Coverage focus, Watch items, Recommended next step
- Mention likely exclusions, limits, deductibles, or endorsement changes when appropriate
- Tailor the recommendation for an independent agency comparing carriers
- Keep it under 170 words
- Plain text only`;

      const data = await callGeminiAPI(prompt);
      const text = extractResponseText(data).trim();
      setSummary(text || fallback);
      setSourceNote(text ? "Generated with live AI copy" : "Demo-ready local summary");
    } catch (apiError) {
      setSummary(fallback);
      setSourceNote("Live API unavailable, showing local demo summary");
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
            <div className="eyebrow">Kollhoff Insurance Agency</div>
            <div className="brand-row">
              <img
                src={logoSrc}
                alt="Kollhoff Insurance Agency"
                className="brand-logo"
              />
              <div>
                <p className="brand-kicker">Big Company Protection, Small Agency Attention</p>
                <h1>Understand policies in 5 seconds, then explain them with confidence.</h1>
              </div>
            </div>
            <p className="hero-text">
              A pitch-ready coverage summary workflow designed for Kollhoff Insurance
              Agency: independent, family-owned, multi-carrier, and built for policy
              reviews that still need personal attention.
            </p>

            <div className="hero-stats">
              <div>
                <strong>Est. 1828</strong>
                <span>one of Ohio&apos;s oldest agencies</span>
              </div>
              <div>
                <strong>4 core lines</strong>
                <span>home, auto, business, life</span>
              </div>
              <div>
                <strong>Multi-carrier ready</strong>
                <span>built for independent comparison work</span>
              </div>
            </div>
          </div>

          <aside className="hero-panel">
            <div className="panel-badge">Independent agency workflow</div>
            <h2>Built for review conversations, not generic AI output.</h2>
            <ul className="bullet-list">
              {heritagePoints.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="panel-note">
              The pitch here is simple: faster internal review, clearer client conversations,
              and more confidence when carrier language gets dense.
            </div>
          </aside>
        </header>

        <main className="content-grid">
          <section className="workspace-card">
            <div className="section-heading">
              <p className="section-label">Agent workspace</p>
              <h2>Prepare a cleaner review before the client call.</h2>
            </div>

            <div className="form-grid">
              <label className="field">
                <span>Client or account</span>
                <input
                  type="text"
                  value={clientName}
                  onChange={(event) => setClientName(event.target.value)}
                  placeholder="Client or account name"
                />
              </label>

              <div className="field">
                <span>Coverage focus</span>
                <div className="pill-row">
                  {coverageFocusOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={option === policyType ? "pill active" : "pill"}
                      onClick={() => setPolicyType(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="field field-full">
                <span>Review lens</span>
                <div className="pill-row">
                  {carrierLensOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={option === carrierLens ? "pill active" : "pill"}
                      onClick={() => setCarrierLens(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <label className="field field-full">
                <span>Policy notes</span>
                <textarea
                  value={policyNotes}
                  onChange={(event) => setPolicyNotes(event.target.value)}
                  rows={6}
                  placeholder="Paste renewal notes, endorsement changes, exclusions, deductible shifts, or carrier comparison context."
                />
              </label>
            </div>

            <div className="cta-row">
              <button className="primary-cta" type="button" onClick={summarize} disabled={loading}>
                {loading ? "Preparing summary..." : "Generate policy review summary"}
              </button>
              <p className="helper-text">
                {apiConfigured
                  ? "Live AI is configured. The summary falls back to a local demo draft if the API is unavailable."
                  : "No live API key detected, so the page uses a polished local demo summary."}
              </p>
            </div>

            {error && <div className="alert">{error}</div>}
          </section>

          <section className="summary-card">
            <div className="summary-head">
              <div>
                <p className="section-label">Summary output</p>
                <h2>Agent-ready, client-friendly, and carrier-aware.</h2>
              </div>
              <span className="source-tag">{sourceNote}</span>
            </div>

            <div className="summary-body">
              {summary ? (
                <pre>{summary}</pre>
              ) : (
                <div className="empty-state">
                  <h3>Preview the draft your team reviews first</h3>
                  <p>
                    Generate a sample summary to see how Kollhoff can turn dense
                    policy language into a sharper renewal or comparison conversation.
                  </p>
                </div>
              )}
            </div>
          </section>

          <section className="insight-card">
            <div className="section-heading">
              <p className="section-label">Why this fits Kollhoff</p>
              <h2>Tailored to how an independent agency actually works.</h2>
            </div>
            <div className="feature-grid">
              {featureList.map((item) => (
                <article key={item} className="feature-item">
                  <h3>{item}</h3>
                  <p>
                    Supports faster analysis without replacing the agency judgment
                    that long-standing client relationships depend on.
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="journey-card">
            <div className="section-heading">
              <p className="section-label">Review flow</p>
              <h2>Pitch the operational improvement, not just the interface.</h2>
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
          <p>Policy Pal demo concept for Kollhoff Insurance Agency.</p>
          <p>Focused on independent-agent coverage review, multi-carrier comparison, and clearer client conversations.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
