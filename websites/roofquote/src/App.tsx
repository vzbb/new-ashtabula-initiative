/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Home, Map as MapIcon, Loader2, AlertCircle, ShieldCheck, Clock3, CloudSnow, Phone, MapPinned, Wrench } from 'lucide-react';
import Markdown from 'react-markdown';
import { useJsApiLoader } from '@react-google-maps/api';
import MapDisplay from './components/MapDisplay';
import { analyzeRoof } from './services/geminiService';

const libraries: ("geometry" | "places")[] = ["geometry"];

const trustPoints = [
  {
    icon: ShieldCheck,
    title: 'Since 1992',
    body: 'A & R Roofing has been serving Ashtabula County homeowners for more than 30 years with a friendly, honest reputation.',
  },
  {
    icon: Clock3,
    title: 'Fast estimate prep',
    body: 'This intake flow turns an address into an inspection-ready scope so the crew can quote faster without losing accuracy.',
  },
  {
    icon: CloudSnow,
    title: 'Roofing plus gutters and plowing',
    body: 'Built for the same local team customers already trust for roofing, gutter service, and winter response.',
  },
];

const workflowSteps = [
  'Enter the property address so the estimator can pull the roof into view.',
  'Review aerial and street-level context to spot pitch, access, and condition clues.',
  'Generate an AI-assisted scope summary your team can use before the on-site estimate.',
];

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
    <div className="min-h-screen bg-[linear-gradient(180deg,#eef4fb_0%,#f8fafc_22%,#ffffff_100%)] text-slate-900 font-sans">
      <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-[#1E3A5F] p-2 text-white shadow-sm">
              <Home size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#C53030]">A &amp; R Roofing</p>
              <h1 className="text-xl font-semibold tracking-tight text-slate-950">RoofQuote</h1>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-600 md:flex">
            <MapPinned size={16} className="text-[#C53030]" />
            <span>Ashtabula County, Ohio</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="relative isolate overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-[0_30px_80px_-40px_rgba(30,58,95,0.55)]">
          <div className="absolute inset-x-0 top-0 h-36 bg-[radial-gradient(circle_at_top_left,#dbeafe_0,#ffffff_58%)]" />
          <div className="absolute -right-16 top-12 h-40 w-40 rounded-full bg-[#C53030]/10 blur-3xl" />
          <div className="relative grid gap-10 px-6 py-10 sm:px-10 lg:grid-cols-[1.15fr_0.85fr] lg:px-12 lg:py-12">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#C53030]/20 bg-[#C53030]/5 px-4 py-1.5 text-sm font-medium text-[#8e2323]">
                <Wrench size={16} />
                Friendly, honest roofing service in Ashtabula County and beyond
              </div>
              <h2 className="mb-4 max-w-3xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                Roof quotes in minutes, backed by A&amp;R&apos;s local reputation since 1992.
              </h2>
              <p className="mb-8 max-w-2xl text-lg leading-8 text-slate-600">
                This estimator helps A&amp;R Roofing review a property faster using aerial imagery, street-level context, and AI-assisted scope notes before the crew heads out for the free estimate.
              </p>

              <form onSubmit={handleSearch} className="relative max-w-2xl">
                <div className="relative flex items-center">
                  <MapIcon className="absolute left-4 text-slate-400" size={20} />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter property address (e.g., 123 Main St, Ashtabula, OH)"
                    className="w-full rounded-2xl border border-slate-300 bg-white py-4 pl-12 pr-36 text-lg shadow-sm transition-shadow focus:border-[#1E3A5F] focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !address.trim() || !apiKey}
                    className="absolute bottom-2 right-2 top-2 flex items-center gap-2 rounded-xl bg-[#1E3A5F] px-6 font-medium text-white transition-colors hover:bg-[#17314f] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
                    <span>Analyze</span>
                  </button>
                </div>
              </form>

              <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-600">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
                  <Phone size={15} className="text-[#C53030]" />
                  <span>Free estimates from a local, fully insured crew</span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
                  <ShieldCheck size={15} className="text-[#C53030]" />
                  <span>Built for A&amp;R Roofing&apos;s honest field workflow</span>
                </div>
              </div>

              {!apiKey && (
                <div className="mt-5 inline-flex max-w-xl items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-left text-sm text-amber-800">
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <span>
                    Live map analysis is still being connected for this demo environment. The branded experience is ready, and the team can finish the live estimator once the maps key is added.
                  </span>
                </div>
              )}
            </div>
            <div className="grid gap-4 rounded-[1.75rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-2xl shadow-slate-900/10">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-300">Field-ready promise</p>
              <h3 className="text-2xl font-semibold tracking-tight">A faster first pass before the truck leaves the yard.</h3>
              <p className="text-sm leading-7 text-slate-300">
                RoofQuote helps A&amp;R prep the estimate with address-level imagery, visible roof context, and AI-assisted notes so the team can walk in more prepared.
              </p>
              <div className="grid gap-3 pt-2">
                {trustPoints.map(({ icon: Icon, title, body }) => (
                  <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Icon size={18} className="text-[#f97373]" />
                      <p className="font-semibold text-white">{title}</p>
                    </div>
                    <p className="text-sm leading-6 text-slate-300">{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div className="mx-auto mb-8 mt-8 flex max-w-3xl items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            <AlertCircle className="shrink-0 mt-0.5" size={20} />
            <p>{error}</p>
          </div>
        )}

        {(location || loading) && (
          <div className="mt-10 grid h-[600px] grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <MapIcon size={20} className="text-[#1E3A5F]" />
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

            <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-4 text-lg font-semibold">
                <Home size={20} className="text-[#1E3A5F]" />
                Estimate Prep Summary
              </h3>
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
                    <Loader2 size={40} className="animate-spin text-[#1E3A5F]" />
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

        <section className="mt-12 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#C53030]">How it works</p>
            <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Built around the way a local roofing estimate actually starts.</h3>
            <div className="mt-8 space-y-4">
              {workflowSteps.map((step, index) => (
                <div key={step} className="flex gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1E3A5F] text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                  <p className="pt-1 text-slate-600">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(160deg,#fff7f7_0%,#ffffff_55%,#f8fafc_100%)] p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#C53030]">Why this fits A&amp;R</p>
            <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">A modern intake layer without losing the family-owned feel.</h3>
            <div className="mt-6 space-y-5 text-slate-600">
              <p>
                The design leans into A&amp;R Roofing&apos;s honest, long-running local reputation instead of pretending to be a flashy national SaaS brand.
              </p>
              <p>
                The estimator is framed as a prep tool for free estimates, not a gimmicky instant-close calculator. That makes the workflow feel more credible for residential and commercial roofing customers in Ashtabula County.
              </p>
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="font-semibold text-slate-950">Service fit</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Roofing, gutter servicing, and snow plowing are all reflected in the tone so the product feels like it belongs to the same crew customers already know.
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-12 rounded-[1.75rem] border border-slate-200 bg-slate-950 px-8 py-7 text-slate-200 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">A &amp; R Roofing</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">Free estimates for roofing projects across Ashtabula County and beyond.</h3>
            </div>
            <div className="grid gap-2 text-sm text-slate-300">
              <p>Family-owned. Friendly. Honest. Fully insured.</p>
              <p>Built as a branded demo for faster roof estimate intake and field prep.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
