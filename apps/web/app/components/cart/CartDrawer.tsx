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

  const freeShippingThreshold = 2000;
  const isFreeShipping = subtotal >= freeShippingThreshold;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-8">
        <div className="w-screen max-w-md bg-[#0e0e0e] text-[#f2efe9] border-l border-white/10 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-[0.28em] font-sans font-bold logo-gold-gradient block mb-1">
                OUD NOMAD DUBAI
              </span>
              <h2 className="text-xl font-serif text-white">
                Your Shopping Bag <span className="text-xs font-mono text-white/50">({totalItems})</span>
              </h2>
            </div>
            <button
              onClick={closeDrawer}
              className="p-2 text-white/60 hover:text-white transition-colors text-lg"
              aria-label="Close cart"
            >
              ✕
            </button>
          </div>

          {/* Free Shipping Announcement */}
          <div className="bg-[#141414] p-3.5 border-b border-white/10 text-xs text-center font-mono">
            {isFreeShipping ? (
              <span className="text-[#53ff73] flex items-center justify-center gap-1.5 font-medium">
                ✓ You have unlocked FREE Express Delivery!
              </span>
            ) : (
              <span className="text-white/70">
                Free Express Delivery on all perfume orders across GCC countries.
              </span>
            )}
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
            {items.length === 0 ? (
              <div className="py-16 text-center space-y-5">
                <div className="w-16 h-16 mx-auto bg-white/5 border border-[#ffb91d]/30 rounded-full flex items-center justify-center text-2xl text-[#ffb91d]">
                  🏺
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-lg text-white">Your Cart is Currently Empty</h3>
                  <p className="text-xs text-white/50 max-w-xs mx-auto leading-relaxed">
                    Explore our luxury perfumes, concentrated attars, and sacred bakhoor sets.
                  </p>
                </div>

                <div className="pt-4">
                  <Link
                    href="/collections"
                    onClick={closeDrawer}
                    className="inline-block px-6 py-2.5 bg-[#d89528] hover:bg-[#ffb91d] text-black text-xs uppercase tracking-widest font-semibold transition-all shadow-md"
                  >
                    Start Shopping
                  </Link>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-white/10">
                {items.map((item) => (
                  <div key={item.variantId} className="py-4 first:pt-0 last:pb-0 flex gap-4 items-start">
                    {/* Item Image */}
                    <div className="relative w-20 aspect-[3/4] bg-[#141414] border border-white/10 flex-shrink-0 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover object-center"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 space-y-1 min-w-0">
                      <Link
                        href={`/products/${item.slug}`}
                        onClick={closeDrawer}
                        className="font-serif text-sm text-white hover:text-[#ffb91d] transition-colors block truncate"
                      >
                        {item.name}
                      </Link>
                      <p className="text-[11px] text-white/50 font-mono">{item.size || '100ml'}</p>
                      <p className="text-xs font-mono text-[#ffb91d] font-medium pt-0.5">
                        {formatPrice(item.price)}
                      </p>

                      {/* Quantity & Remove */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center border border-white/20 bg-[#141414] h-8">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="px-2.5 h-full text-white/60 hover:text-white font-mono text-xs"
                          >
                            -
                          </button>
                          <span className="px-2 font-mono text-xs text-white">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            className="px-2.5 h-full text-white/60 hover:text-white font-mono text-xs"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.variantId)}
                          className="text-[11px] text-white/40 hover:text-red-400 transition-colors uppercase font-mono"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Subtotal & Actions */}
          {items.length > 0 && (
            <div className="p-5 sm:p-6 border-t border-white/10 bg-[#121212] space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70">Subtotal</span>
                  <span className="font-mono text-lg font-medium text-[#ffb91d]">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <p className="text-[10px] text-white/50 font-sans">
                  Taxes and shipping calculated at checkout.
                </p>
              </div>

              <div className="space-y-2">
                <Link
                  href="/checkout"
                  onClick={closeDrawer}
                  className="w-full py-3.5 bg-[#d89528] hover:bg-[#ffb91d] text-black text-xs font-semibold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-xl active:scale-98"
                >
                  <span>Proceed to Checkout</span>
                </Link>

                <Link
                  href="/cart"
                  onClick={closeDrawer}
                  className="w-full py-2.5 border border-white/20 hover:border-white/40 text-white/80 hover:text-white text-[11px] font-medium uppercase tracking-[0.16em] transition-all flex items-center justify-center"
                >
                  View Full Cart Page
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
