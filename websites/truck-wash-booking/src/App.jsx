import { useMemo, useState } from "react";
import "./App.css";

const WASH_PACKAGES = [
  {
    id: "basic",
    name: "Basic Wash",
    price: 7,
    time: "2-4 minutes",
    description: "Quick, affordable exterior cleanup for everyday drivers and work vehicles.",
  },
  {
    id: "deluxe",
    name: "Deluxe Wash",
    price: 8,
    time: "4-6 minutes",
    description: "A stronger wash cycle when salt, dust, or road film need extra attention.",
  },
  {
    id: "super",
    name: "Super Wash",
    price: 10,
    time: "6-8 minutes",
    description: "A polished middle ground for repeat customers and small commercial accounts.",
  },
  {
    id: "ultimate",
    name: "Ultimate Wash",
    price: 11,
    time: "8-10 minutes",
    description: "The top-tier Auto-Pro pass for a fuller clean without overpaying.",
  },
];

const VEHICLE_TYPES = [
  { id: "pickup", label: "Pickup or work truck", note: "Fits standard bays and frequent repeat washes." },
  { id: "box", label: "Box truck or taller commercial vehicle", note: "Best paired with BIG Tall Bay access." },
  { id: "rv", label: "RV or boat tow setup", note: "BIG Tall Bay supports vehicles up to 12'5\" in height." },
  { id: "fleet", label: "Commercial fleet account", note: "Use this page as a clean intake for repeat company visits." },
];

const FACILITY_FEATURES = [
  "BIG Tall Bay for work trucks, box trucks, RVs, and boats up to 12'5\" tall",
  "Do-It-Yourself center with high-pressure washers",
  "Auto-Pro Wash with a fast two-minute pass option",
  "Powerful vacuums and easy in-and-out access on Crawford Road",
];

const SERVICE_POINTS = [
  {
    title: "Good Price. Better Service.",
    body: "Transparent wash tiers from $7 to $11 keep the offer approachable for local drivers and commercial vehicles alike.",
  },
  {
    title: "When You Want Something Done Right.",
    body: "Quick Clean’s positioning is practical and local: strong pressure, fast washes, and a reliable stop for dirty work trucks.",
  },
  {
    title: "Built for taller vehicles.",
    body: "The BIG Tall Bay gives the site a real differentiator, especially for work trucks, RVs, boats, and box trucks.",
  },
];

const ICONS = {
  Drop: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3c3 4 6.5 7.7 6.5 11.1A6.5 6.5 0 1 1 5.5 14.1C5.5 10.7 9 7 12 3Z" />
    </svg>
  ),
  Truck: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 8h10v8H3z" />
      <path d="M13 11h4l3 3v2h-7z" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </svg>
  ),
  Timer: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="13" r="8" />
      <path d="M12 13V9" />
      <path d="M12 13l3 2" />
      <path d="M9 3h6" />
    </svg>
  ),
  Pin: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s6-5.5 6-11a6 6 0 1 0-12 0c0 5.5 6 11 6 11Z" />
      <circle cx="12" cy="10" r="2.2" />
    </svg>
  ),
};

