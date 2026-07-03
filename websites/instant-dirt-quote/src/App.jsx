import { useState } from "react";
import "./App.css";

const materials = {
  topsoil: {
    name: "Premium Topsoil",
    rate: 42,
    description: "Nutrient-rich screened soil for lawns, beds, and finish grading.",
  },
  fill: {
    name: "Fill Dirt",
    rate: 28,
    description: "Clean fill for leveling, backfill, and larger site prep jobs.",
  },
  mulch: {
    name: "Mulch",
    rate: 48,
    description: "A clean finishing layer for landscape installs and seasonal refreshes.",
  },
  gravel: {
    name: "Gravel",
    rate: 55,
    description: "Reliable base material for drives, drainage, and hardscape prep.",
  },
  sand: {
    name: "Sand",
    rate: 46,
    description: "Delivery-ready sand for masonry, leveling, and utility work.",
  },
};

const deliveryZones = {
  ashtabula: {
    name: "Ashtabula / nearby",
    fee: 35,
    window: "Next-day delivery is usually available.",
  },
  county: {
    name: "Ashtabula County",
    fee: 60,
    window: "Most orders are scheduled within 1-2 business days.",
  },
  northeast: {
    name: "Northeast Ohio outer zone",
    fee: 95,
    window: "Scheduling depends on route density and load size.",
  },
};

