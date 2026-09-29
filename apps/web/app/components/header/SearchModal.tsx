'use client';

import React, { useState, useEffect, useRef, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { searchProducts, OUD_PRODUCTS, OudProduct } from '../../lib/products-data';
import { IconSearch } from './icons';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Popular keywords for suggestions matching
const KEYWORDS_DICTIONARY = [
  'white',
  'bakhoor',
  'pure oud',
  'attar',
  'rose',
  'amber',
  'musk',
  'royal',
  'jasmine',
  'taif',
  'sandalwood',
  'patchouli',
  'oudh',
  'flacon',
  'oriental',
];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [matchingProducts, setMatchingProducts] = useState<OudProduct[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Body scroll lock & focus
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setMatchingProducts([]);
      setSuggestions([]);
    }
  }, [isOpen]);

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Search logic on query change
  useEffect(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      setMatchingProducts([]);
      setSuggestions([]);
      return;
    }

    // 1. Matching products
    const prods = searchProducts(trimmed);
    setMatchingProducts(prods.slice(0, 6));

    // 2. Suggestions
    // If user types 'oud', prioritize 'white' and 'bakhoor' exactly as shown in reference screenshot
    let matchedKeywords: string[] = [];
    if (trimmed === 'oud' || trimmed === 'ou') {
      matchedKeywords = ['white', 'bakhoor'];
    } else {
      matchedKeywords = KEYWORDS_DICTIONARY.filter(
        (kw) => kw.includes(trimmed) || trimmed.includes(kw)
      );

      // If few keywords match, also extract matching words from product titles
      if (matchedKeywords.length < 2) {
        prods.forEach((p) => {
          const words = p.title.toLowerCase().split(/\s+/);
          words.forEach((w) => {
            const cleanWord = w.replace(/[^a-z0-9]/g, '');
            if (
              cleanWord.length > 3 &&
              cleanWord !== trimmed &&
              cleanWord.includes(trimmed) &&
              !matchedKeywords.includes(cleanWord)
            ) {
              matchedKeywords.push(cleanWord);
            }
          });
        });
      }
    }

    setSuggestions(matchedKeywords.slice(0, 5));
  }, [query]);

  if (!isOpen) return null;

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    } else {
      router.push('/search');
    }
    onClose();
  };

  const handleSuggestionClick = (sug: string) => {
    setQuery(sug);
    inputRef.current?.focus();
  };

  const handleViewAllResults = () => {
    const q = query.trim();
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    } else {
      router.push('/collections');
    }
    onClose();
  };

  const hasQuery = query.trim().length > 0;
  const hasResults = matchingProducts.length > 0 || suggestions.length > 0;

  return (
    <div
      className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-md overflow-y-auto transition-opacity duration-300 flex flex-col items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Search Fragrances"
    >
      {/* ── Main Container ── */}
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-16 flex flex-col">
        {/* ── Top Bar: White Search Input + Close Button ── */}
        <div className="flex items-center gap-3 sm:gap-4 w-full">
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <div className="flex items-center bg-white border border-stone-200 shadow-xl h-11 sm:h-12 px-3 sm:px-4">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="w-full bg-transparent text-sm sm:text-base font-sans focus:outline-none placeholder:text-stone-400 font-normal"
                style={{ color: '#000000' }}
                autoComplete="off"
                spellCheck="false"
              />
              <button
                type="submit"
                className="p-1.5 text-stone-700 hover:text-black transition-colors"
                aria-label="Submit search"
              >
                <IconSearch className="w-5 h-5 text-stone-800" />
              </button>
            </div>
          </form>

          {/* Close Button (✕) */}
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors p-2 text-2xl font-light leading-none shrink-0"
            aria-label="Close search overlay"
          >
            ✕
          </button>
        </div>

        {/* ── Dynamic Content Area ── */}
        {hasQuery && (
          <div className="mt-8 sm:mt-10 animate-fadeIn">
            {hasResults ? (
              <>
                {/* ── Two Columns: SUGGESTIONS | PRODUCTS ── */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
                  {/* Left Column: SUGGESTIONS (md:col-span-4) */}
                  <div className="md:col-span-4">
                    <div className="border-b border-white/20 pb-2 mb-4">
                      <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-[#DA9630]">
                        SUGGESTIONS
                      </h3>
                    </div>
                    {suggestions.length > 0 ? (
                      <ul className="space-y-4">
                        {suggestions.map((sug) => (
                          <li key={sug}>
                            <button
                              type="button"
                              onClick={() => handleSuggestionClick(sug)}
                              className="text-left font-bold text-sm sm:text-base text-[#DA9630] hover:text-[#EACD4D] transition-colors cursor-pointer"
                            >
                              {sug}
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-white/40 italic">No specific keyword suggestions</p>
                    )}
                  </div>

                  {/* Right Column: PRODUCTS (md:col-span-8) */}
                  <div className="md:col-span-8">
                    <div className="border-b border-white/20 pb-2 mb-4">
                      <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-[#DA9630]">
                        PRODUCTS
                      </h3>
                    </div>
                    <div className="space-y-4">
                      {matchingProducts.map((product) => (
                        <Link
                          key={product.id || product.handle}
                          href={`/products/${product.handle}`}
                          onClick={onClose}
                          className="flex items-center gap-4 p-2 -mx-2 rounded hover:bg-white/[0.04] transition-all group"
                        >
                          {/* Product Thumbnail */}
                          <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 bg-[#121212] border border-white/10 overflow-hidden relative">
                            <img
                              src={product.images?.[0] || 'https://cdn.shopify.com/s/files/1/0812/5077/9453/files/Jannat-e-zuhur-1.jpg?v=1692390618'}
                              alt={product.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          {/* Product Name in Gold */}
                          <div className="flex flex-col justify-center min-w-0">
                            <h4 className="text-sm sm:text-base font-medium text-[#DA9630] group-hover:text-[#EACD4D] transition-colors line-clamp-1">
                              {product.title}
                            </h4>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── Bottom Button: Show all results for "query" → ── */}
                <div className="mt-8 sm:mt-10">
                  <button
                    type="button"
                    onClick={handleViewAllResults}
                    className="w-full border border-white/30 hover:border-[#DA9630] bg-transparent hover:bg-white/[0.03] text-[#DA9630] hover:text-[#EACD4D] py-3.5 px-6 text-xs sm:text-sm font-semibold tracking-wider transition-all duration-300 flex items-center justify-center gap-2 group"
                  >
                    <span>Show all results for &ldquo;{query}&rdquo;</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </>
            ) : (
              /* ── NOT FOUND STATE: When no products or text match ── */
              <div className="py-12 px-4 text-center max-w-xl mx-auto flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border border-[#DA9630]/30 flex items-center justify-center mb-4 text-[#DA9630]">
                  <IconSearch className="w-6 h-6" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold uppercase tracking-[0.2em] text-[#DA9630] mb-2">
                  No Results Found for &ldquo;{query}&rdquo;
                </h3>
                <p className="text-xs sm:text-sm text-stone-400 leading-relaxed mb-6">
                  We couldn&apos;t find any fragrance matching your search. Please check your spelling or explore our popular categories below:
                </p>

                {/* Popular Suggestion Pills */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                  {['Oud', 'Bakhoor', 'Attars', 'Rose', 'Amber', 'Musk', 'Pure Oud'].map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => handleSuggestionClick(term)}
                      className="px-3.5 py-1.5 text-xs font-semibold tracking-wider border border-white/15 bg-white/5 hover:border-[#DA9630] text-[#DA9630] hover:text-[#EACD4D] transition-colors rounded-none"
                    >
                      {term}
                    </button>
                  ))}
                </div>

                <Link
                  href="/collections"
                  onClick={onClose}
                  className="px-6 py-2.5 border border-[#DA9630] text-[#DA9630] hover:bg-[#DA9630] hover:text-black uppercase text-xs font-bold tracking-[0.2em] transition-all"
                >
                  View All Collections →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
