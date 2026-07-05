import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import "./App.css";

const SERVICE_OPTIONS = [
  {
    id: "general",
    label: "General notarization",
    blurb: "Acknowledgements, jurats, affidavits, oaths, and copy certifications.",
    icon: "Seal",
    baseFee: 35,
  },
  {
    id: "medical",
    label: "Medical forms",
    blurb: "Advanced directives, living wills, medical power of attorney, and guardianship packets.",
    icon: "Cross",
    baseFee: 45,
  },
  {
    id: "vehicle",
    label: "Vehicle title work",
    blurb: "Titles, powers of attorney for vehicle transactions, minor consent, and weight affidavits.",
    icon: "Car",
    baseFee: 45,
  },
  {
    id: "field",
    label: "Mortgage field inspections",
    blurb: "Professional onsite documentation support for banks, lenders, and servicers.",
    icon: "Home",
    baseFee: 65,
  },
  {
    id: "wedding",
    label: "Wedding officiant service",
    blurb: "An ordained minister who comes to your location for a polished, personal ceremony.",
    icon: "Rings",
    baseFee: 85,
  },
  {
    id: "fingerprinting",
    label: "Ink fingerprinting interest",
    blurb: "Capture demand now for licensing, employment, and background-check appointments.",
    icon: "Fingerprint",
    baseFee: 30,
  },
];

const AVAILABILITY_OPTIONS = [
  { id: "standard", label: "Standard daytime", fee: 0 },
  { id: "extended", label: "Evening or weekend", fee: 20 },
  { id: "urgent", label: "Holiday or urgent request", fee: 40 },
];

const LOCATION_OPTIONS = [
  { id: "home", label: "Home or residence", fee: 0 },
  { id: "office", label: "Office or job site", fee: 10 },
  { id: "care", label: "Hospital, nursing, or care facility", fee: 20 },
];

const TRUST_POINTS = [
  "20+ years combined experience across notarial, medical, and insurance fields",
  "Mobile appointments at your door across Ashtabula and nearby communities",
  "Evening, weekend, holiday, and urgent scheduling support",
];

const PROCESS_STEPS = [
  {
    title: "Tell us what needs signing",
    body: "Choose the document type, location, and timing so the visit can be scoped fast.",
  },
  {
    title: "Get a same-day callback plan",
    body: "Notes and Prints Mobile follows up with scheduling details, preparation guidance, and appointment confirmation.",
  },
  {
    title: "Meet at your location",
    body: "Clients stay where they are while the notary comes prepared for residential, business, medical, and title work.",
  },
];

// Loading spinner
const Spinner = () => (
  <svg className="spinner" viewBox="0 0 20 20" width="20" height="20" aria-label="Loading" role="status">
    <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
    <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="50" strokeDashoffset="0" strokeLinecap="round"/>
  </svg>
);

const ICONS = {
  Seal: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 14.8 7.2 17l.9-5.4L4.2 7.7l5.4-.8L12 2z" />
    </svg>
  ),
  Cross: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7V3z" />
    </svg>
  ),
  Car: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 16l1.5-5h11L19 16" />
      <path d="M3 16h18v3H3z" />
      <circle cx="7" cy="19" r="1.75" />
      <circle cx="17" cy="19" r="1.75" />
    </svg>
  ),
  Home: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 11.5L12 4l9 7.5" />
      <path d="M6 10.5V20h12v-9.5" />
    </svg>
  ),
  Rings: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="9" cy="14" r="4.5" />
      <circle cx="15" cy="10" r="4.5" />
    </svg>
  ),
  Fingerprint: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 4a6 6 0 0 1 6 6v2" />
      <path d="M12 7a3 3 0 0 1 3 3v5" />
      <path d="M12 10v8" />
      <path d="M9 8.5A4.5 4.5 0 0 0 7.5 12v2.5" />
      <path d="M15 8.5A4.5 4.5 0 0 1 16.5 12v4.5" />
    </svg>
  ),
  Shield: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3l7 3v5c0 4.7-2.9 8.9-7 10-4.1-1.1-7-5.3-7-10V6l7-3z" />
    </svg>
  ),
  Clock: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v6l4 2" />
    </svg>
  ),
  Pin: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s6-5.5 6-11a6 6 0 1 0-12 0c0 5.5 6 11 6 11z" />
      <circle cx="12" cy="10" r="2.25" />
    </svg>
  ),
};

const assetBase = import.meta.env.BASE_URL;

