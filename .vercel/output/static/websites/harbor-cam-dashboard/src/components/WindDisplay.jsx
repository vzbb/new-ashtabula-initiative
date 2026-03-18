export function WindDisplay({ direction, speed, gust }) {
  const getDirectionLabel = (deg) => {
    const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return dirs[Math.round(deg / 45) % 8];
  };

  return (
    <div className="wind-display">
      <div className="stat-value">
        {speed !== null ? speed : '--'} <span className="stat-unit">kts</span>
        <span style={{ 
          fontSize: '1.1rem', 
          marginLeft: '8px', 
          transform: `rotate(${direction || 0}deg)`, 
          display: 'inline-block',
          transition: 'transform 0.5s ease',
          color: 'var(--secondary)'
        }}>↓</span>
      </div>
      <span className="stat-label">
        {direction !== null ? `From ${getDirectionLabel(direction)} (${direction}°)` : 'No Data'}
        {gust && ` • Gusts ${gust} kts`}
      </span>
    </div>
  );
}
