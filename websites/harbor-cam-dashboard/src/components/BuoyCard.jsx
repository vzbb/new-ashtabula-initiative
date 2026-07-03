import { WindDisplay } from './WindDisplay';

export function BuoyCard({ data, loading, isOffline }) {
  if (loading && !data) {
    return (
      <div className="stats-bar" style={{ opacity: 0.6 }}>
        <div className="stat-card" style={{ justifyContent: 'center', alignItems: 'center' }}>
          <span>Loading conditions...</span>
        </div>
      </div>
    );
  }
  const getStatus = () => {
    if (!data || isOffline) return "caution";
    if (data.windSpeed > 25 || data.waveHeight > 4) return "danger";
    if (data.windSpeed > 15 || data.waveHeight > 2.5) return "caution";
    return "green";
  };

  const getStatusClass = (status) => {
    if (status === "green") return "status-green";
    if (status === "caution") return "status-yellow";
    if (status === "danger") return "status-red";
    return "";
  };

  const status = getStatus();

  return (
    <div className="stats-bar">
      <div className="stat-card">
        <span className="stat-label">Wind</span>
        <WindDisplay 
          direction={data?.windDirection} 
          speed={data?.windSpeed} 
          gust={data?.windGust} 
        />
      </div>

      <div className="stat-card">
        <span className="stat-label">Waves</span>
        <div className="stat-value">
          {data?.waveHeight !== null ? data.waveHeight : '--'} <span className="stat-unit">ft</span>
        </div>
        <span className="stat-label">{data?.wavePeriod ? `${data.wavePeriod}s Period` : 'No Data'}</span>
      </div>

      <div className="stat-card">
        <span className="stat-label">Water Temp</span>
        <div className="stat-value">
          {data?.waterTemp !== null ? data.waterTemp : '--'}°<span className="stat-unit">F</span>
        </div>
        <span className={`status-pill ${getStatusClass(status)}`}>
          {isOffline ? "OFFLINE" : status.toUpperCase()}
        </span>
      </div>

      <div className="stat-card">
        <span className="stat-label">Air Temp</span>
        <div className="stat-value">
          {data?.airTemp !== null ? data.airTemp : '--'}°<span className="stat-unit">F</span>
        </div>
        <span className="stat-label">Pressure: {data?.pressure || '--'} hPa</span>
      </div>
    </div>
  );
}
