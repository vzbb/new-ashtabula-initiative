import { useState } from "react";
import "./App.css";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// === NAI API Client ===
const callGeminiAPI = async (prompt) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
};

// Icons
const TrendUpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
);

const DollarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

const ChartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <line x1="9" y1="9" x2="15" y2="15"/>
  </svg>
);

function App() {
  const [income, setIncome] = useState(5000);
  const [expenses, setExpenses] = useState(3200);
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const net = income - expenses;
  const margin = income > 0 ? ((net / income) * 100).toFixed(1) : 0;

  const analyze = async () => {
    setLoading(true);
    setError("");
    setInsight("");
    try {
      const prompt = `You are a financial advisor for small businesses in Ashtabula County, Ohio. 

Given:
- Weekly Income: $${income}
- Weekly Expenses: $${expenses}
- Net Profit: $${net}
- Profit Margin: ${margin}%

Provide 3 specific, actionable tips to improve cash flow. Be practical and tailored to a small business owner. 80 words max. Professional but friendly tone.`;

      const text = await callGeminiAPI(prompt);
      setInsight(text); // <-- FIXED: was missing
    } catch (e) {
      setError(e.message || "Failed to generate insights.");
    } finally {
      setLoading(false);
    }
  };

  // Chart data simulation
  const weeklyData = [
    { week: 'W1', income: income * 0.9, expenses: expenses * 0.95 },
    { week: 'W2', income: income, expenses: expenses },
    { week: 'W3', income: income * 1.1, expenses: expenses * 0.9 },
    { week: 'W4', income: income * 1.05, expenses: expenses * 1.02 },
  ];

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="brand">
            <div className="brand-icon">
              <TrendUpIcon />
            </div>
            <div>
              <h1>Ashtabula Business Financial</h1>
              <span>Cash Flow Intelligence for Local Businesses</span>
            </div>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <div className="dashboard-grid">
            {/* Left Panel: Input */}
            <div className="panel">
              <h2>💰 Weekly Financial Snapshot</h2>
              <p className="panel-desc">Enter your numbers for AI-powered cash flow analysis.</p>
              
              <div className="input-group">
                <label>Weekly Income</label>
                <div className="input-prefix">
                  <span>$</span>
                  <input
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(Number(e.target.value))}
                    placeholder="5000"
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Weekly Expenses</label>
                <div className="input-prefix">
                  <span>$</span>
                  <input
                    type="number"
                    value={expenses}
                    onChange={(e) => setExpenses(Number(e.target.value))}
                    placeholder="3200"
                  />
                </div>
              </div>

              <button 
                className="btn-primary"
                onClick={analyze}
                disabled={loading}
              >
                {loading ? "Analyzing..." : "🔍 Get AI Insights"}
              </button>

              {error && <div className="error">{error}</div>}
            </div>

            {/* Right Panel: Dashboard */}
            <div className="panel">
              <h2>📊 Your Financial Health</h2>
              
              <div className="metrics">
                <div className="metric">
                  <span className="metric-label">Net Profit</span>
                  <span className={`metric-value ${net >= 0 ? 'positive' : 'negative'}`}>
                    ${net.toLocaleString()}
                  </span>
                </div>
                
                <div className="metric">
                  <span className="metric-label">Profit Margin</span>
                  <span className={`metric-value ${margin >= 20 ? 'positive' : 'warning'}`}>
                    {margin}%
                  </span>
                </div>

                <div className="metric">
                  <span className="metric-label">Monthly Run Rate</span>
                  <span className="metric-value">${(net * 4).toLocaleString()}</span>
                </div>
              </div>

              <!-- Simple bar chart -->
              <div className="chart">
                <h4>4-Week Trend</h4>
                <div className="chart-bars">
                  {weeklyData.map((d, i) => (
                    <div key={i} className="chart-bar-group">
                      <div className="chart-bar-stack">
                        <div 
                          className="chart-bar income"
                          style={{height: `${(d.income / (income * 1.2)) * 100}%`}}
                        />
                        <div 
                          className="chart-bar expense"
                          style={{height: `${(d.expenses / (income * 1.2)) * 100}%`}}
                        />
                      </div>
                      <span>{d.week}</span>
                    </div>
                  ))}
                </div>
                <div className="chart-legend">
                  <span><span className="dot income"/> Income</span>
                  <span><span className="dot expense"/> Expenses</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Insights Section */}
          {insight && (
            <div className="insight-panel animate-in">
              <div className="insight-header">
                <DollarIcon />
                <h3>AI-Generated Cash Flow Insights</h3>
              </div>
              <div className="insight-content">{insight}</div>
              <div className="insight-footer">
                <span>Powered by Gemini AI • Tailored for Ashtabula County Businesses</span>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div>
              <strong>Ashtabula Business Financial</strong>
              <span>Supporting Local Business Growth</span>
            </div>
            <div className="footer-links">
              <a href="#">About</a>
              <a href="#">Resources</a>
              <a href="#">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
