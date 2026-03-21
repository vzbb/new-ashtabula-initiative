/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Home, Map as MapIcon, Loader2, AlertCircle } from 'lucide-react';
import Markdown from 'react-markdown';
import { useJsApiLoader } from '@react-google-maps/api';
import MapDisplay from './components/MapDisplay';
import { analyzeRoof } from './services/geminiService';

const libraries: ("geometry" | "places")[] = ["geometry"];

export default function App() {
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey || '',
    libraries,
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;
    if (!apiKey) {
      setError('Google Maps API Key is missing. Please add VITE_GOOGLE_MAPS_API_KEY to your .env file.');
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);
    setLocation(null);

    try {
      // 1. Geocode the address
      const geocodeRes = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`);
      const geocodeData = await geocodeRes.json();

      if (geocodeData.status !== 'OK' || !geocodeData.results.length) {
        throw new Error('Could not find the location for this address.');
      }

      const { lat, lng } = geocodeData.results[0].geometry.location;
      setLocation({ lat, lng });

      // 2. Get Street View Panos (main + adjacent)
      let streetViewUrls: string[] = [];
      if (window.google) {
        const svService = new window.google.maps.StreetViewService();
        const homeLocation = new window.google.maps.LatLng(lat, lng);
        
        try {
          const response = await svService.getPanorama({ location: homeLocation, radius: 50 });
          const mainPano = response.data;
          const panos = [mainPano];
          
          if (mainPano.links && mainPano.links.length > 0) {
            // Try to find two links that are roughly opposite to each other (up and down the street)
            let selectedLinks = [mainPano.links[0]];
            if (mainPano.links.length > 1) {
              const firstHeading = mainPano.links[0].heading || 0;
              let bestOppositeIndex = 1;
              let maxDiff = 0;
              
              for (let i = 1; i < mainPano.links.length; i++) {
                const currentHeading = mainPano.links[i].heading || 0;
                let diff = Math.abs(currentHeading - firstHeading);
                if (diff > 180) diff = 360 - diff;
                if (diff > maxDiff) {
                  maxDiff = diff;
                  bestOppositeIndex = i;
                }
              }
              selectedLinks.push(mainPano.links[bestOppositeIndex]);
            }

            for (const link of selectedLinks) {
              if (link.pano) {
                try {
                  const linkResponse = await svService.getPanorama({ pano: link.pano });
                  panos.push(linkResponse.data);
                } catch (e) {
                  console.error("Failed to fetch linked pano", e);
                }
              }
            }
          }
          
          streetViewUrls = panos.map(pano => {
            const panoLocation = pano.location?.latLng;
            let heading = 0;
            if (panoLocation) {
              heading = window.google.maps.geometry.spherical.computeHeading(panoLocation, homeLocation);
            }
            return `https://maps.googleapis.com/maps/api/streetview?size=600x600&pano=${pano.location?.pano}&heading=${heading}&pitch=10&key=${apiKey}`;
          });
        } catch (e) {
          console.error("Failed to find street view", e);
          // Fallback to basic location-based street view
          streetViewUrls = [`https://maps.googleapis.com/maps/api/streetview?size=600x600&location=${lat},${lng}&fov=90&pitch=10&key=${apiKey}`];
        }
      } else {
        streetViewUrls = [`https://maps.googleapis.com/maps/api/streetview?size=600x600&location=${lat},${lng}&fov=90&pitch=10&key=${apiKey}`];
      }

      // 3. Get Aerial and Map Views
      const aerialUrls = [
        `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=20&size=600x600&maptype=satellite&tilt=0&key=${apiKey}`, // Top-down Satellite Close
        `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=18&size=600x600&maptype=satellite&tilt=0&key=${apiKey}`, // Top-down Satellite Context
        `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=19&size=600x600&maptype=roadmap&key=${apiKey}`, // Roadmap
        `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=18&size=600x600&maptype=terrain&key=${apiKey}`, // Terrain/Topological
      ];

      // Add 8 compass headings at 45-degree tilt
      const headings = [0, 45, 90, 135, 180, 225, 270, 315];
      headings.forEach(h => {
        aerialUrls.push(`https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=20&size=600x600&maptype=satellite&tilt=45&heading=${h}&key=${apiKey}`);
      });

      const allUrls = [...aerialUrls, ...streetViewUrls];

      // 4. Fetch static images via our proxy to avoid CORS
      const fetchImage = async (url: string) => {
        const res = await fetch(`/api/fetch-image?url=${encodeURIComponent(url)}`);
        if (!res.ok) throw new Error('Failed to fetch image');
        return res.json();
      };

      const images = await Promise.all(allUrls.map(url => fetchImage(url)));

      // 5. Analyze with Gemini
      const result = await analyzeRoof(images);
      setAnalysis(result);

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while analyzing the property.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Home size={20} />
            </div>
            <h1 className="text-xl font-semibold tracking-tight">RoofQuote AI</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">
            AI-Powered Roofing Estimates
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Enter an address to instantly analyze the roof using Google Maps, Street View, and Gemini 3.1 Pro spatial reasoning.
          </p>

          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <div className="relative flex items-center">
              <MapIcon className="absolute left-4 text-slate-400" size={20} />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter property address (e.g., 123 Main St, Cleveland, OH)"
                className="w-full pl-12 pr-32 py-4 bg-white border border-slate-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg transition-shadow"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !address.trim()}
                className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
                <span>Analyze</span>
              </button>
            </div>
          </form>
          
          {!apiKey && (
            <div className="mt-4 flex items-center justify-center gap-2 text-amber-600 bg-amber-50 py-2 px-4 rounded-lg inline-flex text-sm font-medium border border-amber-200">
              <AlertCircle size={16} />
              <span>Please configure VITE_GOOGLE_MAPS_API_KEY to use this app.</span>
            </div>
          )}
        </div>

        {error && (
          <div className="max-w-3xl mx-auto mb-8 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3">
            <AlertCircle className="shrink-0 mt-0.5" size={20} />
            <p>{error}</p>
          </div>
        )}

        {(location || loading) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[600px]">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 h-full flex flex-col">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MapIcon size={20} className="text-indigo-600" />
                Property Views
              </h3>
              <div className="flex-1 relative">
                {location ? (
                  <MapDisplay lat={location.lat} lng={location.lng} isLoaded={isLoaded} />
                ) : (
                  <div className="absolute inset-0 bg-slate-100 rounded-xl flex items-center justify-center animate-pulse">
                    <MapIcon size={48} className="text-slate-300" />
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-full flex flex-col overflow-hidden">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 border-b border-slate-100 pb-4">
                <Home size={20} className="text-indigo-600" />
                Gemini 3.1 Pro Analysis
              </h3>
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
                    <Loader2 size={40} className="animate-spin text-indigo-600" />
                    <p className="text-center">
                      Analyzing 15+ different aerial, map, and street view perspectives...<br/>
                      <span className="text-sm opacity-75">This may take a few moments.</span>
                    </p>
                  </div>
                ) : analysis ? (
                  <div className="prose prose-slate prose-indigo max-w-none">
                    <Markdown>{analysis}</Markdown>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

