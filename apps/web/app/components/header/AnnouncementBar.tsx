'use client';

import Link from 'next/link';
import { useState } from 'react';
import { IconGlobe, IconMapPin, IconPackage } from './icons';

type Props = {
  visible: boolean;
  reduceMotion: boolean;
};

export default function AnnouncementBar({ visible, reduceMotion }: Props) {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');

  const transition = reduceMotion ? 'none' : 'transform 550ms var(--ease-luxury), opacity 550ms var(--ease-luxury)';

  return (
    <div
      className="bg-surface-muted border-b border-border text-espresso overflow-hidden"
      style={{
        maxHeight: visible ? 96 : 0,
        opacity: visible ? 1 : 0,
        transition,
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-2.5 text-[11px] sm:text-xs tracking-wide">
          <p className="text-center sm:text-left text-espresso/90 leading-snug">
            <span className="hidden md:inline">Complimentary shipping on orders above </span>
            <span className="font-medium text-antique-gold">AED 500</span>
            <span className="hidden md:inline"> within the UAE — each flacon prepared in our atelier.</span>
            <span className="md:hidden"> Complimentary UAE shipping over AED 500.</span>
          </p>

          <nav
            aria-label="Utility"
            className="flex flex-wrap items-center justify-center sm:justify-end gap-x-4 gap-y-1"
          >
            <Link href="/stores" className="utility-link inline-flex items-center gap-1.5 uppercase tracking-[0.16em]">
              <IconMapPin className="w-3.5 h-3.5 shrink-0 text-antique-gold" />
              Store Locator
            </Link>
            <Link href="/track-order" className="utility-link inline-flex items-center gap-1.5 uppercase tracking-[0.16em]">
              <IconPackage className="w-3.5 h-3.5 shrink-0 text-antique-gold" />
              Track Order
            </Link>
            <div className="inline-flex items-center gap-1.5 uppercase tracking-[0.16em]">
              <IconGlobe className="w-3.5 h-3.5 shrink-0 text-antique-gold" aria-hidden />
              <span className="sr-only">Display language (English primary site)</span>
              <button
                type="button"
                className={`utility-link px-0.5 ${language === 'en' ? 'text-antique-gold font-medium' : ''}`}
                aria-pressed={language === 'en'}
                onClick={() => setLanguage('en')}
              >
                EN
              </button>
              <span className="text-border-strong" aria-hidden>
                |
              </span>
              <button
                type="button"
                className={`utility-link font-arabic px-0.5 ${language === 'ar' ? 'text-antique-gold font-medium' : ''}`}
                aria-pressed={language === 'ar'}
                title="Arabic fragments only — full site remains English"
                onClick={() => setLanguage('ar')}
              >
                <span dir="rtl" lang="ar">
                  ع
                </span>
                <span className="sr-only">Arabic (selective brand text)</span>
              </button>
            </div>
          </nav>
        </div>
      </div>
      <div className="header-damask-edge" aria-hidden />
    </div>
  );
}
