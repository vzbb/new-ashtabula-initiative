import React from 'react';
import { GoogleMap, StreetViewPanorama } from '@react-google-maps/api';

interface MapDisplayProps {
  lat: number;
  lng: number;
  isLoaded: boolean;
}

const containerStyle = {
  width: '100%',
  height: '100%'
};

export default function MapDisplay({ lat, lng, isLoaded }: MapDisplayProps) {
  const center = { lat, lng };

  if (!isLoaded) return <div className="flex items-center justify-center h-full bg-slate-100 rounded-xl">Loading Maps...</div>;

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex-1 rounded-xl overflow-hidden shadow-sm border border-slate-200 relative">
        <GoogleMap
          key={`map-${lat}-${lng}`}
          mapContainerStyle={containerStyle}
          center={center}
          zoom={20}
          mapTypeId="satellite"
          options={{
            mapId: import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || undefined,
            disableDefaultUI: false,
            tilt: 45,
            heading: 45,
          }}
        />
      </div>
      <div className="flex-1 rounded-xl overflow-hidden shadow-sm border border-slate-200 relative">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={14}
        >
          <StreetViewPanorama
            key={`${lat}-${lng}`}
            options={{
              position: center,
              visible: true,
              disableDefaultUI: false,
              enableCloseButton: false,
            }}
          />
        </GoogleMap>
      </div>
    </div>
  );
}
