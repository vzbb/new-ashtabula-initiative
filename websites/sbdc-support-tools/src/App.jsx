import { useState } from 'react';
import './App.css';

// Book with Graduation Cap Logo - Lakeland SBDC
const LogoIcon = () => (
  <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Open Book Base */}
    <path d="M5 35 L5 18 C5 16 7 15 9 16 L20 20 L20 38 L9 34 C7 33 5 33 5 35 Z" fill="#003366"/>
    <path d="M45 35 L45 18 C45 16 43 15 41 16 L30 20 L30 38 L41 34 C43 33 45 33 45 35 Z" fill="#003366"/>
    <path d="M20 20 L25 18 L30 20 L30 38 L25 36 L20 38 Z" fill="#002244"/>
    {/* Book pages */}
    <path d="M8 19 L18 22 L18 35 L8 32 Z" fill="#ffffff"/>
    <path d="M42 19 L32 22 L32 35 L42 32 Z" fill="#ffffff"/>
    <line x1="10" y1="24" x2="16" y2="25" stroke="#003366" strokeWidth="0.5"/>
    <line x1="10" y1="27" x2="16" y2="28" stroke="#003366" strokeWidth="0.5"/>
    <line x1="10" y1="30" x2="16" y2="31" stroke="#003366" strokeWidth="0.5"/>
    <line x1="34" y1="25" x2="40" y2="24" stroke="#003366" strokeWidth="0.5"/>
    <line x1="34" y1="28" x2="40" y2="27" stroke="#003366" strokeWidth="0.5"/>
    <line x1="34" y1="31" x2="40" y2="30" stroke="#003366" strokeWidth="0.5"/>
    {/* Graduation Cap */}
    <path d="M25 4 L10 12 L25 20 L40 12 Z" fill="#cc0000"/>
    <path d="M15 14 L15 22 C15 22 20 26 25 26 C30 26 35 22 35 22 L35 14" fill="#cc0000"/>
    <path d="M37 12 L37 18" stroke="#f1c40f" strokeWidth="2"/>
    <circle cx="37" cy="20" r="2" fill="#f1c40f"/>
    {/* Gold accent */}
    <path d="M25 20 L25 36" stroke="#f1c40f" strokeWidth="1.5"/>
  </svg>
);

// Learning Pattern Background
const LearningPattern = () => (
  <svg className="learning-pattern" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <g opacity="0.4">
      {/* Books */}
      <rect x="20" y="20" width="12" height="16" fill="#003366"/>
      <rect x="22" y="22" width="8" height="12" fill="none" stroke="#ffffff" strokeWidth="0.5"/>
      <rect x="160" y="40" width="12" height="16" fill="#003366"/>
      <rect x="162" y="42" width="8" height="12" fill="none" stroke="#ffffff" strokeWidth="0.5"/>
      {/* Lightbulbs */}
      <circle cx="100" cy="30" r="6" fill="#f1c40f"/>
      <path d="M97 38 L103 38 L102 42 L98 42 Z" fill="#f1c40f"/>
      <circle cx="50" cy="150" r="6" fill="#f1c40f"/>
      <path d="M47 158 L53 158 L52 162 L48 162 Z" fill="#f1c40f"/>
      <circle cx="170" cy="120" r="6" fill="#f1c40f"/>
      <path d="M167 128 L173 128 L172 132 L168 132 Z" fill="#f1c40f"/>
      {/* Academic cap symbols */}
      <polygon points="30,80 35,75 40,80 35,85" fill="#cc0000"/>
      <polygon points="150,160 155,155 160,160 155,165" fill="#cc0000"/>
      <polygon points="80,180 85,175 90,180 85,185" fill="#cc0000"/>
      {/* Page lines */}
      <line x1="120" y1="60" x2="140" y2="60" stroke="#003366" strokeWidth="0.5"/>
      <line x1="120" y1="65" x2="140" y2="65" stroke="#003366" strokeWidth="0.5"/>
      <line x1="120" y1="70" x2="135" y2="70" stroke="#003366" strokeWidth="0.5"/>
      <line x1="60" y1="100" x2="80" y2="100" stroke="#003366" strokeWidth="0.5"/>
      <line x1="60" y1="105" x2="80" y2="105" stroke="#003366" strokeWidth="0.5"/>
      <line x1="60" y1="110" x2="75" y2="110" stroke="#003366" strokeWidth="0.5"/>
    </g>
  </svg>
);

