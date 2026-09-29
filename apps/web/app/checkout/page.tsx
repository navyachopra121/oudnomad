'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import SiteHeader from '../components/header/SiteHeader';
import Container from '../components/Container';
import { useCart } from '../components/cart/CartContext';
import { useCurrency } from '../components/concierge/CurrencyContext';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh', 'Delhi', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu & Kashmir', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan',
  'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

const GCC_COUNTRIES = [
  'India', 'United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Oman', 'Bahrain'
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { formatPrice } = useCurrency();

  // Contact State
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [newsOffers, setNewsOffers] = useState(true);

  // Shipping Address State
  const [country, setCountry] = useState('United Arab Emirates');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Delhi');
  const [pinCode, setPinCode] = useState('');
  const [phone, setPhone] = useState('');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'prepaid' | 'cod'>('prepaid');
  const [upiOption, setUpiOption] = useState<'gpay' | 'phonepe' | 'paytm' | 'card'>('gpay');

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  // Submission state
  const [submitting, setSubmitting] = useState(false);

  // Auto prepaid discount like Oud Arabia ("Extra ₹200 Off on Prepaid Orders")
  const prepaidDiscount = paymentMethod === 'prepaid' ? 200 : 0;
  const totalDiscount = couponDiscount + prepaidDiscount;
  const shippingFee = 0; // Free express shipping
  const finalTotal = Math.max(0, subtotal - totalDiscount + shippingFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'PREPAID200' || code === 'GOLD10' || code === 'NOMAD') {
      setCouponDiscount(200);
      setCouponApplied(true);
    } else {
      alert('Invalid coupon code. Try PREPAID200');
    }
  };

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert('Your cart is empty.');
      router.push('/collections');
      return;
    }

    setSubmitting(true);
    const orderId = `OUD-${Math.floor(100000 + Math.random() * 900000)}`;

    setTimeout(() => {
      clearCart();
      setSubmitting(false);
      router.push(`/checkout/success?orderId=${orderId}&total=${finalTotal}`);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#070707] text-[#f2efe9] flex flex-col font-sans selection:bg-[#ffb91d] selection:text-black">
      <SiteHeader />

      <main className="flex-1 w-full pt-8 pb-20">
        <Container className="space-y-8">
          {/* Breadcrumb / Status */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 text-xs font-mono">
            <div className="flex items-center gap-2 text-white/50 uppercase tracking-wider text-[11px]">
              <Link href="/cart" className="hover:text-[#ffb91d]">Bag</Link>
              <span>›</span>
              <span className="text-[#ffb91d]">Information & Shipping</span>
              <span>›</span>
              <span className="text-white/40">Payment</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#53ff73] text-[11px]">
              <span>🔒</span>
              <span>256-Bit SSL Encrypted Checkout</span>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="py-24 text-center border border-white/10 bg-[#0e0e0e] p-12 max-w-xl mx-auto space-y-6">
              <h2 className="text-2xl font-serif text-white">Your Cart is Empty</h2>
              <p className="text-xs text-white/60">Please add flacons to your cart before proceeding to checkout.</p>
              <Link
                href="/collections"
                className="inline-block px-8 py-3 bg-[#d89528] hover:bg-[#ffb91d] text-black text-xs uppercase tracking-widest font-semibold"
              >
                Browse Collections
              </Link>
            </div>
          ) : (
            <form onSubmit={handleCompleteOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* ── LEFT COLUMN: Checkout Form Steps ── */}
              <div className="lg:col-span-7 space-y-8">
                {/* Express Checkout Bar */}
                <div className="border border-white/10 bg-[#0e0e0e] p-5 space-y-3">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-mono block text-center">
                    Express Instant Checkout
                  </span>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentMethod('prepaid');
                        setUpiOption('gpay');
                      }}
                      className="py-2.5 bg-[#181818] hover:bg-[#222] border border-white/10 flex items-center justify-center font-bold text-xs text-white transition-all"
                    >
                      Google Pay
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentMethod('prepaid');
                        setUpiOption('phonepe');
                      }}
                      className="py-2.5 bg-[#181818] hover:bg-[#222] border border-white/10 flex items-center justify-center font-bold text-xs text-white transition-all"
                    >
                      PhonePe
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentMethod('prepaid');
                        setUpiOption('paytm');
                      }}
                      className="py-2.5 bg-[#181818] hover:bg-[#222] border border-white/10 flex items-center justify-center font-bold text-xs text-white transition-all"
                    >
                      Paytm / UPI
                    </button>
                  </div>
                  <div className="relative text-center my-3">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/10" />
                    </div>
                    <span className="relative bg-[#0e0e0e] px-4 text-[10px] text-white/40 uppercase tracking-widest">
                      OR ENTER SHIPPING DETAILS
                    </span>
                  </div>
                </div>

                {/* Step 1: Contact Information */}
                <div className="border border-white/10 bg-[#0e0e0e] p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-serif text-white uppercase tracking-wider">
                      1. Contact Information
                    </h3>
                    <span className="text-[11px] text-white/50">Already have an account? Log in</span>
                  </div>

                  <div>
                    <input
                      type="text"
                      required
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      placeholder="Email or Mobile phone number"
                      className="w-full bg-[#141414] border border-white/15 p-3 text-xs text-white outline-none focus:border-[#ffb91d]"
                    />
                  </div>

                  <label className="flex items-center gap-2 text-xs text-white/70 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newsOffers}
                      onChange={(e) => setNewsOffers(e.target.checked)}
                      className="accent-[#ffb91d]"
                    />
                    <span>Email me with exclusive news and private vault allocations</span>
                  </label>
                </div>

                {/* Step 2: Delivery Address */}
                <div className="border border-white/10 bg-[#0e0e0e] p-6 space-y-4">
                  <h3 className="text-base font-serif text-white uppercase tracking-wider">
                    2. Shipping Address
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1 font-mono">
                        Country / Region
                      </label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full bg-[#141414] border border-white/15 p-3 text-white outline-none focus:border-[#ffb91d] cursor-pointer"
                      >
                        {GCC_COUNTRIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          required
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="First name"
                          className="w-full bg-[#141414] border border-white/15 p-3 text-white outline-none focus:border-[#ffb91d]"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          required
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Last name"
                          className="w-full bg-[#141414] border border-white/15 p-3 text-white outline-none focus:border-[#ffb91d]"
                        />
                      </div>
                    </div>

                    <div>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Street Address, House/Flat No, Landmark"
                        className="w-full bg-[#141414] border border-white/15 p-3 text-white outline-none focus:border-[#ffb91d]"
                      />
                    </div>

                    <div>
                      <input
                        type="text"
                        value={apartment}
                        onChange={(e) => setApartment(e.target.value)}
                        placeholder="Apartment, suite, unit (optional)"
                        className="w-full bg-[#141414] border border-white/15 p-3 text-white outline-none focus:border-[#ffb91d]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="City"
                          className="w-full bg-[#141414] border border-white/15 p-3 text-white outline-none focus:border-[#ffb91d]"
                        />
                      </div>

                      <div>
                        <select
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="w-full bg-[#141414] border border-white/15 p-3 text-white outline-none focus:border-[#ffb91d] cursor-pointer"
                        >
                          {INDIAN_STATES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <input
                          type="text"
                          required
                          value={pinCode}
                          onChange={(e) => setPinCode(e.target.value)}
                          placeholder="PIN code"
                          className="w-full bg-[#141414] border border-white/15 p-3 text-white outline-none focus:border-[#ffb91d]"
                        />
                      </div>
                    </div>

                    <div>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Phone number for courier updates"
                        className="w-full bg-[#141414] border border-white/15 p-3 text-white outline-none focus:border-[#ffb91d]"
                      />
                    </div>
                  </div>
                </div>

                {/* Step 3: Shipping Method */}
                <div className="border border-white/10 bg-[#0e0e0e] p-6 space-y-3">
                  <h3 className="text-base font-serif text-white uppercase tracking-wider">
                    3. Shipping Method
                  </h3>

                  <div className="border border-[#ffb91d]/50 bg-[#161616] p-4 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <span className="font-semibold text-white">Complimentary Express Courier</span>
                      <p className="text-[11px] text-white/60">Dispatched within 24h • 2 to 4 business days transit</p>
                    </div>
                    <span className="font-mono text-[#53ff73] font-bold">FREE</span>
                  </div>
                </div>

                {/* Step 4: Payment Method */}
                <div className="border border-white/10 bg-[#0e0e0e] p-6 space-y-4">
                  <h3 className="text-base font-serif text-white uppercase tracking-wider">
                    4. Payment Method
                  </h3>

                  <div className="space-y-3">
                    {/* Prepaid Option (with ₹200 off badge) */}
                    <div
                      onClick={() => setPaymentMethod('prepaid')}
                      className={`border p-4 cursor-pointer transition-all ${paymentMethod === 'prepaid'
                        ? 'border-[#ffb91d] bg-[#161616]'
                        : 'border-white/10 bg-[#101010] hover:border-white/30'
                        }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <label className="flex items-center gap-2 cursor-pointer font-medium text-xs text-white">
                          <input
                            type="radio"
                            name="payment"
                            checked={paymentMethod === 'prepaid'}
                            onChange={() => setPaymentMethod('prepaid')}
                            className="accent-[#ffb91d]"
                          />
                          <span>Prepaid Online Payment (UPI / Cards / NetBanking)</span>
                        </label>
                        <span className="bg-[#53ff73] text-black text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 shadow">
                          Extra ₹200 Off
                        </span>
                      </div>
                      <p className="text-[11px] text-white/60 ml-5">
                        Instant payment via Google Pay, PhonePe, Paytm, Debit/Credit Card or NetBanking.
                      </p>
                    </div>

                    {/* Cash on Delivery Option */}
                    <div
                      onClick={() => setPaymentMethod('cod')}
                      className={`border p-4 cursor-pointer transition-all ${paymentMethod === 'cod'
                        ? 'border-[#ffb91d] bg-[#161616]'
                        : 'border-white/10 bg-[#101010] hover:border-white/30'
                        }`}
                    >
                      <label className="flex items-center gap-2 cursor-pointer font-medium text-xs text-white">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                          className="accent-[#ffb91d]"
                        />
                        <span>Cash on Delivery (COD)</span>
                      </label>
                      <p className="text-[11px] text-white/60 ml-5 mt-1">
                        Pay with cash upon physical handover by the courier at your doorstep.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Complete Order Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-[#d89528] hover:bg-[#ffb91d] text-black font-semibold text-sm uppercase tracking-[0.2em] transition-all shadow-2xl flex items-center justify-center gap-2 active:scale-98"
                >
                  <span>{submitting ? 'Confirming Acquisition...' : `Complete Order • ${formatPrice(finalTotal)}`}</span>
                </button>
              </div>

              {/* ── RIGHT COLUMN: Order Summary ── */}
              <div className="lg:col-span-5 border border-white/10 bg-[#0e0e0e] p-6 space-y-6 sticky top-28">
                <h3 className="font-serif text-lg text-white border-b border-white/10 pb-3">
                  Summary ({items.length} Flacons)
                </h3>

                {/* Items List */}
                <div className="divide-y divide-white/10 max-h-80 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.variantId} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 aspect-[3/4] bg-[#141414] border border-white/10 flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover object-center"
                          />
                          <span className="absolute -top-1.5 -right-1.5 bg-[#ffb91d] text-black font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="space-y-0.5 text-xs">
                          <h4 className="font-serif text-white line-clamp-1">{item.name}</h4>
                          <p className="text-[10px] text-white/50 font-mono">{item.size || '100ml'}</p>
                        </div>
                      </div>

                      <span className="font-mono text-xs text-[#ffb91d] font-medium shrink-0">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Coupon Code Input */}
                <div className="border-t border-white/10 pt-4 space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Discount code (e.g. PREPAID200)"
                      className="flex-1 bg-[#141414] border border-white/15 px-3 py-2 text-xs text-white uppercase outline-none focus:border-[#ffb91d]"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs uppercase tracking-wider font-semibold transition-all"
                    >
                      Apply
                    </button>
                  </div>
                  {couponApplied && (
                    <p className="text-[11px] text-[#53ff73] font-mono">
                      ✓ Code applied: -₹{couponDiscount}
                    </p>
                  )}
                </div>

                {/* Breakdown */}
                <div className="border-t border-white/10 pt-4 space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-white/70">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>

                  {prepaidDiscount > 0 && (
                    <div className="flex justify-between text-[#53ff73]">
                      <span>Prepaid Offer Discount</span>
                      <span>-{formatPrice(prepaidDiscount)}</span>
                    </div>
                  )}

                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-[#53ff73]">
                      <span>Coupon Discount</span>
                      <span>-{formatPrice(couponDiscount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-white/70">
                    <span>Shipping</span>
                    <span className="text-[#53ff73]">FREE (Express)</span>
                  </div>
                </div>

                {/* Grand Total */}
                <div className="border-t border-white/10 pt-4 flex justify-between items-baseline text-white">
                  <span className="font-serif text-lg">Total</span>
                  <div className="text-right">
                    <span className="font-mono text-2xl text-[#ffb91d] font-bold">
                      {formatPrice(finalTotal)}
                    </span>
                    <span className="block text-[10px] text-white/50 font-sans mt-0.5">
                      Including ₹{Math.round(finalTotal * 0.18)} in taxes
                    </span>
                  </div>
                </div>
              </div>
            </form>
          )}
        </Container>
      </main>
    </div>
  );
}
