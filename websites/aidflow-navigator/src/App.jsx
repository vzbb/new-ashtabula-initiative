import { useMemo, useState } from "react";
import "./App.css";
import logo211 from "./assets/211-ashtabula-logo.png";
import hero211 from "./assets/211-ashtabula-hero.jpg";

const needs = [
  {
    id: "food",
    label: "Food and groceries",
    intro: "Support with grocery costs, infant nutrition, or pantry referrals.",
    programs: ["snap", "wic"]
  },
  {
    id: "utilities",
    label: "Utility bills and heating costs",
    intro: "Help with winter heating, electric bills, and payment plans.",
    programs: ["heap", "pipp"]
  },
  {
    id: "health",
    label: "Health coverage and care",
    intro: "Coverage for doctor visits, prescriptions, and ongoing care.",
    programs: ["medicaid"]
  },
  {
    id: "housing",
    label: "Housing and rent support",
    intro: "Rental assistance, shelter referrals, and housing stabilization.",
    programs: ["housing", "rent"]
  }
];

const programs = {
  snap: {
    name: "SNAP food assistance",
    organization: "Ohio Benefits / Job and Family Services",
    phone: "1-800-874-8545",
    blurb: "Monthly grocery support for households with low income.",
    documents: ["Photo ID", "Proof of income", "Proof of address", "Expense details if available"],
    linkLabel: "Start at benefits.ohio.gov",
    link: "https://benefits.ohio.gov/"
  },
  wic: {
    name: "WIC nutrition support",
    organization: "Ashtabula County Community Action Agency",
    phone: "1-800-874-8545",
    blurb: "Food, nutrition education, and support for pregnant people, infants, and young children.",
    documents: ["Photo ID", "Proof of address", "Income information", "Pregnancy or child verification"],
    linkLabel: "Contact local WIC support",
    link: "https://accaa.org/"
  },
  heap: {
    name: "HEAP winter utility assistance",
    organization: "Ohio energy assistance partners",
    phone: "1-800-874-8545",
    blurb: "Seasonal help with heating bills for households under income guidelines.",
    documents: ["Utility bill", "Photo ID", "Social Security numbers", "Income verification"],
    linkLabel: "Review HEAP details",
    link: "https://development.ohio.gov/is/is_heap.htm"
  },
  pipp: {
    name: "PIPP payment plan support",
    organization: "Community action and utility partners",
    phone: "1-800-874-8545",
    blurb: "Income-based utility payment planning to keep service stable month to month.",
    documents: ["Recent utility bill", "Income verification", "Photo ID"],
    linkLabel: "Learn about PIPP",
    link: "https://development.ohio.gov/is/is_pipp.htm"
  },
  medicaid: {
    name: "Medicaid coverage screening",
    organization: "Ohio Department of Medicaid",
    phone: "1-800-874-8545",
    blurb: "Health coverage support for children, adults, seniors, and families.",
    documents: ["Photo ID", "Income information", "Residency proof", "Social Security numbers"],
    linkLabel: "Start Medicaid application",
    link: "https://benefits.ohio.gov/"
  },
  housing: {
    name: "Housing voucher and housing support",
    organization: "Local housing and referral partners",
    phone: "1-800-874-8545",
    blurb: "Connections to vouchers, shelter, and housing-related referrals.",
    documents: ["Photo ID", "Proof of current housing status", "Income information", "Lease or notice if available"],
    linkLabel: "Call 211 for housing referrals",
    link: "https://www.211ashtabula.org/"
  },
  rent: {
    name: "Rent assistance triage",
    organization: "211 Ashtabula County / United Way of Ashtabula County",
    phone: "1-800-874-8545",
    blurb: "Triage for local rent help, eviction prevention, and related support.",
    documents: ["Lease or landlord notice", "Household income", "Photo ID", "Past due balance if available"],
    linkLabel: "Open 211 Ashtabula County",
    link: "https://www.211ashtabula.org/"
  }
};

const reassurance = [
  "24/7 live operators are still available when self-service is not enough.",
  "Built to complement 211 Ashtabula County's resource database, not replace human help.",
  "Simple next steps for SNAP, Medicaid, WIC, heating help, and rent-related support."
];

const quickSteps = [
  "Choose the type of help you need first.",
  "Answer a few household questions to narrow the best next step.",
  "See a short document checklist before you call or apply.",
  "Escalate to 211 when the situation is urgent or complicated."
];

