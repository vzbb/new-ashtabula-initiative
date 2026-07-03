import { useMemo, useState } from "react";
import "./App.css";
import mcLogo from "./assets/mc-lawncare-logo.png";

const propertyTypes = [
  { value: "residential", label: "Residential yard", multiplier: 1 },
  { value: "commercial", label: "Commercial property", multiplier: 1.35 },
  { value: "hoa", label: "HOA or multi-unit grounds", multiplier: 1.55 }
];

const recurringServices = [
  { id: "mowing", label: "Weekly mowing and trimming", price: 68 },
  { id: "fertilization", label: "Fertilization and weed control", price: 52 },
  { id: "aeration", label: "Core aeration and overseeding", price: 44 },
  { id: "pest", label: "Mosquito, flea, tick, or perimeter pest control", price: 39 }
];

const projectServices = [
  { id: "mulch", label: "Mulch or rock refresh", price: 34 },
  { id: "cleanup", label: "Spring or fall cleanup", price: 42 },
  { id: "drainage", label: "Drainage, grading, or bush hogging review", price: 58 },
  { id: "irrigation", label: "Irrigation startup or winterization", price: 31 },
  { id: "snow", label: "Commercial snow removal add-on", price: 47 }
];

const proofPoints = [
  "Serving residential, commercial, and HOA properties in Ashtabula",
  "Quotes can combine lawn care, landscaping, pest control, irrigation, and snow work",
  "Built around MC Professional's full-service scope, not a single-service mower app"
];

const coverage = [
  "Ashtabula residential lawns and larger corner lots",
  "Commercial sites needing mowing, weed control, and vegetation management",
  "HOA grounds that want recurring service plus seasonal snow support"
];

