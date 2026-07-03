import { useState } from "react";
import "./App.css";
import axessLogo from "./assets/volunteer/axess-logo.png";
import rsvpHero from "./assets/volunteer/rsvp-hero.webp";
import rsvpFull from "./assets/volunteer/rsvp-full.webp";
import americorpsSeniors from "./assets/volunteer/americorps-seniors.png";

const volunteerPrograms = [
  "Tutoring and homework help",
  "Meal delivery and prep",
  "Transportation support",
  "Food pantry and clothing assistance",
  "Clerical and office support",
  "Light cleaning and organizing",
];

const impactCards = [
  { value: "15", label: "counties in the RSVP network" },
  { value: "55+", label: "volunteers supported with flexible shifts" },
  { value: "40 hrs", label: "max weekly commitment range" },
];

const identityPills = ["RSVP", "Axess Family Services", "AmeriCorps Seniors"];

const opportunityRows = [
  {
    title: "Senior companion tutoring",
    detail: "One-on-one homework support for local schools and after-school programs",
    time: "Weekday afternoons",
  },
  {
    title: "Meal prep and delivery",
    detail: "Route-friendly volunteer shifts for food pantry and home-delivery programs",
    time: "Morning and lunch blocks",
  },
  {
    title: "Community admin support",
    detail: "Reception, filing, and intake help for coordinated volunteer operations",
    time: "Flexible office hours",
  },
];

const buildConfirmation = ({ eventName, date, location, volunteerCount, program }) => {
  const scheduleDate = date || "the selected date";

  return `Thanks for stepping up for ${eventName} on ${scheduleDate} at ${location}.

RSVP / Axess will have ${volunteerCount} volunteer spot${volunteerCount === "1" ? "" : "s"} reserved for the ${program} shift.

Please arrive 15 minutes early, check in with the volunteer lead, and bring any materials listed in your confirmation email.

Your time strengthens the community. We appreciate you.`;
};

