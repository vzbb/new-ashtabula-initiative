/**
 * API Status Checker Component
 * Displays current API configuration and allows testing
 */

import { useState, useEffect } from 'react';
import { getApiStatus, testApiConnection, isMockModeEnabled } from '../lib/gemini.js';

export default function ApiStatusPanel() {
  const [status, setStatus] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setStatus(getApiStatus());
  }, []);

  const runTest = async () => {
    setLoading(true);
    setTestResult(null);
    try {
      const result = await testApiConnection();
      setTestResult(result);
    } catch (err) {
      setTestResult({ success: false, message: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (!status) return null;

  return (
    <div className="api-status-panel">
      <h4>🔌 AI Service Status</h4>
      
      <div className="status-grid">
        <div className="status-item">
          <span className="status-label">API Key:</span>
          <span className={`status-value ${status.configured ? 'ok' : 'warning'}`}>
            {status.configured ? '✅ Configured' : '⚠️ Not Set'}
          </span>
        </div>
        
        <div className="status-item">
          <span className="status-label">Mode:</span>
          <span className={`status-value ${!status.mockMode ? 'ok' : 'info'}`}>
            {status.mockMode ? '🧪 Demo Mode' : '🔴 Live API'}
          </span>
        </div>
      </div>

      {status.mockMode && (
        <div className="status-alert info">
          <strong>Demo Mode Active</strong>
          <p>
            The app is using mock data for meeting summaries. 
            Add a Gemini API key to enable AI-powered summaries.
          </p>
          <code className="status-code">
            VITE_GEMINI_API_KEY=your_key_here
          </code>
        </div>
      )}

      <div className="status-actions">
        <button 
          onClick={runTest} 
          disabled={loading || status.mockMode}
          className="test-btn"
        >
          {loading ? 'Testing...' : 'Test API Connection'}
        </button>
      </div>

      {testResult && (
        <div className={`status-alert ${testResult.success ? 'success' : 'error'}`}>
          <strong>{testResult.success ? '✅ Success' : '❌ Failed'}</strong>
          <p>{testResult.message}</p>
        </div>
      )}
    </div>
  );
}