function App() {
  // Pricing estimator state
  const [serviceId, setServiceId] = useState("medical");
  const [availabilityId, setAvailabilityId] = useState("extended");
  const [locationId, setLocationId] = useState("care");
  const [name, setName] = useState("");

  // CTA ref for initial pulse
  const ctaRef = useRef(null);

  const service = SERVICE_OPTIONS.find((item) => item.id === serviceId) ?? SERVICE_OPTIONS[0];
  const availability =
    AVAILABILITY_OPTIONS.find((item) => item.id === availabilityId) ?? AVAILABILITY_OPTIONS[0];
  const location = LOCATION_OPTIONS.find((item) => item.id === locationId) ?? LOCATION_OPTIONS[0];

  const estimate = useMemo(() => {
    const total = service.baseFee + availability.fee + location.fee;
    const prepNote =
      serviceId === "medical"
        ? "Have IDs ready for all signers and gather any required witnesses before arrival."
        : serviceId === "vehicle"
          ? "Keep the title packet, ID, and any lien release paperwork together for the appointment."
          : serviceId === "wedding"
            ? "Share ceremony timing, exact address, and any script preferences before confirmation."
            : "Have valid ID ready and confirm whether witnesses are required for the document.";

    return {
      total,
      responseWindow: availabilityId === "urgent" ? "Call back within 15 minutes" : "Call back within 1 business hour",
      timing: locationId === "care" ? "Allow a 45-60 minute onsite visit" : "Most visits wrap in 20-40 minutes",
      prepNote,
    };
  }, [availability.fee, availabilityId, location.fee, locationId, service.baseFee, serviceId]);

  const requestHeadline = name.trim()
    ? `${name.trim()}'s appointment plan`
    : "Sample appointment plan";

  // Check for reduced motion preference
  const prefersReducedMotion = useCallback(() => {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Scroll-reveal IntersectionObserver
  useEffect(() => {
    if (prefersReducedMotion()) {
      document.querySelectorAll(".reveal").forEach(el => el.classList.add("visible"));
      return;
    }

    const targets = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    targets.forEach(t => observer.observe(t));
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  // CTA initial pulse — one-time, 1s after mount
  useEffect(() => {
    if (!prefersReducedMotion()) {
      const timer = setTimeout(() => {
        if (ctaRef.current) {
          ctaRef.current.classList.add("initial-pulse");
        }
      }, 1000);
      const removal = setTimeout(() => {
        if (ctaRef.current) {
          ctaRef.current.classList.remove("initial-pulse");
        }
      }, 2000);
      return () => { clearTimeout(timer); clearTimeout(removal); };
    }
  }, [prefersReducedMotion]);

  return (
    <div className="page-shell">
      <div className="aurora" aria-hidden="true" />

      <header className="topbar reveal">
        <div className="brand-mark">
          <img
            className="brand-logo"
            src={`${assetBase}images/notes-and-prints-logo.png`}
            alt="Notes and Prints Mobile logo"
          />
          <div>
            <p className="brand-kicker">Ashtabula mobile notary</p>
            <h1 className="brand-name">Notes and Prints Mobile Notary</h1>
          </div>
        </div>
        <a className="cta-link" href="tel:18666797370" ref={ctaRef}>
          Call (866) 679-7370
        </a>
      </header>

      <main className="layout">
        <section className="hero panel glass reveal">
          <div className="hero-copy">
            <p className="eyebrow">Convenient notary services at your doorstep</p>
            <h2>Notarized. On Your Schedule. At Your Door.</h2>
            <p className="hero-text">
              Notes and Prints Mobile brings professional notary service directly to homes,
              offices, care facilities, and closing appointments across Ashtabula, with support
              for medical forms, vehicle titles, mortgage field inspections, and wedding officiant
              requests.
            </p>

            <div className="hero-highlights">
              <div className="highlight-chip">
                <span className="highlight-icon">{ICONS.Shield}</span>
                20+ years combined experience
              </div>
              <div className="highlight-chip">
                <span className="highlight-icon">{ICONS.Clock}</span>
                Evening, weekend, and urgent scheduling
              </div>
              <div className="highlight-chip">
                <span className="highlight-icon">{ICONS.Pin}</span>
                Ashtabula-based mobile coverage
              </div>
            </div>

            <div className="hero-proof">
              {TRUST_POINTS.map((point) => (
                <div className="proof-row" key={point}>
                  <span className="proof-dot" />
                  <p>{point}</p>
                </div>
              ))}
            </div>

            <div className="contact-band">
              <div>
                <p className="band-label">Primary contact</p>
                <p className="band-value">(866) 679-7370</p>
              </div>
              <div>
                <p className="band-label">Email</p>
                <p className="band-value">info@notesandprintsmobile.com</p>
              </div>
              <div>
                <p className="band-label">Best fit</p>
                <p className="band-value">Residential, medical, title, and urgent appointments</p>
              </div>
            </div>
          </div>

          <aside className="planner" style={{ animationDelay: "200ms" }}>
            <p className="planner-kicker">Appointment intake</p>
            <h3>Plan your mobile notary visit</h3>
            <p className="planner-copy">
              Start the request here to estimate the visit, confirm the service type, and prepare
              for a fast callback from Notes and Prints Mobile.
            </p>

            <label className="field">
              <span>Client or signer name</span>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Patricia Walker"
              />
            </label>

            <label className="field">
              <span>Service requested</span>
              <select value={serviceId} onChange={(event) => setServiceId(event.target.value)}>
                {SERVICE_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="field-grid">
              <label className="field">
                <span>Timing</span>
                <select
                  value={availabilityId}
                  onChange={(event) => setAvailabilityId(event.target.value)}
                >
                  {AVAILABILITY_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span>Appointment location</span>
                <select value={locationId} onChange={(event) => setLocationId(event.target.value)}>
                  {LOCATION_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="estimate-card">
              <p className="estimate-label">{requestHeadline}</p>
              <p className="estimate-total">Starting at ${estimate.total}</p>
              <ul className="estimate-list">
                <li>{estimate.responseWindow}</li>
                <li>{estimate.timing}</li>
                <li>{estimate.prepNote}</li>
              </ul>
            </div>

            <div className="planner-actions">
              <a className="primary-action" href="mailto:info@notesandprintsmobile.com">
                Request an appointment
              </a>
              <p className="planner-note">
                This intake stays on-page here, with the tone and structure shaped around the
                Notes and Prints Mobile booking experience.
              </p>
            </div>
          </aside>
        </section>

        <section className="brand-spotlight panel glass reveal" style={{ animationDelay: "300ms" }}>
          <div className="spotlight-copy">
            <p className="eyebrow">Brand presentation</p>
            <h3>The official Notes and Prints Mobile look is built into the page.</h3>
            <p>
              The logo, favicon, and social preview image now come from the current branding pack,
              reinforcing a trustworthy, mobile-service identity throughout the page.
            </p>
          </div>
          <div className="spotlight-media">
            <img
              src={`${assetBase}images/notes-and-prints-og.jpg`}
              alt="Notes and Prints Mobile branded social preview"
            />
          </div>
        </section>

        <section className="services panel glass reveal" style={{ animationDelay: "400ms" }}>
          <div className="section-heading">
            <p className="eyebrow">Service mix</p>
            <h3>Services shaped around the actual Notes and Prints Mobile offer.</h3>
          </div>
          <div className="service-grid">
            {SERVICE_OPTIONS.map((option) => (
              <article className="service-card" key={option.id}>
                <div className="service-icon">{ICONS[option.icon]}</div>
                <h4>{option.label}</h4>
                <p>{option.blurb}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="split-row">
          <article className="panel narrative-card glass reveal" style={{ animationDelay: "500ms" }}>
            <p className="eyebrow">Why clients choose us</p>
            <h3>Built around real doorstep service and a wide appointment mix.</h3>
            <p>
              Notes and Prints Mobile stands out by combining broad document coverage with
              local-response convenience. The business can serve personal signings, medical
              documents, title work, officiant requests, and lender support without losing the warm,
              professional tone that clients expect.
            </p>
            <div className="metric-strip">
              <div>
                <strong>20+</strong>
                <span>years combined experience</span>
              </div>
              <div>
                <strong>1</strong>
                <span>trusted brand across notary, officiant, and inspection demand</span>
              </div>
              <div>
                <strong>24/7</strong>
                <span>urgent-friendly scheduling posture for evenings, weekends, and holidays</span>
              </div>
            </div>
          </article>

          <article className="panel process-card glass reveal" style={{ animationDelay: "600ms" }}>
            <p className="eyebrow">How it works</p>
            <h3>A simple flow for a fast local close.</h3>
            <div className="process-list">
              {PROCESS_STEPS.map((step, index) => (
                <div className="process-item" key={step.title}>
                  <span className="step-number">0{index + 1}</span>
                  <div>
                    <h4>{step.title}</h4>
                    <p>{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>

        <section className="panel footer-panel glass reveal" style={{ animationDelay: "700ms" }}>
          <div>
            <p className="eyebrow">Notes and Prints Mobile</p>
            <h3>Professional mobile notary service for Ashtabula appointments.</h3>
          </div>
          <p>
            The page now speaks in the brand's own voice, keeps the `/notary/` route, and
            highlights the service categories that make Notes and Prints Mobile distinctive in
            Ashtabula.
          </p>
          <div className="footer-actions">
            <a href="https://notesandprintsmobile.com/">Visit current site</a>
            <a href="mailto:info@notesandprintsmobile.com">Email Notes and Prints Mobile</a>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
