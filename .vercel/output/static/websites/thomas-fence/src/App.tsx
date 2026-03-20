/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import SnapToQuoteFence from './components/SnapToQuoteFence';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <h1 style={{position: "absolute", left: "-9999px"}}>Thomas Fence Company</h1>

      <main className="flex-1 p-4 lg:p-6 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full min-h-[calc(100vh-2rem)]">
          <SnapToQuoteFence />
        </div>
      </main>
    </div>
  );
}