const customerProfiles = {
  homeowner: {
    label: "Homeowner",
    modifier: 1,
    note: "Best for one-off residential deliveries and project cleanup.",
  },
  contractor: {
    label: "Contractor",
    modifier: 0.95,
    note: "Volume-friendly pricing and straightforward scheduling for job sites.",
  },
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

const calculateEstimate = ({ materialKey, yards, zoneKey, customerKey, rush }) => {
  const material = materials[materialKey];
  const zone = deliveryZones[zoneKey];
  const customer = customerProfiles[customerKey];

  const materialTotal = material.rate * yards;
  const subtotal = (materialTotal + zone.fee) * customer.modifier;
  const total = subtotal + (rush ? 85 : 0);
  const minimum = Math.round(total * 0.92);
  const maximum = Math.round(total * 1.08);

  return {
    material,
    zone,
    customer,
    minimum,
    maximum,
    perYard: Math.round(material.rate * customer.modifier),
    turnaround: rush ? "Rush delivery request submitted for confirmation." : zone.window,
  };
};

const BrockwayMark = () => (
  <svg viewBox="0 0 160 160" aria-hidden="true">
    <defs>
      <linearGradient id="soilGlow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8b6914" />
        <stop offset="100%" stopColor="#5d4e37" />
      </linearGradient>
    </defs>
    <rect x="10" y="18" width="140" height="96" rx="22" fill="url(#soilGlow)" />
    <path d="M32 100c17-22 29-34 48-34s29 10 48 34H32Z" fill="#f5f1e6" opacity="0.94" />
    <path d="M48 76c8-12 16-18 30-18 14 0 23 8 33 24" stroke="#f5f1e6" strokeWidth="10" strokeLinecap="round" fill="none" />
    <path d="M44 116h72c17 0 30 13 30 30H14c0-17 13-30 30-30Z" fill="#314d36" />
  </svg>
);

function App() {
  const [materialKey, setMaterialKey] = useState("topsoil");
  const [yards, setYards] = useState(8);
  const [zoneKey, setZoneKey] = useState("county");
  const [customerKey, setCustomerKey] = useState("homeowner");
  const [rush, setRush] = useState(false);

  const estimate = calculateEstimate({ materialKey, yards, zoneKey, customerKey, rush });

  return (
    <div className="page-shell">
      <div className="terrain-backdrop" aria-hidden="true" />

      <main className="page">
        <section className="hero-card">
          <div className="hero-copy">
            <p className="eyebrow">Brockway&apos;s Instant Dirt Quote • Ashtabula County, Ohio</p>
            <p className="hero-tagline">Get Your Dirt Quote. Instantly.</p>
            <h1>Instant dirt quotes that feel like Brockway, not a template.</h1>
            <p className="hero-text">
              Pitch-ready quoting for Brockway&apos;s Topsoil, built around premium
              topsoil, fill dirt delivery, dependable scheduling, and 20+ years of local service.
            </p>

            <div className="trust-row">
              <span>Over 20 years in the industry</span>
              <span>Locally owned and operated</span>
              <span>100% satisfaction promise</span>
            </div>
          </div>

          <div className="brand-panel">
            <div className="brand-mark">
              <BrockwayMark />
            </div>
            <div>
              <p className="brand-label">Demo concept for</p>
              <h2>Brockway&apos;s Topsoil</h2>
              <p className="brand-lockup">Brockway&apos;s Topsoil and Saybrook Storage</p>
              <p>
                A cleaner online quote flow for homeowners, landscapers, and contractors
                who want fast pricing before they call.
              </p>
            </div>
          </div>
        </section>

        <section className="photo-strip" aria-label="Brockway visual references">
          <figure className="photo-card photo-card-large">
            <img src={`${import.meta.env.BASE_URL}brockways-topsoil-hero.jpg`} alt="Brockway's Topsoil material delivery and site work reference" />
          </figure>
          <figure className="photo-card">
            <img src={`${import.meta.env.BASE_URL}brockways-soil-reference.jpg`} alt="Close-up Brockway's Topsoil soil and product quality reference" />
          </figure>
        </section>

        <section className="identity-strip" aria-label="Brockway brand points">
          <div className="identity-card">
            <p className="kicker">Local identity</p>
            <h3>Brockway&apos;s Topsoil</h3>
            <p>Locally owned and operated, serving Ashtabula County and northeast Ohio with practical delivery-first service.</p>
          </div>
          <div className="identity-card">
            <p className="kicker">Core products</p>
            <h3>Premium topsoil, fill dirt, and soil products</h3>
            <p>Built around the materials Brockway is known to deliver for homeowners, landscapers, and job sites.</p>
          </div>
          <div className="identity-card">
            <p className="kicker">Promise</p>
            <h3>On-time delivery with a satisfaction mindset</h3>
            <p>The demo keeps Brockway&apos;s dependable, quality-focused tone front and center through every estimate.</p>
          </div>
        </section>

        <section className="content-grid">
          <div className="quote-card">
            <div className="section-heading">
              <p className="kicker">Instant Quote Builder</p>
              <h3>Set the load, location, and customer type.</h3>
            </div>

            <div className="field-block">
              <label>Material</label>
              <div className="material-grid">
                {Object.entries(materials).map(([key, material]) => (
                  <button
                    key={key}
                    type="button"
                    className={key === materialKey ? "material-card active" : "material-card"}
                    onClick={() => setMaterialKey(key)}
                  >
                    <strong>{material.name}</strong>
                    <span>{material.description}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="field-block">
              <div className="split-heading">
                <label htmlFor="yards">Quantity</label>
                <strong>{yards} cubic yards</strong>
              </div>
              <input
                id="yards"
                type="range"
                min="1"
                max="40"
                value={yards}
                onChange={(event) => setYards(Number(event.target.value))}
              />
              <div className="range-scale">
                <span>1 yd</span>
                <span>20 yd</span>
                <span>40 yd</span>
              </div>
            </div>

            <div className="field-row">
              <div className="field-block">
                <label htmlFor="zone">Delivery zone</label>
                <select id="zone" value={zoneKey} onChange={(event) => setZoneKey(event.target.value)}>
                  {Object.entries(deliveryZones).map(([key, zone]) => (
                    <option key={key} value={key}>
                      {zone.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field-block">
                <label htmlFor="customer">Customer type</label>
                <select
                  id="customer"
                  value={customerKey}
                  onChange={(event) => setCustomerKey(event.target.value)}
                >
                  {Object.entries(customerProfiles).map(([key, profile]) => (
                    <option key={key} value={key}>
                      {profile.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <label className="rush-toggle">
              <input
                type="checkbox"
                checked={rush}
                onChange={(event) => setRush(event.target.checked)}
              />
              <span>Request rush delivery review for this order</span>
            </label>
          </div>

          <aside className="estimate-card">
            <div className="section-heading">
              <p className="kicker">Live Estimate</p>
              <h3>{estimate.material.name}</h3>
            </div>

            <div className="estimate-price">
              <span>{formatCurrency(estimate.minimum)}</span>
              <small>to {formatCurrency(estimate.maximum)}</small>
            </div>

            <ul className="estimate-list">
              <li>{formatCurrency(estimate.perYard)} estimated price per cubic yard</li>
              <li>{estimate.zone.name} delivery zone</li>
              <li>{estimate.customer.note}</li>
              <li>{estimate.turnaround}</li>
            </ul>

            <div className="estimate-note">
              Final pricing is confirmed by Brockway&apos;s Topsoil based on load access,
              route timing, and material availability.
            </div>

            <button type="button" className="cta-button">
              Request Brockway Follow-Up
            </button>
          </aside>
        </section>

        <section className="details-grid">
          <article className="detail-card">
            <p className="kicker">Why it works for Brockway</p>
            <h3>Built around real delivery buying moments.</h3>
            <ul>
              <li>Homeowners can price a yardage range before starting a garden or grading project.</li>
              <li>Contractors get a cleaner pre-call estimate for planning and budget conversations.</li>
              <li>The experience foregrounds quality soil, dependable delivery, and local trust.</li>
            </ul>
          </article>

          <article className="detail-card">
            <p className="kicker">Service signals</p>
            <h3>What the pitch should reinforce.</h3>
            <ul>
              <li>Premium topsoil and fill dirt delivery across Ashtabula County and northeast Ohio.</li>
              <li>Locally owned operation with more than two decades of industry experience.</li>
              <li>On-time delivery and satisfaction language carried directly into the demo.</li>
            </ul>
          </article>

          <article className="detail-card">
            <p className="kicker">Target buyers</p>
            <h3>Spoken to like Brockway&apos;s real customers.</h3>
            <ul>
              <li>Landscape contractors pricing fast without waiting on a callback.</li>
              <li>Homeowners planning grading, lawn installs, and garden bed refreshes.</li>
              <li>Business owners and property caretakers coordinating dependable material delivery.</li>
            </ul>
          </article>

          <article className="detail-card detail-card-accent">
            <p className="kicker">Pitch framing</p>
            <h3>A modern front door for a long-standing local operator.</h3>
            <p>
              This version keeps the Brockway name, earthy visual language, and delivery-first
              story visible at a glance so the product reads as a branded sales tool, not a generic calculator.
            </p>
          </article>
        </section>
      </main>
    </div>
  );
}

export default App;
