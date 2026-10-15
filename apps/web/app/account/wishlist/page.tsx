'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import SiteHeader from '../../components/header/SiteHeader';
import Container from '../../components/Container';
import { StoreApi } from '../../store-api';
import { useAuth } from '../../components/auth/AuthContext';

export default function WishlistPage() {
  const { isAuthenticated, openAuthModal } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const localWishlist = JSON.parse(localStorage.getItem('oudnomad_wishlist') || '[]');
      let remoteWishlist: any[] = [];
      try {
        const data = await StoreApi.getWishlist();
        remoteWishlist = data.items || [];
      } catch (_) {}

      const merged = [...localWishlist];
      for (const r of remoteWishlist) {
        if (!merged.some((m) => (m.productId || m.id) === (r.productId || r.id))) {
          merged.push(r);
        }
      }
      setItems(merged);
    } catch (err) {
      console.error('Failed to fetch wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (productId: string) => {
    const updated = items.filter((item) => (item.productId || item.id) !== productId);
    setItems(updated);
    try {
      localStorage.setItem('oudnomad_wishlist', JSON.stringify(updated));
    } catch (_) {}
    try {
      await StoreApi.removeFromWishlist(productId);
    } catch (_) {}
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-serif">
      <SiteHeader />

      <main className="flex-1 w-full py-8 sm:py-12">
        <Container className="space-y-10">
          {/* Breadcrumbs */}
          <nav className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.14em] sm:tracking-[0.2em] text-muted flex flex-wrap items-center gap-1.5 sm:gap-2 leading-relaxed py-1">
            <Link href="/" className="hover:text-espresso transition-colors shrink-0">Home</Link>
            <span className="opacity-50">/</span>
            <Link href="/account" className="hover:text-espresso transition-colors shrink-0">Account</Link>
            <span className="opacity-50">/</span>
            <span className="text-antique-gold font-medium shrink-0">Saved Wishlist</span>
          </nav>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
            <div>
              <span className="text-[10px] font-sans tracking-[0.28em] uppercase text-antique-gold font-medium">
                Personal Archive
              </span>
              <h1 className="font-display text-3xl sm:text-4xl text-espresso tracking-tight">Saved Wishlist</h1>
            </div>

            <button
              onClick={fetchWishlist}
              className="px-4 py-2 border border-border text-xs uppercase tracking-wider font-sans text-muted hover:text-espresso hover:border-antique-gold transition-colors"
            >
              🔄 Refresh List
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center border border-border bg-surface-muted/30 font-sans text-xs text-muted">
              Retrieving saved flacons...
            </div>
          ) : items.length === 0 ? (
            <div className="p-12 sm:p-16 text-center border border-border bg-surface-muted/20 space-y-4 font-sans">
              <div className="text-4xl text-antique-gold opacity-80">🤍</div>
              <h3 className="font-display text-2xl text-espresso">Your Wishlist is Empty</h3>
              <p className="text-xs text-muted max-w-md mx-auto leading-relaxed">
                You haven&apos;t saved any artisanal fragrances or pure agarwood extraits yet. Click the heart icon on any product page to curate your personal reserve.
              </p>
              <div className="pt-2">
                <Link
                  href="/collections"
                  className="inline-block px-7 py-3 bg-antique-gold text-white text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#c99516] transition-colors"
                >
                  Explore Fragrances →
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 font-sans">
              {items.map((item) => {
                const prod = item.product || item;
                const price = prod?.price || prod?.variants?.[0]?.price || 0;
                const id = item.productId || item.id || prod.id;
                return (
                  <div
                    key={id}
                    className="p-5 border border-border bg-surface-muted/40 hover:border-antique-gold/50 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <span className="text-[10px] text-muted uppercase tracking-wider">
                          Reserved Flacon
                        </span>
                        <button
                          onClick={() => handleRemove(id)}
                          className="text-xs text-muted hover:text-brick-oxblood"
                          title="Remove item"
                        >
                          ✕
                        </button>
                      </div>

                      <h3 className="font-serif text-base text-espresso mb-1">
                        {prod?.name || 'Artisanal Flacon'}
                      </h3>
                      <p className="text-xs text-muted line-clamp-2 mb-4">
                        {prod?.description || ''}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-border flex items-center justify-between">
                      <span className="font-serif text-base text-antique-gold font-medium">
                        AED {Number(price).toLocaleString()}
                      </span>
                      <Link
                        href={`/products/${prod.slug || id}`}
                        className="text-xs uppercase tracking-wider text-espresso hover:text-antique-gold font-medium"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Container>
      </main>
    </div>
  );
}
