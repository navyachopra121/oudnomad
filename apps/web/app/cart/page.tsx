'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SiteHeader from '../components/header/SiteHeader';
import Container from '../components/Container';
import { useCart } from '../components/cart/CartContext';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, subtotal, totalItems } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [selectedSample, setSelectedSample] = useState('Mysore Sandalwood Oil (1ml)');

  const freeShippingThreshold = 250;
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 25;
  const discountAmount = (subtotal * promoDiscount) / 100;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'GOLD10' || promoCode.trim().toUpperCase() === 'NOMAD') {
      setPromoDiscount(10);
      setPromoApplied(true);
    } else {
      alert('Invalid promotional code. Try using GOLD10 for 10% off.');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-serif">
      <SiteHeader />

      <main className="flex-1 w-full py-6 sm:py-2">
        <Container className="space-y-12">
          {/* Breadcrumb Navigation */}
          <nav className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.14em] sm:tracking-[0.2em] text-muted flex flex-wrap items-center gap-1.5 sm:gap-2 leading-relaxed py-1">
            <Link href="/" className="hover:text-espresso transition-colors shrink-0">Home</Link>
            <span className="opacity-50">/</span>
            <span className="text-antique-gold font-medium shrink-0">Cart Review</span>
          </nav>

          {/* Page Header */}
          <div className="border-b border-border pb-6 space-y-2">
            <p className="text-[11px] font-sans tracking-[0.28em] uppercase text-antique-gold font-medium">
              Flacon Vault Review
            </p>
            <h1 className="font-display text-3xl sm:text-5xl font-normal text-espresso tracking-tight">
              Your Selected Creations <span className="text-lg font-mono text-muted">({totalItems})</span>
            </h1>
          </div>

          {items.length === 0 ? (
            <div className="py-24 text-center font-sans space-y-6 border border-border bg-surface-muted/30 p-12 max-w-xl mx-auto">
              <div className="text-4xl text-antique-gold/50">🏺</div>
              <h2 className="font-display text-2xl text-espresso">Your Flacon Vault is currently empty</h2>
              <p className="text-xs text-muted leading-relaxed">
                Discover our artisanal collections to add wild Cambodian agarwood oils, pure attars, and fine extraits to your vault.
              </p>
              <Link
                href="/collections"
                className="inline-block px-8 py-3 bg-aged-gold text-accent-on-fill text-xs uppercase tracking-[0.22em] font-medium transition-colors shadow-sm"
              >
                Explore Olfactory Archives
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start font-sans">
              {/* Left Column — Items List */}
              <div className="lg:col-span-8 space-y-8">
                <div className="border border-border bg-surface-muted/30 divide-y divide-border">
                  {items.map((item) => (
                    <div key={item.variantId} className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className="relative w-20 aspect-[4/5] bg-surface-muted border border-border flex-shrink-0 overflow-hidden">
                          <Image src={item.image} alt={item.name} fill className="object-cover object-center" />
                        </div>

                        <div className="space-y-1">
                          <Link
                            href={`/products/${item.slug}`}
                            className="font-display text-lg text-espresso hover:text-antique-gold transition-colors block"
                          >
                            {item.name}
                          </Link>
                          <p className="text-xs text-muted font-sans">{item.size}</p>
                          <p className="text-xs font-mono text-antique-gold font-medium sm:hidden">
                            ${item.price} USD each
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-border/60">
                        {/* Quantity controls */}
                        <div className="flex items-center border border-border bg-ivory">
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="px-3 py-1.5 text-muted hover:text-espresso font-mono text-xs"
                          >
                            -
                          </button>
                          <span className="px-3 text-xs font-mono font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            className="px-3 py-1.5 text-muted hover:text-espresso font-mono text-xs"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right min-w-[90px]">
                          <span className="font-serif text-base text-espresso font-medium block">
                            ${item.price * item.quantity} USD
                          </span>
                          <button
                            onClick={() => removeItem(item.variantId)}
                            className="text-[10px] text-muted hover:text-brick-oxblood uppercase tracking-wider transition-colors mt-0.5"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Complimentary Sample Selector */}
                <div className="p-6 border border-border bg-surface-muted/40 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-display text-base text-espresso">Complimentary Artisanal Sample</span>
                    <span className="text-[10px] uppercase tracking-widest text-antique-gold font-medium">Included with Order</span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    Select a 1ml pure oil vial to accompany your order in an velvet pouch:
                  </p>
                  <select
                    value={selectedSample}
                    onChange={(e) => setSelectedSample(e.target.value)}
                    className="w-full bg-ivory border border-border px-3 py-2 text-xs text-espresso outline-none focus:border-antique-gold"
                  >
                    <option value="Mysore Sandalwood Oil (1ml)">Mysore Vintage Sandalwood Oil (1ml)</option>
                    <option value="Taif Rose Attar (1ml)">Royal Taif Rose Pure Attar (1ml)</option>
                    <option value="Cambodian Oud Reserve (1ml)">Wild Cambodian Agarwood Extract (1ml)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Link href="/collections" className="text-xs uppercase tracking-[0.2em] text-antique-gold hover:underline">
                    ← Continue Browsing Archives
                  </Link>
                  <button
                    onClick={clearCart}
                    className="text-xs text-muted hover:text-brick-oxblood uppercase tracking-wider"
                  >
                    Clear Vault Cart
                  </button>
                </div>
              </div>

              {/* Right Column — Summary Card */}
              <div className="lg:col-span-4 space-y-6">
                <div className="p-6 border border-border bg-surface-muted/50 space-y-6">
                  <h3 className="font-display text-xl text-espresso border-b border-border pb-4">
                    Order Summary
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between text-muted">
                      <span>Subtotal ({totalItems} items)</span>
                      <span className="font-mono text-espresso">${subtotal} USD</span>
                    </div>

                    {promoApplied && (
                      <div className="flex justify-between text-deep-emerald font-medium">
                        <span>Promotional Discount (10%)</span>
                        <span className="font-mono">-${discountAmount.toFixed(2)} USD</span>
                      </div>
                    )}

                    <div className="flex justify-between text-muted">
                      <span>Worldwide Express Shipping</span>
                      <span className="font-mono text-espresso">
                        {shippingFee === 0 ? <strong className="text-deep-emerald">FREE</strong> : `$${shippingFee} USD`}
                      </span>
                    </div>

                    {subtotal < freeShippingThreshold && (
                      <p className="text-[10px] text-antique-gold pt-1">
                        Add ${(freeShippingThreshold - subtotal).toFixed(2)} USD more for free courier shipping.
                      </p>
                    )}

                    <div className="pt-4 border-t border-border flex justify-between items-baseline text-sm">
                      <span className="font-serif text-base text-espresso font-medium">Total Amount</span>
                      <span className="font-serif text-2xl text-antique-gold font-normal">${finalTotal.toFixed(2)} USD</span>
                    </div>
                  </div>

                  {/* Promo Code Form */}
                  <form onSubmit={handleApplyPromo} className="pt-4 border-t border-border space-y-2">
                    <label className="block text-[10px] uppercase tracking-widest text-muted font-semibold">
                      Promotional Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="e.g. GOLD10"
                        className="flex-1 bg-ivory border border-border px-3 py-2 text-xs text-espresso outline-none uppercase placeholder:normal-case"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 border border-antique-gold text-antique-gold hover:bg-aged-gold hover:text-accent-on-fill text-xs uppercase tracking-wider transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {promoApplied && (
                      <p className="text-[10px] text-deep-emerald">✓ Code GOLD10 applied (10% off).</p>
                    )}
                  </form>

                  {/* Checkout Action */}
                  <Link
                    href="/checkout"
                    className="w-full py-4 bg-aged-gold hover:bg-antique-gold text-accent-on-fill text-xs uppercase tracking-[0.24em] font-medium text-center block transition-all shadow-md"
                  >
                    Proceed to Checkout →
                  </Link>

                  <div className="pt-4 border-t border-border/60 text-[10px] text-muted space-y-2">
                    <div className="flex items-center gap-2">
                      <span>🔒</span>
                      <span>Encrypted SSL 256-Bit Checkout</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>✈</span>
                      <span>Complimentary Insulated Wooden Vault Box</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Container>
      </main>
    </div>
  );
}
