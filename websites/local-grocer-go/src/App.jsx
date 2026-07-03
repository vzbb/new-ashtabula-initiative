import { useMemo, useState } from "react";
import "./App.css";

const pickupWindows = [
  "Wednesday, 3:00 PM - 4:00 PM",
  "Thursday, 11:00 AM - 12:00 PM",
  "Friday, 2:00 PM - 3:00 PM",
  "Saturday, 10:30 AM - 11:30 AM",
];

const orderTypes = [
  "Fresh produce + pantry staples",
  "Cheese, bread, and prepared kitchen items",
  "Maple syrup, grains, and local eggs",
  "Giftable artisan goods + grocery basics",
];

const dietaryNotes = [
  "No substitutions without checking first",
  "Best available local substitute is okay",
  "Prepared foods okay if seasonal produce is out",
  "Focus on pantry items if produce changes",
];

const sampleOrders = {
  market: {
    title: "Bridge Street Pickup Basket",
    summary:
      "Your Harbor Gardens order is confirmed for pickup at 1022 Bridge Street. We are gathering fresh produce, pantry goods, and local staples from today’s vendor selection.",
    closing:
      "If a seasonal item shifts, Harbor Gardens will match it with the closest local option that fits your note.",
  },
  kitchen: {
    title: "Kitchen + Pantry Pickup",
    summary:
      "Your Harbor Gardens order is in progress with prepared kitchen items, pantry staples, and market goods selected for curbside pickup.",
    closing:
      "Prepared foods are packed closest to pickup time so they stay fresh when you arrive.",
  },
  artisan: {
    title: "Local Makers Market Bag",
    summary:
      "Your Harbor Gardens order includes artisan items and food staples sourced from local makers and food producers in the Harbor Gardens network.",
    closing:
      "We will keep your pickup message updated if one handcrafted item needs an alternate vendor selection.",
  },
};

