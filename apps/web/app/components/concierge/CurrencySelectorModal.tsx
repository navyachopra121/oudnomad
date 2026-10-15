'use client';

import React from 'react';
import { useCurrency, GccCountryCode } from './CurrencyContext';
import { GCC_COUNTRIES } from '../../lib/pricing';

export default function CurrencySelectorModal() {
  const { countryCode, setCountry, isModalOpen, setIsModalOpen } = useCurrency();

  if (!isModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
      onClick={() => setIsModalOpen(false)}
    >
      <div
        className="relative w-full max-w-md bg-[#0e0e0e] border border-white/10 p-6 sm:p-8 shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.28em] text-[#ffb91d] font-semibold">
              GCC Delivery Destination
            </span>
            <h3 className="font-serif text-xl text-white font-medium mt-1">
              Select Your Country
            </h3>
            <p className="text-[11px] text-white/40 mt-1 leading-relaxed">
              Prices shown are VAT-inclusive for the selected country.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(false)}
            className="p-2 text-white/40 hover:text-white transition-colors text-lg ml-4 flex-shrink-0"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Country Options */}
        <div className="space-y-2">
          {GCC_COUNTRIES.map((country) => {
            const isSelected = countryCode === country.code;
            return (
              <button
                key={country.code}
                id={`country-option-${country.code}`}
                onClick={() => {
                  setCountry(country.code as GccCountryCode);
                  setIsModalOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3.5 border transition-all text-left group ${
                  isSelected
                    ? 'border-[#ffb91d] bg-[#ffb91d]/8'
                    : 'border-white/8 hover:border-[#ffb91d]/50 bg-white/[0.02] hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl leading-none">{country.flag}</span>
                  <div>
                    <div className="text-[12px] font-medium uppercase tracking-wider text-white">
                      {country.name}
                    </div>
                    <div className="text-[11px] text-white/40 mt-0.5">
                      {country.currency} &mdash; {country.vatNote}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-serif text-sm font-semibold text-[#ffb91d]">
                    {country.currency}
                  </span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-[#ffb91d] flex-shrink-0" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-2 text-center text-[11px] text-white/30 leading-relaxed border-t border-white/8">
          📦 Oud Nomad delivers exclusively within the GCC via insured express courier.
        </div>
      </div>
    </div>
  );
}
