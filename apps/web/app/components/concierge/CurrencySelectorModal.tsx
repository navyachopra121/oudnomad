'use client';

import React from 'react';
import { useCurrency, CURRENCIES, CurrencyCode } from './CurrencyContext';

export default function CurrencySelectorModal() {
  const { currency, setCurrency, isModalOpen, setIsModalOpen } = useCurrency();

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-surface border border-border p-6 sm:p-8 shadow-2xl rounded-sm space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/80 pb-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-antique-gold font-semibold">
              Global Concierge
            </span>
            <h3 className="font-serif text-xl text-primary font-medium mt-0.5">
              Select Currency & Region
            </h3>
          </div>
          <button
            onClick={() => setIsModalOpen(false)}
            className="p-2 text-primary-muted hover:text-primary transition-colors text-lg"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Currency Options */}
        <div className="space-y-2.5">
          {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => {
            const item = CURRENCIES[code];
            const isSelected = currency.code === code;
            return (
              <button
                key={code}
                onClick={() => {
                  setCurrency(code);
                  setIsModalOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3.5 border transition-all text-left ${
                  isSelected
                    ? 'border-antique-gold bg-antique-gold/10 shadow-sm'
                    : 'border-border/60 hover:border-antique-gold/50 bg-surface-muted/40 hover:bg-surface-muted'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl leading-none">{item.flag}</span>
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider text-primary">
                      {item.code} — {item.name}
                    </div>
                    <div className="text-[11px] text-primary-muted">
                      Base Rate: 1 USD = {item.rate} {item.code}
                    </div>
                  </div>
                </div>
                <div className="font-serif text-sm font-semibold text-antique-gold">
                  {item.symbol}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="pt-2 text-center text-[11px] text-primary-muted font-light leading-relaxed border-t border-border/60">
          Complimentary white-glove DHL Express & FedEx Priority shipping insured worldwide on orders over $250 USD equivalent.
        </div>
      </div>
    </div>
  );
}
