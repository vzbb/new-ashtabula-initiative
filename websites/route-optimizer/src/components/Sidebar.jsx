import { Trash2, GripVertical, CheckCircle2, Clock, MapPin, Plus } from 'lucide-react';
import { motion, Reorder } from 'framer-motion';
import './Sidebar.css';

function Sidebar({ stops, setStops, onOptimize, isOptimizing }) {
  const removeStop = (id) => {
    setStops(stops.filter(s => s.id !== id));
  };

  const addRandomStop = () => {
    const pool = [
      { name: 'Client: Emily Davis', address: '345 E 15th St, Ashtabula, OH 44004', lat: 41.8851, lng: -80.7758 },
      { name: 'Client: Michael Ross', address: '122 State St, Geneva, OH 44041', lat: 41.8023, lng: -80.9456 },
      { name: 'Client: Sarah Connor', address: '789 N Bend Rd, Ashtabula, OH 44004', lat: 41.8512, lng: -80.7612 },
    ];
    const random = pool[Math.floor(Math.random() * pool.length)];
    const newStop = { ...random, id: Date.now().toString(), type: 'delivery' };
    setStops([...stops, newStop]);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title-row">
          <h2 className="sidebar-title">
            <MapPin className="w-5 h-5" />
            Route Stops
          </h2>
          <button 
            onClick={addRandomStop}
            className="add-btn"
            title="Add random stop"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <p className="sidebar-subtitle">Manage delivery locations</p>
        
        <button 
          onClick={onOptimize}
          disabled={isOptimizing || stops.length < 2}
          className="optimize-btn"
        >
          {isOptimizing ? (
            <div className="spinner" />
          ) : (
            <CheckCircle2 className="w-5 h-5" />
          )}
          {isOptimizing ? 'Optimizing...' : 'Optimize Route'}
        </button>
      </div>

      <div className="sidebar-content">
        {stops.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
               <MapPin className="w-6 h-6" />
            </div>
            <p>No stops added yet.</p>
          </div>
        ) : (
          <Reorder.Group axis="y" values={stops} onReorder={setStops} className="stops-list">
            {stops.map((stop, index) => (
              <Reorder.Item 
                key={stop.id} 
                value={stop}
                className="stop-item"
              >
                <GripVertical className="grip-icon" />
                <div className="stop-info">
                  <div className="stop-header">
                    <span className="stop-number">{index + 1}</span>
                    <h3 className="stop-name">{stop.name}</h3>
                  </div>
                  <p className="stop-address">{stop.address}</p>
                </div>
                <button 
                  onClick={() => removeStop(stop.id)}
                  className="delete-btn"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        )}
      </div>

      <div className="sidebar-footer">
        <div className="stat-row">
          <span className="stat-label">
            <Clock className="w-4 h-4" />
            Est Time:
          </span>
          <span className="stat-value">2h 45m</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">
            <MapPin className="w-4 h-4" />
            Total Distance:
          </span>
          <span className="stat-value">42.5 miles</span>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
