import { useState } from 'react';
import './App.css';

// Book with Graduation Cap Logo - Lakeland SBDC
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

const resources = [
  {
    category: 'Starting a Business',
    icon: '🚀',
    items: [
      { title: 'Startup Checklist', type: 'PDF', downloads: '2.4k' },
      { title: 'Business Structure Guide', type: 'Guide', downloads: '1.8k' },
      { title: 'Name Registration Steps', type: 'Article', downloads: '956' }
    ]
  },
  {
    category: 'Marketing',
    icon: '📢',
    items: [
      { title: 'Social Media Strategy Template', type: 'Template', downloads: '3.1k' },
      { title: 'Customer Persona Worksheet', type: 'Worksheet', downloads: '1.5k' },
      { title: 'Marketing Budget Calculator', type: 'Tool', downloads: '2.2k' }
    ]
  },
  {
    category: 'Finance',
    icon: '💵',
    items: [
      { title: 'Financial Statement Template', type: 'Excel', downloads: '4.2k' },
      { title: 'Loan Application Guide', type: 'PDF', downloads: '2.8k' },
      { title: 'Cash Flow Projection Tool', type: 'Tool', downloads: '3.5k' }
    ]
  },
  {
    category: 'Operations',
    icon: '⚙️',
    items: [
      { title: 'Employee Handbook Template', type: 'Template', downloads: '1.9k' },
      { title: 'Inventory Management Guide', type: 'Guide', downloads: '1.2k' },
      { title: 'Vendor Evaluation Scorecard', type: 'Worksheet', downloads: '876' }
    ]
  }
];

function App() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [saved, setSaved] = useState([]);

  const toggleSave = (title) => {
    if (saved.includes(title)) {
      setSaved(saved.filter(s => s !== title));
    } else {
      setSaved([...saved, title]);
    }
  };

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
            <a href="#">Resources</a>
            <a href="#">Library</a>
            <a href="#">Workshops</a>
            <button className="nav-btn">Get Help</button>
          </nav>
        </div>
      </header>

      <main className="content">
        <section className="hero">
          <div className="hero-badge">
            <span>📚 Educational Resources — Lakeland SBDC Resource</span>
          </div>
          <div className="hero-approved-badge">
            <span>✓ Lakeland SBDC Approved Resource</span>
          </div>
          <h1>Welcome to Lakeland's Small Business Development Center</h1>
          <p className="hero-tagline">Learn. Grow. Succeed.</p>
          <p className="hero-subtitle">
            Download free guides, templates, and tools created by SBDC business experts 
            to help you start, grow, and manage your small business.
          </p>
          <p className="hero-free-notice">
            <span className="free-badge">🎓 FREE</span> for Ashtabula County Entrepreneurs
          </p>
          <div className="stats-bar">
            <div className="stat">
              <strong>50+</strong>
              <span>Resources</span>
            </div>
            <div className="stat">
              <strong>12k+</strong>
              <span>Downloads</span>
            </div>
            <div className="stat">
              <strong>100%</strong>
              <span>Free</span>
            </div>
          </div>
        </section>

        <section className="resources-section">
          <div className="category-tabs">
            {resources.map((cat, idx) => (
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

          <div className="resources-grid">
            {resources[activeCategory].items.map((item, idx) => (
              <div key={idx} className="resource-card">
                <div className="resource-icon">📄</div>
                <div className="resource-content">
                  <h4>{item.title}</h4>
                  <div className="resource-meta">
                    <span className="type-badge">{item.type}</span>
                    <span className="downloads">⬇ {item.downloads}</span>
                  </div>
                </div>
                <div className="resource-actions">
                  <button 
                    className={`save-btn ${saved.includes(item.title) ? 'saved' : ''}`}
                    onClick={() => toggleSave(item.title)}
                  >
                    {saved.includes(item.title) ? '★' : '☆'}
                  </button>
                  <button className="download-btn">Download</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="newsletter-section">
          <div className="newsletter-card">
            <div className="newsletter-icon">📧</div>
            <h3>Get New Resources in Your Inbox</h3>
            <p>Subscribe to receive the latest guides, templates, and exclusive SBDC workshop invitations. SBDC Counseling Available.</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email address" />
              <button className="btn-primary">Start Your Free SBDC Consultation</button>
            </div>
            <p className="privacy-note">🔒 We respect your privacy. Unsubscribe anytime.</p>
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
          <p className="footer-network">Part of the Ohio SBDC Network</p>
          <p className="footer-copy">© 2026 Lakeland Community College SBDC. Funded in part by the U.S. Small Business Administration.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
