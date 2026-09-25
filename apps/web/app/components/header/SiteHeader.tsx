'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { StoreApi } from '../../store-api';
import Container from '../Container';
import AnnouncementBar from './AnnouncementBar';
import { IconBag, IconMenu, IconSearch, IconUser } from './icons';
import MobileNavDrawer from './MobileNavDrawer';
import { useHeaderScroll } from './use-header-scroll';
import { useCart } from '../cart/CartContext';
import { useCurrency } from '../concierge/CurrencyContext';

type CategoryNode = {
  id: string;
  name: string;
  slug: string;
  children: CategoryNode[];
};

const FALLBACK_CATEGORIES: CategoryNode[] = [
  { id: 'perfumes', name: 'All Perfumes', slug: 'perfumes', children: [] },
  { id: 'attars', name: 'Attars & Oils', slug: 'attars', children: [] },
  { id: 'bakhoor', name: 'Bakhoor & Incense', slug: 'bakhoor', children: [] },
];

export default function SiteHeader() {
  const router = useRouter();
  const { announcementVisible, compact, reduceMotion } = useHeaderScroll();
  const { openDrawer, totalItems } = useCart();
  const { currency, setIsModalOpen } = useCurrency();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<CategoryNode[]>(FALLBACK_CATEGORIES);

  useEffect(() => {
    StoreApi.getCategories()
      .then((tree) => {
        if (tree.length > 0) setCategories(tree as CategoryNode[]);
      })
      .catch(() => { });
  }, []);

  const onSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
    else router.push('/search');
    setSearchOpen(false);
  };

  const announcementHeight = announcementVisible ? 38 : 0;
  const mainNavHeight = compact ? 60 : 72;
  const spacerHeight = announcementHeight + mainNavHeight + (searchOpen ? 52 : 0);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50" style={{ top: 0 }}>
        <AnnouncementBar visible={announcementVisible} reduceMotion={reduceMotion} />

        <div className="bg-[#000000] border-b border-[#d89527]/20 text-white">
          <Container>
            <div
              className="grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_auto_1fr] items-center gap-3 transition-all duration-500"
              style={{
                height: mainNavHeight,
              }}
            >
              {/* Left Side: Mobile Menu + Desktop Nav Links */}
              <div className="flex items-center gap-3 lg:gap-6 justify-self-start">
                <button
                  type="button"
                  className="lg:hidden min-w-[38px] min-h-[38px] -ml-1 flex items-center justify-center text-[#d89527]"
                  aria-expanded={mobileOpen}
                  aria-controls="mobile-nav-drawer"
                  aria-label="Open menu"
                  onClick={() => setMobileOpen(true)}
                >
                  <IconMenu className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  className="hidden lg:flex items-center justify-center text-white/80 hover:text-[#d89527] transition-colors pr-2"
                  aria-label="Search"
                  onClick={() => setSearchOpen((v) => !v)}
                >
                  <IconSearch className="w-4 h-4" />
                </button>

                <nav aria-label="Primary Left" className="hidden lg:flex items-center gap-6 text-[11px] font-medium tracking-[0.22em] uppercase">
                  <Link
                    href="/"
                    className="text-white/90 hover:text-[#d89527] transition-colors py-2"
                  >
                    HOME
                  </Link>

                  <div
                    className="relative group"
                    onMouseEnter={() => setCatalogOpen(true)}
                    onMouseLeave={() => setCatalogOpen(false)}
                  >
                    <Link
                      href="/collections"
                      className="text-white/90 hover:text-[#d89527] transition-colors py-2 flex items-center gap-1"
                    >
                      <span>CATALOG</span>
                      <span className="text-[9px] opacity-70">▼</span>
                    </Link>

                    {/* Dropdown Menu */}
                    {catalogOpen && (
                      <div className="absolute top-full left-0 w-48 bg-[#0a0a0a] border border-[#d89527]/30 shadow-2xl py-2 z-50 flex flex-col gap-0.5">
                        <Link
                          href="/collections"
                          className="px-4 py-2 text-[11px] uppercase tracking-wider text-white/80 hover:text-[#d89527] hover:bg-white/5 transition-colors"
                        >
                          All Fragrances
                        </Link>
                        <Link
                          href="/collections/perfumes"
                          className="px-4 py-2 text-[11px] uppercase tracking-wider text-white/80 hover:text-[#d89527] hover:bg-white/5 transition-colors"
                        >
                          Perfumes
                        </Link>
                        <Link
                          href="/collections/attars"
                          className="px-4 py-2 text-[11px] uppercase tracking-wider text-white/80 hover:text-[#d89527] hover:bg-white/5 transition-colors"
                        >
                          Attars & Oils
                        </Link>
                        <Link
                          href="/collections/bakhoor"
                          className="px-4 py-2 text-[11px] uppercase tracking-wider text-white/80 hover:text-[#d89527] hover:bg-white/5 transition-colors"
                        >
                          Bakhoor
                        </Link>
                      </div>
                    )}
                  </div>
                </nav>
              </div>

              {/* Center Logo: OUD NOMAD DUBAI */}
              <Link
                href="/"
                className="justify-self-center text-center shrink-0 flex flex-col items-center justify-center py-1 cursor-pointer select-none"
                aria-label="Oud Nomad Dubai Home"
              >
                <div className="flex items-start justify-center">
                  <span className="font-display text-lg sm:text-2xl lg:text-3xl font-semibold tracking-[0.24em] text-[#d89527] uppercase leading-none">
                    OUD NOMAD
                  </span>
                  <span className="text-[8px] sm:text-[10px] text-[#d89527] font-semibold -mt-1 ml-0.5">®</span>
                </div>
                <span className="text-[8px] sm:text-[10px] font-medium tracking-[0.38em] text-white/70 uppercase mt-0.5">
                  DUBAI
                </span>
              </Link>

              {/* Right Side: Desktop Nav Links + Action Icons */}
              <div className="flex items-center gap-3 lg:gap-5 justify-self-end">
                <nav aria-label="Primary Right" className="hidden lg:flex items-center gap-6 text-[11px] font-medium tracking-[0.22em] uppercase">
                  <Link href="/about" className="text-white/90 hover:text-[#d89527] transition-colors">
                    ABOUT US
                  </Link>
                  <Link href="/collections" className="text-white/90 hover:text-[#d89527] transition-colors">
                    GCC SHIPPING
                  </Link>
                  <Link href="/contact" className="text-white/90 hover:text-[#d89527] transition-colors">
                    CONTACT
                  </Link>
                </nav>

                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="hidden sm:flex items-center gap-1 px-2 py-0.5 text-[10px] uppercase tracking-wider text-[#d89527] hover:text-white transition-colors font-medium border border-[#d89527]/30 rounded-xs"
                    title="Select Currency"
                  >
                    <span>{currency.flag}</span>
                    <span>{currency.code}</span>
                  </button>

                  <button
                    type="button"
                    className="lg:hidden min-w-[36px] min-h-[36px] flex items-center justify-center text-white/80 hover:text-[#d89527] transition-colors"
                    aria-label={searchOpen ? 'Close search' : 'Open search'}
                    onClick={() => setSearchOpen((v) => !v)}
                  >
                    <IconSearch className="w-4 h-4" />
                  </button>

                  <Link
                    href="/account"
                    className="hidden sm:flex min-w-[36px] min-h-[36px] items-center justify-center text-white/80 hover:text-[#d89527] transition-colors"
                    aria-label="Account"
                  >
                    <IconUser className="w-4 h-4" />
                  </Link>

                  <button
                    type="button"
                    onClick={openDrawer}
                    className="relative min-w-[36px] min-h-[36px] flex items-center justify-center text-white/80 hover:text-[#d89527] transition-colors"
                    aria-label="Shopping bag"
                  >
                    <IconBag className="w-4 h-4" />
                    {totalItems > 0 && (
                      <span className="absolute top-0 right-0 min-w-[15px] h-[15px] bg-[#d89527] text-black text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
                        {totalItems}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Search Panel */}
            <div
              id="header-search-panel"
              className="overflow-hidden border-t border-[#d89527]/20"
              style={{
                maxHeight: searchOpen ? 52 : 0,
                opacity: searchOpen ? 1 : 0,
                transition: reduceMotion ? 'none' : 'max-height 350ms ease, opacity 250ms ease',
              }}
              hidden={!searchOpen}
            >
              <form onSubmit={onSearchSubmit} className="py-2 flex gap-2">
                <label htmlFor="header-search-input" className="sr-only">
                  Search fragrances
                </label>
                <input
                  id="header-search-input"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="SEARCH PERFUMES, ATTARS, OUD..."
                  className="flex-1 bg-[#121212] border border-[#d89527]/30 rounded-none px-4 py-1.5 text-[11px] text-white placeholder:text-white/40 focus:outline-none focus:border-[#d89527] uppercase tracking-wider"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="shrink-0 px-5 py-1.5 text-[10px] uppercase tracking-[0.2em] font-semibold bg-[#d89527] text-black hover:bg-[#c58b2b] transition-colors"
                >
                  SEARCH
                </button>
              </form>
            </div>
          </Container>
        </div>
      </header>

      <div aria-hidden style={{ height: spacerHeight }} />

      <MobileNavDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        categories={categories}
        reduceMotion={reduceMotion}
      />
    </>
  );
}