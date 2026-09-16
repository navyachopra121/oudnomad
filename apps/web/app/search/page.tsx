'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '../components/Header';
import { StoreApi } from '../store-api';
import Link from 'next/link';

function SearchContent() {
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

  const handleWishlistToggle = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await StoreApi.addToWishlist(productId);
      alert('Item added to wishlist!');
    } catch (err: any) {
      alert(`Wishlist action: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-100 tracking-tight">Search Catalog</h1>
          <p className="text-sm text-stone-400 mt-1">
            Discover exquisite perfumes, rare ouds, and signature fragrances.
          </p>
        </div>

        {/* Filter bar */}
        <form
          onSubmit={handleFilterSubmit}
          className="bg-stone-900 border border-stone-800 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end"
        >
          <div>
            <label className="block text-xs font-semibold text-stone-400 mb-1.5 uppercase tracking-wider">
              Keyword
            </label>
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Product name..."
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-400 mb-1.5 uppercase tracking-wider">
              Category
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Perfumes"
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-400 mb-1.5 uppercase tracking-wider">
              Price Range ($)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-500"
              />
              <span className="text-stone-600">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-400 mb-1.5 uppercase tracking-wider">
              Min Rating
            </label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-500"
            >
              <option value="">Any Rating</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
              <option value="2">2+ Stars</option>
            </select>
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold py-2 px-4 rounded-xl text-sm transition-all shadow-md"
            >
              Apply Filters
            </button>
          </div>
        </form>

        {/* Results */}
        {loading ? (
          <div className="text-center py-16 text-stone-500">Searching products...</div>
        ) : error ? (
          <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm">
            {error}
          </div>
        ) : results && results.items ? (
          <div>
            <div className="text-sm text-stone-400 mb-4">
              Found <span className="text-stone-100 font-semibold">{results.total}</span> products
            </div>

            {results.items.length === 0 ? (
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-12 text-center text-stone-400">
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="text-lg font-semibold text-stone-200">No products found</h3>
                <p className="text-sm text-stone-500 mt-1">Try adjusting your query or price filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {results.items.map((prod: any) => (
                  <div
                    key={prod.productId}
                    className="bg-stone-900 border border-stone-800 hover:border-amber-500/40 rounded-2xl p-5 flex flex-col justify-between group transition-all"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <span className="px-2.5 py-0.5 bg-stone-800 text-stone-400 rounded-md text-[11px] font-semibold">
                          {prod.category}
                        </span>
                        <button
                          onClick={(e) => handleWishlistToggle(prod.productId, e)}
                          title="Add to Wishlist"
                          className="text-stone-500 hover:text-red-400 transition-colors text-lg"
                        >
                          ❤️
                        </button>
                      </div>

                      <h3 className="font-semibold text-stone-100 group-hover:text-amber-400 transition-colors text-base mb-1">
                        {prod.name}
                      </h3>
                      <p className="text-xs text-stone-400 line-clamp-2 mb-4">
                        {prod.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-stone-800 flex items-center justify-between">
                      <div>
                        <div className="text-xs text-stone-500 flex items-center gap-1">
                          <span className="text-amber-400">★</span>
                          <span>{prod.avgRating ? prod.avgRating.toFixed(1) : '0.0'}</span>
                          <span>({prod.reviewCount || 0})</span>
                        </div>
                        <div className="text-base font-bold text-amber-300">
                          ${((prod.priceMinor || 0) / 100).toFixed(2)}
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium rounded-full">
                        In Stock
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-stone-950 text-stone-400 flex items-center justify-center">Loading search page...</div>}>
      <SearchContent />
    </Suspense>
  );
}
