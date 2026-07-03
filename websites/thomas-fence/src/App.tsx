/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import SnapToQuoteFence from './components/SnapToQuoteFence';

export default function App() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7faf7_0%,#eef6ef_100%)] flex flex-col font-sans text-stone-800">
      <h1 style={{ position: 'absolute', left: '-9999px' }}>Thomas Fence Company</h1>

      <header className="border-b border-[color:var(--tf-border)] bg-white/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--tf-accent)] font-semibold">
              Family Owned Since the 1970s
            </p>
            <div>
              <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight text-[color:var(--tf-primary-dark)]">
                Thomas Fence Co. Instant Quote
              </h2>
              <p className="mt-2 max-w-3xl text-sm lg:text-base text-stone-600">
                A faster way to scope residential, commercial, and industrial fencing with the
                employees-only crew trusted across eight Ohio counties and northern Pennsylvania.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div className="rounded-2xl border border-[color:var(--tf-border)] bg-[color:var(--tf-surface)] px-4 py-3">
              <div className="font-semibold text-[color:var(--tf-primary-dark)]">Employees Only</div>
              <div className="text-stone-600">No subcontractors. No handoff confusion.</div>
            </div>
            <div className="rounded-2xl border border-[color:var(--tf-border)] bg-[color:var(--tf-surface)] px-4 py-3">
              <div className="font-semibold text-[color:var(--tf-primary-dark)]">In-House Fabrication</div>
              <div className="text-stone-600">Welding and custom gate work handled by Thomas.</div>
            </div>
            <div className="rounded-2xl border border-[color:var(--tf-border)] bg-[color:var(--tf-surface)] px-4 py-3">
              <div className="font-semibold text-[color:var(--tf-primary-dark)]">8-County Coverage</div>
              <div className="text-stone-600">Ashtabula through Cuyahoga, plus northern PA.</div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 lg:p-6 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full min-h-[calc(100vh-2rem)]">
          <SnapToQuoteFence />
        </div>
      </main>
    </div>
  );
}
