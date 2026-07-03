import { useMemo, useState } from "react";
import "./App.css";

const VENUE_FACTS = [
  { label: "Venue", value: "Elks Lodge #208" },
  { label: "Location", value: "Lakeside in Ashtabula, OH" },
  { label: "Capacity", value: "151-200 guests" },
  { label: "Market Rating", value: "4.8 stars on The Knot" },
];

const VENUE_HIGHLIGHTS = [
  "Lake Erie views create a real ceremony backdrop instead of a generic banquet-room feel",
  "The venue works well for ceremony, cocktail hour, and reception pacing in one coordinated flow",
  "A strong fit for couples planning a local wedding weekend with out-of-town guests",
  "Lead capture can qualify tours, vendor coordination, timeline help, and follow-up in one pass",
];

const PACKAGES = [
  {
    name: "Lakeside Ceremony",
    detail: "Ceremony timing, aisle flow, shoreline photo windows, and weather-aware backup notes.",
  },
  {
    name: "Reception Coordination",
    detail: "Vendor arrival timing, dinner service, speeches, first dance, and reception pacing.",
  },
  {
    name: "All-in-One Lead",
    detail: "Guest count, style, date, budget fit, venue-tour request, and the next follow-up step.",
  },
];

const TRUST_SIGNALS = [
  {
    label: "Ceremony style",
    value: "Lakeside vows, sunset portraits, and guest-friendly arrival flow",
  },
  {
    label: "Best-fit couple",
    value: "Couples wanting a local Lake Erie venue that still feels memorable",
  },
  {
    label: "Coordinator value",
    value: "One intake can qualify tours, vendor help, timelines, and weekend planning",
  },
];

const INITIAL_FORM = {
  coupleNames: "Alyssa & Jordan",
  contactName: "Alyssa",
  contactEmail: "alyssa@example.com",
  preferredDate: "2026-09-12",
  guestCount: "170",
  budget: "$12,500 - $18,000",
  style: "Lakefront ceremony with elegant reception",
  services: ["Venue tour", "Vendor referrals", "Timeline planning"],
  notes: "Looking for a polished lakeside celebration with a smooth ceremony-to-reception flow.",
};

const SERVICE_OPTIONS = [
  "Venue tour",
  "Vendor referrals",
  "Timeline planning",
  "RSVP management",
  "Seating guidance",
  "Weekend itinerary",
];

function BadgeIcon({ children }) {
  return <span className="badge-icon">{children}</span>;
}

