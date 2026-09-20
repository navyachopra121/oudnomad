'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import SiteHeader from '../components/header/SiteHeader';
import Container from '../components/Container';
import { StoreApi } from '../store-api';
import { useCurrency } from '../components/concierge/CurrencyContext';

function SearchContent() {
  const { formatPrice } = useCurrency();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || '';

  const [q, setQ] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [minRating, setMinRating] = useState<string>('');

  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await StoreApi.search({
        q,
        category: category || undefined,
        minPrice: minPrice ? Number(minPrice) * 100 : undefined,
        maxPrice: maxPrice ? Number(maxPrice) * 100 : undefined,
        minRating: minRating ? Number(minRating) : undefined,
      });
      setResults(data);
    } catch (err: any) {
      setError(err.message || 'Failed to perform search');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [searchParams]);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchResults();
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-serif">
      <SiteHeader />

      <main className="flex-1 w-full py-6 sm:py-2">
        <Container className="space-y-10">
          <div className="space-y-2">
            <span className="text-[11px] font-sans tracking-[0.28em] uppercase text-antique-gold font-medium">
              Catalog Search
            </span>
            <h1 className="font-display text-3xl sm:text-4xl text-espresso tracking-tight">
              Search Archives
            </h1>
            <p className="text-xs sm:text-sm text-muted font-sans">
              Discover bespoke perfumes, rare wild agarwood extraits, and signature attar oils.
            </p>
          </div>

          {/* Sticky Filter Bar */}
          <form
            onSubmit={handleFilterSubmit}
            className="sticky top-[64px] lg:top-[80px] z-40 bg-ivory/95 backdrop-blur-md shadow-sm border border-border p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end font-sans text-xs transition-all duration-300"
          >
            <div>
              <label className="block text-[10px] font-semibold text-muted mb-1.5 uppercase tracking-wider">
                Keyword
              </label>
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Product name..."
                className="w-full bg-ivory border border-border px-3 py-2 text-espresso outline-none focus:border-antique-gold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-muted mb-1.5 uppercase tracking-wider">
                Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. attars, oud"
                className="w-full bg-ivory border border-border px-3 py-2 text-espresso outline-none focus:border-antique-gold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-muted mb-1.5 uppercase tracking-wider">
                Price ($)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full bg-ivory border border-border px-3 py-2 text-espresso outline-none focus:border-antique-gold"
                />
                <span className="text-muted">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full bg-ivory border border-border px-3 py-2 text-espresso outline-none focus:border-antique-gold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-muted mb-1.5 uppercase tracking-wider">
                Rating
              </label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                className="w-full bg-ivory border border-border px-3 py-2 text-espresso outline-none focus:border-antique-gold"
              >
                <option value="">Any Rating</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
              </select>
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-aged-gold hover:bg-antique-gold text-accent-on-fill font-medium py-2.5 px-4 text-xs uppercase tracking-[0.2em] transition-all shadow-sm"
              >
                Apply Filters
              </button>
            </div>
          </form>

          {/* Results */}
          {loading ? (
            <div className="text-center py-16 text-muted text-xs uppercase tracking-[0.22em] font-sans">
              Searching archives...
            </div>
          ) : error ? (
            <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-700 text-xs font-sans">
              {error}
            </div>
          ) : results && results.items ? (
            <div className="space-y-6 font-sans">
              <div className="text-xs text-muted">
                Found <span className="text-espresso font-semibold">{results.total}</span> products
              </div>

              {results.items.length === 0 ? (
                <div className="bg-surface-muted/30 border border-border p-12 text-center text-muted">
                  <h3 className="font-display text-lg text-espresso mb-1">No products found</h3>
                  <p className="text-xs">Try adjusting your query or price filters.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {results.items.map((prod: any) => (
                    <article
                      key={prod.productId}
                      className="group bg-surface-muted/40 border border-border hover:border-antique-gold/50 p-4 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <Link href={`/products/${prod.slug}`} className="block aspect-[4/5] bg-background border border-border mb-4 relative overflow-hidden">
                          <Image
                            src={prod.images?.[0] || `https://picsum.photos/seed/${prod.slug || prod.productId}/600/800`}
                            alt={prod.name}
                            fill
                            className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                          />
                        </Link>
                        <span className="text-[10px] uppercase tracking-widest text-muted">{prod.category}</span>
                        <Link href={`/products/${prod.slug}`}>
                          <h3 className="font-display text-base text-espresso group-hover:text-antique-gold transition-colors mt-0.5 mb-1">
                            {prod.name}
                          </h3>
                        </Link>
                        <p className="text-xs text-muted line-clamp-2 leading-relaxed mb-4">{prod.description}</p>
                      </div>

                      <div className="pt-3 border-t border-border flex items-center justify-between">
                        <span className="text-sm font-mono font-medium text-antique-gold">
                          {formatPrice((prod.priceMinor || 0) / 100)}
                        </span>
                        <Link
                          href={`/products/${prod.slug}`}
                          className="px-3 py-1.5 border border-antique-gold/60 text-antique-gold hover:bg-aged-gold hover:text-accent-on-fill text-[10px] uppercase tracking-[0.18em] transition-all"
                        >
                          Inspect
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </Container>
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background text-muted flex items-center justify-center font-sans text-xs">Loading search page...</div>}>
      <SearchContent />
    </Suspense>
  );
}
