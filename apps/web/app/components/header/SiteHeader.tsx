'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { StoreApi } from '../../store-api';
import { IconBag, IconChevronDown, IconClose, IconMenu, IconSearch, IconUser } from './icons';
import MobileNavDrawer from './MobileNavDrawer';
import { useCart } from '../cart/CartContext';
import { useCurrency } from '../concierge/CurrencyContext';
import SearchModal from './SearchModal';

type CategoryNode = {
  id: string;
  name: string;
  slug: string;
  children: CategoryNode[];
};

const FALLBACK_CATEGORIES: CategoryNode[] = [
  { id: 'perfumes', name: 'Perfumes', slug: 'perfumes', children: [] },
  { id: 'attars', name: 'Attars & Oils', slug: 'attars', children: [] },
  { id: 'bakhoor', name: 'Bakhoor & Incense', slug: 'bakhoor', children: [] },
];

export default function SiteHeader({ transparentMode = false }: { transparentMode?: boolean }) {
  const { openDrawer, totalItems } = useCart();
  const { currency, setIsModalOpen } = useCurrency();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [categories, setCategories] = useState<CategoryNode[]>(FALLBACK_CATEGORIES);

  useEffect(() => {
    StoreApi.getCategories()
      .then((tree) => {
        if (tree.length > 0) setCategories(tree as CategoryNode[]);
      })
      .catch(() => { });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    // Set initial value
    setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerHeight = 80;

  // Smooth 0→1 opacity over first 120px of scroll
  const bgOpacity = Math.min(scrollY / 120, 1);
  // Border fades in after 60px
  const borderOpacity = Math.max(0, Math.min((scrollY - 60) / 60, 1)) * 0.25;

  return (
    <>
      <header
        style={{
          background: `rgba(0, 0, 0, ${bgOpacity * 0.92})`,

          backdropFilter: bgOpacity > 0.3 ? `blur(${bgOpacity * 12}px)` : 'none',
          WebkitBackdropFilter: bgOpacity > 0.3 ? `blur(${bgOpacity * 12}px)` : 'none',
          boxShadow: bgOpacity > 0.5 ? `0 4px 32px rgba(0,0,0,${bgOpacity * 0.7})` : 'none',
          transition: 'background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease, box-shadow 0.4s ease',
        }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12">
          <div
            className="grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4"
            style={{ height: headerHeight }}
          >
            {/* ── LEFT COLUMN: Search Icon + Desktop Nav (HOME, CATALOG) / Mobile Hamburger ── */}
            <div className="flex items-center gap-4 lg:gap-8 justify-self-start">
              {/* Mobile hamburger menu */}
              <button
                type="button"
                className="lg:hidden p-2 -ml-2 flex items-center justify-center text-white hover:text-[#ffb91d] transition-colors"
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav-drawer"
                aria-label="Open navigation menu"
                onClick={() => setMobileOpen(true)}
              >
                <IconMenu className="w-6 h-6" />
              </button>

              {/* Desktop Search Icon on the far left (Exact oudarabiadubai.com placement) */}
              <button
                type="button"
                className="hidden lg:flex items-center justify-center text-white hover:text-[#ffb91d] transition-colors p-1"
                aria-label={searchOpen ? 'Close search' : 'Open search'}
                onClick={() => setSearchOpen((v) => !v)}
              >
                <IconSearch className="w-6 h-6" />
              </button>

              {/* Desktop Left Navigation */}
              <nav aria-label="Primary Left" className="hidden lg:flex items-center gap-8 text-[11px] font-normal tracking-[0.22em] uppercase font-sans">
                <Link
                  href="/"
                  className="nav-link py-2 text-white hover:text-[#ffb91d] transition-colors"
                >
                  HOME
                </Link>

                {/* CATALOG with dropdown */}
                <div
                  className="relative group py-2"
                  onMouseEnter={() => setCatalogOpen(true)}
                  onMouseLeave={() => setCatalogOpen(false)}
                >
                  <Link
                    href="/collections"
                    className="nav-link flex items-center gap-1.5 text-white hover:text-[#ffb91d] transition-colors"
                    onClick={() => setCatalogOpen(false)}
                  >
                    <span>CATALOG</span>
                    <IconChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${catalogOpen ? 'rotate-180 text-[#ffb91d]' : 'text-white/80'
                        }`}
                    />
                  </Link>

                  {/* Dropdown Menu */}
                  {catalogOpen && (
                    <div
                      className="absolute top-full left-0 w-56 bg-[#0a0a0a] border border-[#ffb91d]/30 shadow-2xl py-2 z-50 flex flex-col divide-y divide-white/5 animate-fadeIn"
                    >
                      <Link
                        href="/collections/all"
                        className="px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-white/90 hover:text-[#ffb91d] hover:bg-white/5 transition-colors font-normal"
                        onClick={() => setCatalogOpen(false)}
                      >
                        All Fragrances
                      </Link>
                      <Link
                        href="/collections/perfumes"
                        className="px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-white/90 hover:text-[#ffb91d] hover:bg-white/5 transition-colors font-medium"
                        onClick={() => setCatalogOpen(false)}
                      >
                        Perfumes
                      </Link>
                      <Link
                        href="/collections/mists"
                        className="px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-white/90 hover:text-[#ffb91d] hover:bg-white/5 transition-colors font-medium"
                        onClick={() => setCatalogOpen(false)}
                      >
                        Hair & Body Mists
                      </Link>
                    </div>
                  )}
                </div>

                <Link
                  href="/fragrance-finder"
                  className="nav-link py-2 text-[#ffb91d] hover:text-white transition-colors font-medium flex items-center gap-1.5"
                >
                  <span>FRAGRANCE FINDER</span>
                  <span className="text-[9px] px-1 py-0.5 bg-[#ffb91d]/15 text-[#ffb91d] border border-[#ffb91d]/40 rounded-xs tracking-normal">QUIZ</span>
                </Link>
              </nav>
            </div>

            {/* ── CENTER COLUMN: Brand Logo ── */}
            <div className="justify-self-center text-center shrink-0 flex items-center justify-center py-1">
              <Link href="/" aria-label="Oud Nomad Home" className="inline-block group">
                <Image
                  src="/oudnomadtextlogo.png"
                  alt="Oud Nomad"
                  width={300}
                  height={40}
                  className="h-6 sm:h-7 lg:h-8 w-auto object-contain group-hover:brightness-110 transition-all duration-300"
                  priority
                />
              </Link>
            </div>

            {/* ── RIGHT COLUMN: Desktop Nav (CONTACT, STORES, ABOUT US) + Action Icons ── */}
            <div className="flex items-center gap-4 lg:gap-8 justify-self-end">
              {/* Desktop Right Navigation */}
              <nav aria-label="Primary Right" className="hidden lg:flex items-center gap-8 text-[11px] font-normal tracking-[0.22em] uppercase font-sans">
                <Link
                  href="/contact"
                  className="nav-link py-2 text-white hover:text-[#ffb91d] transition-colors"
                >
                  CONTACT US
                </Link>
                {/* <Link
                  href="/stores"
                  className="nav-link py-2 text-white hover:text-[#ffb91d] transition-colors"
                >
                  STORES
                </Link> */}
                <Link
                  href="/about"
                  className="nav-link py-2 text-white hover:text-[#ffb91d] transition-colors"
                >
                  ABOUT US
                </Link>
              </nav>

              {/* Action Icons */}
              <div className="flex items-center gap-2 sm:gap-4">
                {/* Currency selector modal trigger */}
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 text-[11px] uppercase tracking-wider text-[#ffb91d] hover:text-white transition-colors font-medium border border-[#ffb91d]/30 hover:border-[#ffb91d]"
                  title="Select Currency"
                >
                  <span>{currency.flag}</span>
                  <span>{currency.code}</span>
                </button>

                {/* Mobile Search Icon */}
                <button
                  type="button"
                  className="lg:hidden p-2 flex items-center justify-center text-white hover:text-[#ffb91d] transition-colors"
                  aria-label={searchOpen ? 'Close search' : 'Open search'}
                  onClick={() => setSearchOpen((v) => !v)}
                >
                  <IconSearch className="w-6 h-6" />
                </button>

                {/* User Account Icon */}
                <Link
                  href="/account"
                  className="hidden sm:flex p-2 items-center justify-center text-white hover:text-[#ffb91d] transition-colors"
                  aria-label="Account"
                >
                  <IconUser className="w-6 h-6" />
                </Link>

                {/* Cart Bag Icon */}
                <button
                  type="button"
                  onClick={openDrawer}
                  className="relative p-2 flex items-center justify-center text-white hover:text-[#ffb91d] transition-colors"
                  aria-label="Shopping bag"
                >
                  <IconBag className="w-6 h-6" />
                  {totalItems > 0 && (
                    <span className="absolute top-0.5 right-0.5 min-w-[16px] h-[16px] bg-[#ffb91d] text-black text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 shadow-md">
                      {totalItems}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── FULL SCREEN SEARCH POPUP MODAL (matches screenshot) ── */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      {/* Spacer so content is not hidden beneath fixed header — skipped in transparentMode (hero pages) */}
      {!transparentMode && (
        <div aria-hidden style={{ height: headerHeight }} />
      )}

      {/* Mobile Drawer Navigation */}
      <MobileNavDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        categories={categories}
        reduceMotion={false}
      />
    </>
  );
}