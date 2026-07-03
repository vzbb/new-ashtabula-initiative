import { useState } from "react";
import "./App.css";

const CONDITIONS = [
  {
    wind: "NW 11 knots",
    waves: "1-2 ft",
    visibility: "Clear channel view",
    air: "67 F",
    water: "61 F",
    status: "Open-water favorable",
  },
  {
    wind: "W 15 knots",
    waves: "2-4 ft",
    visibility: "Moderate haze off the lake",
    air: "64 F",
    water: "60 F",
    status: "Use extra caution beyond the harbor mouth",
  },
  {
    wind: "NE 18 knots",
    waves: "3-5 ft",
    visibility: "Reduced by spray and cloud cover",
    air: "59 F",
    water: "58 F",
    status: "Hold inside the river unless necessary",
  },
];

const CAMERA_PANELS = [
  {
    title: "Harbor entrance",
    detail: "View toward the river mouth and lighthouse line",
    note: "Best for checking chop and approach visibility before heading north.",
  },
  {
    title: "Bridge Street lift bridge",
    detail: "Traffic and opening activity near the historic district",
    note: "Useful for launch timing, member arrivals, and guest communication.",
  },
  {
    title: "Dock line and basin",
    detail: "Conditions inside the protected harbor near the club slips",
    note: "Quick read on dock traffic, gusts, and onboard prep before departure.",
  },
];

const MEMBER_SIGNALS = [
  "1924 yacht club heritage anchored on the Ashtabula River",
  "125 docks serving powerboats and sailboats from 24' to 50'",
  "35-ton travel lift and 600+ feet of bulkhead replacement in recent upgrades",
];

const QUICK_LINKS = [
  {
    label: "Ashtabula Yacht Club",
    href: "https://www.aycohio.com/",
  },
  {
    label: "Ashtabula County Port Authority",
    href: "https://www.ashtabulacounty.us/305/Ashtabula-County-Port-Authority",
  },
  {
    label: "NWS Marine Forecast",
    href: "https://www.weather.gov/cle/marine",
  },
];

const BADGE_ICONS = {
  Wind: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 9h11a3 3 0 1 0-2.8-4" />
      <path d="M3 15h15a3 3 0 1 1-2.9 4" />
    </svg>
  ),
  Wave: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2 14c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2" />
      <path d="M2 18c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2" />
    </svg>
  ),
  Bridge: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 18h16" />
      <path d="M7 18V9l5-4 5 4v9" />
      <path d="M12 5v13" />
    </svg>
  ),
  Dock: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 5v14" />
      <path d="M10 8v11" />
      <path d="M15 6v13" />
      <path d="M20 10v9" />
      <path d="M2 19c2 0 2-1.5 4-1.5S8 19 10 19s2-1.5 4-1.5S16 19 18 19s2-1.5 4-1.5" />
    </svg>
  ),
};

function App() {
  const [snapshotIndex, setSnapshotIndex] = useState(0);

  const activeCondition = CONDITIONS[snapshotIndex];
  const now = new Date();
  const next = new Date(now);
  next.setMinutes(now.getMinutes() < 30 ? 30 : 60, 0, 0);
  const nextBridgeWindow = next.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  return (
    <div className="page-shell">
      <div className="chart-lines" aria-hidden="true" />

      <header className="topbar">
        <div className="brand-lockup">
          <img
            className="brand-logo"
            src="/images/ashtabula-yacht-club-logo.png"
            alt="Ashtabula Yacht Club logo"
          />
          <div className="brand-copy">
            <p className="eyebrow">Ashtabula Yacht Club</p>
            <h1>Ashtabula Harbor Conditions</h1>
            <p>
              See the harbor. Plan your voyage. Built around member trust, protected slips, and
              the real Bridge Street waterfront.
            </p>
          </div>
        </div>

        <div className="club-meta">
          <p>Historic Bridge Street, Ashtabula River</p>
          <a href="https://www.aycohio.com/">Visit AYC</a>
        </div>
      </header>

      <main className="layout">
        <section className="hero panel">
          <div className="hero-panel">
            <div className="panel-heading">
              <span className="heading-icon">{BADGE_ICONS.Wave}</span>
              <div>
                <p className="section-label">Current snapshot</p>
                <h2>Harbor-ready view for members, guests, and departures.</h2>
              </div>
            </div>

            <p className="hero-text">
              The dashboard is tuned for what an Ashtabula Yacht Club boater actually needs before
              leaving the dock: wind, wave height, channel visibility, bridge timing, and a quick
              read on what the harbor basin looks like right now.
            </p>

            <div className="signal-row">
              <div className="signal-card">
                <span>{BADGE_ICONS.Wind}</span>
                <strong>{activeCondition.wind}</strong>
                <p>Wind over the harbor and river mouth</p>
              </div>
              <div className="signal-card">
                <span>{BADGE_ICONS.Wave}</span>
                <strong>{activeCondition.waves}</strong>
                <p>Wave read beyond the protected basin</p>
              </div>
              <div className="signal-card">
                <span>{BADGE_ICONS.Bridge}</span>
                <strong>{nextBridgeWindow}</strong>
                <p>Next Bridge Street opening window</p>
              </div>
            </div>
          </div>

          <aside className="conditions-card">
            <p className="section-label">Condition cycle</p>
            <h3>Refresh the harbor snapshot</h3>
            <p className="card-copy">
              Use the sample cycle below to preview how the club dashboard can surface changing
              conditions throughout the day.
            </p>

            <div className="condition-list">
              <div>
                <span>Visibility</span>
                <strong>{activeCondition.visibility}</strong>
              </div>
              <div>
                <span>Air</span>
                <strong>{activeCondition.air}</strong>
              </div>
              <div>
                <span>Water</span>
                <strong>{activeCondition.water}</strong>
              </div>
              <div>
                <span>Status</span>
                <strong>{activeCondition.status}</strong>
              </div>
            </div>

            <button
              className="refresh-button"
              type="button"
              onClick={() => setSnapshotIndex((value) => (value + 1) % CONDITIONS.length)}
            >
              Show next harbor update
            </button>
          </aside>
        </section>

        <section className="camera-grid panel">
          <div className="panel-heading">
            <span className="heading-icon">{BADGE_ICONS.Dock}</span>
            <div>
              <p className="section-label">Camera-style panels</p>
              <h3>Focused on the moments AYC members actually check.</h3>
            </div>
          </div>

          <div className="camera-cards">
            {CAMERA_PANELS.map((panel) => (
              <article className="camera-card" key={panel.title}>
                <div className="camera-frame">
                  <div className="camera-overlay">
                    <span className="live-pill">LIVE STYLE</span>
                    <span className="camera-tag">{panel.title}</span>
                  </div>
                </div>
                <div className="camera-body">
                  <h4>{panel.detail}</h4>
                  <p>{panel.note}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="split-row">
          <article className="panel heritage-card">
            <p className="section-label">Club context</p>
            <h3>Built around the real Ashtabula Yacht Club story.</h3>
            <div className="heritage-list">
              {MEMBER_SIGNALS.map((item) => (
                <div className="heritage-item" key={item}>
                  <span className="heritage-dot" />
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="panel harbor-links-card">
            <p className="section-label">Harbor network</p>
            <h3>Useful links for members and harbor partners.</h3>
            <div className="link-list">
              {QUICK_LINKS.map((link) => (
                <a key={link.label} href={link.href}>
                  {link.label}
                </a>
              ))}
            </div>
            <div className="port-note">
              <span>Port authority contact</span>
              <strong>91 North Chestnut St, Jefferson, OH 44047 | (440) 576-6069</strong>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}

export default App;
