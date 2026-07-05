import { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";

// Icons
const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

// Loading spinner SVG
const Spinner = () => (
  <svg className="spinner" viewBox="0 0 20 20" width="20" height="20" aria-label="Loading" role="status">
    <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
    <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="50" strokeDashoffset="0" strokeLinecap="round"/>
  </svg>
);

const BASE = import.meta.env.BASE_URL || "/";

function App() {
  const [formData, setFormData] = useState({
    serviceType: "general",
    date: "",
    time: "",
    location: "",
    name: "",
    email: "",
    phone: "",
    notes: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitState, setSubmitState] = useState("idle"); // idle | loading | success
  const [pulseDone, setPulseDone] = useState(false);
  const ctaRef = useRef(null);
  const formRef = useRef(null);

  // Check for reduced motion preference
  const prefersReducedMotion = useCallback(() => {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Scroll-reveal IntersectionObserver
  useEffect(() => {
    if (prefersReducedMotion()) {
      // Show everything immediately
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
      // Remove pulse class after animation ends
      const removal = setTimeout(() => {
        if (ctaRef.current) {
          ctaRef.current.classList.remove("initial-pulse");
        }
        setPulseDone(true);
      }, 2000);
      return () => { clearTimeout(timer); clearTimeout(removal); };
    } else {
      setPulseDone(true);
    }
  }, [prefersReducedMotion]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitState === "loading") return; // prevent double-submit

    setSubmitState("loading");

    // Simulate booking — 1.5s loading state then success
    setTimeout(() => {
      setSubmitState("success");
      setTimeout(() => {
        setSubmitted(true);
        setSubmitState("idle");
      }, 400);
    }, 1500);
  };

  const serviceTypes = [
    { value: "general", label: "General Notarization" },
    { value: "loan", label: "Loan Signing" },
    { value: "real-estate", label: "Real Estate Documents" },
    { value: "power-of-attorney", label: "Power of Attorney" },
    { value: "wills", label: "Wills & Trusts" },
    { value: "affidavit", label: "Affidavits" }
  ];

  const submitLabel = () => {
    switch (submitState) {
      case "loading": return <><Spinner /> Booking...</>;
      case "success": return <>Booked! &#10003;</>;
      default: return "Book Appointment";
    }
  };

  return (
    <div className="page">
      {/* Hero background image */}
      <div className="hero-bg-layer" aria-hidden="true">
        <img src={BASE + "hero-bg.webp"} alt="" className="hero-bg-img" />
        <div className="hero-bg-overlay" />
      </div>

      {/* Background pattern for non-hero areas */}
      <div className="background-pattern" aria-hidden="true">
        <svg className="bg-pattern" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="notaryPattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <circle cx="40" cy="40" r="15" fill="none" stroke="#4f46e5" strokeWidth="1" opacity="0.08"/>
              <circle cx="40" cy="40" r="8" fill="none" stroke="#3730a3" strokeWidth="1" opacity="0.06"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#notaryPattern)"/>
        </svg>
      </div>

      <div className="container">
        <header className="header reveal">
          <div className="brand glass">
            <img src={BASE + "logo.png"} alt="Notes and Prints Mobile" className="logo-img" />
            <div className="brand-text">
              <span className="brand-name">Notes &amp; Prints Mobile</span>
              <span className="brand-tagline">Professional Notary Services</span>
            </div>
          </div>
        </header>

        <main className="main-content">
          <section className="hero-card glass reveal" style={{ animationDelay: "0ms" }}>
            <div className="hero-content">
              <p className="eyebrow">Licensed &amp; Bonded</p>
              <h1>Notary Services at Your Location</h1>
              <p className="sub">Professional mobile notary services throughout Ashtabula County. We come to your home, office, or any convenient location.</p>

              <div className="trust">
                <span className="trust-item"><ClockIcon /> Same Day Service</span>
                <span className="trust-item"><MapPinIcon /> We Come to You</span>
                <span className="trust-item"><ShieldIcon /> Licensed &amp; Insured</span>
              </div>
            </div>

            <div className="input-card glass-tint">
              <h3>Need It Now?</h3>
              <p className="quote-text">Emergency notary available</p>
              <button className="secondary">Call (440) 555-0199</button>
            </div>
          </section>

          {submitted ? (
            <section className="result-card success glass reveal" style={{ animationDelay: "200ms" }}>
              <div className="success-icon">✓</div>
              <h2>Booking Confirmed!</h2>
              <p>Thank you for your booking request. A mobile notary will contact you shortly to confirm your appointment details.</p>
              <button className="primary" onClick={() => setSubmitted(false)}>Book Another Appointment</button>
            </section>
          ) : (
            <section className="form-card glass reveal" style={{ animationDelay: "200ms" }} ref={formRef}>
              <div className="card-header">
                <h2>Schedule Appointment</h2>
                <span className="pill">Online Booking</span>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                <div className="form-row">
                  <div className="input-float">
                    <select name="serviceType" value={formData.serviceType} onChange={handleChange} required className="float-select">
                      {serviceTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                    <label htmlFor="serviceType" className="float-label">Service Type *</label>
                  </div>
                </div>

                <div className="form-row two-col">
                  <div className="input-float">
                    <input
                      type="date"
                      name="date"
                      id="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      placeholder=" "
                    />
                    <label htmlFor="date" className="float-label">Preferred Date *</label>
                  </div>
                  <div className="input-float">
                    <input
                      type="time"
                      name="time"
                      id="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                      placeholder=" "
                    />
                    <label htmlFor="time" className="float-label">Preferred Time *</label>
                  </div>
                </div>

                <div className="form-row">
                  <div className="input-float">
                    <input
                      type="text"
                      name="location"
                      id="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder=" "
                      required
                    />
                    <label htmlFor="location" className="float-label">Service Location *</label>
                  </div>
                </div>

                <div className="form-row two-col">
                  <div className="input-float">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder=" "
                      required
                    />
                    <label htmlFor="name" className="float-label">Your Name *</label>
                  </div>
                  <div className="input-float">
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder=" "
                      required
                    />
                    <label htmlFor="phone" className="float-label">Phone *</label>
                  </div>
                </div>

                <div className="form-row">
                  <div className="input-float">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder=" "
                      required
                    />
                    <label htmlFor="email" className="float-label">Email *</label>
                  </div>
                </div>

                <div className="form-row">
                  <div className="input-float">
                    <textarea
                      name="notes"
                      id="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder=" "
                      rows="3"
                    />
                    <label htmlFor="notes" className="float-label">Additional Notes</label>
                  </div>
                </div>

                <button
                  type="submit"
                  className={`primary ${submitState === "loading" ? "loading" : ""} ${submitState === "success" ? "success" : ""}`}
                  ref={ctaRef}
                  disabled={submitState === "loading"}
                >
                  {submitLabel()}
                </button>
              </form>
            </section>
          )}

          <div className="section-divider reveal">
            <img src={BASE + "lake-erie.webp"} alt="Lake Erie shoreline at Ashtabula Harbor" className="divider-img" />
            <div className="divider-overlay" />
            <span className="divider-text">Serving All of Ashtabula County</span>
          </div>

          <section className="features">
            <div className="feature glass-light reveal" style={{ animationDelay: "400ms" }}>
              <div className="feature-icon">📋</div>
              <h3>All Documents</h3>
              <p>Wills, trusts, real estate, affidavits, powers of attorney, and more.</p>
            </div>
            <div className="feature glass-light reveal" style={{ animationDelay: "500ms" }}>
              <div className="feature-icon">🚗</div>
              <h3>Mobile Service</h3>
              <p>We travel to your home, office, hospital, or any location in the county.</p>
            </div>
            <div className="feature glass-light reveal" style={{ animationDelay: "600ms" }}>
              <div className="feature-icon">🔒</div>
              <h3>Secure &amp; Confidential</h3>
              <p>Your documents and personal information are always protected.</p>
            </div>
          </section>

          <div className="local-section reveal">
            <img src={BASE + "courthouse.webp"} alt="Historic Ashtabula County Courthouse" className="local-img" />
            <div className="local-content">
              <h2>Proudly Serving Ashtabula County</h2>
              <p>From Conneaut to Geneva-on-the-Lake, Jefferson to Andover — trusted mobile notary services across all of Ashtabula County and surrounding areas.</p>
            </div>
          </div>
        </main>

        <footer className="footer reveal" style={{ animationDelay: "700ms" }}>
          <p>Licensed Notary Public &middot; State of Ohio</p>
          <p>Serving Ashtabula County and surrounding areas</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
