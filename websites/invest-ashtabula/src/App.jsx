import React, { useRef } from 'react';
import './App.css';

// Chamber of Commerce Network Logo SVG
const ChamberLogo = ({ size = 50 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* Network/Bridge interconnected nodes design */}
    <circle cx="50" cy="50" r="46" fill="#003366" />
    <circle cx="50" cy="50" r="42" fill="none" stroke="#d4af37" strokeWidth="2" />
    
    {/* Central hub */}
    <circle cx="50" cy="50" r="8" fill="#d4af37" />
    
    {/* Network nodes */}
    <circle cx="50" cy="25" r="5" fill="#ffffff" />
    <circle cx="72" cy="38" r="5" fill="#ffffff" />
    <circle cx="72" cy="62" r="5" fill="#ffffff" />
    <circle cx="50" cy="75" r="5" fill="#ffffff" />
    <circle cx="28" cy="62" r="5" fill="#ffffff" />
    <circle cx="28" cy="38" r="5" fill="#ffffff" />
    
    {/* Connection lines - forming a bridge/network pattern */}
    <line x1="50" y1="50" x2="50" y2="25" stroke="#d4af37" strokeWidth="2" />
    <line x1="50" y1="50" x2="72" y2="38" stroke="#d4af37" strokeWidth="2" />
    <line x1="50" y1="50" x2="72" y2="62" stroke="#d4af37" strokeWidth="2" />
    <line x1="50" y1="50" x2="50" y2="75" stroke="#d4af37" strokeWidth="2" />
    <line x1="50" y1="50" x2="28" y2="62" stroke="#d4af37" strokeWidth="2" />
    <line x1="50" y1="50" x2="28" y2="38" stroke="#d4af37" strokeWidth="2" />
    
    {/* Outer ring connections */}
    <path d="M50 25 L72 38 L72 62 L50 75 L28 62 L28 38 Z" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.5" />
    
    {/* Bridge arch element */}
    <path d="M25 70 Q50 55 75 70" fill="none" stroke="#d4af37" strokeWidth="2" opacity="0.8" />
  </svg>
);

// Sample site data
const sitesData = {
  sites: [
    { id: 1, name: "Harbor District", type: "Waterfront", description: "Prime lakefront development opportunity with marina access." },
    { id: 2, name: "Downtown Core", type: "Commercial", description: "Historic district revitalization with mixed-use potential." },
    { id: 3, name: "Industrial Park", type: "Industrial", description: "Shovel-ready sites with rail and highway access." },
    { id: 4, name: "Agricultural Reserve", type: "Agribusiness", description: "Farmland preservation with value-added processing opportunities." },
    { id: 5, name: "Tech Corridor", type: "Technology", description: "Fiber-connected sites ideal for data centers and tech companies." },
    { id: 6, name: "Tourism Gateway", type: "Hospitality", description: "Covered Bridge Trail adjacent properties for hospitality development." },
  ]
};

function Hero({ onViewSites }) {
  return (
    <section className="hero">
      <div className="hero-badge">🏆 Chamber Certified Business Tool</div>
      <h1 className="hero-title">Welcome to Your Chamber Business Assistant</h1>
      <p className="hero-subtitle">
        Exclusive Chamber Member Resource — Connecting Ashtabula Businesses with 
        prime development opportunities in Northeast Ohio's most promising growth corridor.
      </p>
      <div className="member-stats">
        <span className="stats-badge">Join 400+ Chamber Members Using This Tool</span>
      </div>
      <div className="separator" />
      <button onClick={onViewSites} className="btn btn-primary">
        📋 View Available Sites
      </button>
      <p className="cta-subtext">Member Benefit — Powered by Your Chamber</p>
    </section>
  );
}

function SiteGrid({ sites }) {
  return (
    <section className="card">
      <h2 className="card-title">🏗️ Development Sites</h2>
      <p className="card-subtitle">Connecting Ashtabula Businesses with Growth Opportunities</p>
      <div className="site-grid">
        {sites.map(site => (
          <div key={site.id} className="site-card">
            <h3>{site.name}</h3>
            <p>{site.description}</p>
            <span className="site-tag">{site.type}</span>
          </div>
        ))}
      </div>
      <div className="member-cta">
        <button className="btn btn-gold">Claim Your Chamber Member Benefit</button>
      </div>
    </section>
  );
}

function Benefits() {
  const benefits = [
    { icon: "🚢", title: "Lake Access", desc: "Direct Lake Erie port and marina facilities" },
    { icon: "🚛", title: "Transportation", desc: "I-90, SR 11, and CSX rail corridors" },
    { icon: "🎓", title: "Workforce", desc: "Access to 5 colleges within 30 miles" },
    { icon: "💰", title: "Incentives", desc: "Enterprise Zone and TIF district benefits" },
  ];

  return (
    <section className="benefits">
      <h2 className="benefits-title">Why Invest in Ashtabula County?</h2>
      <p className="benefits-subtitle">Your Chamber is Here to Help Your Business Grow</p>
      <div className="benefits-grid">
        {benefits.map((benefit, idx) => (
          <div key={idx} className="benefit-item">
            <div className="benefit-icon">{benefit.icon}</div>
            <h4>{benefit.title}</h4>
            <p>{benefit.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <p className="footer-text">Ashtabula Area Chamber of Commerce</p>
      <p className="footer-subtext">© 2026 Ashtabula Area Chamber of Commerce. All rights reserved.</p>
      <p className="footer-tagline">Connecting Businesses. Building Community.</p>
    </footer>
  );
}

function App() {
  const sitesRef = useRef(null);

  const scrollToSites = () => {
    sitesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      <div className="bg-pattern" />
      
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <ChamberLogo size={50} />
            <div className="logo-text">
              <span className="logo-title">Invest Ashtabula</span>
              <span className="logo-subtitle">Ashtabula Chamber Business Tool</span>
            </div>
          </div>
          <div className="chamber-badge">Chamber Member Resource</div>
        </div>
      </header>

      <main className="main">
        <div className="content-wrapper">
          <Hero onViewSites={scrollToSites} />
          <div ref={sitesRef}>
            <SiteGrid sites={sitesData.sites} />
          </div>
          
          <Benefits />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
