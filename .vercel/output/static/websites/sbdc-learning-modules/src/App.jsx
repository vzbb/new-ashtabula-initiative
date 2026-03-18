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

const modules = [
  {
    id: 1,
    title: 'Business Fundamentals',
    description: 'Learn the core concepts every entrepreneur needs to know',
    lessons: 8,
    duration: '4 hours',
    level: 'Beginner',
    progress: 75,
    icon: '📚'
  },
  {
    id: 2,
    title: 'Marketing Essentials',
    description: 'Attract and retain customers with strategic marketing',
    lessons: 10,
    duration: '5 hours',
    level: 'Beginner',
    progress: 30,
    icon: '📢'
  },
  {
    id: 3,
    title: 'Financial Management',
    description: 'Master business finances and cash flow management',
    lessons: 12,
    duration: '6 hours',
    level: 'Intermediate',
    progress: 0,
    icon: '💰'
  },
  {
    id: 4,
    title: 'Leadership & Management',
    description: 'Build and lead high-performing teams',
    lessons: 9,
    duration: '4.5 hours',
    level: 'Intermediate',
    progress: 0,
    icon: '👥'
  },
  {
    id: 5,
    title: 'Digital Transformation',
    description: 'Leverage technology to grow your business',
    lessons: 7,
    duration: '3.5 hours',
    level: 'Advanced',
    progress: 0,
    icon: '💻'
  },
  {
    id: 6,
    title: 'Scaling Your Business',
    description: 'Strategies for sustainable growth and expansion',
    lessons: 8,
    duration: '4 hours',
    level: 'Advanced',
    progress: 0,
    icon: '📈'
  }
];

function App() {
  const [filter, setFilter] = useState('all');
  
  const filteredModules = filter === 'all' 
    ? modules 
    : modules.filter(m => m.level.toLowerCase() === filter);

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
            <a href="#">Modules</a>
            <a href="#">My Progress</a>
            <a href="#">Certificates</a>
            <button className="nav-btn">Get Help</button>
          </nav>
        </div>
      </header>

      <main className="content">
        <section className="hero">
          <div className="hero-badge">
            <span>🎓 Learning Center</span>
          </div>
          <h1>Learn at Your Own Pace</h1>
          <p className="hero-subtitle">
            Comprehensive learning modules designed by business experts to help you 
            master the skills needed for entrepreneurial success.
          </p>
          <div className="my-progress-card">
            <div className="progress-info">
              <div className="progress-stat">
                <strong>2</strong>
                <span>Modules Started</span>
              </div>
              <div className="progress-stat">
                <strong>5.2</strong>
                <span>Hours Learned</span>
              </div>
              <div className="progress-stat">
                <strong>12</strong>
                <span>Lessons Completed</span>
              </div>
            </div>
            <div className="continue-learning">
              <span>Continue where you left off:</span>
              <button className="continue-btn">📢 Marketing Essentials →</button>
            </div>
          </div>
        </section>

        <section className="modules-section">
          <div className="section-header">
            <h2>Available Learning Modules</h2>
            <div className="filter-tabs">
              {['all', 'beginner', 'intermediate', 'advanced'].map(f => (
                <button
                  key={f}
                  className={`filter-tab ${filter === f ? 'active' : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="modules-grid">
            {filteredModules.map(module => (
              <div key={module.id} className="module-card">
                <div className="module-header">
                  <span className="module-icon">{module.icon}</span>
                  <span className={`level-tag ${module.level.toLowerCase()}`}>
                    {module.level}
                  </span>
                </div>
                
                <h4>{module.title}</h4>
                <p>{module.description}</p>
                
                <div className="module-meta">
                  <span>📖 {module.lessons} lessons</span>
                  <span>⏱ {module.duration}</span>
                </div>

                {module.progress > 0 && (
                  <div className="module-progress">
                    <div className="progress-bar-small">
                      <div 
                        className="progress-fill-small" 
                        style={{width: `${module.progress}%`}}
                      ></div>
                    </div>
                    <span>{module.progress}%</span>
                  </div>
                )}

                <button className={`module-btn ${module.progress > 0 ? 'continue' : ''}`}>
                  {module.progress > 0 ? 'Continue Learning' : 'Start Module'}
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="certificate-section">
          <div className="certificate-card">
            <div className="certificate-icon">🏆</div>
            <h3>Earn Certificates</h3>
            <p>Complete modules to earn digital certificates you can share on LinkedIn and add to your resume.</p>
            <div className="certificate-preview">
              <div className="preview-badge">🎓 SBDC Certified</div>
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
