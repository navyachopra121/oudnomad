'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { IconClose } from './icons';

type CategoryNode = {
  id: string;
  name: string;
  slug: string;
  children: CategoryNode[];
};

type Props = {
  open: boolean;
  onClose: () => void;
  categories: CategoryNode[];
  reduceMotion: boolean;
};

export default function MobileNavDrawer({ open, onClose, reduceMotion }: Props) {
  const [catalogExpanded, setCatalogExpanded] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  const slide = reduceMotion ? 'none' : 'transform 400ms cubic-bezier(0.16, 1, 0.3, 1)';

  return (
    <>
      <div
        className="fixed inset-0 z-[60] bg-black/70 lg:hidden backdrop-blur-xs"
        style={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: reduceMotion ? 'none' : 'opacity 300ms ease',
        }}
        aria-hidden={!open}
        onClick={onClose}
      />
      <aside
        id="mobile-nav-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className="fixed inset-y-0 left-0 z-[70] w-[min(100vw-3rem,20rem)] bg-[#000000] border-r border-[#d89527]/30 shadow-2xl lg:hidden flex flex-col text-white"
        style={{
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: slide,
        }}
        hidden={!open}
      >
        {/* Top bar with close X */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#d89527]/20">
          <span className="font-display text-lg tracking-[0.2em] text-[#d89527] uppercase font-bold">
            OUD NOMAD
          </span>
          <button
            type="button"
            className="min-w-[40px] min-h-[40px] -mr-2 flex items-center justify-center text-[#d89527] hover:text-white transition-colors"
            aria-label="Close menu"
            onClick={onClose}
          >
            <IconClose className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-6 py-6 space-y-4 text-xs uppercase font-semibold tracking-[0.2em]">
          <Link
            href="/"
            className="block py-2.5 text-white hover:text-[#d89527] transition-colors border-b border-white/10"
            onClick={onClose}
          >
            HOME
          </Link>

          {/* CATALOG Accordion */}
          <div className="border-b border-white/10 pb-2">
            <button
              type="button"
              onClick={() => setCatalogExpanded((v) => !v)}
              className="w-full flex items-center justify-between py-2.5 text-white hover:text-[#d89527] transition-colors"
            >
              <span>CATALOG</span>
              <span className="text-[#d89527] text-sm font-light">
                {catalogExpanded ? '−' : '+'}
              </span>
            </button>

            {catalogExpanded && (
              <div className="pl-4 py-2 space-y-2.5 text-[11px] font-normal tracking-[0.16em]">
                <Link
                  href="/collections"
                  className="block text-white/80 hover:text-[#d89527] transition-colors"
                  onClick={onClose}
                >
                  All Fragrances
                </Link>
                <Link
                  href="/collections/perfumes"
                  className="block text-white/80 hover:text-[#d89527] transition-colors"
                  onClick={onClose}
                >
                  Perfumes
                </Link>
                <Link
                  href="/collections/attars"
                  className="block text-white/80 hover:text-[#d89527] transition-colors"
                  onClick={onClose}
                >
                  Attars & Oils
                </Link>
                <Link
                  href="/collections/bakhoor"
                  className="block text-white/80 hover:text-[#d89527] transition-colors"
                  onClick={onClose}
                >
                  Bakhoor
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/about"
            className="block py-2.5 text-white hover:text-[#d89527] transition-colors border-b border-white/10"
            onClick={onClose}
          >
            ABOUT US
          </Link>

          <Link
            href="/contact"
            className="block py-2.5 text-white hover:text-[#d89527] transition-colors border-b border-white/10"
            onClick={onClose}
          >
            CONTACT
          </Link>

          <Link
            href="/account"
            className="block py-2.5 text-[#d89527] hover:text-white transition-colors"
            onClick={onClose}
          >
            MY ACCOUNT
          </Link>
        </nav>

        {/* Social Box Bottom Bar */}
        <div className="p-4 border-t border-[#d89527]/20 bg-[#0a0a0a]">
          <div className="grid grid-cols-4 gap-1.5 text-center text-[9px] tracking-wider text-[#d89527] font-semibold">
            <a
              href="https://www.instagram.com/oudnomaddubai?stkn=NWtkMGc4ZmFvc3pv&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 border border-[#d89527]/30 hover:border-[#d89527] hover:bg-[#d89527] hover:text-black transition-all"
            >
              INSTAGRAM
            </a>
            <a
              href="https://x.com/oudnomad?s=11"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 border border-[#d89527]/30 hover:border-[#d89527] hover:bg-[#d89527] hover:text-black transition-all"
            >
              X / TWITTER
            </a>
            <a
              href="https://www.linkedin.com/posts/oud-nomad_oudnomad-luxuryfragrance-activity-7508052849604435968-vmRv?utm_source=share&utm_medium=member_ios&rcm=ACoAAEW4eq0Bm-115qea9ir7xuPfrWztpoN0l_4"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 border border-[#d89527]/30 hover:border-[#d89527] hover:bg-[#d89527] hover:text-black transition-all"
            >
              LINKEDIN
            </a>
            <a
              href="https://pin.it/7xTiv852Y"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 border border-[#d89527]/30 hover:border-[#d89527] hover:bg-[#d89527] hover:text-black transition-all"
            >
              PINTEREST
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