const supportTools = [
  {
    icon: '📊',
    title: 'Cash Flow Calculator',
    description: 'Project your monthly cash flow and identify potential shortfalls before they happen.',
    level: 'Beginner',
    time: '10 min'
  },
  {
    icon: '📋',
    title: 'Business Checklist',
    description: 'Step-by-step startup checklist covering licenses, permits, and registrations.',
    level: 'Beginner',
    time: '15 min'
  },
  {
    icon: '💰',
    title: 'Break-Even Analyzer',
    description: 'Calculate how many units you need to sell to cover your fixed costs.',
    level: 'Intermediate',
    time: '12 min'
  },
  {
    icon: '📈',
    title: 'Profit Margin Tool',
    description: 'Analyze your pricing strategy and profit margins by product or service.',
    level: 'Intermediate',
    time: '8 min'
  },
  {
    icon: '🎯',
    title: 'Goal Tracker',
    description: 'Set SMART business goals and track your progress with visual indicators.',
    level: 'All Levels',
    time: '20 min'
  },
  {
    icon: '📅',
    title: 'Task Prioritizer',
    description: 'Organize your business tasks by urgency and impact for maximum productivity.',
    level: 'All Levels',
    time: '5 min'
  }
];

function App() {
  const [selectedTool, setSelectedTool] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = supportTools.filter(tool => 
    tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <a href="#tools">Tools</a>
            <a href="#resources">Resources</a>
            <a href="#counseling">Counseling</a>
            <button className="nav-btn">Get Help</button>
          </nav>
        </div>
      </header>

      <main className="content">
        <section className="hero">
          <div className="hero-badge">
            <span>📚 Small Business Support Tools — Lakeland SBDC Resource</span>
          </div>
          <div className="hero-approved-badge">
            <span>✓ Lakeland SBDC Approved Resource</span>
          </div>
          <h1>Welcome to Lakeland's Small Business Development Center</h1>
          <p className="hero-tagline">Learn. Grow. Succeed.</p>
          <p className="hero-subtitle">
            Free calculators, templates, and resources designed to support entrepreneurs 
            at every stage of their business journey.
          </p>
          <p className="hero-free-notice">
            <span className="free-badge">🎓 FREE</span> for Ashtabula County Entrepreneurs
          </p>
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input 
              type="text"
              placeholder="Search tools and resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </section>

        <section className="progress-section">
          <h3>Your Learning Path</h3>
          <div className="progress-track">
            <div className="progress-step completed">
              <div className="step-icon">✓</div>
              <span>Explore Tools</span>
            </div>
            <div className="progress-line"></div>
            <div className="progress-step active">
              <div className="step-icon">2</div>
              <span>Try Calculator</span>
            </div>
            <div className="progress-line"></div>
            <div className="progress-step">
              <div className="step-icon">3</div>
              <span>Get Feedback</span>
            </div>
            <div className="progress-line"></div>
            <div className="progress-step">
              <div className="step-icon">4</div>
              <span>Implement</span>
            </div>
          </div>
        </section>

        <section id="tools" className="tools-section">
          <div className="section-header">
            <h2>Small Business Support Tools</h2>
            <p>Select a tool to get started with your business analysis</p>
          </div>

          <div className="tools-grid">
            {filteredTools.map((tool, index) => (
              <div 
                key={index}
                className={`tool-card ${selectedTool === index ? 'selected' : ''}`}
                onClick={() => setSelectedTool(index)}
              >
                <div className="tool-icon">{tool.icon}</div>
                <h4>{tool.title}</h4>
                <p>{tool.description}</p>
                <div className="tool-meta">
                  <span className="level-badge">{tool.level}</span>
                  <span className="time-badge">⏱ {tool.time}</span>
                </div>
                <button className="tool-btn">Launch Tool →</button>
              </div>
            ))}
          </div>
        </section>

        <section className="help-section">
          <div className="help-card">
            <div className="help-icon">💡</div>
            <h3>Need Personalized Guidance?</h3>
            <p>
              Our certified SBDC counselors are here to help you interpret results 
              and create an action plan tailored to your business. SBDC Counseling Available.
            </p>
            <div className="help-actions">
              <button className="btn-primary">Start Your Free SBDC Consultation</button>
              <button className="btn-outline">View Workshop Calendar</button>
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
          <div className="footer-links">
            <a href="#">About Us</a>
            <a href="#">Services</a>
            <a href="#">Events</a>
            <a href="#">Contact</a>
          </div>
          <p className="footer-network">Part of the Ohio SBDC Network</p>
          <p className="footer-copy">© 2026 Lakeland Community College SBDC. Funded in part by the U.S. Small Business Administration.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
