/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import EarthFlowEstimator from './components/EarthFlowEstimator';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.10),_transparent_34%),radial-gradient(circle_at_85%_12%,_rgba(15,23,42,0.06),_transparent_28%),linear-gradient(180deg,_#fbfaf7_0%,_#f3f4f6_100%)]">
      <h1 style={{position: "absolute", left: "-9999px"}}>Severino Construction | Terra Vantage</h1>

      <main className="flex-1 p-4 lg:p-6 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full min-h-[calc(100vh-2rem)] rounded-[32px] border border-stone-200/80 bg-white/60 shadow-[0_24px_80px_-28px_rgba(15,23,42,0.18)] backdrop-blur-sm overflow-hidden">
          <EarthFlowEstimator />
        </div>
      </main>
    </div>
  );
}
