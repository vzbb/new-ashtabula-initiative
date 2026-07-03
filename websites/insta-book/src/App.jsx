import { useState } from "react";
import {
  callGeminiAPI,
  extractResponseText,
  getErrorMessage,
  isAPIConfigured,
} from "./api-client.js";
import "./App.css";

const amenityOptions = [
  "Breakfast basket delivery",
  "Crosswinds Grille dinner",
  "Spa appointment hold",
  "Winery tasting flight",
  "Covered bridge guide",
];

const accommodationOptions = [
  "Inn room",
  "Lakeview suite",
  "Two-bedroom cottage",
];

const socialProof = [
  "Matches how The Lakehouse Inn actually sells the stay: lodging, spa, dining, winery, and destination planning together.",
  "Uses the property’s strongest differentiators in the message itself, including breakfast baskets, Crosswinds Grille, and tasting add-ons.",
  "Keeps busy seasonal weekends polished with guest-ready confirmations that still feel family-owned and personal.",
];

const stayHighlights = [
  "Southern shore of Lake Erie",
  "On-site winery and tasting experience",
  "Crosswinds Grille farm-to-table dining",
  "Full-service spa and wellness add-ons",
  "30+ wineries and 19 covered bridges nearby",
];

const amenityMoments = [
  "Complimentary breakfast baskets delivered to the room",
  "Lakefront patios and sunset-friendly arrival messaging",
  "Spa hold reminders and dining coordination in one note",
];

const destinationMoments = [
  "30+ Ohio Wine Country wineries",
  "19 covered bridges to explore nearby",
  "Geneva-on-the-Lake, Ohio's oldest resort",
];

const itineraryCards = [
  {
    title: "Arrival night",
    detail: "Welcome note, lakefront check-in timing, dinner reservation reminder, and sunset patio nudge.",
  },
  {
    title: "Mid-stay touchpoint",
    detail: "Spa confirmation, tasting availability, and suggested stops across Ohio Wine Country.",
  },
  {
    title: "Departure morning",
    detail: "Breakfast basket timing, checkout details, and a prompt to book the next seasonal escape.",
  },
];

