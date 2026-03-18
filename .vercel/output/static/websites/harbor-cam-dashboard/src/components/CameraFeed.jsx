export function CameraFeed({ url }) {
  const timestamp = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  return (
    <section className="hero-section">
      <img 
        src={url} 
        alt="Ashtabula Harbor Live Feed" 
        className="camera-feed"
        onError={(e) => {
          e.target.src = "https://images.unsplash.com/photo-1516104273821-236f0e21a48e?q=80&w=1200&auto=format&fit=crop";
        }}
      />
      <div className="camera-overlay">
        <div className="live-dot"></div>
        LIVE CAMERA FEED <span style={{ marginLeft: '10px', opacity: 0.7, fontWeight: 400 }}>| Refreshed {timestamp}</span>
      </div>
    </section>
  );
}