function App() {
  const [eventName, setEventName] = useState("RSVP Community Service Day");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("184 E. Walnut Street, Jefferson, OH");
  const [program, setProgram] = useState("Tutoring and homework help");
  const [volunteerCount, setVolunteerCount] = useState("6");
  const [confirmation, setConfirmation] = useState(
    "Use the scheduler to reserve volunteers, confirm the site, and keep RSVP/Axess coordination simple and human."
  );
  const [loading, setLoading] = useState(false);

  const scheduleVolunteer = async () => {
    setLoading(true);

    try {
      const prompt = `Write a warm RSVP/Axess volunteer confirmation for "${eventName}" on ${date || "the selected date"} at ${location}. Mention the ${program} role and ${volunteerCount} volunteer spot(s). Keep it under 100 words and make it sound friendly, organized, and community-centered.`;

      if (import.meta.env.VITE_GEMINI_API_KEY) {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            setConfirmation(text);
            return;
          }
        }
      }

      setConfirmation(
        buildConfirmation({ eventName, date, location, volunteerCount, program })
      );
    } catch {
      setConfirmation(
        buildConfirmation({ eventName, date, location, volunteerCount, program })
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="backdrop backdrop-left" aria-hidden="true" />
      <div className="backdrop backdrop-right" aria-hidden="true" />

      <header className="topbar">
        <div className="brand-lockup">
          <img className="brand-logo" src={axessLogo} alt="Axess Family Services logo" />
          <div>
            <p className="eyebrow">RSVP / Axess Family Services</p>
            <h1>Volunteer Scheduler</h1>
          </div>
        </div>

        <div className="badge">Powered by Axess Family Services</div>
      </header>

      <main className="layout">
        <section className="hero-panel">
          <div className="hero-copy">
            <p className="section-kicker">Connect Volunteers. Strengthen Community.</p>
            <h2>Schedule RSVP volunteers through Axess Family Services.</h2>
            <p className="hero-text">
              Built for RSVP’s 15-county senior volunteer network where volunteers choose how, where,
              and how often they serve. The interface keeps Axess coordination simple for tutoring,
              meal delivery, transportation, clerical support, and more.
            </p>

            <div className="brand-pills" aria-label="Primary brand references">
              {identityPills.map((pill) => (
                <span key={pill} className="brand-pill">
                  {pill}
                </span>
              ))}
            </div>

            <div className="cta-row">
              <button className="primary-btn" onClick={scheduleVolunteer} disabled={loading}>
                {loading ? "Drafting confirmation..." : "Create volunteer confirmation"}
              </button>
              <button className="secondary-btn" type="button">
                Review roster capacity
              </button>
            </div>
          </div>

          <div className="brand-aside" aria-label="Volunteer program highlights and brand references">
            <div className="hero-image-card">
              <img src={rsvpHero} alt="RSVP volunteer community reference art" />
              <div className="hero-image-caption">
                <strong>RSVP Volunteer Scheduler</strong>
                <span>Lead with Experience</span>
              </div>
            </div>

            <div className="logo-strip">
              <img src={americorpsSeniors} alt="AmeriCorps Seniors reference" />
              <img src={rsvpFull} alt="RSVP reference logo" />
            </div>

            <div className="stats-grid">
              {impactCards.map((card) => (
                <article key={card.label} className="stat-card">
                  <strong>{card.value}</strong>
                  <span>{card.label}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="content-grid">
          <article className="schedule-card">
            <div className="card-header">
              <div>
                <p className="card-label">Volunteer intake</p>
                <h3>Plan the next shift</h3>
              </div>
              <span className="live-pill">Live scheduling</span>
            </div>

            <div className="form-grid">
              <label>
                <span>Event name</span>
                <input
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="RSVP Community Service Day"
                />
              </label>
              <label>
                <span>Event date</span>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </label>
              <label className="wide">
                <span>Location</span>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="184 E. Walnut Street, Jefferson, OH"
                />
              </label>
              <label>
                <span>Volunteer spots</span>
                <input
                  value={volunteerCount}
                  onChange={(e) => setVolunteerCount(e.target.value)}
                  inputMode="numeric"
                  placeholder="6"
                />
              </label>
              <label>
                <span>Program focus</span>
                <select value={program} onChange={(e) => setProgram(e.target.value)}>
                  {volunteerPrograms.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="helper-row">
              <p>
                RSVP / Axess can support tutoring, meal delivery, transportation, clerical help, and
                other flexible service roles.
              </p>
            </div>
          </article>

          <article className="confirmation-card">
            <div className="card-header">
              <div>
                <p className="card-label">Confirmation studio</p>
                <h3>Ready-to-send volunteer message</h3>
              </div>
              <span className="soft-pill">Warm tone</span>
            </div>

            <div className="confirmation-body">
              <p>{confirmation}</p>
            </div>

            <div className="mini-grid">
              <div>
                <span>Program</span>
                <strong>{program}</strong>
              </div>
              <div>
                <span>Site</span>
                <strong>{location}</strong>
              </div>
              <div>
                <span>Capacity</span>
                <strong>{volunteerCount} spots</strong>
              </div>
            </div>
          </article>
        </section>

        <section className="program-section">
          <div className="section-heading">
            <p className="section-kicker">What the platform handles</p>
            <h3>Flexible enough for RSVP, ACCAA, Metroparks, and other community partners</h3>
          </div>

          <div className="opportunity-grid">
            {opportunityRows.map((row) => (
              <article key={row.title} className="opportunity-card">
                <span className="opportunity-time">{row.time}</span>
                <h4>{row.title}</h4>
                <p>{row.detail}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div>
          <p className="footer-title">RSVP / Axess Family Services</p>
          <p>Volunteer coordination for a flexible, 15-county senior service network.</p>
        </div>
        <p className="footer-note">AmeriCorps Seniors-aligned scheduling for community service teams.</p>
      </footer>
    </div>
  );
}

export default App;
