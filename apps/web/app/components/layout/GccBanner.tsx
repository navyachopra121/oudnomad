'use client';

import React from 'react';
import { useCurrency } from '../concierge/CurrencyContext';

/**
 * GccBanner — shown only to visitors detected outside GCC (by timezone).
 * Displays a refined atelier notice with a "Select Delivery Destination" CTA.
 * Disappears permanently once dismissed or a country is selected.
 */
export default function GccBanner() {
  const { showGccBanner, dismissGccBanner, setIsModalOpen } = useCurrency();

  if (!showGccBanner) return null;

  return (
    <div
      id="gcc-atelier-banner"
      role="banner"
      className="w-full bg-[#0a0a0a] border-b border-[#ffb91d]/20 px-4 py-2.5 flex items-center justify-between gap-4 z-40 relative"
    >
      {/* Left: Message */}
      <p className="text-[11px] text-white/60 leading-relaxed flex items-center gap-2 flex-1 min-w-0">
        <span className="text-[#ffb91d] flex-shrink-0">📍</span>
        <span className="hidden sm:inline">
          <span className="text-white/80 font-medium">Atelier Notice:</span>{' '}
          Oud Nomad ships exclusively within the GCC. Gifting to Dubai, Riyadh or beyond?
        </span>
        <span className="sm:hidden text-white/60">Oud Nomad ships to GCC only.</span>
      </p>

      {/* Center: CTA */}
      <button
        id="gcc-banner-select-destination"
        onClick={() => setIsModalOpen(true)}
        className="flex-shrink-0 text-[11px] uppercase tracking-[0.2em] font-medium text-[#ffb91d] hover:text-white border border-[#ffb91d]/40 hover:border-[#ffb91d] px-3 py-1.5 transition-all whitespace-nowrap"
      >
        Select Destination
      </button>

      {/* Right: Dismiss */}
      <button
        id="gcc-banner-dismiss"
        onClick={dismissGccBanner}
        className="flex-shrink-0 text-white/25 hover:text-white/60 transition-colors text-sm p-1"
        aria-label="Dismiss notice"
      >
        ✕
      </button>
    </div>
  );
}
