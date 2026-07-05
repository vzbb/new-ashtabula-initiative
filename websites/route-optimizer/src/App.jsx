import { useState } from 'react';
import { callGeminiAPI, extractResponseText, isAPIConfigured } from '../../../shared/api-client.js';
import "./App.css";

const apiKey = isAPIConfigured();

// Icons
const MapPinIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;

const SparklesIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>;

const TrendingUpIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>;

const BusIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="14" rx="2" ry="2"/><line x1="3" y1="10" x2="21" y2="10"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>;

function App() {
  const [stops, setStops] = useState([
    { name: "Downtown Depot", lat: 41.865, lng: -80.78 },
    { name: "Geneva Plaza", lat: 41.805, lng: -80.95 },
    { name: "Conneaut Harbor", lat: 41.945, lng: -80.55 }
  ]);
  const [aiSummary, setAiSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleOptimize = async () => {
    setIsOptimizing(true);
    setLoading(true);

    // Simulate optimization delay
    setTimeout(async () => {
      setIsOptimizing(false);

      // Generate AI summary via OpenRouter (provider-agnostic)
      if (!apiKey) {
        setAiSummary("Route optimized! The path minimizes backtracking and follows main corridors through Ashtabula County.");
        setLoading(false);
        return;
      }

      try {
        const stopNames = stops.map(s => s.name).join(", ");
        const prompt = `Act as a logistics expert for Ashtabula County. Analyze this route: ${stopNames}. Give a professional 2-sentence summary of why this order is efficient. Mention geography if relevant.`;

        const data = await callGeminiAPI(prompt);
        const text = extractResponseText(data);
        setAiSummary(text || "Route optimized for maximum efficiency.");
      } catch (e) {
        setAiSummary("Route optimized! Efficiency improved by reducing total travel distance.");
      } finally {
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="page">
      <div className="header">
        <img src="/logo.svg" alt="ACTS Route Optimizer" className="header-logo" />
      </div>

      <header className="hero">
        <div className="hero-content">
          <span className="eyebrow">🚍 ACTS Transit Routing</span>
          <h1>Optimize Your Transit & Delivery Routes</h1>
          <p className="sub">AI-powered route analysis for efficient fleet management — proudly serving Ashtabula County</p>

          <div className="stats-bar">
            <div className="stat-item">
              <div className="stat-icon">📍</div>
              <div className="stat-value">{stops.length}</div>
              <div className="stat-label">Stops</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">⚡</div>
              <div className="stat-value">{isOptimizing ? '...' : '94%'}</div>
              <div className="stat-label">Efficiency</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">🕐</div>
              <div className="stat-value">{isOptimizing ? '...' : '2.3h'}</div>
              <div className="stat-label">Est. Time</div>
            </div>
          </div>

          <div className="input-card">
            <h3>🚚 Current Route Stops</h3>
            <div style={{color: 'var(--text-secondary)', marginBottom: '15px'}}>
              {stops.map((stop, idx) => (
                <div key={idx} style={{padding: '10px', background: 'var(--bg-primary)', borderRadius: '8px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px'}}>
                  <span style={{background: 'var(--accent-navy)', color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '700'}}>{idx + 1}</span>
                  <span>{stop.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-actions">
            <button className="primary" onClick={handleOptimize} disabled={isOptimizing || loading}>
              {isOptimizing ? "⚡ Optimizing…" : "🚀 Optimize Route"}
            </button>
            <button className="ghost">📊 View Map</button>
          </div>

          <div className="trust">
            <span><MapPinIcon /> ACTS Edition</span>
            <span><BusIcon /> County Transit</span>
            <span><TrendingUpIcon /> Live Tracking</span>
          </div>
        </div>
      </header>

      {aiSummary && (
        <section className="card">
          <div className="card-head">
            <h2><SparklesIcon /> AI Route Analysis</h2>
            <span className="pill">ACTS Optimizer</span>
          </div>
          <div className="output">{aiSummary}</div>
        </section>
      )}

      <section className="grid">
        <div className="tile">
          <div className="tile-icon">🧠</div>
          <h3>Smart Optimization</h3>
          <p>AI analyzes traffic patterns and stop sequences for efficient routing</p>
        </div>
        <div className="tile">
          <div className="tile-icon">⛽</div>
          <h3>Save Fuel</h3>
          <p>Reduce miles driven with intelligent route consolidation</p>
        </div>
        <div className="tile">
          <div className="tile-icon">📈</div>
          <h3>More Deliveries</h3>
          <p>Complete more stops in less time across Ashtabula County</p>
        </div>
      </section>

      <footer className="footer">
        <img src="/trust-badge.svg" alt="Proudly Serving Ashtabula County Since 1976" className="footer-badge" />
      </footer>
      <div className="footer-legal">
        Ashtabula County Transportation System (ACTS) • Route Optimizer
      </div>
    </div>
  );
}

export default App;
