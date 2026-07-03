import { useState } from "react";
import {
  callGeminiAPI,
  extractResponseText,
  getErrorMessage,
  isAPIConfigured,
} from "./api-client.js";
import "./App.css";

const serviceOptions = [
  {
    name: "Air Conditioner Tune-Up",
    short: "AC",
    detail: "Cooling inspection, airflow review, and condenser cleanup.",
  },
  {
    name: "Furnace Precision Check",
    short: "Heat",
    detail: "Heating safety review before cold weather or uneven comfort calls.",
  },
  {
    name: "Heat Pump Service",
    short: "HP",
    detail: "Dual-season maintenance for year-round comfort and efficiency.",
  },
  {
    name: "Boiler Visit",
    short: "Boiler",
    detail: "Hydronic performance review for dependable heat and control.",
  },
  {
    name: "Commercial Rooftop Unit",
    short: "RTU",
    detail: "Light-commercial service for offices, retail, and mixed-use spaces.",
  },
];

const urgencyOptions = [
  "Routine seasonal maintenance",
  "Comfort issue that may become urgent",
  "No heat or no cooling concern",
  "MVP Value Plan renewal visit",
];

const cityOptions = [
  "Ashtabula",
  "Concord",
  "Conneaut",
  "Jefferson",
  "Madison",
  "Painesville",
  "Geneva",
  "Other nearby service area",
];

const stats = [
  { value: "1975", label: "Established" },
  { value: "24/7", label: "Emergency support" },
  { value: "3,000+", label: "Sq ft sheet metal shop" },
  { value: "NATE", label: "Certified technicians" },
];

const featureCards = [
  {
    title: "MVP Value Plan ready",
    body: "Frames HAVE's existing maintenance-plan story instead of pretending this is just another generic scheduler.",
  },
  {
    title: "Local dispatch context",
    body: "Service-area routing and urgency capture make the demo feel grounded in the Ashtabula market.",
  },
  {
    title: "Customer-ready messaging",
    body: "The generated confirmation sounds like a real office follow-up, complete with trust cues and prep guidance.",
  },
];

