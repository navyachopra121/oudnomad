'use client';

import React from 'react';
import { useCurrency } from '../concierge/CurrencyContext';

/**
 * GccBanner — shown only to visitors detected outside GCC (by timezone).
 * Styled as a luxury atelier announcement bar sitting at the top of the header.
 * Disappears permanently once dismissed or a country is selected.
 */
export default function GccBanner() {
  const { showGccBanner, dismissGccBanner, setIsModalOpen } = useCurrency();

  if (!showGccBanner) return null;

  return (
    <div
      id="gcc-atelier-banner"
      role="banner"
      className="w-full bg-[#0a0a0c] border-b border-[#ffb91d]/20 px-3 sm:px-6 py-2 flex items-center justify-between gap-2 sm:gap-4 text-xs z-50 text-white select-none transition-all"
    >
      {/* Left: Message */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-[#ffb91d] flex-shrink-0 text-xs">📍</span>
        <p className="text-[11px] sm:text-xs text-white/80 leading-tight truncate sm:whitespace-normal font-sans">
          <span className="text-[#ffb91d] font-semibold uppercase tracking-wider text-[10px] mr-1 hidden xs:inline">
            Atelier Notice:
          </span>
          <span className="hidden md:inline">
            Oud Nomad delivers exclusively to addresses within the GCC. Gifting to Dubai, Riyadh or beyond?
          </span>
          <span className="md:hidden">
            GCC deliveries only. Gifting to someone in the region?
          </span>
        </p>
      </div>

      {/* Right: CTA & Dismiss */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          id="gcc-banner-select-destination"
          onClick={() => setIsModalOpen(true)}
          className="text-[10px] sm:text-[11px] uppercase tracking-[0.15em] font-medium text-[#ffb91d] hover:text-black hover:bg-[#ffb91d] border border-[#ffb91d]/60 hover:border-[#ffb91d] px-2.5 py-1 sm:px-3 sm:py-1 transition-all duration-200 whitespace-nowrap cursor-pointer active:scale-95"
        >
          Select Destination
        </button>
        <button
          id="gcc-banner-dismiss"
          onClick={dismissGccBanner}
          className="text-white/40 hover:text-white transition-colors text-sm p-1 leading-none cursor-pointer"
          aria-label="Dismiss notice"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
