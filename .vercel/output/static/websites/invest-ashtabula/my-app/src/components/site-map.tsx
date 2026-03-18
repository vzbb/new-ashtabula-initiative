'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Site } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2 } from 'lucide-react';

interface SiteMapProps {
  sites: Site[];
  selectedSiteId?: string;
  onSiteSelect?: (site: Site) => void;
  height?: string;
  fullscreen?: boolean;
  onToggleFullscreen?: () => void;
  center?: [number, number];
  zoom?: number;
}

// Free public token - for demo purposes
const MAPBOX_TOKEN = 'pk.eyJ1IjoiZGVtby1hc2h0YWJ1bGEiLCJhIjoiY2x0ZGVtbyJ9.demo_token_replace_in_production';

export function SiteMap({ 
  sites, 
  selectedSiteId, 
  onSiteSelect, 
  height = '500px',
  fullscreen = false,
  onToggleFullscreen,
  center = [-80.79, 41.89],
  zoom = 12
}: SiteMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    try {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: center,
        zoom: zoom,
        attributionControl: true
      });

      map.current.on('load', () => {
        setIsLoading(false);
        
        // Add navigation controls
        map.current?.addControl(new mapboxgl.NavigationControl(), 'top-right');
        
        // Add fullscreen control if needed
        if (!fullscreen) {
          map.current?.addControl(new mapboxgl.FullscreenControl(), 'top-right');
        }
      });

      map.current.on('error', (e) => {
        console.error('Map error:', e);
        setMapError('Unable to load map. Please check your connection.');
        setIsLoading(false);
      });
    } catch (err) {
      console.error('Map initialization error:', err);
      setMapError('Unable to initialize map.');
      setIsLoading(false);
    }

    return () => {
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
      map.current?.remove();
    };
  }, [center, zoom, fullscreen]);

  // Update markers when sites change
  useEffect(() => {
    if (!map.current || isLoading) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add new markers
    sites.forEach(site => {
      const el = document.createElement('div');
      el.className = 'site-marker';
      el.style.width = '28px';
      el.style.height = '36px';
      el.style.cursor = 'pointer';
      el.style.backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 32'%3E%3Cpath fill='${getMarkerColor(site.status)}' d='M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20c0-6.6-5.4-12-12-12z'/%3E%3Ccircle fill='white' cx='12' cy='12' r='5'/%3E%3C/svg%3E")`;
      el.style.backgroundSize = 'contain';
      el.style.backgroundRepeat = 'no-repeat';

      const popup = new mapboxgl.Popup({ offset: 25, closeButton: false })
        .setHTML(`
          <div style="padding: 8px; min-width: 180px;">
            <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">${site.name}</div>
            <div style="font-size: 12px; color: #666; margin-bottom: 4px;">${site.acres} acres • ${site.zoningType}</div>
            <div style="font-size: 11px; color: ${getMarkerColor(site.status)}; text-transform: uppercase; font-weight: 500;">${site.status.replace('_', ' ')}</div>
          </div>
        `);

      if (map.current) {
        const marker = new mapboxgl.Marker(el)
          .setLngLat(site.coordinates)
          .setPopup(popup)
          .addTo(map.current);

        el.addEventListener('click', () => {
          onSiteSelect?.(site);
        });

        markers.current.push(marker);
      }
    });
  }, [sites, isLoading, onSiteSelect]);

  // Highlight selected site
  useEffect(() => {
    if (!map.current || !selectedSiteId) return;
    
    const selectedSite = sites.find(s => s.id === selectedSiteId);
    if (selectedSite) {
      map.current.flyTo({
        center: selectedSite.coordinates,
        zoom: 14,
        duration: 1000
      });
    }
  }, [selectedSiteId, sites]);

  const getMarkerColor = (status: Site['status']) => {
    switch (status) {
      case 'shovel_ready': return '%23059669'; // green
      case 'available': return '%23D97706'; // amber
      case 'option': return '%231E40AF'; // blue
      default: return '%236B7280'; // gray
    }
  };

  return (
    <div className={`relative ${fullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {onToggleFullscreen && (
        <div className="absolute top-4 left-4 z-10">
          <Button
            variant="secondary"
            size="sm"
            onClick={onToggleFullscreen}
            className="shadow-md"
          >
            {fullscreen ? (
              <><Minimize2 className="w-4 h-4 mr-1" /> Minimize</>
            ) : (
              <><Maximize2 className="w-4 h-4 mr-1" /> Expand</>
            )}
          </Button>
        </div>
      )}
      
      {isLoading && (
        <div className={`absolute inset-0 bg-slate-100 flex items-center justify-center z-10 ${fullscreen ? '' : ''}`}
          style={{ height: fullscreen ? '100vh' : height }}
        >
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}
      
      {mapError && (
        <div 
          className={`absolute inset-0 bg-slate-50 flex items-center justify-center z-10`}
          style={{ height: fullscreen ? '100vh' : height }}
        >
          <div className="text-center p-6 max-w-sm">
            <div className="text-4xl mb-3">🗺️</div>
            <p className="text-muted-foreground">{mapError}</p>
            <p className="text-xs text-muted-foreground mt-2">Please check that Mapbox token is configured correctly.</p>
          </div>
        </div>
      )}
      
      <div 
        ref={mapContainer} 
        className="w-full rounded-lg overflow-hidden"
        style={{ height: fullscreen ? '100vh' : height }}
      />
    </div>
  );
}
