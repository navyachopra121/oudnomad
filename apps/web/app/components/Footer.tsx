'use client';

import Link from 'next/link';
import { useState } from 'react';
import Container from './Container';
import { useCurrency } from './concierge/CurrencyContext';

const SHOP_LINKS = [
  { label: 'All Fragrances', href: '/collections' },
  { label: 'Royal Oud & Extrait', href: '/collections/oud' },
  { label: 'Pure Concentrated Attars', href: '/collections/attars' },
  { label: 'Bakhoor & Incense', href: '/collections/bakhoor' },
  { label: 'Saved Wishlist', href: '/account/wishlist' },
];

const CARE_LINKS = [
  { label: 'Order Tracking Dossier', href: '/account/orders' },
  { label: 'Collector Appraisals', href: '/reviews' },
  { label: 'Store Locator & Atelier', href: '/stores' },
  { label: 'Atelier Concierge', href: 'mailto:concierge@oudnomad.com' },
];

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/legal/privacy' },
  { label: 'Terms of Service', href: '/legal/terms' },
  { label: 'Shipping & Delivery', href: '/legal/shipping' },
  { label: 'Returns & Refunds', href: '/legal/refund-policy' },
];

export default function Footer() {
  const { currency, setIsModalOpen } = useCurrency();
  // Mobile accordion open states
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionKey: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  return (
    <footer className="bg-obsidian text-ivory/75 mt-auto border-t border-antique-gold/35">
      <div className="header-damask-edge opacity-60" aria-hidden />

      <Container className="py-10 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1 border-b border-ivory/10 pb-6 md:border-none md:pb-0">
            <p className="font-display text-xl md:text-2xl tracking-[0.2em] text-ivory">OUD NOMAD</p>
            <p className="font-arabic text-xs md:text-sm text-ivory/60 mt-1.5" dir="rtl" lang="ar">
              دار عطور عربية
            </p>
            <p className="mt-3 md:mt-5 text-xs md:text-sm leading-relaxed text-ivory/65 max-w-xs">
              Artisanal oud, attars, and mukhallat — composed in Dubai for those who enter expecting another world.
            </p>
            <p className="mt-4 md:mt-6 text-[11px] md:text-xs uppercase tracking-[0.18em] text-champagne-sand/80">
              Visit us in Dubai →{' '}
              <Link href="/stores" className="underline-offset-4 hover:underline active:underline">
                Store locator
              </Link>
            </p>
          </div>

          {/* Shop Column (Accordion on mobile) */}
          <div className="border-b border-ivory/10 pb-4 md:border-none md:pb-0">
            <button
              type="button"
              onClick={() => toggleSection('shop')}
              className="w-full flex items-center justify-between text-left text-xs uppercase tracking-[0.22em] text-champagne-sand font-medium md:cursor-default"
              aria-expanded={!!openSections['shop']}
            >
              <span>Shop</span>
              <span className="md:hidden text-champagne-sand/70 text-sm font-light">
                {openSections['shop'] ? '−' : '+'}
              </span>
            </button>
            <ul
              className={`${
                openSections['shop'] ? 'block' : 'hidden'
              } md:block mt-3 space-y-2.5 text-xs md:text-sm transition-all duration-300`}
            >
              {SHOP_LINKS.map((l) => (
                <li key={l.href + l.label}>
                  <Link
                    href={l.href}
                    className="block py-1 hover:text-champagne-sand active:text-champagne-sand transition-colors duration-[400ms]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Client Care Column (Accordion on mobile) */}
          <div className="border-b border-ivory/10 pb-4 md:border-none md:pb-0">
            <button
              type="button"
              onClick={() => toggleSection('care')}
              className="w-full flex items-center justify-between text-left text-xs uppercase tracking-[0.22em] text-champagne-sand font-medium md:cursor-default"
              aria-expanded={!!openSections['care']}
            >
              <span>Client Care</span>
              <span className="md:hidden text-champagne-sand/70 text-sm font-light">
                {openSections['care'] ? '−' : '+'}
              </span>
            </button>
            <ul
              className={`${
                openSections['care'] ? 'block' : 'hidden'
              } md:block mt-3 space-y-2.5 text-xs md:text-sm transition-all duration-300`}
            >
              {CARE_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="block py-1 hover:text-champagne-sand active:text-champagne-sand transition-colors duration-[400ms]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column (Accordion on mobile) */}
          <div>
            <button
              type="button"
              onClick={() => toggleSection('legal')}
              className="w-full flex items-center justify-between text-left text-xs uppercase tracking-[0.22em] text-champagne-sand font-medium md:cursor-default"
              aria-expanded={!!openSections['legal']}
            >
              <span>Legal</span>
              <span className="md:hidden text-champagne-sand/70 text-sm font-light">
                {openSections['legal'] ? '−' : '+'}
              </span>
            </button>
            <ul
              className={`${
                openSections['legal'] ? 'block' : 'hidden'
              } md:block mt-3 space-y-2.5 text-xs md:text-sm transition-all duration-300`}
            >
              {LEGAL_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="block py-1 hover:text-champagne-sand active:text-champagne-sand transition-colors duration-[400ms]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 md:mt-8 flex gap-4 text-[10px] uppercase tracking-[0.16em] text-ivory/45">
              <span>Visa</span>
              <span>Mastercard</span>
              <span>Apple Pay</span>
            </div>
          </div>
        </div>
      </Container>

      <div className="border-t border-ivory/10">
        <Container className="py-4 md:py-6">
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between text-[11px] md:text-xs text-ivory/45">
            <p>© {new Date().getFullYear()} Oud Nomad. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1.5 px-2 py-0.5 text-[10px] uppercase tracking-wider text-champagne-sand hover:text-ivory transition-colors border border-ivory/20 hover:border-champagne-sand/50 rounded-xs"
              >
                <span>{currency.flag}</span>
                <span>{currency.code} ({currency.symbol})</span>
                <span className="text-[9px] opacity-60 ml-0.5">▼</span>
              </button>
              <p className="text-ivory/40">support@oudnomad.com · grievance@oudnomad.com</p>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}