function App() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);

  const leadBrief = useMemo(() => {
    const services = form.services.length ? form.services.join(", ") : "Venue consultation";
    return [
      `${form.coupleNames} are planning a ${form.style.toLowerCase()} at Elks Lodge #208.`,
      `Target date: ${form.preferredDate || "TBD"} | Expected guests: ${form.guestCount || "TBD"} | Budget: ${form.budget || "TBD"}.`,
      `Priority services: ${services}.`,
      `Follow-up owner: ${form.contactName} (${form.contactEmail}).`,
      form.notes ? `Notes: ${form.notes}` : "Notes: None yet.",
    ].join("\n");
  }, [form]);

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const toggleService = (service) => {
    setForm((current) => ({
      ...current,
      services: current.services.includes(service)
        ? current.services.filter((item) => item !== service)
        : [...current.services, service],
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <BadgeIcon>⛵</BadgeIcon>
            <span>Elks Lodge #208 • Ashtabula Wedding Leads</span>
          </div>
          <h1>Lake Erie weddings, qualified in one polished lead pass.</h1>
          <p className="hero-text">
            A demo-ready intake experience for Elks Lodge #208 that captures the essentials couples
            and planners need: date, guest count, style, budget, and the next action that keeps the
            venue moving.
          </p>
          <p className="hero-subtext">
            Built to feel like a real lakeside venue workflow, not a generic lead form with the name
            swapped out.
          </p>

          <div className="fact-grid">
            {VENUE_FACTS.map((fact) => (
              <article key={fact.label} className="fact-card">
                <span>{fact.label}</span>
                <strong>{fact.value}</strong>
              </article>
            ))}
          </div>

          <div className="cta-row">
            <a className="primary-btn" href="#lead-form">
              Build lead brief
            </a>
            <a className="secondary-btn" href="https://www.theknot.com/marketplace/elks-lodge-208-ashtabula-oh-2080331" target="_blank" rel="noreferrer">
              View venue listing
            </a>
          </div>
        </div>

        <aside className="hero-panel">
          <div className="panel-topline">Venue-ready summary</div>
          <h2>{form.coupleNames}</h2>
          <p>
            A lakeside ceremony at Elks Lodge #208 with vendor coordination and a clear next step for
            the couple.
          </p>
          <div className="summary-chip">
            <span>Guest count</span>
            <strong>{form.guestCount || "TBD"}</strong>
          </div>
          <div className="summary-chip">
            <span>Preferred date</span>
            <strong>{form.preferredDate || "TBD"}</strong>
          </div>
          <div className="summary-chip">
            <span>Budget</span>
            <strong>{form.budget || "TBD"}</strong>
          </div>
          <div className="summary-chip">
            <span>Venue fit</span>
            <strong>Lake Erie ceremony + reception flow</strong>
          </div>
        </aside>
      </section>

      <section className="content-grid">
        <form id="lead-form" className="lead-card" onSubmit={handleSubmit}>
          <div className="card-head">
            <div>
              <span className="section-kicker">Lead intake</span>
              <h3>Capture the wedding details that matter most.</h3>
            </div>
            <span className="status-pill">{submitted ? "Lead brief ready" : "Demo ready"}</span>
          </div>

          <div className="field-grid">
            <label>
              Couple names
              <input
                value={form.coupleNames}
                onChange={(event) => updateField("coupleNames", event.target.value)}
                placeholder="Alyssa & Jordan"
              />
            </label>
            <label>
              Primary contact
              <input
                value={form.contactName}
                onChange={(event) => updateField("contactName", event.target.value)}
                placeholder="Alyssa"
              />
            </label>
            <label>
              Contact email
              <input
                type="email"
                value={form.contactEmail}
                onChange={(event) => updateField("contactEmail", event.target.value)}
                placeholder="alyssa@example.com"
              />
            </label>
            <label>
              Preferred date
              <input
                type="date"
                value={form.preferredDate}
                onChange={(event) => updateField("preferredDate", event.target.value)}
              />
            </label>
            <label>
              Guest count
              <input
                type="number"
                min="1"
                value={form.guestCount}
                onChange={(event) => updateField("guestCount", event.target.value)}
                placeholder="170"
              />
            </label>
            <label>
              Budget range
              <input
                value={form.budget}
                onChange={(event) => updateField("budget", event.target.value)}
                placeholder="$12,500 - $18,000"
              />
            </label>
          </div>

          <label className="stacked-field">
            Wedding style
            <input
              value={form.style}
              onChange={(event) => updateField("style", event.target.value)}
              placeholder="Lakefront ceremony with elegant reception"
            />
          </label>

          <div className="service-group">
            <span className="field-label">Priority services</span>
            <div className="service-grid">
              {SERVICE_OPTIONS.map((service) => (
                <button
                  type="button"
                  key={service}
                  className={form.services.includes(service) ? "service-pill active" : "service-pill"}
                  onClick={() => toggleService(service)}
                >
                  {service}
                </button>
              ))}
            </div>
          </div>

          <label className="stacked-field">
            Notes for the venue
            <textarea
              rows="4"
              value={form.notes}
              onChange={(event) => updateField("notes", event.target.value)}
              placeholder="Looking for a polished lakeside celebration with a smooth ceremony-to-reception flow."
            />
          </label>

          <div className="form-actions">
            <button className="primary-btn" type="submit">
              Save lead brief
            </button>
            <a className="secondary-btn" href="tel:440-964-4422">
              Call venue contact
            </a>
          </div>
        </form>

        <aside className="side-column">
          <section className="info-card">
            <span className="section-kicker">Why this fits Elks Lodge #208</span>
            <ul className="highlight-list">
              {VENUE_HIGHLIGHTS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="info-card">
            <span className="section-kicker">Venue trust signals</span>
            <div className="package-stack">
              {TRUST_SIGNALS.map((item) => (
                <article key={item.label} className="package-card">
                  <strong>{item.label}</strong>
                  <p>{item.value}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="info-card">
            <span className="section-kicker">Lead packages</span>
            <div className="package-stack">
              {PACKAGES.map((pkg) => (
                <article key={pkg.name} className="package-card">
                  <strong>{pkg.name}</strong>
                  <p>{pkg.detail}</p>
                </article>
              ))}
            </div>
          </section>
        </aside>
      </section>

      <section className="lead-preview">
        <div className="card-head">
          <div>
            <span className="section-kicker">Demo output</span>
            <h3>Lead brief preview</h3>
          </div>
          <span className="status-pill">Ready to hand off</span>
        </div>
        <pre className="brief-block">{leadBrief}</pre>
        {submitted && <div className="success-banner">Lead brief saved for Elks Lodge #208 follow-up.</div>}
      </section>
    </main>
  );
}

export default App;
