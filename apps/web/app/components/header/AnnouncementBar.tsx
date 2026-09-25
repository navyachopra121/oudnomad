'use client';

import Link from 'next/link';
import { IconPackage } from './icons';

type Props = {
  visible: boolean;
  reduceMotion: boolean;
};

export default function AnnouncementBar({ visible, reduceMotion }: Props) {
  const transition = reduceMotion ? 'none' : 'transform 550ms var(--ease-luxury), opacity 550ms var(--ease-luxury)';

  return (
    <div
      className="bg-[#000000] border-b border-[#d89527]/30 text-white overflow-hidden"
      style={{
        maxHeight: visible ? 96 : 0,
        opacity: visible ? 1 : 0,
        transition,
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-1.5 sm:gap-4 py-2 text-[10px] sm:text-xs tracking-wider">
          <p className="text-center sm:text-left text-[#d89527] font-semibold tracking-[0.14em] uppercase shrink-0">
            EXPRESS DELIVERY ACROSS ALL GCC COUNTRIES — UAE · KSA · QATAR · KUWAIT · OMAN · BAHRAIN
          </p>

          <nav
            aria-label="Utility"
            className="flex items-center justify-center sm:justify-end gap-x-4 uppercase tracking-[0.14em] text-white/80 shrink-0 text-[10px] sm:text-xs"
          >
            <Link href="/track-order" className="hover:text-[#d89527] transition-colors inline-flex items-center gap-1.5">
              <IconPackage className="w-3 h-3 text-[#d89527]" />
              <span>TRACK ORDER</span>
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