function ShieldIcon() {
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

function PhoneIcon() {
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

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="m13 6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function App() {
  const [propertyType, setPropertyType] = useState("residential");
  const [acreage, setAcreage] = useState(0.5);
  const [selectedRecurring, setSelectedRecurring] = useState(["mowing", "fertilization"]);
  const [selectedProjects, setSelectedProjects] = useState(["cleanup"]);

  const property = propertyTypes.find((item) => item.value === propertyType) ?? propertyTypes[0];

  const recurringTotal = selectedRecurring.reduce((sum, id) => {
    const service = recurringServices.find((item) => item.id === id);
    return sum + (service ? service.price : 0);
  }, 0);

  const projectTotal = selectedProjects.reduce((sum, id) => {
    const service = projectServices.find((item) => item.id === id);
    return sum + (service ? service.price : 0);
  }, 0);

  const estimate = useMemo(() => {
    const sizeMultiplier = Math.max(0.65, acreage);
    const total = (recurringTotal + projectTotal) * property.multiplier * sizeMultiplier;
    return Math.round(total);
  }, [acreage, projectTotal, property.multiplier, recurringTotal]);

  const quoteSummary = useMemo(() => {
    if (propertyType === "commercial" || propertyType === "hoa") {
      return "This mix is set up like an MC Professional managed-property package with recurring grounds care and optional seasonal add-ons.";
    }
    if (selectedProjects.includes("snow")) {
      return "This quote blends warm-season lawn care with a winter-ready snow add-on, which is one of MC Professional's strongest differentiators.";
    }
    return "This package fits a homeowner looking for full-season lawn care plus targeted treatments without juggling multiple contractors.";
  }, [propertyType, selectedProjects]);

  const toggleSelection = (id, selected, setSelected) => {
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  return (
    <div className="page-shell">
      <div className="ambient ambient-left" aria-hidden="true" />
      <div className="ambient ambient-right" aria-hidden="true" />

      <div className="page">
        <header className="topbar">
          <div className="brand-block">
            <div className="logo-panel">
              <img src={mcLogo} alt="MC Professional Lawn Care and Snow Plowing logo" className="brand-logo" />
            </div>
            <div>
              <p className="eyebrow">MC Professional Lawn Care and Snow Plowing</p>
              <h1>MC Lawn Quote</h1>
              <p className="brand-copy">Fast quote guidance for lawn care, landscaping, pest control, irrigation, and snow-ready properties in Ashtabula.</p>
            </div>
          </div>

          <div className="topbar-actions">
            <a className="pill-link" href="https://www.mcprofessionallawncare.com/ashtabula-oh/" target="_blank" rel="noreferrer">
              MCProfessionalLawnCare.com
            </a>
            <a className="pill-link strong" href="tel:4402242448">
              Call (440) 224-2448
            </a>
          </div>
        </header>

        <main className="layout">
          <section className="hero panel">
            <div className="hero-copy">
              <p className="eyebrow">Professional, comprehensive, service-ready</p>
              <h2>Build a quote around the actual mix of services MC Professional sells.</h2>
              <p className="hero-text">
                This is not just a mowing calculator. It reflects MC Professional's broader Ashtabula offering:
                fertilization, weed control, aeration, hydroseeding, pest work, irrigation support, cleanups, grading,
                and commercial snow removal.
              </p>

              <ul className="trust-strip">
                {proofPoints.map((item) => (
                  <li key={item}>
                    <ShieldIcon />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <aside className="contact-card">
              <p className="small-label">Service coverage</p>
              <h3>Built for the mix of jobs MC Professional already handles.</h3>
              <ul className="coverage-list">
                {coverage.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="contact-actions">
                <a className="primary-link" href="tel:4402242448">
                  <PhoneIcon />
                  (440) 224-2448
                </a>
                <a className="secondary-link" href="https://www.mcprofessionallawncare.com/ashtabula-oh/" target="_blank" rel="noreferrer">
                  Open company site
                </a>
              </div>
            </aside>
          </section>

          <section className="quote-grid">
            <section className="panel builder-panel">
              <div className="section-head">
                <div>
                  <p className="eyebrow">Quote builder</p>
                  <h3>Package lawn, pest, cleanup, irrigation, and snow support in one place.</h3>
                </div>
              </div>

              <div className="field-grid">
                <label className="field">
                  <span>Property type</span>
                  <select value={propertyType} onChange={(event) => setPropertyType(event.target.value)}>
                    {propertyTypes.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="field">
                  <span>Estimated acreage</span>
                  <input
                    type="number"
                    min="0.2"
                    step="0.1"
                    value={acreage}
                    onChange={(event) => setAcreage(Number(event.target.value))}
                  />
                </label>
              </div>

              <div className="service-sections">
                <section>
                  <p className="small-label">Recurring services</p>
                  <div className="service-grid">
                    {recurringServices.map((service) => (
                      <button
                        key={service.id}
                        type="button"
                        className={`service-card${selectedRecurring.includes(service.id) ? " selected" : ""}`}
                        onClick={() => toggleSelection(service.id, selectedRecurring, setSelectedRecurring)}
                      >
                        <strong>{service.label}</strong>
                        <span>From ${service.price}</span>
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <p className="small-label">Project and seasonal add-ons</p>
                  <div className="service-grid">
                    {projectServices.map((service) => (
                      <button
                        key={service.id}
                        type="button"
                        className={`service-card${selectedProjects.includes(service.id) ? " selected" : ""}`}
                        onClick={() => toggleSelection(service.id, selectedProjects, setSelectedProjects)}
                      >
                        <strong>{service.label}</strong>
                        <span>From ${service.price}</span>
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            </section>

            <aside className="side-stack">
              <section className="panel estimate-panel">
                <p className="eyebrow">Estimated starting range</p>
                <h3>${estimate}</h3>
                <p>{quoteSummary}</p>
                <div className="estimate-meta">
                  <span>{property.label}</span>
                  <span>{acreage.toFixed(1)} acres</span>
                </div>
                <a className="action-inline" href="tel:4402242448">
                  Request a final walkthrough
                  <ArrowIcon />
                </a>
              </section>

              <section className="panel note-panel">
                <p className="eyebrow">What makes this pitch specific</p>
                <ul className="notes-list">
                  <li>MC Professional's pest-control scope is included, not treated like an afterthought.</li>
                  <li>Commercial snow removal stays in the same quote flow for year-round account value.</li>
                  <li>Irrigation startup and winterization are framed as practical add-ons for established clients.</li>
                </ul>
              </section>

              <section className="panel note-panel warm">
                <p className="eyebrow">Local fit</p>
                <ul className="notes-list">
                  <li>Ashtabula homeowners can ask for recurring weekly service plus seasonal cleanups.</li>
                  <li>Commercial and HOA buyers can build a broader grounds package before talking to the crew.</li>
                  <li>The page reflects a Lake Erie-area lawn and snow business, not a startup-looking app template.</li>
                </ul>
              </section>
            </aside>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
