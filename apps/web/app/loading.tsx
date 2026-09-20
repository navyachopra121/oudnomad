'use client';

import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-[60vh] w-full flex flex-col items-center justify-center space-y-5 font-sans">
      <div className="relative w-12 h-12 flex items-center justify-center">
        {/* Outer pulsating gold ring */}
        <div className="absolute inset-0 rounded-full border border-antique-gold/30 animate-ping opacity-40" />
        {/* Inner rotating gold spinner */}
        <div className="w-8 h-8 rounded-full border-2 border-border border-t-antique-gold animate-spin" />
      </div>

      <div className="text-center space-y-1">
        <span className="text-[10px] uppercase tracking-[0.28em] text-antique-gold font-medium block">
          OudNomad Atelier
        </span>
        <p className="text-xs text-muted font-light tracking-wider">
          Consulting the fragrance archives...
        </p>
      </div>
    </div>
  );
}
