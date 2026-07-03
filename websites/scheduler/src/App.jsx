import { useMemo, useState } from "react";
import "./App.css";
import blankHeatingLogo from "./assets/blank-heating-logo.png";

const serviceOptions = [
  {
    value: "heating-repair",
    label: "Heating Repair Visit",
    duration: "90 min",
    blurb: "Furnace, boiler, and no-heat diagnostics for occupied homes."
  },
  {
    value: "ac-service",
    label: "A/C Service Call",
    duration: "90 min",
    blurb: "Cooling issues, airflow checks, and condenser troubleshooting."
  },
  {
    value: "system-checkup",
    label: "Seasonal System Check-Up",
    duration: "60 min",
    blurb: "Preventive tune-up before peak weather hits Ashtabula County."
  },
  {
    value: "estimate",
    label: "Free In-Home Estimate",
    duration: "45 min",
    blurb: "New system, replacement, zoning, and indoor comfort planning."
  },
  {
    value: "indoor-air",
    label: "Indoor Air Quality Consultation",
    duration: "45 min",
    blurb: "Humidifier, dehumidifier, and air purification recommendations."
  }
];

const appointmentWindows = [
  "8:00 AM",
  "9:30 AM",
  "11:00 AM",
  "1:00 PM",
  "2:30 PM",
  "4:00 PM"
];

const crewNotes = [
  "Three generations serving Ashtabula-area families",
  "OH LIC #25138 and NATE-certified technicians",
  "Free in-home estimates with clear equipment options",
  "Many payment options and dependable arrival windows"
];

const prepChecklist = [
  "Tell us whether the issue is heating, cooling, zoning, or indoor air quality.",
  "Share the best callback number for day-of technician arrival updates.",
  "Add equipment age, unusual sounds, and rooms most affected for a faster visit."
];

const serviceHighlights = [
  {
    title: "Heating and cooling expertise",
    text: "Book repair, replacement, and tune-up visits for furnaces, A/C systems, and whole-home comfort upgrades."
  },
  {
    title: "Built for busy homeowners",
    text: "Customers can request a preferred window after hours instead of waiting for the office to reopen."
  },
  {
    title: "Comfort-first scheduling",
    text: "The experience keeps the tone honest, dependable, and family-oriented while making service requests easier to submit."
  }
];

function FlameMark() {
  return (
    <svg viewBox="0 0 72 72" className="brand-mark" aria-hidden="true">
      <defs>
        <linearGradient id="schedulerHeat" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>
        <linearGradient id="schedulerCool" x1="10%" y1="10%" x2="90%" y2="90%">
          <stop offset="0%" stopColor="#dbeafe" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
      </defs>
      <rect x="5" y="5" width="62" height="62" rx="20" fill="#fff7ed" />
      <path
        d="M37 14c6 8 9 14 9 20 0 10-7 18-16 18-7 0-12-5-12-12 0-6 3-11 10-19 0 6 2 10 5 12-1-7 1-13 4-19Z"
        fill="url(#schedulerHeat)"
      />
      <path
        d="M43 25c7 5 12 12 12 19 0 9-7 15-17 15 7-3 10-8 10-14 0-7-2-13-5-20Z"
        fill="url(#schedulerCool)"
      />
    </svg>
  );
}

function BadgeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 3 5 6v6c0 4.7 2.9 8.9 7 10 4.1-1.1 7-5.3 7-10V6l-7-3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m9.4 12.2 1.8 1.8 3.8-4.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 7.5v5l3 1.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
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
        d="M7.2 4.8h3.1l1.1 3.4-1.8 1.8a15.2 15.2 0 0 0 4.4 4.4l1.8-1.8 3.4 1.1v3.1a1.8 1.8 0 0 1-2 1.8A17.4 17.4 0 0 1 5.4 6.8a1.8 1.8 0 0 1 1.8-2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function App() {
  const [formData, setFormData] = useState({
    serviceType: "heating-repair",
    date: "",
    time: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const selectedService = useMemo(
    () => serviceOptions.find((service) => service.value === formData.serviceType) ?? serviceOptions[0],
    [formData.serviceType]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="page-shell">
      <div className="page-backdrop" aria-hidden="true">
        <div className="backdrop-heat" />
        <div className="backdrop-grid" />
      </div>

      <div className="page">
        <header className="topbar">
          <div className="brand-lockup">
            <div className="brand-badge">
              <FlameMark />
            </div>
            <div>
              <p className="kicker">Blank Heating Company Inc.</p>
              <h1 className="brand-title">Book Service</h1>
            </div>
          </div>

          <div className="topbar-meta">
            <span>OH LIC #25138</span>
            <span>Family-owned for 3 generations</span>
          </div>
        </header>

        <section className="logo-ribbon panel" aria-label="Blank Heating brand">
          <img src={blankHeatingLogo} alt="Blank Heating Company Inc logo" className="official-logo" />
          <div className="logo-ribbon-copy">
            <p className="small-label">Official mark</p>
            <strong>Branded for Blank Heating Company Inc. with the official local mark and HVAC-first service copy.</strong>
          </div>
        </section>

        <main className="layout">
          <section className="hero panel">
            <div className="hero-copy">
              <p className="eyebrow">Book service with Blank Heating Company</p>
              <h2>Schedule heating, cooling, and indoor comfort visits without waiting on a callback.</h2>
              <p className="hero-text">
                Request a preferred visit window for repair calls, seasonal system check-ups, free in-home estimates,
                and indoor air quality consultations. The experience stays rooted in Blank Heating's family-owned,
                dependable reputation in Ashtabula.
              </p>

              <div className="hero-actions">
                <a className="primary-action" href="#booking-form">
                  Book a visit window
                </a>
                <a className="secondary-action" href="tel:4409691760">
                  Call 440-969-1760
                </a>
              </div>

              <ul className="signal-strip" aria-label="Blank Heating differentiators">
                {crewNotes.map((note) => (
                  <li key={note}>
                    <BadgeIcon />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>

            <aside className="hero-aside">
              <div className="service-spotlight">
                <p className="small-label">Selected visit type</p>
                <h3>{selectedService.label}</h3>
                <p>{selectedService.blurb}</p>
                <div className="spotlight-meta">
                  <span>
                    <ClockIcon />
                    {selectedService.duration}
                  </span>
                  <span>
                    <PhoneIcon />
                    Office follow-up included
                  </span>
                </div>
              </div>

              <div className="callout-card">
                <p className="small-label">After-hours convenience</p>
                <strong>Send a service request any time of day.</strong>
                <p>
                  Homeowners can request a preferred service window online, while the office keeps control over crew
                  routing and confirmation.
                </p>
              </div>
            </aside>
          </section>

          <section className="proof-grid">
            {serviceHighlights.map((item) => (
              <article key={item.title} className="panel proof-card">
                <p className="small-label">Blank Heating edge</p>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </section>

          <section className="booking-grid">
            <section className="panel booking-panel" id="booking-form">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Appointment request</p>
                  <h3>Reserve a service window</h3>
                </div>
                <span className="status-pill">Free estimate available</span>
              </div>

              {submitted ? (
                <div className="confirmation-card" role="status" aria-live="polite">
                  <div className="confirmation-mark">Confirmed</div>
                  <h4>Thanks, {formData.name || "neighbor"}.</h4>
                  <p>
                    Blank Heating would follow up to confirm your {selectedService.label.toLowerCase()} on{" "}
                    <strong>{formData.date || "your selected date"}</strong> at <strong>{formData.time || "your chosen time"}</strong>.
                  </p>
                  <div className="confirmation-details">
                    <span>{formData.address || "Service address to be confirmed"}</span>
                    <span>{formData.phone || "Callback number pending"}</span>
                  </div>
                  <button className="secondary-action button-reset" type="button" onClick={() => setSubmitted(false)}>
                    Book another visit
                  </button>
                </div>
              ) : (
                <form className="booking-form" onSubmit={handleSubmit}>
                  <label>
                    <span>Service requested</span>
                    <select name="serviceType" value={formData.serviceType} onChange={handleChange}>
                      {serviceOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="form-row split">
                    <label>
                      <span>Preferred date</span>
                      <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                    </label>
                    <label>
                      <span>Preferred arrival window</span>
                      <select name="time" value={formData.time} onChange={handleChange} required>
                        <option value="">Choose a window</option>
                        {appointmentWindows.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className="form-row split">
                    <label>
                      <span>Homeowner name</span>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Jane Blank"
                        required
                      />
                    </label>
                    <label>
                      <span>Best callback number</span>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="440-969-1760"
                        required
                      />
                    </label>
                  </div>

                  <div className="form-row split">
                    <label>
                      <span>Email for confirmation</span>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="homeowner@example.com"
                        required
                      />
                    </label>
                    <label>
                      <span>Service address</span>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Ashtabula, OH"
                        required
                      />
                    </label>
                  </div>

                  <label>
                    <span>System notes</span>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="No heat upstairs, thermostat replaced last winter, loud startup noise, interested in humidifier options..."
                      rows="4"
                    />
                  </label>

                  <button className="primary-action button-reset" type="submit">
                    Request service window
                  </button>
                </form>
              )}
            </section>

            <aside className="side-stack">
              <section className="panel contact-panel">
                <p className="eyebrow">Local trust</p>
                <h3>Why homeowners already trust Blank Heating</h3>
                <ul className="detail-list">
                  <li>Family-run HVAC team serving Ashtabula across three generations</li>
                  <li>Free in-home estimates for replacements, zoning, and comfort upgrades</li>
                  <li>Indoor air quality options including humidifiers and dehumidifiers</li>
                  <li>Clear review of equipment choices before the crew is dispatched</li>
                </ul>
              </section>

              <section className="panel prep-panel">
                <p className="eyebrow">Before the visit</p>
                <h3>What the office wants to know</h3>
                <ol className="prep-list">
                  {prepChecklist.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
              </section>

              <section className="panel emergency-panel">
                <p className="eyebrow">Need a faster response?</p>
                <h3>Call the Blank Heating office directly.</h3>
                <p>
                  For urgent comfort issues and same-day dispatch, the office can prioritize active outages and route
                  the right technician faster by phone.
                </p>
                <a className="emergency-link" href="tel:4409691760">
                  440-969-1760
                </a>
              </section>
            </aside>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
