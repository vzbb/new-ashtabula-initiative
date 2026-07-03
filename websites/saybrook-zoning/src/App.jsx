import React, { useState, useEffect } from 'react';
import { CivicSidebar } from './components/CivicSidebar';
import { ChatAssistant } from './pages/ChatAssistant';
import { TrusteeQueue } from './pages/TrusteeQueue';
import './App.css';

function App() {
  const [viewMode, setViewMode] = useState('public');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view');
    if (view === 'trustees') {
      setViewMode('trustees');
    }
  }, []);

  if (viewMode === 'trustees') {
    return <TrusteeQueue />;
  }

  return (
    <div className="saybrook-app">
      <div className="saybrook-shell">
        <CivicSidebar />
        <ChatAssistant />
      </div>
    </div>
  );
}

export default App;
