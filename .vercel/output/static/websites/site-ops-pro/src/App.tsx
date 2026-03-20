/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import EarthFlowEstimator from './components/EarthFlowEstimator';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <h1 style={{position: "absolute", left: "-9999px"}}>Site Ops Pro</h1>

      <main className="flex-1 p-4 lg:p-6 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full min-h-[calc(100vh-2rem)]">
          <EarthFlowEstimator />
        </div>
      </main>
    </div>
  );
}