function formatDate(dateValue) {
  if (!dateValue) {
    return "the next available opening";
  }

  const parsed = new Date(`${dateValue}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return dateValue;
  }

  return parsed.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function buildFallbackSummary({
  customerName,
  selectedService,
  date,
  city,
  urgency,
  membership,
  notes,
}) {
  const name = customerName || "Customer";
  const article = /^[aeiou]/i.test(selectedService.name) ? "an" : "a";
  const valuePlanLine =
    membership === "member"
      ? "Because this account is marked as an MVP Value Plan member, the office can prioritize seasonal scheduling and ongoing maintenance timing."
      : "If the caller is not yet part of the MVP Value Plan, the office can introduce it during confirmation as the easiest way to stay ahead of breakdowns.";
  const noteLine = notes
    ? `Dispatcher note: ${notes.slice(0, 120)}${notes.length > 120 ? "..." : ""}`
    : "Dispatcher note: No additional equipment notes were entered yet.";

  return [
    `Thanks ${name}. HAVE Heating and Cooling has received your request for ${article} ${selectedService.name.toLowerCase()} in ${city}, with a preferred appointment around ${formatDate(date)}.`,
    `Request type: ${urgency}. A coordinator can confirm the final arrival window and match the visit to the right technician.`,
    "Before the appointment, please make sure the equipment and thermostat area are easy to access.",
    "Ashtabula homeowners and facilities teams count on HAVE for established local service, NATE-certified technicians, and 24/7 emergency support when conditions change quickly.",
    valuePlanLine,
    noteLine,
  ].join(" ");
}

function App() {
  const [selectedService, setSelectedService] = useState(serviceOptions[0]);
  const [customerName, setCustomerName] = useState("");
  const [city, setCity] = useState(cityOptions[0]);
  const [date, setDate] = useState("");
  const [urgency, setUrgency] = useState(urgencyOptions[0]);
  const [membership, setMembership] = useState("member");
  const [notes, setNotes] = useState("");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const aiReady = isAPIConfigured();
  const logoSrc = `${import.meta.env.BASE_URL}have-logo.png`;
  const bryantBadgeSrc = `${import.meta.env.BASE_URL}bryant-badge.png`;

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setSummary("");

    const payload = {
      customerName,
      selectedService,
      date,
      city,
      urgency,
      membership,
      notes,
    };

    if (!aiReady) {
      setSummary(buildFallbackSummary(payload));
      setLoading(false);
      return;
    }

    try {
      const prompt = `
You are writing a concise appointment confirmation for HAVE Heating and Cooling in Ashtabula, Ohio.

Brand cues:
- Established in 1975
- Leading contractor in the area
- Residential, commercial, and industrial capabilities
- 24/7 emergency service
- NATE-certified technicians
- MVP Value Plan maintenance agreements

Customer name: ${customerName || "Customer"}
Requested service: ${selectedService.name}
Preferred date: ${formatDate(date)}
Service area: ${city}
Request type: ${urgency}
Membership status: ${membership === "member" ? "Existing MVP Value Plan member" : "Not enrolled yet"}
Extra notes: ${notes || "None provided"}

Write under 120 words.
Sound like HAVE's office team.
Mention one prep step before the visit.
Mention one trust signal from the brand facts.
End with one soft next step about the MVP Value Plan or emergency support.
`.trim();

      const response = await callGeminiAPI(prompt);
      setSummary(extractResponseText(response).trim());
    } catch (err) {
      setError(getErrorMessage(err));
      setSummary(buildFallbackSummary(payload));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="page-background" aria-hidden="true" />

      <main className="page">
        <section className="hero-panel">
          <div className="hero-copy">
            <div className="brand-bar">
              <img className="have-logo" src={logoSrc} alt="HAVE Heating and Cooling" />
              <div className="brand-copy">
                <p className="eyebrow">HAVE Heating and Cooling</p>
                <h1>Schedule service with HAVE, not with a generic HVAC template.</h1>
              </div>
            </div>

            <p className="hero-lead">
              This demo repositions the HVAC tune-up MVP as a HAVE-ready booking and
              dispatch experience for Ashtabula County homeowners, facility teams, and
              maintenance-plan customers.
            </p>

            <div className="stat-grid" aria-label="HAVE trust signals">
              {stats.map((item) => (
                <article className="stat-card" key={item.label}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </article>
              ))}
            </div>

            <div className="brand-notes">
              <div className="note-card">
                <p className="note-label">Service hub</p>
                <strong>2101 Aetna Road, Ashtabula, OH 44004</strong>
                <span>440-998-7252 • License #28522</span>
              </div>
              <div className="note-card">
                <p className="note-label">Coverage</p>
                <strong>Ashtabula, Concord, Conneaut, Jefferson, Madison, Painesville</strong>
                <span>Residential, commercial, industrial, and engineering support</span>
              </div>
            </div>
          </div>

          <aside className="trust-panel">
            <div className="trust-card">
              <p className="eyebrow eyebrow-light">Secondary trust cue</p>
              <img className="bryant-badge" src={bryantBadgeSrc} alt="Bryant dealer badge" />
              <h2>Branded for HAVE first.</h2>
              <p>
                The Bryant badge stays supportive, while the actual HAVE identity leads the
                pitch with established-local credibility and maintenance-plan relevance.
              </p>
              <ul className="trust-list">
                <li>Built around MVP Value Plan conversations</li>
                <li>Prepared for 24/7 emergency-service escalation</li>
                <li>Grounded in HAVE’s real Ashtabula footprint</li>
              </ul>
            </div>
          </aside>
        </section>

        <section className="workspace">
          <div className="scheduler-card">
            <div className="section-head">
              <p className="eyebrow">Dispatch Demo</p>
              <h2>Generate a HAVE-branded confirmation</h2>
              <p>
                Capture the service type, local routing context, and maintenance-plan status,
                then generate the kind of message a dispatcher could actually send.
              </p>
            </div>

            <div className="field-stack">
              <div className="field-group">
                <label htmlFor="customerName">Customer or account name</label>
                <input
                  id="customerName"
                  type="text"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  placeholder="Pat Miller, Harbor Suites, Lakeside Dental, etc."
                />
              </div>

              <div className="field-group">
                <span className="field-label">Requested service</span>
                <div className="service-grid">
                  {serviceOptions.map((option) => (
                    <button
                      type="button"
                      key={option.name}
                      className={`service-card ${
                        selectedService.name === option.name ? "service-card-active" : ""
                      }`}
                      onClick={() => setSelectedService(option)}
                    >
                      <strong>{option.short}</strong>
                      <span>{option.name}</span>
                      <small>{option.detail}</small>
                    </button>
                  ))}
                </div>
              </div>

              <div className="field-row">
                <div className="field-group">
                  <label htmlFor="city">Service area</label>
                  <select id="city" value={city} onChange={(event) => setCity(event.target.value)}>
                    {cityOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field-group">
                  <label htmlFor="date">Preferred date</label>
                  <input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                  />
                </div>
              </div>

              <div className="field-row">
                <div className="field-group">
                  <label htmlFor="urgency">Request type</label>
                  <select
                    id="urgency"
                    value={urgency}
                    onChange={(event) => setUrgency(event.target.value)}
                  >
                    {urgencyOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field-group">
                  <label htmlFor="membership">Maintenance-plan status</label>
                  <select
                    id="membership"
                    value={membership}
                    onChange={(event) => setMembership(event.target.value)}
                  >
                    <option value="member">Existing MVP Value Plan member</option>
                    <option value="prospect">Not enrolled yet</option>
                  </select>
                </div>
              </div>

              <div className="field-group">
                <label htmlFor="notes">Equipment notes or dispatcher context</label>
                <textarea
                  id="notes"
                  rows="4"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Older unit, thermostat issue, rooftop access note, noisy blower, replacement discussion, or after-hours concern."
                />
              </div>
            </div>

            <div className="cta-block">
              <button type="button" className="primary-cta" onClick={handleGenerate} disabled={loading}>
                {loading ? "Generating HAVE confirmation..." : "Generate confirmation preview"}
              </button>
              <p className="cta-note">
                {aiReady
                  ? "AI copy is enabled for live demo output."
                  : "No API key detected, so the site falls back to a polished local confirmation."}
              </p>
            </div>

            {error ? <div className="status-banner">{error}</div> : null}
          </div>

          <div className="preview-column">
            <div className="preview-card">
              <div className="preview-head">
                <div>
                  <p className="eyebrow">Customer-Facing Output</p>
                  <h3>Confirmation preview</h3>
                </div>
                <span className="preview-chip">{selectedService.short}</span>
              </div>

              {summary ? (
                <div className="preview-body">
                  <pre>{summary}</pre>
                </div>
              ) : (
                <div className="empty-state">
                  <p>
                    Build a confirmation to preview how HAVE’s team could follow up after a
                    tune-up, service issue, or maintenance-plan touchpoint.
                  </p>
                </div>
              )}
            </div>

            <div className="mini-panel">
              <p className="eyebrow">Pitch framing</p>
              <h3>Why this feels buyer-specific</h3>
              <div className="feature-list">
                {featureCards.map((card) => (
                  <article className="feature-card" key={card.title}>
                    <h4>{card.title}</h4>
                    <p>{card.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
