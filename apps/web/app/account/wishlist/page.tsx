'use client';

import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { StoreApi } from '../../store-api';
import Link from 'next/link';

export default function WishlistPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWishlist = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await StoreApi.getWishlist();
      setItems(data.items || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch wishlist. Please ensure you are logged in.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (productId: string) => {
    try {
      await StoreApi.removeFromWishlist(productId);
      setItems((prev) => prev.filter((item) => item.productId !== productId));
    } catch (err: any) {
      alert(`Failed to remove item: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-stone-100 tracking-tight">Your Wishlist</h1>
            <p className="text-sm text-stone-400 mt-1">
              Saved fragrances and luxury scents for future purchases.
            </p>
          </div>
          <button
            onClick={fetchWishlist}
            className="px-4 py-2 bg-stone-900 border border-stone-800 hover:bg-stone-800 text-stone-300 rounded-xl text-sm transition-all"
          >
            🔄 Refresh
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-16 text-stone-500">Loading your wishlist...</div>
        ) : items.length === 0 ? (
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-12 text-center text-stone-400">
            <div className="text-4xl mb-3">🖤</div>
            <h3 className="text-lg font-semibold text-stone-200">Your wishlist is empty</h3>
            <p className="text-sm text-stone-500 mt-1 mb-6">
              Explore our catalog and click the heart icon to save products.
            </p>
            <Link
              href="/search"
              className="inline-block bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold px-6 py-2.5 rounded-xl text-sm transition-all"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => {
              const prod = item.product;
              const minPrice = prod?.variants?.[0]?.price || 0;
              return (
                <div
                  key={item.id}
                  className="bg-stone-900 border border-stone-800 hover:border-amber-500/40 rounded-2xl p-5 flex flex-col justify-between group transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className="text-xs text-stone-500">
                        Added {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => handleRemove(item.productId)}
                        title="Remove from Wishlist"
                        className="text-stone-400 hover:text-red-400 transition-colors text-sm px-2 py-1 bg-stone-800 rounded-md"
                      >
                        ✕ Remove
                      </button>
                    </div>

                    <h3 className="font-semibold text-stone-100 group-hover:text-amber-400 transition-colors text-base mb-1">
                      {prod?.name || 'Product'}
                    </h3>
                    <p className="text-xs text-stone-400 line-clamp-2 mb-4">
                      {prod?.description || ''}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-stone-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-stone-500 flex items-center gap-1">
                        <span className="text-amber-400">★</span>
                        <span>{prod?.avgRating ? prod.avgRating.toFixed(1) : '0.0'}</span>
                        <span>({prod?.reviewCount || 0})</span>
                      </div>
                      <div className="text-base font-bold text-amber-300">
                        ${Number(minPrice).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
