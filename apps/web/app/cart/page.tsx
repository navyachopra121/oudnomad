'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SiteHeader from '../components/header/SiteHeader';
import Container from '../components/Container';
import { useCart } from '../components/cart/CartContext';
import { useCurrency } from '../components/concierge/CurrencyContext';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, subtotal, totalItems } = useCart();
  const { formatPrice } = useCurrency();

  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [orderNote, setOrderNote] = useState('');

  const freeShippingThreshold = 2000;
  const shippingFee = 0; // Free express shipping
  const discountAmount = promoDiscount;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'PREPAID200' || code === 'GOLD10' || code === 'NOMAD') {
      setPromoDiscount(200);
      setPromoApplied(true);
    } else {
      alert('Invalid promotional code. Try using PREPAID200 for ₹200 off.');
    }
  };

  return (
    <div className="min-h-screen bg-[#070707] text-[#f2efe9] flex flex-col font-sans selection:bg-[#ffb91d] selection:text-black">
      <SiteHeader />

      <main className="flex-1 w-full pt-8 pb-20">
        <Container className="space-y-8">
          {/* Breadcrumb */}
          <nav className="text-[11px] font-sans uppercase tracking-[0.2em] text-white/50 flex items-center gap-2">
            <Link href="/" className="hover:text-[#ffb91d] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#ffb91d] font-medium">Shopping Bag</span>
          </nav>

          {/* Page Title */}
          <div className="border-b border-white/10 pb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <h1 className="text-3xl sm:text-4xl font-serif text-white tracking-wide">
              Your Flacon Bag <span className="text-sm font-mono text-white/40">({totalItems} items)</span>
            </h1>
            <Link
              href="/collections"
              className="text-xs uppercase tracking-widest text-[#ffb91d] hover:underline"
            >
              ← Continue Shopping
            </Link>
          </div>

          {items.length === 0 ? (
            <div className="py-24 text-center border border-white/10 bg-[#0e0e0e] p-12 max-w-xl mx-auto space-y-6">
              <div className="text-4xl text-[#ffb91d]">🏺</div>
              <h2 className="text-2xl font-serif text-white">Your Shopping Bag is Currently Empty</h2>
              <p className="text-xs text-white/60 leading-relaxed max-w-md mx-auto">
                Explore our artisanal catalog of luxury perfumes, concentrated attars, and gold brass bakhoor sets.
              </p>
              <Link
                href="/collections"
                className="inline-block px-8 py-3 bg-[#d89528] hover:bg-[#ffb91d] text-black text-xs uppercase tracking-[0.2em] font-semibold transition-all shadow-md"
              >
                Browse All Fragrances
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Column — Items List */}
              <div className="lg:col-span-8 space-y-6">
                <div className="border border-white/10 bg-[#0e0e0e] divide-y divide-white/10">
                  {items.map((item) => (
                    <div
                      key={item.variantId}
                      className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative w-20 aspect-[3/4] bg-[#141414] border border-white/10 flex-shrink-0 overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover object-center"
                          />
                        </div>

                        <div className="space-y-1">
                          <Link
                            href={`/products/${item.slug}`}
                            className="font-serif text-base sm:text-lg text-white hover:text-[#ffb91d] transition-colors block"
                          >
                            {item.name}
                          </Link>
                          <p className="text-xs text-white/50 font-mono">{item.size || '100ml'}</p>
                          <p className="text-xs font-mono text-[#ffb91d] font-medium sm:hidden">
                            {formatPrice(item.price)} each
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-white/10">
                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-white/20 bg-[#141414]">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="px-3 py-1.5 text-white/70 hover:text-white font-mono text-xs"
                          >
                            -
                          </button>
                          <span className="px-3 py-1.5 font-mono text-xs text-white">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            className="px-3 py-1.5 text-white/70 hover:text-white font-mono text-xs"
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right min-w-[100px] hidden sm:block">
                          <span className="text-sm font-mono text-[#ffb91d] font-medium block">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => removeItem(item.variantId)}
                          className="text-white/40 hover:text-red-400 text-xs font-mono transition-colors p-1"
                          title="Remove item"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Special Instructions Note */}
                <div className="border border-white/10 bg-[#0e0e0e] p-5 space-y-2">
                  <label className="block text-[11px] uppercase tracking-wider text-white/70 font-mono">
                    Special Instructions / Gift Message:
                  </label>
                  <textarea
                    rows={3}
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    placeholder="Enter bespoke gift packaging notes or delivery instructions..."
                    className="w-full bg-[#141414] border border-white/10 p-3 text-xs text-white outline-none focus:border-[#ffb91d] resize-none"
                  />
                </div>
              </div>

              {/* Right Column — Summary Card */}
              <div className="lg:col-span-4 border border-white/10 bg-[#0e0e0e] p-6 space-y-6 sticky top-28">
                <h3 className="font-serif text-lg text-white border-b border-white/10 pb-3">
                  Order Summary
                </h3>

                {/* Discount Code Form */}
                <form onSubmit={handleApplyPromo} className="space-y-2">
                  <label className="block text-[10px] uppercase tracking-wider text-white/60 font-mono">
                    Promo / Gift Card Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="e.g. PREPAID200"
                      className="flex-1 bg-[#141414] border border-white/15 px-3 py-2 text-xs text-white uppercase outline-none focus:border-[#ffb91d]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs uppercase tracking-wider font-semibold transition-all"
                    >
                      Apply
                    </button>
                  </div>
                  {promoApplied && (
                    <p className="text-[11px] text-[#53ff73] font-mono">
                      ✓ Promo code applied: ₹{discountAmount} off
                    </p>
                  )}
                </form>

                {/* Price Breakdown */}
                <div className="space-y-2 text-xs border-y border-white/10 py-4 font-mono">
                  <div className="flex justify-between text-white/70">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#53ff73]">
                      <span>Discount</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-white/70">
                    <span>Shipping</span>
                    <span className="text-[#53ff73]">FREE (Express)</span>
                  </div>
                </div>

                {/* Final Total */}
                <div className="flex justify-between items-baseline text-white">
                  <span className="font-serif text-base">Total</span>
                  <div className="text-right">
                    <span className="font-mono text-xl sm:text-2xl text-[#ffb91d] font-bold">
                      {formatPrice(finalTotal)}
                    </span>
                    <span className="block text-[10px] text-white/50 font-sans mt-0.5">
                      Inclusive of all taxes
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  className="w-full py-4 bg-[#d89528] hover:bg-[#ffb91d] text-black font-semibold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-xl active:scale-98"
                >
                  <span>Proceed to Checkout →</span>
                </Link>

                {/* Security and guarantee */}
                <div className="text-center space-y-1 text-[10px] text-white/50 font-mono">
                  <p>🔒 256-bit Encrypted SSL Checkout</p>
                  <p>GCC Express Courier Delivery (UAE, KSA, Qatar, Kuwait, Oman & Bahrain)</p>
                </div>
              </div>
            </div>
          )}
        </Container>
      </main>
    </div>
  );
}
