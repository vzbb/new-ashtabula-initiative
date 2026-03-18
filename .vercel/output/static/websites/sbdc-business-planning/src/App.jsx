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

const planSections = [
  { id: 'executive', title: 'Executive Summary', icon: '📋', status: 'completed' },
  { id: 'company', title: 'Company Description', icon: '🏢', status: 'completed' },
  { id: 'market', title: 'Market Analysis', icon: '📊', status: 'in-progress' },
  { id: 'organization', title: 'Organization & Management', icon: '👥', status: 'pending' },
  { id: 'service', title: 'Service/Product Line', icon: '📦', status: 'pending' },
  { id: 'marketing', title: 'Marketing & Sales', icon: '📢', status: 'pending' },
  { id: 'financial', title: 'Financial Projections', icon: '💰', status: 'pending' },
  { id: 'funding', title: 'Funding Request', icon: '💵', status: 'pending' }
];

function App() {
  const [activeSection, setActiveSection] = useState('market');
  const [progress, setProgress] = useState(25);

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
            <a href="#">Planner</a>
            <a href="#">Templates</a>
            <a href="#">Examples</a>
            <button className="nav-btn">Save Progress</button>
          </nav>
        </div>
      </header>

      <main className="content">
        <section className="hero">
          <div className="hero-badge">
            <span>🎯 Business Plan Builder</span>
          </div>
          <h1>Create Your Business Plan</h1>
          <p className="hero-subtitle">
            Build a comprehensive business plan step-by-step with guided instructions, 
            examples, and expert tips from SBDC counselors.
          </p>
        </section>

        <section className="builder-container">
          <div className="progress-sidebar">
            <div className="progress-header">
              <h3>Plan Progress</h3>
              <div className="progress-percent">{progress}%</div>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{width: `${progress}%`}}></div>
            </div>
            <nav className="section-nav">
              {planSections.map(section => (
                <button
                  key={section.id}
                  className={`section-item ${section.status} ${activeSection === section.id ? 'active' : ''}`}
                  onClick={() => setActiveSection(section.id)}
                >
                  <span className="section-icon">{section.icon}</span>
                  <span className="section-title">{section.title}</span>
                  <span className="section-status">
                    {section.status === 'completed' && '✓'}
                    {section.status === 'in-progress' && '●'}
                    {section.status === 'pending' && '○'}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          <div className="builder-content">
            <div className="section-card">
              <div className="section-header-card">
                <span className="section-number">Section 3 of 8</span>
                <h2>📊 Market Analysis</h2>
                <p>Research and describe your industry, target market, and competitive landscape.</p>
              </div>

              <div className="form-fields">
                <div className="form-group">
                  <label>Industry Overview</label>
                  <textarea 
                    placeholder="Describe your industry. What is the current size? What are the trends?"
                    rows={4}
                  />
                  <span className="hint">💡 Tip: Include statistics and cite your sources</span>
                </div>

                <div className="form-group">
                  <label>Target Market</label>
                  <textarea 
                    placeholder="Who are your ideal customers? Be specific about demographics and psychographics."
                    rows={4}
                  />
                </div>

                <div className="form-group">
                  <label>Competitive Analysis</label>
                  <textarea 
                    placeholder="Who are your main competitors? What are their strengths and weaknesses?"
                    rows={4}
                  />
                </div>

                <div className="form-group">
                  <label>Market Advantages</label>
                  <textarea 
                    placeholder="What gives you a competitive advantage? Why will customers choose you?"
                    rows={3}
                  />
                </div>
              </div>

              <div className="section-actions">
                <button className="btn-outline">← Previous Section</button>
                <button className="btn-secondary">Save Draft</button>
                <button className="btn-primary">Next Section →</button>
              </div>
            </div>

            <div className="help-box">
              <div className="help-icon">💡</div>
              <div className="help-content">
                <h4>Need help with market research?</h4>
                <p>Schedule a free session with an SBDC counselor to access premium market research databases.</p>
                <button className="help-btn">Book Counseling Session</button>
              </div>
            </div>
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