function App() {
  const [vehicleId, setVehicleId] = useState("box");
  const [packageId, setPackageId] = useState("ultimate");
  const [visitType, setVisitType] = useState("today");

  const selectedVehicle = VEHICLE_TYPES.find((item) => item.id === vehicleId) ?? VEHICLE_TYPES[0];
  const selectedPackage = WASH_PACKAGES.find((item) => item.id === packageId) ?? WASH_PACKAGES[0];

  const visitSummary = useMemo(() => {
    const timingText =
      visitType === "today"
        ? "Best for a same-day stop at the wash."
        : visitType === "week"
          ? "Good fit for a planned commercial or repeat weekly visit."
          : "Use this to start a recurring commercial account conversation.";

    const vehicleText =
      vehicleId === "box" || vehicleId === "rv"
        ? "Head straight for the BIG Tall Bay when you arrive."
        : vehicleId === "fleet"
          ? "A staff follow-up can help map out repeat fleet scheduling."
          : "Standard bays and vacuums keep the stop simple.";

    return {
      estimate: `$${selectedPackage.price}`,
      duration: selectedPackage.time,
      timingText,
      vehicleText,
    };
  }, [selectedPackage.price, selectedPackage.time, vehicleId, visitType]);

  return (
    <div className="page-shell">
      <div className="surface-glow" aria-hidden="true" />

      <header className="topbar">
        <div className="brand-lockup">
          <picture className="brand-logo-wrap">
            <source media="(max-width: 760px)" srcSet="/images/quick-clean-mobile-logo.svg" />
            <img
              className="brand-logo"
              src="/images/quick-clean-logo.svg"
              alt="Quick Clean Car and Truck Wash logo"
            />
          </picture>
          <div>
            <p className="brand-kicker">Ashtabula's premier self-service car and truck wash</p>
            <h1 className="brand-name">Quick Clean Fleet Booking</h1>
          </div>
        </div>
        <div className="topbar-meta">
          <p>3834 Crawford Rd, Ashtabula, OH 44004</p>
          <a href="https://www.quickcleancarandtruckwash.com/">Visit current site</a>
        </div>
      </header>

      <main className="layout">
        <section className="hero panel">
          <div className="hero-copy">
            <p className="eyebrow">Good Price. Better Service.</p>
            <h2>Truck wash scheduling shaped around the real Quick Clean facility.</h2>
            <p className="hero-text">
              This page is built around the actual Quick Clean offer in Ashtabula: a BIG Tall Bay
              for taller vehicles, a self-service center with strong pressure, a fast Auto-Pro Wash,
              and pricing that stays simple enough for everyday drivers and commercial stops.
            </p>

            <div className="trust-row">
              <div className="trust-pill">
                <span>{ICONS.Truck}</span>
                BIG Tall Bay up to 12'5"
              </div>
              <div className="trust-pill">
                <span>{ICONS.Timer}</span>
                Two-minute Auto-Pro pass
              </div>
              <div className="trust-pill">
                <span>{ICONS.Pin}</span>
                Crawford Road facility
              </div>
            </div>

            <div className="feature-list">
              {FACILITY_FEATURES.map((item) => (
                <div className="feature-row" key={item}>
                  <span className="feature-dot" />
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="planner-card">
            <p className="planner-kicker">Plan your stop</p>
            <h3>Find the right wash setup before you pull in.</h3>
            <p className="planner-copy">
              Use the selector below to preview the most likely package, timing, and bay fit for
              your vehicle at Quick Clean Car and Truck Wash.
            </p>

            <label className="field">
              <span>Vehicle type</span>
              <select value={vehicleId} onChange={(event) => setVehicleId(event.target.value)}>
                {VEHICLE_TYPES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Wash package</span>
              <select value={packageId} onChange={(event) => setPackageId(event.target.value)}>
                {WASH_PACKAGES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} - ${item.price}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Visit style</span>
              <select value={visitType} onChange={(event) => setVisitType(event.target.value)}>
                <option value="today">Today or this afternoon</option>
                <option value="week">This week</option>
                <option value="account">Recurring commercial account</option>
              </select>
            </label>

            <div className="estimate-card">
              <p className="estimate-kicker">Recommended stop</p>
              <h4>{selectedPackage.name}</h4>
              <p className="estimate-price">{visitSummary.estimate}</p>
              <ul>
                <li>{selectedPackage.description}</li>
                <li>{selectedVehicle.note}</li>
                <li>{visitSummary.vehicleText}</li>
                <li>{visitSummary.timingText}</li>
                <li>Typical wash time: {visitSummary.duration}</li>
              </ul>
            </div>

            <div className="planner-actions">
              <a className="primary-action" href="https://www.quickcleancarandtruckwash.com/">
                Get Quick Clean details
              </a>
              <p className="planner-note">
                The page stays simple on purpose: Quick Clean feels strongest as a local facility
                first, with light scheduling guidance layered on top.
              </p>
            </div>
          </aside>
        </section>

        <section className="pricing panel">
          <div className="section-heading">
            <p className="eyebrow">Transparent pricing</p>
            <h3>Wash tiers that feel like Quick Clean: simple, local, and easy to trust.</h3>
          </div>
          <div className="pricing-grid">
            {WASH_PACKAGES.map((item) => (
              <article className={`price-card${item.id === packageId ? " active" : ""}`} key={item.id}>
                <p className="price-label">{item.name}</p>
                <p className="price-value">${item.price}</p>
                <p className="price-time">{item.time}</p>
                <p className="price-copy">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="split-row">
          <article className="panel story-card">
            <p className="eyebrow">Why it works</p>
            <h3>Quick Clean stands out because the offer is specific and local.</h3>
            <div className="story-grid">
              {SERVICE_POINTS.map((item) => (
                <div className="story-item" key={item.title}>
                  <h4>{item.title}</h4>
                  <p>{item.body}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="panel info-card">
            <p className="eyebrow">Facility snapshot</p>
            <h3>Built around a real stop in Ashtabula.</h3>
            <div className="info-list">
              <div>
                <span className="info-label">Address</span>
                <strong>3834 Crawford Rd, Ashtabula, OH 44004</strong>
              </div>
              <div>
                <span className="info-label">Best fit</span>
                <strong>Work trucks, box trucks, RVs, boats, and regular local vehicles</strong>
              </div>
              <div>
                <span className="info-label">Core promise</span>
                <strong>Strong pressure, clean finish, and pricing that won't break the bank</strong>
              </div>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}

export default App;
