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
      className="bg-surface-muted border-b border-antique-gold/20 text-espresso overflow-hidden"
      style={{
        maxHeight: visible ? 96 : 0,
        opacity: visible ? 1 : 0,
        transition,
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-1.5 sm:gap-4 py-2 sm:py-2.5 text-[10px] sm:text-xs tracking-wide">
          <p className="text-center sm:text-left text-espresso font-medium tracking-[0.10em] sm:tracking-[0.14em] uppercase shrink-0">
            Complimentary UAE shipping over AED 500
          </p>

          <nav
            aria-label="Utility"
            className="flex items-center justify-center sm:justify-end gap-x-3 sm:gap-x-5 uppercase tracking-[0.12em] sm:tracking-[0.16em] shrink-0"
          >
            <Link href="/stores" className="utility-link inline-flex items-center gap-1 sm:gap-1.5">
              <IconMapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 text-antique-gold" />
              <span>Store Locator</span>
            </Link>
            <Link href="/track-order" className="utility-link inline-flex items-center gap-1 sm:gap-1.5">
              <IconPackage className="w-3.5 h-3.5 shrink-0 text-antique-gold" />
              <span>Track Order</span>
            </Link>
            {/* <div className="inline-flex items-center gap-1 sm:gap-1.5">
              <IconGlobe className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 text-antique-gold" aria-hidden />
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
              </button>
            </div> */}
          </nav>
        </div>
      </div>
      <div className="header-damask-edge" aria-hidden />
    </div>
  );
}
