'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from './CartContext';
import { useCurrency } from '../concierge/CurrencyContext';

export default function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, updateQuantity, removeItem, subtotal, totalItems } = useCart();
  const { formatPrice } = useCurrency();

  useEffect(() => {
    if (!isDrawerOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  if (!isDrawerOpen) return null;

  const freeShippingThreshold = 250;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-serif">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-espresso/60 backdrop-blur-sm transition-opacity duration-500"
        onClick={closeDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-ivory text-espresso border-l border-border shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-border flex items-center justify-between font-sans">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-antique-gold font-medium block mb-0.5">
                Shopping Cart
              </span>
              <h2 className="font-display text-xl text-espresso">
                Flacon Vault <span className="text-xs font-mono text-muted font-normal">({totalItems})</span>
              </h2>
            </div>
            <button
              onClick={closeDrawer}
              className="p-2 text-muted hover:text-espresso transition-colors text-lg"
              aria-label="Close cart"
            >
              ✕
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="bg-surface-muted/60 p-4 border-b border-border font-sans text-xs space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              {remainingForFreeShipping > 0 ? (
                <span className="text-muted">
                  Add <strong className="text-antique-gold font-mono">{formatPrice(remainingForFreeShipping)}</strong> for complimentary courier delivery.
                </span>
              ) : (
                <span className="text-deep-emerald font-medium flex items-center gap-1">
                  ✓ Qualified for Complimentary Worldwide Shipping
                </span>
              )}
            </div>
            <div className="w-full bg-border h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-aged-gold h-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="py-14 text-center font-sans space-y-6">
                <div className="w-16 h-16 mx-auto bg-surface-muted border border-border rounded-full flex items-center justify-center text-2xl text-antique-gold">
                  🏺
                </div>
                <div className="space-y-1">
                  <h3 className="font-display text-xl text-espresso">Your Flacon Vault is Empty</h3>
                  <p className="text-xs text-muted max-w-xs mx-auto leading-relaxed">
                    Explore our curated extraits, aged wild oud oils, and botanical attars.
                  </p>
                </div>

                <div className="pt-2 space-y-2 max-w-xs mx-auto">
                  <span className="text-[10px] uppercase tracking-widest text-antique-gold font-semibold block">
                    Curated Selections
                  </span>
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/collections/oud"
                      onClick={closeDrawer}
                      className="p-2.5 bg-surface-muted hover:bg-aged-gold/15 border border-border hover:border-antique-gold text-xs text-espresso transition-colors text-left flex justify-between items-center"
                    >
                      <span>Royal Oud & Extraits</span>
                      <span className="text-antique-gold">→</span>
                    </Link>
                    <Link
                      href="/collections/attars"
                      onClick={closeDrawer}
                      className="p-2.5 bg-surface-muted hover:bg-aged-gold/15 border border-border hover:border-antique-gold text-xs text-espresso transition-colors text-left flex justify-between items-center"
                    >
                      <span>Pure Concentrated Attars</span>
                      <span className="text-antique-gold">→</span>
                    </Link>
                    <Link
                      href="/collections/bakhoor"
                      onClick={closeDrawer}
                      className="p-2.5 bg-surface-muted hover:bg-aged-gold/15 border border-border hover:border-antique-gold text-xs text-espresso transition-colors text-left flex justify-between items-center"
                    >
                      <span>Incense & Sacred Bakhoor</span>
                      <span className="text-antique-gold">→</span>
                    </Link>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/collections"
                    onClick={closeDrawer}
                    className="inline-block px-8 py-3 bg-aged-gold hover:bg-antique-gold text-accent-on-fill text-xs uppercase tracking-[0.2em] font-medium shadow-sm transition-colors"
                  >
                    View Full Catalog
                  </Link>
                </div>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.variantId} className="flex items-start gap-4 pb-6 border-b border-border/80 font-sans">
                  <div className="relative w-20 aspect-[4/5] bg-surface-muted border border-border flex-shrink-0 overflow-hidden">
                    <Image src={item.image} alt={item.name} fill className="object-cover object-center" />
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/products/${item.slug}`}
                        onClick={closeDrawer}
                        className="font-display text-base text-espresso hover:text-antique-gold transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeItem(item.variantId)}
                        className="text-muted hover:text-brick-oxblood text-xs transition-colors"
                        title="Remove item"
                      >
                        ✕
                      </button>
                    </div>

                    <p className="text-[11px] text-muted">{item.size}</p>

                    <div className="pt-2 flex items-center justify-between">
                      <div className="flex items-center border border-border bg-ivory">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="px-2.5 py-0.5 text-muted hover:text-espresso font-mono text-xs"
                        >
                          -
                        </button>
                        <span className="px-3 text-xs font-mono font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="px-2.5 py-0.5 text-muted hover:text-espresso font-mono text-xs"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-sm font-mono font-medium text-antique-gold">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary */}
          {items.length > 0 && (
            <div className="p-6 border-t border-border bg-surface-muted/40 font-sans space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted uppercase tracking-wider">Subtotal</span>
                <span className="font-serif text-lg text-espresso font-medium">{formatPrice(subtotal)}</span>
              </div>
              <p className="text-[10px] text-muted">Shipping and taxes calculated at checkout.</p>

              <div className="space-y-2">
                <Link
                  href="/cart"
                  onClick={closeDrawer}
                  className="w-full py-3 bg-aged-gold hover:bg-antique-gold text-accent-on-fill font-medium text-xs uppercase tracking-[0.22em] text-center block transition-colors shadow-sm"
                >
                  Review Cart & Checkout
                </Link>
                <button
                  onClick={closeDrawer}
                  className="w-full py-2.5 border border-border text-espresso hover:border-antique-gold text-[10px] uppercase tracking-[0.2em] font-medium text-center transition-colors"
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
