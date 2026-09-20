'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { StoreApi } from '../../store-api';
import Container from '../Container';
import AnnouncementBar from './AnnouncementBar';
import CollectionsMegaMenu from './CollectionsMegaMenu';
import { IconBag, IconHeart, IconMenu, IconSearch, IconUser } from './icons';
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
  { id: 'attars', name: 'Pure Attars', slug: 'attars', children: [] },
  { id: 'oud', name: 'Oud & Mukhallat', slug: 'oud', children: [] },
  { id: 'bakhoor', name: 'Bakhoor & Incense', slug: 'bakhoor', children: [] },
];

export default function SiteHeader() {
  const router = useRouter();
  const { announcementVisible, compact, reduceMotion } = useHeaderScroll();
  const { openDrawer, totalItems } = useCart();
  const { currency, setIsModalOpen } = useCurrency();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
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

  const announcementHeight = announcementVisible ? 44 : 0;
  const mainNavHeight = compact ? 64 : 80;
  const spacerHeight = announcementHeight + mainNavHeight + (searchOpen ? 52 : 0);

  return (
    <>
      <header className="  fixed top-0 left-0 right-0 z-50">
        <AnnouncementBar visible={announcementVisible} reduceMotion={reduceMotion} />

        <div className="bg-ivory/95 backdrop-blur-sm border-b border-antique-gold/20 text-espresso">
          <Container>
            <div
              className={`grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_auto_1fr] items-center gap-3 transition-all duration-[550ms]`}
              style={{
                height: mainNavHeight,
                transitionTimingFunction: 'var(--ease-luxury)',
              }}
            >
              {/* Left — mobile menu + desktop nav */}
              <div className="flex items-center gap-4 lg:gap-8 justify-self-start">
                <button
                  type="button"
                  className="lg:hidden min-w-[44px] min-h-[44px] -ml-2 flex items-center justify-center text-antique-gold hover:text-espresso active:text-espresso transition-colors duration-[400ms]"
                  aria-expanded={mobileOpen}
                  aria-controls="mobile-nav-drawer"
                  aria-label="Open menu"
                  onClick={() => setMobileOpen(true)}
                >
                  <IconMenu className="w-5 h-5" />
                </button>

                <nav aria-label="Primary" className="hidden lg:flex items-center gap-8">
                  <CollectionsMegaMenu compact={compact} reduceMotion={reduceMotion} />
                  <Link
                    href="/#sanctuary"
                    className="nav-link text-xs uppercase tracking-[0.22em] font-medium text-espresso"
                  >
                    The Sanctuary
                  </Link>
                  <Link
                    href="/#vitrine"
                    className="nav-link text-xs uppercase tracking-[0.22em] font-medium text-espresso"
                  >
                    Grand Vitrine
                  </Link>
                </nav>
              </div>

              {/* Center logo */}
              <Link
                href="/"
                className="relative z-30 justify-self-center text-center group shrink-0 flex items-center justify-center"
                aria-label="Oud Nomad home"
              >
                <Image
                  src="/logo.png"
                  alt="OUD NOMAD"
                  width={220}
                  height={80}
                  priority
                  className="relative z-30 object-contain max-w-none transition-all duration-[550ms] drop-shadow-sm"
                  style={{
                    height: compact ? '48px' : '74px',
                    transform: compact ? 'translateY(0)' : 'translateY(0)',
                    width: 'auto',
                    transitionTimingFunction: 'var(--ease-luxury)',
                  }}
                />
              </Link>

              {/* Right actions */}
              <div className="flex items-center gap-0 sm:gap-1 justify-self-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs uppercase tracking-wider text-antique-gold hover:text-espresso transition-colors font-medium border border-antique-gold/20 hover:border-antique-gold/50 rounded-xs mr-1"
                  title="Select Currency & Region"
                >
                  <span className="text-sm">{currency.flag}</span>
                  <span>{currency.code}</span>
                </button>
                <button
                  type="button"
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center text-antique-gold hover:text-espresso active:text-espresso transition-colors duration-[400ms]"
                  aria-expanded={searchOpen}
                  aria-controls="header-search-panel"
                  aria-label={searchOpen ? 'Close search' : 'Open search'}
                  onClick={() => setSearchOpen((v) => !v)}
                >
                  <IconSearch className="w-[1.15rem] h-[1.15rem]" />
                </button>
                <Link
                  href="/account/wishlist"
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center text-antique-gold hover:text-espresso active:text-espresso transition-colors duration-[400ms]"
                  aria-label="Wishlist"
                >
                  <IconHeart className="w-[1.15rem] h-[1.15rem]" />
                </Link>
                <Link
                  href="/account"
                  className="hidden sm:flex min-w-[44px] min-h-[44px] items-center justify-center text-antique-gold hover:text-espresso active:text-espresso transition-colors duration-[400ms]"
                  aria-label="Account"
                >
                  <IconUser className="w-[1.15rem] h-[1.15rem]" />
                </Link>
                <button
                  type="button"
                  onClick={openDrawer}
                  className="relative min-w-[44px] min-h-[44px] flex items-center justify-center text-antique-gold hover:text-espresso active:text-espresso transition-colors duration-[400ms]"
                  aria-label="Shopping bag"
                >
                  <IconBag className="w-[1.15rem] h-[1.15rem]" />
                  {totalItems > 0 && (
                    <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] bg-aged-gold text-accent-on-fill text-[10px] font-mono font-bold rounded-full flex items-center justify-center px-1">
                      {totalItems}
                    </span>
                  )}
                </button>
              </div>
            </div>

            <div
              id="header-search-panel"
              className="overflow-hidden border-t border-border"
              style={{
                maxHeight: searchOpen ? 52 : 0,
                opacity: searchOpen ? 1 : 0,
                transition: reduceMotion ? 'none' : 'max-height 550ms var(--ease-luxury), opacity 400ms var(--ease-luxury)',
              }}
              hidden={!searchOpen}
            >
              <form onSubmit={onSearchSubmit} className="py-3 flex gap-2">
                <label htmlFor="header-search-input" className="sr-only">
                  Search fragrances
                </label>
                <input
                  id="header-search-input"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search extraits, attars, oud notes…"
                  className="flex-1 bg-surface-muted border border-border rounded-sm px-4 py-2 text-sm text-espresso placeholder:text-muted/80 focus:outline-none focus:border-antique-gold transition-colors duration-[400ms]"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="shrink-0 px-5 py-2 text-xs uppercase tracking-[0.18em] font-medium bg-aged-gold text-accent-on-fill hover:opacity-90 transition-opacity duration-[400ms]"
                >
                  Search
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