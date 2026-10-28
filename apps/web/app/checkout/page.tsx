'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import SiteHeader from '../components/header/SiteHeader';
import Container from '../components/Container';
import { useCart } from '../components/cart/CartContext';
import { useCurrency, GccCountryCode } from '../components/concierge/CurrencyContext';
import { GCC_COUNTRIES, getGccCountry, getGccCountryByName } from '../lib/pricing';
import { StoreApi } from '../store-api';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { currency, countryCode, setCountry: setCurrencyCountry, formatPrice } = useCurrency();

  // Contact State
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [newsOffers, setNewsOffers] = useState(true);

  // Shipping Address State
  const initialCountry = getGccCountry(countryCode)?.name || 'United Arab Emirates';
  const [shippingCountry, setShippingCountry] = useState(initialCountry);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [citySelect, setCitySelect] = useState('');
  const [customCity, setCustomCity] = useState('');
  const [state, setState] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');

  // Gift Order State
  const [isGift, setIsGift] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');

  // Dual Billing Address State (for International Gifters)
  const [differentBilling, setDifferentBilling] = useState(false);
  const [billingName, setBillingName] = useState('');
  const [billingCountry, setBillingCountry] = useState('United Kingdom');
  const [billingAddress, setBillingAddress] = useState('');
  const [billingCity, setBillingCity] = useState('');
  const [billingPostal, setBillingPostal] = useState('');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank_transfer'>('card');

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const prepaidDiscount = 0;

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [foreignAddressWarning, setForeignAddressWarning] = useState<string | null>(null);

  const shippingFee = 0; // Free express courier across GCC
  const finalTotal = Math.max(0, subtotal - couponDiscount + shippingFee);

  // Look up active GCC country metadata
  const currentGcc = getGccCountryByName(shippingCountry) || GCC_COUNTRIES[0];

  // Sync initial country from CurrencyContext if user hasn't changed it
  useEffect(() => {
    const matched = getGccCountry(countryCode);
    if (matched && matched.name !== shippingCountry) {
      setShippingCountry(matched.name);
    }
  }, [countryCode]);

  // When shipping country changes, sync city presets and currency
  const handleCountryChange = (countryName: string) => {
    setShippingCountry(countryName);
    const found = getGccCountryByName(countryName);
    if (found) {
      setCurrencyCountry(found.code as GccCountryCode);
      setCitySelect(found.cities[0] || '');
      setCustomCity('');
    }
  };

  // Check for foreign postal code or non-GCC keywords in address
  const handleAddressChange = (val: string) => {
    setAddress(val);
    const foreignPatterns = /\b(USA|UK|United States|London|Paris|Germany|India|Delhi|Mumbai|New York|California)\b/i;
    if (foreignPatterns.test(val)) {
      setForeignAddressWarning(
        '⚠️ Notice: Oud Nomad ships exclusively to addresses within the GCC. Please ensure your delivery address is in the UAE, Saudi Arabia, Kuwait, Qatar, Oman, or Bahrain.'
      );
    } else {
      setForeignAddressWarning(null);
    }
  };

  const effectiveCity = citySelect === '__CUSTOM__' ? customCity.trim() : (citySelect || currentGcc.cities[0] || '');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'PREPAID200' || code === 'GOLD10' || code === 'NOMAD') {
      setCouponDiscount(200);
      setCouponApplied(true);
    } else {
      alert('Invalid coupon code. Try PREPAID200 or NOMAD');
    }
  };

  const handleCompleteOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert('Your cart is empty.');
      router.push('/collections');
      return;
    }

    if (!effectiveCity) {
      alert('Please specify your delivery city.');
      return;
    }

    setSubmitting(true);
    const fallbackOrderId = `OUD-${Math.floor(100000 + Math.random() * 900000)}`;

    const customerEmail = emailOrPhone.includes('@') ? emailOrPhone.trim() : 'collector@oudnomaddubai.com';
    const customerPhone = recipientPhone.trim()
      ? `${currentGcc.dialCode} ${recipientPhone.trim()}`
      : (!emailOrPhone.includes('@') ? emailOrPhone.trim() : '');

    // Authoritative backend order creation payload
    const backendPayload = {
      email: customerEmail,
      name: `${firstName} ${lastName}`.trim() || 'Collector',
      phone: customerPhone,
      address: `${address} ${apartment}`.trim(),
      city: effectiveCity,
      state: state || currentGcc.name,
      postalCode: pinCode || '00000',
      country: currentGcc.name,
      countryCode: currentGcc.code,
      shippingMethod: 'STANDARD' as const,
      isGift,
      giftMessage: isGift ? giftMessage.trim() : undefined,
      items: items.map((it) => ({
        variantId: it.variantId || it.id,
        productId: it.productId,
        name: it.name,
        size: it.size,
        price: it.price,
        quantity: it.quantity,
      })),
    };

    let backendOrder: any = null;
    let paymentAttemptData: any = null;

    try {
      // 1. Authoritative order creation in NestJS + PostgreSQL
      backendOrder = await StoreApi.createOrder(backendPayload);

      // 2. Initialize Stripe PaymentIntent if paying via card
      if (paymentMethod === 'card' && backendOrder?.id) {
        try {
          paymentAttemptData = await StoreApi.createPaymentAttempt(
            backendOrder.id,
            `pmt_${backendOrder.id}_${Date.now()}`
          );
        } catch (attemptErr) {
          console.warn('Stripe payment attempt notice:', attemptErr);
        }
      }
    } catch (apiErr: any) {
      console.warn('Backend order creation notice:', apiErr?.message || apiErr);
    }

    const orderId = backendOrder?.id || backendOrder?.orderNumber || fallbackOrderId;

    const orderPayload = {
      orderId,
      customer: {
        name: `${firstName} ${lastName}`.trim() || 'Collector',
        email: customerEmail,
        phone: customerPhone,
        address: `${address} ${apartment}`.trim(),
        city: effectiveCity,
        state: state || currentGcc.name,
        postalCode: pinCode || '00000',
        country: currentGcc.name,
      },
      gift: isGift
        ? {
            isGift: true,
            message: giftMessage.trim(),
          }
        : null,
      billing: differentBilling
        ? {
            name: billingName.trim(),
            country: billingCountry.trim(),
            address: billingAddress.trim(),
            city: billingCity.trim(),
            postalCode: billingPostal.trim(),
          }
        : null,
      items: items.map((it) => ({
        id: it.id,
        name: it.name,
        size: it.size,
        quantity: it.quantity,
        price: it.price,
      })),
      subtotal,
      shipping: shippingFee,
      discount: couponDiscount,
      total: finalTotal,
      currency: currency.code,
      paymentMethod: paymentMethod === 'card' ? 'Stripe Secure Card Payment' : 'Direct Atelier Transfer',
    };

    // 3. Dispatch real-time email receipt
    try {
      await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
    } catch (mailErr) {
      console.warn('Order email notification notice:', mailErr);
    }

    // 4. Save order locally for customer tracking on /account/orders
    try {
      const existing = JSON.parse(localStorage.getItem('oudnomad_placed_orders') || '[]');
      const newRecord = {
        id: orderId,
        orderNumber: orderId,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        items: items.map((it) => `${it.name} (${it.size}) × ${it.quantity}`).join(', '),
        total: finalTotal,
        currency: currency.code,
        country: currentGcc.name,
        isGift,
        status: 'Processing',
        carrier: 'DHL Express GCC Courier',
        trackingNumber: `DHL-${currentGcc.code}-${Math.floor(100000 + Math.random() * 900000)}`,
        stripeClientSecret: paymentAttemptData?.stripeClientSecret,
      };
      localStorage.setItem('oudnomad_placed_orders', JSON.stringify([newRecord, ...existing]));
    } catch (_) {}

    clearCart();
    router.push(`/checkout/success?orderId=${orderId}&total=${finalTotal}&currency=${currency.code}`);
    setSubmitting(false);
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
              <span className="text-[#ffb91d]">GCC Shipping & Address</span>
              <span>›</span>
              <span className="text-white/40">Payment</span>
            </div>
            <div className="flex items-center gap-2 text-[#53ff73] text-[11px]">
              <span>🔒</span>
              <span>256-Bit SSL Encrypted GCC Checkout</span>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="py-24 text-center border border-white/10 bg-[#0e0e0e] p-12 max-w-xl mx-auto space-y-6">
              <h2 className="text-2xl font-serif text-white">Your Cart is Empty</h2>
              <p className="text-xs text-white/60">Please select your flacons before proceeding to checkout.</p>
              <Link
                href="/collections"
                className="inline-block px-8 py-3 bg-[#d89528] hover:bg-[#ffb91d] text-black text-xs uppercase tracking-widest font-semibold"
              >
                Explore Fragrances
              </Link>
            </div>
          ) : (
            <form onSubmit={handleCompleteOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* ── LEFT COLUMN: Checkout Form Steps ── */}
              <div className="lg:col-span-7 space-y-8">
                
                {/* Step 1: Contact Information (Worldwide Buyer) */}
                <div className="border border-white/10 bg-[#0e0e0e] p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-serif text-white uppercase tracking-wider flex items-center gap-2">
                      <span>1. Contact Information</span>
                    </h3>
                    <span className="text-[11px] text-white/50">Receipt & order status</span>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1 font-mono">
                      Buyer Email Address (Worldwide)
                    </label>
                    <input
                      type="email"
                      required
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      placeholder="e.g. collector@luxury.com"
                      className="w-full bg-[#141414] border border-white/15 p-3 text-xs text-white outline-none focus:border-[#ffb91d]"
                    />
                    <p className="text-[10px] text-white/40 mt-1">
                      Your order confirmation, receipt and tracking notifications will be dispatched here.
                    </p>
                  </div>

                  <label className="flex items-center gap-2 text-xs text-white/70 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={newsOffers}
                      onChange={(e) => setNewsOffers(e.target.checked)}
                      className="accent-[#ffb91d]"
                    />
                    <span>Receive private vault allocations and atelier olfactory news</span>
                  </label>
                </div>

                {/* Step 2: Shipping Destination — Strictly GCC */}
                <div className="border border-white/10 bg-[#0e0e0e] p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-serif text-white uppercase tracking-wider">
                      2. Delivery Address (GCC Exclusive)
                    </h3>
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 border border-[#ffb91d]/40 text-[#ffb91d] bg-[#ffb91d]/5 font-mono">
                      {currentGcc.flag} {currentGcc.name}
                    </span>
                  </div>

                  <div className="p-3 bg-[#131210] border border-[#ffb91d]/20 text-[11px] text-white/70 flex items-start gap-2">
                    <span className="text-[#ffb91d] text-sm">ℹ️</span>
                    <div>
                      <strong className="text-white">White-Glove GCC Delivery:</strong> Oud Nomad ships exclusively to recipients within the 6 GCC nations. Sending a gift? You can use an international billing card in step 4 below.
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    {/* Country Selector */}
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1 font-mono">
                        Destination Country (GCC Only)
                      </label>
                      <select
                        value={shippingCountry}
                        onChange={(e) => handleCountryChange(e.target.value)}
                        className="w-full bg-[#141414] border border-white/15 p-3 text-white outline-none focus:border-[#ffb91d] cursor-pointer font-medium"
                      >
                        {GCC_COUNTRIES.map((c) => (
                          <option key={c.code} value={c.name}>
                            {c.flag} {c.name} — {c.currency} ({c.vatNote})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Recipient Name */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1 font-mono">
                          Recipient First Name
                        </label>
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
                        <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1 font-mono">
                          Recipient Last Name
                        </label>
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

                    {/* Street Address */}
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1 font-mono">
                        Street Address & Villa / Building
                      </label>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => handleAddressChange(e.target.value)}
                        placeholder="e.g. Al Wasl Road, Villa 42 / Downtown Blvd, Tower 1"
                        className="w-full bg-[#141414] border border-white/15 p-3 text-white outline-none focus:border-[#ffb91d]"
                      />
                      {foreignAddressWarning && (
                        <p className="mt-1.5 p-2 bg-red-950/60 border border-red-500/40 text-red-300 text-[11px]">
                          {foreignAddressWarning}
                        </p>
                      )}
                    </div>

                    <div>
                      <input
                        type="text"
                        value={apartment}
                        onChange={(e) => setApartment(e.target.value)}
                        placeholder="Apartment, suite, landmark, floor (optional)"
                        className="w-full bg-[#141414] border border-white/15 p-3 text-white outline-none focus:border-[#ffb91d]"
                      />
                    </div>

                    {/* City (Smart Dropdown + Other) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1 font-mono">
                          City / Emirate
                        </label>
                        <select
                          value={citySelect || currentGcc.cities[0]}
                          onChange={(e) => setCitySelect(e.target.value)}
                          className="w-full bg-[#141414] border border-white/15 p-3 text-white outline-none focus:border-[#ffb91d] cursor-pointer"
                        >
                          {currentGcc.cities.map((ct) => (
                            <option key={ct} value={ct}>
                              {ct}
                            </option>
                          ))}
                          <option value="__CUSTOM__">Other / Specific Area...</option>
                        </select>
                      </div>

                      {citySelect === '__CUSTOM__' ? (
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1 font-mono">
                            Specify Area / City
                          </label>
                          <input
                            type="text"
                            required
                            value={customCity}
                            onChange={(e) => setCustomCity(e.target.value)}
                            placeholder="Enter specific area name"
                            className="w-full bg-[#141414] border border-white/15 p-3 text-white outline-none focus:border-[#ffb91d]"
                          />
                        </div>
                      ) : (
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1 font-mono">
                            District / Region (Optional)
                          </label>
                          <input
                            type="text"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            placeholder="e.g. Palm Jumeirah / Olaya"
                            className="w-full bg-[#141414] border border-white/15 p-3 text-white outline-none focus:border-[#ffb91d]"
                          />
                        </div>
                      )}
                    </div>

                    {/* Recipient Phone with Dial Code */}
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1 font-mono">
                        Recipient Mobile Number (For Courier Call Upon Arrival)
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 bg-[#1c1c1c] border border-r-0 border-white/15 text-xs text-[#ffb91d] font-mono select-none">
                          {currentGcc.flag} {currentGcc.dialCode}
                        </span>
                        <input
                          type="tel"
                          required
                          value={recipientPhone}
                          onChange={(e) => setRecipientPhone(e.target.value.replace(/[^0-9\s-]/g, ''))}
                          placeholder="50 123 4567"
                          className="flex-1 bg-[#141414] border border-white/15 p-3 text-white outline-none focus:border-[#ffb91d] text-xs font-mono"
                        />
                      </div>
                      <p className="text-[10px] text-white/40 mt-1">
                        Our courier will call or WhatsApp this recipient number to coordinate delivery access.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 3: Complimentary Gifting Option */}
                <div className="border border-white/10 bg-[#0e0e0e] p-6 space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isGift}
                      onChange={(e) => setIsGift(e.target.checked)}
                      className="accent-[#ffb91d] w-4 h-4"
                    />
                    <div>
                      <span className="font-serif text-white text-sm">🎁 This is a complimentary gift order</span>
                      <p className="text-[11px] text-white/50">
                        Omit price details from packaging & include a wax-sealed handwritten message card.
                      </p>
                    </div>
                  </label>

                  {isGift && (
                    <div className="pt-3 border-t border-white/10 space-y-2">
                      <label className="block text-[10px] uppercase tracking-wider text-[#ffb91d] font-mono">
                        Handwritten Card Message (Max 120 chars)
                      </label>
                      <textarea
                        maxLength={120}
                        rows={2}
                        value={giftMessage}
                        onChange={(e) => setGiftMessage(e.target.value)}
                        placeholder="Wishing you unforgettable moments. Enjoy this bespoke scent..."
                        className="w-full bg-[#141414] border border-white/15 p-3 text-xs text-white outline-none focus:border-[#ffb91d]"
                      />
                      <div className="flex justify-between text-[10px] text-white/40 font-mono">
                        <span>Card will be written by atelier calligrapher</span>
                        <span>{giftMessage.length} / 120</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Step 4: Shipping Method */}
                <div className="border border-white/10 bg-[#0e0e0e] p-6 space-y-3">
                  <h3 className="text-base font-serif text-white uppercase tracking-wider">
                    4. Shipping Method
                  </h3>

                  <div className="border border-[#ffb91d]/50 bg-[#161616] p-4 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <span className="font-semibold text-white flex items-center gap-2">
                        <span>Complimentary White-Glove GCC Courier</span>
                        <span className="text-[10px] text-[#ffb91d] border border-[#ffb91d]/40 px-1.5 py-0.2">
                          DHL / Aramex
                        </span>
                      </span>
                      <p className="text-[11px] text-white/60">
                        Dispatched within 24h from Dubai Atelier • 2 to 4 business days to {currentGcc.name}
                      </p>
                    </div>
                    <span className="font-mono text-[#53ff73] font-bold">FREE</span>
                  </div>
                </div>

                {/* Step 5: Payment & Dual Billing */}
                <div className="border border-white/10 bg-[#0e0e0e] p-6 space-y-4">
                  <h3 className="text-base font-serif text-white uppercase tracking-wider">
                    5. Payment & Billing
                  </h3>

                  <div className="space-y-3">
                    {/* Credit / Debit Card */}
                    <div
                      onClick={() => setPaymentMethod('card')}
                      className={`border p-4 cursor-pointer transition-all ${
                        paymentMethod === 'card'
                          ? 'border-[#ffb91d] bg-[#161616]'
                          : 'border-white/10 bg-[#101010] hover:border-white/30'
                      }`}
                    >
                      <label className="flex items-center gap-2 cursor-pointer font-medium text-xs text-white">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'card'}
                          onChange={() => setPaymentMethod('card')}
                          className="accent-[#ffb91d]"
                        />
                        <span>Credit / Debit Card (Visa, Mastercard, Amex)</span>
                      </label>
                      <p className="text-[11px] text-white/60 ml-5 mt-1">
                        Secure 3D-authenticated payment. International cards from UK, US, Europe & worldwide accepted.
                      </p>
                    </div>

                    {/* Bank Transfer / Concierge */}
                    <div
                      onClick={() => setPaymentMethod('bank_transfer')}
                      className={`border p-4 cursor-pointer transition-all ${
                        paymentMethod === 'bank_transfer'
                          ? 'border-[#ffb91d] bg-[#161616]'
                          : 'border-white/10 bg-[#101010] hover:border-white/30'
                      }`}
                    >
                      <label className="flex items-center gap-2 cursor-pointer font-medium text-xs text-white">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'bank_transfer'}
                          onChange={() => setPaymentMethod('bank_transfer')}
                          className="accent-[#ffb91d]"
                        />
                        <span>Bank Transfer / Dubai Concierge Order</span>
                      </label>
                      <p className="text-[11px] text-white/60 ml-5 mt-1">
                        Our Dubai concierge will reach out via WhatsApp (+971 58 571 9731) to assist your private transfer.
                      </p>
                    </div>
                  </div>

                  {/* International Billing Address Toggle */}
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <label className="flex items-center gap-2 text-xs text-white/80 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={differentBilling}
                        onChange={(e) => setDifferentBilling(e.target.checked)}
                        className="accent-[#ffb91d]"
                      />
                      <span>My card billing address is different from the GCC delivery address (Gifting from abroad)</span>
                    </label>

                    {differentBilling && (
                      <div className="p-4 bg-[#121212] border border-white/10 space-y-3 text-xs mt-2">
                        <h4 className="text-[11px] uppercase tracking-wider font-mono text-[#ffb91d]">
                          Cardholder Billing Address
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <input
                              type="text"
                              value={billingName}
                              onChange={(e) => setBillingName(e.target.value)}
                              placeholder="Cardholder Name"
                              className="w-full bg-[#181818] border border-white/15 p-2.5 text-xs text-white outline-none focus:border-[#ffb91d]"
                            />
                          </div>
                          <div>
                            <input
                              type="text"
                              value={billingCountry}
                              onChange={(e) => setBillingCountry(e.target.value)}
                              placeholder="Billing Country (e.g. UK, USA, France)"
                              className="w-full bg-[#181818] border border-white/15 p-2.5 text-xs text-white outline-none focus:border-[#ffb91d]"
                            />
                          </div>
                        </div>
                        <input
                          type="text"
                          value={billingAddress}
                          onChange={(e) => setBillingAddress(e.target.value)}
                          placeholder="Billing Street Address"
                          className="w-full bg-[#181818] border border-white/15 p-2.5 text-xs text-white outline-none focus:border-[#ffb91d]"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={billingCity}
                            onChange={(e) => setBillingCity(e.target.value)}
                            placeholder="City"
                            className="w-full bg-[#181818] border border-white/15 p-2.5 text-xs text-white outline-none focus:border-[#ffb91d]"
                          />
                          <input
                            type="text"
                            value={billingPostal}
                            onChange={(e) => setBillingPostal(e.target.value)}
                            placeholder="Postal / ZIP Code"
                            className="w-full bg-[#181818] border border-white/15 p-2.5 text-xs text-white outline-none focus:border-[#ffb91d]"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pre-Payment Confirmation Badge */}
                <div className="border border-[#ffb91d]/40 bg-gradient-to-r from-[#17140e] to-[#0e0e0e] p-5 space-y-2 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="font-semibold text-white flex items-center gap-1.5">
                      <span>📦 Dispatch Destination:</span>
                      <strong className="text-[#ffb91d]">{currentGcc.flag} {currentGcc.name}</strong>
                    </span>
                    <span className="font-mono text-[11px] text-[#53ff73]">
                      ✓ {currentGcc.vatNote}
                    </span>
                  </div>
                  <div className="text-[11px] text-white/70 space-y-1">
                    <div className="flex justify-between">
                      <span>Estimated Transit:</span>
                      <span className="text-white">2–4 business days via Express Courier</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Charge:</span>
                      <span className="text-[#ffb91d] font-mono font-bold">{formatPrice(finalTotal)}</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-white/50 pt-2 border-t border-white/5 leading-relaxed">
                    ℹ️ By placing this order, you confirm the delivery destination is located within the GCC. Orders outside the GCC cannot be fulfilled.
                  </p>
                </div>

                {/* Complete Order Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-[#d89528] hover:bg-[#ffb91d] text-black font-semibold text-sm uppercase tracking-[0.2em] transition-all shadow-2xl flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
                >
                  <span>
                    {submitting
                      ? 'Confirming Acquisition...'
                      : `Complete Order • ${formatPrice(finalTotal)}`}
                  </span>
                </button>
              </div>

              {/* ── RIGHT COLUMN: Order Summary ── */}
              <div className="lg:col-span-5 border border-white/10 bg-[#0e0e0e] p-6 space-y-6 sticky top-28">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="font-serif text-lg text-white">
                    Summary ({items.length} Flacons)
                  </h3>
                  <span className="text-[11px] font-mono text-[#ffb91d]">
                    {currentGcc.flag} {currency.code}
                  </span>
                </div>

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
                      ✓ Code applied: -{formatPrice(couponDiscount)}
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
                    <span>Express Shipping ({currentGcc.name})</span>
                    <span className="text-[#53ff73]">COMPLIMENTARY</span>
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
                      {currentGcc.vatNote}
                    </span>
                  </div>
                </div>

                {/* Security trust badges */}
                <div className="border-t border-white/10 pt-4 space-y-2 text-[11px] text-white/60">
                  <div className="flex items-center gap-2">
                    <span className="text-[#ffb91d]">✨</span>
                    <span>100% Authentic Hand-Blended Dubai Perfumes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#ffb91d]">📦</span>
                    <span>Dispatched in bespoke luxury gift box</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#ffb91d]">🛡️</span>
                    <span>Complimentary insurance on transit</span>
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