function App() {
  const [customerName, setCustomerName] = useState("Bridge Street Neighbor");
  const [orderType, setOrderType] = useState(orderTypes[0]);
  const [pickupWindow, setPickupWindow] = useState(pickupWindows[1]);
  const [dietaryNote, setDietaryNote] = useState(dietaryNotes[1]);

  const preview = useMemo(() => {
    const base =
      orderType === orderTypes[0]
        ? sampleOrders.market
        : orderType === orderTypes[1]
          ? sampleOrders.kitchen
          : sampleOrders.artisan;

    return `${customerName},\n\n${base.summary}\n\nPickup window: ${pickupWindow}.\nOrder type: ${orderType}.\nSubstitution note: ${dietaryNote}.\n\n${base.closing}\n\nThank you for supporting Harbor Gardens and the 50+ local vendors we stock in Ashtabula Harbor.`;
  }, [customerName, dietaryNote, orderType, pickupWindow]);

  return (
    <div className="page-shell">
      <div className="page-backdrop" aria-hidden="true" />

      <main className="page">
        <section className="hero-card">
          <div className="hero-copy">
            <p className="eyebrow">Harbor Gardens • 1022 Bridge Street • Ashtabula Harbor</p>
            <p className="tagline">Local Groceries. Ready for Pickup.</p>
            <h1>A pickup marketplace shaped around Harbor Gardens, not a generic grocer.</h1>
            <p className="hero-text">
              This version of Local Grocer Go is repositioned as a Harbor Gardens pickup
              confirmation flow for fresh produce, pantry staples, demonstration kitchen items,
              and artisan goods sourced from 50+ local vendors.
            </p>

            <div className="trust-row">
              <span>50+ local vendors</span>
              <span>Demonstration kitchen items</span>
              <span>Food security + self-reliance mission</span>
            </div>
          </div>

          <div className="brand-panel">
            <div className="brand-mark">
              <img
                src={`${import.meta.env.BASE_URL}harbor-gardens-icon.png`}
                alt="Harbor Gardens icon"
              />
            </div>
            <div>
              <p className="brand-label">Pickup confirmation for</p>
              <img
                className="wordmark"
                src={`${import.meta.env.BASE_URL}wordmark.svg`}
                alt="Harbor Gardens"
              />
              <p>
                A warmer, market-friendly confirmation experience for Harbor Gardens shoppers,
                classes, pantry pickups, and Bridge Street curbside orders.
              </p>
            </div>
          </div>
        </section>

        <section className="photo-card" aria-label="Harbor Gardens market photography">
          <img
            src={`${import.meta.env.BASE_URL}harbor-gardens-hero.jpg`}
            alt="Harbor Gardens produce and market imagery"
          />
          <div className="photo-overlay">
            <p className="kicker">Harbor Gardens feel</p>
            <h2>Fresh market color, local food energy, and pickup flow built for the Harbor.</h2>
          </div>
        </section>

        <section className="identity-grid">
          <article className="identity-card">
            <p className="kicker">Mission</p>
            <h3>Community around self-reliance and food security</h3>
            <p>Pickup messaging should feel like Harbor Gardens: practical, welcoming, and rooted in local food access.</p>
          </article>
          <article className="identity-card">
            <p className="kicker">Offerings</p>
            <h3>Produce, pantry, kitchen, and artisan goods</h3>
            <p>The flow now supports seasonal produce, grains, cheese, breads, eggs, prepared items, and local maker goods.</p>
          </article>
          <article className="identity-card">
            <p className="kicker">Why this works</p>
            <h3>Convenience without losing Harbor Gardens&apos; voice</h3>
            <p>Customers get clear pickup information while the product still feels like a local food hub, not a chain checkout.</p>
          </article>
        </section>

        <section className="content-grid">
          <div className="builder-card">
            <div className="section-heading">
              <p className="kicker">Confirmation Builder</p>
              <h2>Draft a Harbor Gardens pickup message.</h2>
            </div>

            <div className="field-block">
              <label htmlFor="customerName">Pickup name</label>
              <input
                id="customerName"
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                placeholder="Bridge Street Neighbor"
              />
            </div>

            <div className="field-row">
              <div className="field-block">
                <label htmlFor="orderType">Order mix</label>
                <select
                  id="orderType"
                  value={orderType}
                  onChange={(event) => setOrderType(event.target.value)}
                >
                  {orderTypes.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field-block">
                <label htmlFor="pickupWindow">Pickup window</label>
                <select
                  id="pickupWindow"
                  value={pickupWindow}
                  onChange={(event) => setPickupWindow(event.target.value)}
                >
                  {pickupWindows.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="field-block">
              <label htmlFor="dietaryNote">Substitution preference</label>
              <select
                id="dietaryNote"
                value={dietaryNote}
                onChange={(event) => setDietaryNote(event.target.value)}
              >
                {dietaryNotes.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="builder-note">
              Harbor Gardens can use this kind of confirmation for weekly pantry pickup,
              class-adjacent market orders, and fresh local produce bundles.
            </div>
          </div>

          <aside className="preview-card">
            <div className="section-heading">
              <p className="kicker">Preview</p>
              <h2>Pickup confirmation</h2>
            </div>

            <pre className="preview-output">{preview}</pre>

            <ul className="preview-points">
              <li>Anchored to Harbor Gardens and Bridge Street pickup.</li>
              <li>Reflects local substitutions rather than generic inventory language.</li>
              <li>Supports produce, pantry, kitchen, and artisan goods in one message.</li>
            </ul>
          </aside>
        </section>

        <section className="details-grid">
          <article className="detail-card">
            <p className="kicker">Buyer fit</p>
            <h3>Built for Harbor Gardens&apos; strongest real-world use cases.</h3>
            <ul>
              <li>Seasonal produce pickups for repeat Harbor shoppers.</li>
              <li>Prepared kitchen items bundled with pantry staples.</li>
              <li>Mixed local vendor orders that need warm, clear substitution language.</li>
            </ul>
          </article>

          <article className="detail-card">
            <p className="kicker">Brand fidelity</p>
            <h3>Grounded in the Harbor Gardens research and asset pack.</h3>
            <ul>
              <li>Uses the official surfaced icon plus Harbor Gardens-specific market photography.</li>
              <li>Keeps the palette in organic greens, warm neutrals, and produce-market tones.</li>
              <li>Centers community, sustainability, local vendors, and self-reliance over generic convenience copy.</li>
            </ul>
          </article>
        </section>
      </main>
    </div>
  );
}

export default App;