function formatStayDate(date) {
  if (!date) {
    return "a soon-to-arrive guest";
  }

  const parsed = new Date(`${date}T12:00:00`);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

function buildFallbackConfirmation({ date, nights, accommodation, guestName, addOns }) {
  const arrival = formatStayDate(date);
  const guestLabel = guestName.trim() || "Guest";
  const extras =
    addOns.length > 0
      ? `We have also noted ${addOns.join(", ").toLowerCase()} for your stay.`
      : "We can help add spa, dining, or winery plans whenever you are ready.";

  return `Dear ${guestLabel},

Your ${nights}-night ${accommodation.toLowerCase()} stay at The Lakehouse Inn is confirmed for arrival on ${arrival}. We are preparing a relaxed Geneva-on-the-Lake welcome with lakefront comfort, breakfast basket service, and easy access to our winery, spa, and Crosswinds Grille.

${extras} Reply to this confirmation if you would like us to hold a tasting, dinner reservation, or late checkout request before arrival.`;
}

function App() {
  const assetBase = import.meta.env.BASE_URL;
  const logoSrc = `${assetBase}assets/lakehouse-logo.png`;
  const heroImageSrc = `${assetBase}assets/lakehouse-og.jpg`;
  const [date, setDate] = useState("");
  const [nights, setNights] = useState(2);
  const [guestName, setGuestName] = useState("Megan");
  const [accommodation, setAccommodation] = useState(accommodationOptions[1]);
  const [addOns, setAddOns] = useState([
    "Breakfast basket delivery",
    "Winery tasting flight",
  ]);
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sourceNote, setSourceNote] = useState("Demo-ready local confirmation");

  const apiConfigured = isAPIConfigured();

  const toggleAddOn = (item) => {
    setAddOns((current) =>
      current.includes(item)
        ? current.filter((entry) => entry !== item)
        : [...current, item],
    );
  };

  const reserve = async () => {
    setLoading(true);
    setError("");

    const fallback = buildFallbackConfirmation({
      date,
      nights,
      accommodation,
      guestName,
      addOns,
    });

    if (!apiConfigured) {
      setConfirmation(fallback);
      setSourceNote("Demo-ready local confirmation");
      setLoading(false);
      return;
    }

    try {
      const prompt = `Write a polished booking confirmation email for The Lakehouse Inn in Geneva-on-the-Lake, Ohio.
Guest name: ${guestName || "Guest"}
Arrival date: ${date || "soon"}
Length of stay: ${nights} nights
Accommodation: ${accommodation}
Add-ons: ${addOns.join(", ") || "none"}

Requirements:
- Warm boutique-hotel tone
- Mention Lake Erie or Ohio Wine Country naturally
- Reference breakfast basket service and one upsell tied to spa, dinner, or wine tasting
- Keep it under 140 words
- Plain text only`;

      const data = await callGeminiAPI(prompt);
      const text = extractResponseText(data).trim();
      setConfirmation(text || fallback);
      setSourceNote(text ? "Generated with live AI copy" : "Demo-ready local confirmation");
    } catch (apiError) {
      setConfirmation(fallback);
      setSourceNote("Live API unavailable, showing local demo confirmation");
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
            <div className="eyebrow">Book Instantly with The Lakehouse Inn</div>
            <div className="brand-row">
              <img
                src={logoSrc}
                alt="The Lakehouse Inn"
                className="lakehouse-mark"
              />
              <div>
                <p className="brand-kicker">Your Ohio Wine Country destination</p>
                <h1>Booking confirmations that feel like part of the stay.</h1>
              </div>
            </div>
            <p className="hero-text">
              A pitch-ready booking confirmation experience for The Lakehouse Inn,
              built around lakeview suites, cottages, winery visits, spa add-ons,
              and the all-in-one Ohio Wine Country getaway.
            </p>

            <div className="hero-stats">
              <div>
                <strong>8 inn rooms</strong>
                <span>plus suites and cottages</span>
              </div>
              <div>
                <strong>30+ wineries</strong>
                <span>easy to recommend pre-arrival</span>
              </div>
              <div>
                <strong>Booked. Confirmed.</strong>
                <span>Ready for guests across stay, spa, dining, and tasting</span>
              </div>
            </div>
          </div>

          <aside className="hero-panel">
            <img
              src={heroImageSrc}
              alt="The Lakehouse Inn on the shore of Lake Erie"
              className="hero-panel-image"
            />
            <div className="hero-panel-overlay">
              <div className="panel-badge">Lakeside retreat demo</div>
              <h2>Your Ohio Wine Country destination</h2>
              <p>
                Built to help staff send polished confirmations that coordinate
                room details, welcome amenities, and upsell moments without
                losing the warmth of a family-owned property.
              </p>
              <ul className="bullet-list">
                {stayHighlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </aside>
        </header>

        <main className="content-grid">
          <section className="booking-card">
            <div className="section-heading">
              <p className="section-label">Guest confirmation studio</p>
              <h2>Preview the message a guest receives before arrival.</h2>
            </div>

            <div className="form-grid">
              <label className="field">
                <span>Guest name</span>
                <input
                  type="text"
                  value={guestName}
                  onChange={(event) => setGuestName(event.target.value)}
                  placeholder="Guest name"
                />
              </label>

              <label className="field">
                <span>Arrival date</span>
                <input
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                />
              </label>

              <div className="field">
                <span>Length of stay</span>
                <div className="pill-row">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={value === nights ? "pill active" : "pill"}
                      onClick={() => setNights(value)}
                    >
                      {value} night{value > 1 ? "s" : ""}
                    </button>
                  ))}
                </div>
              </div>

              <div className="field">
                <span>Stay type</span>
                <div className="pill-row">
                  {accommodationOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={option === accommodation ? "pill active" : "pill"}
                      onClick={() => setAccommodation(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="field">
              <span>Suggested add-ons</span>
              <div className="pill-row">
                {amenityOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={addOns.includes(option) ? "pill active" : "pill"}
                    onClick={() => toggleAddOn(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="cta-row">
              <button className="primary-cta" type="button" onClick={reserve} disabled={loading}>
                {loading ? "Preparing confirmation..." : "Generate guest confirmation"}
              </button>
              <p className="helper-text">
                {apiConfigured
                  ? "Live AI is configured. The flow falls back to a polished local draft if needed."
                  : "No live API key detected, so the page uses a polished local demo draft."}
              </p>
            </div>

            {error && <div className="alert">{error}</div>}
          </section>

          <section className="confirmation-card">
            <div className="confirmation-header">
              <div>
                <p className="section-label">Confirmation preview</p>
                <h2>Warm, specific, and ready to send.</h2>
              </div>
              <span className="source-tag">{sourceNote}</span>
            </div>

            <div className="confirmation-body">
              {confirmation ? (
                <pre>{confirmation}</pre>
              ) : (
                <div className="empty-state">
                  <h3>Preview a polished arrival note</h3>
                  <p>
                    Generate a sample confirmation to see how The Lakehouse Inn
                    can coordinate lodging, winery, spa, and dining details in
                    a single guest-ready message.
                  </p>
                </div>
              )}
            </div>

            <div className="confirmation-actions">
              <button type="button" className="secondary-cta">Email to guest</button>
              <button type="button" className="secondary-cta">Save as template</button>
            </div>
          </section>

          <section className="proof-card">
            <div className="section-heading">
              <p className="section-label">Why this fits The Lakehouse Inn</p>
              <h2>Designed around the actual stay guests book here.</h2>
            </div>
            <div className="proof-list">
              {socialProof.map((item) => (
                <article key={item} className="proof-item">
                  <span className="proof-number">0{socialProof.indexOf(item) + 1}</span>
                  <p>{item}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="proof-card">
            <div className="section-heading">
              <p className="section-label">Brand fidelity</p>
              <h2>What the guest experience needs the confirmation to carry forward.</h2>
            </div>
            <div className="journey-grid">
              <article className="journey-step">
                <h3>Property moments</h3>
                <ul className="bullet-list bullet-list-dark">
                  {amenityMoments.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
              <article className="journey-step">
                <h3>Destination planning</h3>
                <ul className="bullet-list bullet-list-dark">
                  {destinationMoments.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </div>
          </section>

          <section className="journey-card">
            <div className="section-heading">
              <p className="section-label">Guest journey</p>
              <h2>Pitch the workflow, not just the screen.</h2>
            </div>
            <div className="journey-grid">
              {itineraryCards.map((card) => (
                <article key={card.title} className="journey-step">
                  <h3>{card.title}</h3>
                  <p>{card.detail}</p>
                </article>
              ))}
            </div>
          </section>
        </main>

        <footer className="footer">
          <p>The Lakehouse Inn demo concept for Geneva-on-the-Lake, Ohio.</p>
          <p>Focused on boutique lodging, wine-country experiences, and polished pre-arrival communication.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