const serviceSignals = [
  {
    title: "211-backed triage",
    text: "A calmer first step for residents before they call, text, or email a live operator."
  },
  {
    title: "Built around Ohio benefits handoff",
    text: "Program guidance stays anchored to the real county and state pathways people already use."
  },
  {
    title: "Designed for stressed users",
    text: "Simple choices, document prep, and human backup make the experience easier to trust."
  }
];

function BadgePhone() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7 4.5h3l1.2 3.5-1.7 1.7a14.3 14.3 0 0 0 4.8 4.8l1.7-1.7 3.5 1.2v3A1.8 1.8 0 0 1 17.7 19 16.7 16.7 0 0 1 5 6.3 1.8 1.8 0 0 1 7 4.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BadgeShield() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 3 5.5 6v5.8c0 4.4 2.7 8.4 6.5 9.9 3.8-1.5 6.5-5.5 6.5-9.9V6L12 3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m9.4 12.4 1.7 1.7 3.6-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="m13 6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function App() {
  const [selectedNeed, setSelectedNeed] = useState("food");
  const [household, setHousehold] = useState("adult");
  const [urgency, setUrgency] = useState("soon");
  const [contactMode, setContactMode] = useState("phone");

  const need = needs.find((item) => item.id === selectedNeed) ?? needs[0];

  const recommendedPrograms = useMemo(
    () => need.programs.map((key) => programs[key]),
    [need]
  );

  const openingMessage = useMemo(() => {
    if (urgency === "urgent") {
      return "Your best next step is to connect with a live 211 operator now so they can triage urgent local options.";
    }
    if (household === "family") {
      return "Start with family-focused benefit programs, then keep 211 ready for local follow-through and referrals.";
    }
    if (household === "senior") {
      return "Focus on health, utility, and housing stability programs first, then use 211 for a guided handoff.";
    }
    return "A short self-service path can narrow your next step before you call, text, or email 211 Ashtabula County.";
  }, [urgency, household]);

  const intakeHint =
    contactMode === "text"
      ? "Text-first follow-up works best for simple questions and quick resource handoff."
      : contactMode === "email"
        ? "Email follow-up is useful when you need a written list of next steps and documents."
        : "Phone support is best when your situation is urgent, confusing, or involves multiple needs.";

  return (
    <div className="page-shell">
      <div className="ambient ambient-left" aria-hidden="true" />
      <div className="ambient ambient-right" aria-hidden="true" />

      <div className="page">
        <header className="topbar">
          <div className="brand-block">
            <div>
              <p className="eyebrow">United Way of Ashtabula County</p>
              <h1>211 Ashtabula Benefits Navigator</h1>
              <p className="brand-copy">Self-service benefit guidance that stays connected to 211 Ashtabula County.</p>
            </div>
          </div>

          <div className="topbar-actions">
            <a className="pill-link" href="https://www.211ashtabula.org/" target="_blank" rel="noreferrer">
              211Ashtabula.org
            </a>
            <a className="pill-link strong" href="tel:18008748545">
              Call 1-800-874-8545
            </a>
          </div>
        </header>

        <main className="layout">
          <section className="hero panel">
            <div className="hero-copy">
              <div className="logo-ribbon" aria-label="211 Ashtabula County logo">
                <img src={logo211} alt="211 Ashtabula County logo" className="official-logo" />
              </div>
              <p className="eyebrow">Helping People. Changing Lives.</p>
              <h2>Give residents a calmer first step into food, health, housing, and utility support.</h2>
              <p className="hero-text">
                Designed for 211 Ashtabula County and United Way of Ashtabula County, this experience helps residents
                sort their needs, gather documents, and move into the right local or state benefit path without losing
                the option of a live operator.
              </p>
              <p className="hero-kicker">
                211 Ashtabula Benefits Navigator expands the helpline with a self-service screen, a document-prep layer,
                and a faster handoff into the real 24/7 support team.
              </p>

              <ul className="trust-strip">
                {reassurance.map((item) => (
                  <li key={item}>
                    <BadgeShield />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <aside className="contact-card">
              <div className="hero-photo-wrap">
                <img src={hero211} alt="Community support image from 211 Ashtabula County" className="hero-photo" />
              </div>
              <p className="small-label">24/7 support</p>
              <h3>Residents can still reach a real person any time.</h3>
              <p className="contact-copy">
                This demo keeps the 211 call center, text support, and resource database at the center of the journey,
                with self-service only where it genuinely reduces stress.
              </p>
              <div className="contact-actions">
                <a className="primary-link" href="tel:18008748545">
                  <BadgePhone />
                  1-800-874-8545
                </a>
                <a className="secondary-link" href="mailto:211@accaa.org">
                  Email 211@accaa.org
                </a>
              </div>
              <p className="contact-note">Use self-service for prep. Use live operators for urgent, complex, or multi-need situations.</p>
            </aside>
          </section>

          <section className="panel section-panel">
            <div className="section-head">
              <div>
                <p className="eyebrow">Quick triage</p>
                <h3>Start with the kind of help you need</h3>
              </div>
              <span className="helper-note">Mobile-friendly and easy to scan under stress</span>
            </div>

            <div className="needs-grid">
              {needs.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`need-card${item.id === selectedNeed ? " selected" : ""}`}
                  onClick={() => setSelectedNeed(item.id)}
                >
                  <strong>{item.label}</strong>
                  <span>{item.intro}</span>
                </button>
              ))}
            </div>

            <div className="intake-grid">
              <label className="field">
                <span>Who are you seeking help for?</span>
                <select value={household} onChange={(event) => setHousehold(event.target.value)}>
                  <option value="adult">An adult or individual</option>
                  <option value="family">A family with children</option>
                  <option value="senior">An older adult or caregiver</option>
                </select>
              </label>

              <label className="field">
                <span>How urgent is the situation?</span>
                <select value={urgency} onChange={(event) => setUrgency(event.target.value)}>
                  <option value="soon">I need help soon</option>
                  <option value="urgent">It feels urgent today</option>
                  <option value="planning">I am planning ahead</option>
                </select>
              </label>

              <label className="field">
                <span>Preferred 211 follow-up</span>
                <select value={contactMode} onChange={(event) => setContactMode(event.target.value)}>
                  <option value="phone">Phone</option>
                  <option value="text">Text</option>
                  <option value="email">Email</option>
                </select>
              </label>
            </div>

            <div className="message-bar">
              <strong>Recommended starting point:</strong>
              <span>{openingMessage}</span>
            </div>

            <div className="signal-grid">
              {serviceSignals.map((signal) => (
                <article key={signal.title} className="signal-card">
                  <p className="eyebrow">{signal.title}</p>
                  <p>{signal.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="results-grid">
            <section className="panel programs-panel">
              <div className="section-head compact">
                <div>
                  <p className="eyebrow">Suggested programs</p>
                  <h3>Next steps for {need.label.toLowerCase()}</h3>
                </div>
              </div>

              <div className="program-list">
                {recommendedPrograms.map((program) => (
                  <article key={program.name} className="program-card">
                    <div className="program-head">
                      <div>
                        <h4>{program.name}</h4>
                        <p>{program.organization}</p>
                      </div>
                      <a href={program.link} target="_blank" rel="noreferrer" className="mini-link">
                        {program.linkLabel}
                      </a>
                    </div>

                    <p className="program-blurb">{program.blurb}</p>

                    <div className="doc-block">
                      <span>Bring or gather:</span>
                      <ul>
                        {program.documents.map((doc) => (
                          <li key={doc}>{doc}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="program-footer">
                      <a href={`tel:${program.phone.replace(/[^0-9]/g, "")}`} className="action-inline">
                        Call for help
                        <ArrowRight />
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <aside className="side-stack">
              <section className="panel sidebar-card">
                <p className="eyebrow">How it supports 211</p>
                <h3>Self-service first, human backup built in</h3>
                <ol className="steps-list">
                  {quickSteps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </section>

              <section className="panel sidebar-card warm">
                <p className="eyebrow">Preferred handoff</p>
                <h3>{contactMode === "phone" ? "Phone follow-up" : contactMode === "text" ? "Text follow-up" : "Email follow-up"}</h3>
                <p>{intakeHint}</p>
                <div className="handoff-links">
                  <a href="tel:18008748545">Call 211</a>
                  <a href="mailto:211@accaa.org">Email support</a>
                  <a href="https://www.211ashtabula.org/" target="_blank" rel="noreferrer">Open resource site</a>
                </div>
              </section>

              <section className="panel sidebar-card parent-card">
                <p className="eyebrow">United Way connection</p>
                <h3>Community trust already exists here.</h3>
                <p>
                  The experience is framed as a digital extension of 211 Ashtabula County and the broader United Way of
                  Ashtabula County support network, not as a disconnected standalone app.
                </p>
              </section>

              <section className="panel sidebar-card urgent">
                <p className="eyebrow">Urgent situations</p>
                <h3>Do not make residents guess.</h3>
                <p>
                  If housing is unstable, utilities are shutting off, or food is needed right away, route them to 211
                  first so a live operator can connect local support faster.
                </p>
              </section>
            </aside>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
