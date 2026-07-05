import { useMemo, useState } from "react";
import "./App.css";

const pickupWindows = [
  "Today, 3:30 PM - 4:00 PM",
  "Today, 4:30 PM - 5:00 PM",
  "Tomorrow, 10:00 AM - 10:30 AM",
  "Tomorrow, 12:00 PM - 12:30 PM",
];

const vendorCollections = [
  "Bridge Street produce + pantry staples",
  "Soup, hummus, and prepared kitchen items",
  "Bread, cheese, and local dairy",
  "Seasonal produce box + artisan goods",
];

const pickupStates = {
  ready: {
    label: "Ready for pickup",
    tone: "green",
    message:
      "Your Harbor Gardens order has been gathered from local vendors and is ready for curbside handoff at 1022 Bridge Street.",
  },
  packing: {
    label: "Being packed",
    tone: "gold",
    message:
      "Our team is finishing your order now, including fresh items from today's vendor pickup and kitchen prep.",
  },
  sourcing: {
    label: "Waiting on vendor item",
    tone: "sage",
    message:
      "One vendor item is still being checked in. We will keep your pickup window updated as soon as it lands.",
  },
};

const sampleOrders = [
  {
    code: "HG-214",
    name: "Bridge Street Produce Basket",
    items: "Salad greens, tomatoes, eggs, sourdough",
    state: "ready",
  },
  {
    code: "HG-318",
    name: "Kitchen Pickup Bundle",
    items: "Soup quart, hummus, English muffins",
    state: "packing",
  },
  {
    code: "HG-406",
    name: "Vendor Market Box",
    items: "Maple syrup, cheese, grains, artisan soap",
    state: "sourcing",
  },
];

const findOrder = (code) => sampleOrders.find((order) => order.code === code.trim().toUpperCase());

function App() {
  const [orderCode, setOrderCode] = useState("HG-214");
  const [selectedWindow, setSelectedWindow] = useState(pickupWindows[1]);
  const [collection, setCollection] = useState(vendorCollections[0]);

  const order = useMemo(() => findOrder(orderCode) ?? sampleOrders[0], [orderCode]);
  const status = pickupStates[order.state];

  return (
    <div className="page-shell">
      <div className="market-backdrop" aria-hidden="true" />

      <main className="page">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">Harbor Gardens • Ashtabula Harbor</p>
            <p className="tagline">Local Food. Pre-Ordered. Picked Up Fresh.</p>
            <h1>Curbside pickup that looks and feels like Harbor Gardens.</h1>
            <p className="hero-text">
              A Harbor Gardens order flow for 50+ local vendors, demonstration kitchen items,
              and Bridge Street pickups that keep local food convenient without losing the community feel.
            </p>

            <div className="trust-row">
              <span>1022 Bridge Street pickup point</span>
              <span>50+ Ashtabula County vendors</span>
              <span>Prepared foods + pantry + produce</span>
            </div>
          </div>

          <div className="brand-card">
            <div className="brand-mark">
              <img
                src={`${import.meta.env.BASE_URL}harbor-gardens-icon.png`}
                alt="Harbor Gardens icon"
              />
            </div>
            <div>
              <p className="brand-label">Built for</p>
              <h2>Harbor Gardens</h2>
              <p>
                A curbside experience aligned with Harbor Gardens&apos; mission around food security,
                sustainability, and stronger local ecosystems.
              </p>
            </div>
          </div>
        </section>

        <section className="photo-hero" aria-label="Harbor Gardens visual reference">
          <img
            src={`${import.meta.env.BASE_URL}harbor-gardens-hero.jpg`}
            alt="Harbor Gardens produce and garden-forward market photography"
          />
          <div className="photo-overlay">
            <p className="kicker">Bridge Street feel</p>
            <h3>A curbside experience rooted in fresh food, flowers, and neighborhood pickup.</h3>
          </div>
        </section>

        <section className="identity-grid">
          <article className="identity-card">
            <p className="kicker">Community role</p>
            <h3>More than a store</h3>
            <p>Harbor Gardens is a local food hub with classes, workshops, and a demonstration kitchen.</p>
          </article>
          <article className="identity-card">
            <p className="kicker">What customers pick up</p>
            <h3>Fresh, local, useful</h3>
            <p>Produce, grains, cheeses, soups, hummus, breads, artisan goods, and seasonal market staples.</p>
          </article>
          <article className="identity-card">
            <p className="kicker">Why curbside fits</p>
            <h3>Convenience without losing locality</h3>
            <p>Busy families and repeat shoppers can pre-order trusted Harbor Gardens goods and swing by Bridge Street.</p>
          </article>
        </section>

        <section className="content-grid">
          <div className="planner-card">
            <div className="section-heading">
              <p className="kicker">Pickup Planner</p>
              <h3>Track an order the Harbor Gardens way.</h3>
            </div>

            <div className="field-block">
              <label htmlFor="orderCode">Order code</label>
              <input
                id="orderCode"
                value={orderCode}
                onChange={(event) => setOrderCode(event.target.value)}
                placeholder="HG-214"
              />
            </div>

            <div className="field-row">
              <div className="field-block">
                <label htmlFor="window">Pickup window</label>
                <select
                  id="window"
                  value={selectedWindow}
                  onChange={(event) => setSelectedWindow(event.target.value)}
                >
                  {pickupWindows.map((window) => (
                    <option key={window} value={window}>
                      {window}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field-block">
                <label htmlFor="collection">Order type</label>
                <select
                  id="collection"
                  value={collection}
                  onChange={(event) => setCollection(event.target.value)}
                >
                  {vendorCollections.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pickup-note">
              Check in curbside when you arrive on Bridge Street and Harbor Gardens can bring your order out
              once your vehicle and pickup name are confirmed.
            </div>
          </div>

          <aside className={`status-card tone-${status.tone}`}>
            <div className="section-heading">
              <p className="kicker">Live Status</p>
              <h3>{order.name}</h3>
            </div>

            <div className="status-pill">{status.label}</div>
            <p className="status-copy">{status.message}</p>

            <ul className="status-list">
              <li>Pickup window: {selectedWindow}</li>
              <li>Order contents: {order.items}</li>
              <li>Selected collection: {collection}</li>
              <li>Location: Harbor Gardens, 1022 Bridge Street, Ashtabula Harbor</li>
            </ul>
          </aside>
        </section>

        <section className="details-grid">
          <article className="detail-card">
            <p className="kicker">Harbor Gardens fit</p>
            <h3>Designed for a local food network, not a chain retailer.</h3>
            <ul>
              <li>Supports mixed orders from produce, pantry staples, prepared foods, and artisan makers.</li>
              <li>Keeps pickup language warm and community-oriented instead of sounding transactional.</li>
              <li>Works for repeat weekly shoppers as well as event-driven or class-adjacent pickups.</li>
            </ul>
          </article>

          <article className="detail-card">
            <p className="kicker">Program cues</p>
            <h3>Grounded in Harbor Gardens&apos; real identity.</h3>
            <ul>
              <li>References the demonstration kitchen and prepared item pickup flow.</li>
              <li>Leaves room for future cooking class, workshop, or subscription box tie-ins.</li>
              <li>Matches the brandkit palette with fresh greens, warm market neutrals, and friendly type.</li>
            </ul>
          </article>
        </section>
      </main>
    </div>
  );
}

export default App;
