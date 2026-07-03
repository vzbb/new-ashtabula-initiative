import { useState } from 'react';
import './App.css';

const LogoIcon = () => (
  <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 35 L5 18 C5 16 7 15 9 16 L20 20 L20 38 L9 34 C7 33 5 33 5 35 Z" fill="#003366"/>
    <path d="M45 35 L45 18 C45 16 43 15 41 16 L30 20 L30 38 L41 34 C43 33 45 33 45 35 Z" fill="#003366"/>
    <path d="M20 20 L25 18 L30 20 L30 38 L25 36 L20 38 Z" fill="#002244"/>
    <path d="M8 19 L18 22 L18 35 L8 32 Z" fill="#ffffff"/>
    <path d="M42 19 L32 22 L32 35 L42 32 Z" fill="#ffffff"/>
    <line x1="10" y1="24" x2="16" y2="25" stroke="#003366" strokeWidth="0.5"/>
    <line x1="10" y1="27" x2="16" y2="28" stroke="#003366" strokeWidth="0.5"/>
    <line x1="10" y1="30" x2="16" y2="31" stroke="#003366" strokeWidth="0.5"/>
    <line x1="34" y1="25" x2="40" y2="24" stroke="#003366" strokeWidth="0.5"/>
    <line x1="34" y1="28" x2="40" y2="27" stroke="#003366" strokeWidth="0.5"/>
    <line x1="34" y1="31" x2="40" y2="30" stroke="#003366" strokeWidth="0.5"/>
    <path d="M25 4 L10 12 L25 20 L40 12 Z" fill="#cc0000"/>
    <path d="M15 14 L15 22 C15 22 20 26 25 26 C30 26 35 22 35 22 L35 14" fill="#cc0000"/>
    <path d="M37 12 L37 18" stroke="#f1c40f" strokeWidth="2"/>
    <circle cx="37" cy="20" r="2" fill="#f1c40f"/>
    <path d="M25 20 L25 36" stroke="#f1c40f" strokeWidth="1.5"/>
  </svg>
);

const LearningPattern = () => (
  <svg className="learning-pattern" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <g opacity="0.4">
      <rect x="20" y="20" width="12" height="16" fill="#003366"/>
      <rect x="22" y="22" width="8" height="12" fill="none" stroke="#ffffff" strokeWidth="0.5"/>
      <rect x="160" y="40" width="12" height="16" fill="#003366"/>
      <circle cx="100" cy="30" r="6" fill="#f1c40f"/>
      <path d="M97 38 L103 38 L102 42 L98 42 Z" fill="#f1c40f"/>
      <circle cx="50" cy="150" r="6" fill="#f1c40f"/>
      <polygon points="30,80 35,75 40,80 35,85" fill="#cc0000"/>
      <polygon points="150,160 155,155 160,160 155,165" fill="#cc0000"/>
      <line x1="120" y1="60" x2="140" y2="60" stroke="#003366" strokeWidth="0.5"/>
      <line x1="120" y1="65" x2="140" y2="65" stroke="#003366" strokeWidth="0.5"/>
      <line x1="60" y1="100" x2="80" y2="100" stroke="#003366" strokeWidth="0.5"/>
    </g>
  </svg>
);

const services = [
  {
    category: 'Legal & Compliance',
    icon: '⚖️',
    partners: [
      { name: 'Lake County Legal Aid', service: 'Free Legal Consultation', availability: 'Open' },
      { name: 'Ohio Business Registration', service: 'License & Permit Help', availability: 'Online' },
      { name: 'SCORE Mentors', service: 'Business Mentorship', availability: 'Booking' }
    ]
  },
  {
    category: 'Financial Services',
    icon: '🏦',
    partners: [
      { name: 'SBA Lender Match', service: 'Loan Connection', availability: '24/7' },
      { name: 'Lakeland Credit Union', service: 'Business Banking', availability: 'Open' },
      { name: 'Ohio Development Services', service: 'Grant Programs', availability: 'Apply Now' }
    ]
  },
  {
    category: 'Technology & Innovation',
    icon: '💻',
    partners: [
      { name: 'Ohio TechCred', service: 'Tech Training Grants', availability: 'Open' },
      { name: 'Microsoft for Startups', service: 'Free Software Credits', availability: 'Apply' },
      { name: 'Broadband Ohio', service: 'Internet Access Programs', availability: 'Check Eligibility' }
    ]
  }
];

function App() {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <div className="page">
      <LearningPattern />
      
      <header className="header">
        <div className="header-container">
          <div className="logo">
            <LogoIcon />
            <div className="logo-text">
              <span className="logo-title">Lakeland</span>
              <span className="logo-subtitle">SBDC</span>
            </div>
          </div>
          <nav className="nav">
            <a href="#">Services</a>
            <a href="#">Partners</a>
            <a href="#">Events</a>
            <button className="nav-btn">Get Help</button>
          </nav>
        </div>
      </header>

      <main className="content">
        <section className="hero">
          <div className="hero-badge">
            <span>🤝 Partner Network</span>
          </div>
          <h1>SBDC Adjacent Services</h1>
          <p className="hero-subtitle">
            Connect with our network of partner organizations offering specialized services 
            to help your business start, grow, and succeed.
          </p>
        </section>

        <section className="services-section">
          <div className="category-tabs">
            {services.map((cat, idx) => (
              <button
                key={idx}
                className={`category-tab ${activeCategory === idx ? 'active' : ''}`}
                onClick={() => setActiveCategory(idx)}
              >
                <span>{cat.icon}</span>
                {cat.category}
              </button>
            ))}
          </div>

          <div className="partners-grid">
            {services[activeCategory].partners.map((partner, idx) => (
              <div key={idx} className="partner-card">
                <div className="partner-header">
                  <h4>{partner.name}</h4>
                  <span className="availability-badge">{partner.availability}</span>
                </div>
                <p className="partner-service">{partner.service}</p>
                <div className="partner-actions">
                  <button className="btn-outline">Learn More</button>
                  <button className="btn-primary">Connect</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="referral-section">
          <div className="referral-card">
            <div className="referral-icon">📋</div>
            <h3>Need a Warm Introduction?</h3>
            <p>SBDC counselors can provide direct referrals to our partner network, helping you skip the wait and get priority service.</p>
            <button className="btn-primary">Request Referral</button>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <LogoIcon />
            <div>
              <strong>Lakeland SBDC</strong>
              <p>Empowering entrepreneurs through education</p>
            </div>
          </div>
          <p className="footer-copy">© 2026 Lakeland Community College SBDC. Funded in part by the U.S. Small Business Administration.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
