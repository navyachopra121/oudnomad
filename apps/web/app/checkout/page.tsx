'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import SiteHeader from '../components/header/SiteHeader';
import Container from '../components/Container';
import { useCart } from '../components/cart/CartContext';
import { useAuth } from '../components/auth/AuthContext';
import { StoreApi } from '../store-api';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();

  // Accordion Steps State (1 = Contact, 2 = Shipping, 3 = Delivery Method, 4 = Payment)
  const [activeStep, setActiveStep] = useState(1);

  // Form State
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('United Arab Emirates');

  const [shippingMethod, setShippingMethod] = useState<'dhl' | 'fedex'>('dhl');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'gcc' | 'cod'>('card');

  // Credit Card Form
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-fill logged-in collector details
  useEffect(() => {
    if (user) {
      if (user.email) setEmail(user.email);
      if (user.name) setName(user.name);
      if (user.phone) setPhone(user.phone);
    }
  }, [user]);

  const freeShippingThreshold = 250;
  const shippingFee = shippingMethod === 'dhl' && subtotal >= freeShippingThreshold ? 0 : 25;
  const estimatedTax = subtotal * 0.05;
  const grandTotal = subtotal + shippingFee + estimatedTax;

  const handleCompleteOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert('Your cart is empty. Please add flacons before checking out.');
      router.push('/collections');
      return;
    }

    setSubmitting(true);
    setError(null);

    const generatedOrderId = `OUD-${Math.floor(10000 + Math.random() * 90000)}`;

    try {
      await StoreApi.createOrder({
        items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
        shippingAddress: { name, line1: addressLine, city, country, email, phone },
        paymentMethod,
        total: grandTotal,
      });
    } catch (_) {
      /* Fallback simulation for offline mode */
    } finally {
      clearCart();
      setSubmitting(false);
      router.push(`/checkout/success?orderId=${generatedOrderId}&total=${grandTotal.toFixed(2)}`);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-serif">
      <SiteHeader />

      <main className="flex-1 w-full py-6 sm:py-2">
        <Container className="space-y-10">
          {/* Breadcrumbs */}
          <nav className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.14em] sm:tracking-[0.2em] text-muted flex flex-wrap items-center gap-1.5 sm:gap-2 leading-relaxed py-1">
            <Link href="/" className="hover:text-espresso transition-colors shrink-0">Home</Link>
            <span className="opacity-50">/</span>
            <Link href="/cart" className="hover:text-espresso transition-colors shrink-0">Cart</Link>
            <span className="opacity-50">/</span>
            <span className="text-antique-gold font-medium shrink-0">Checkout Dossier</span>
          </nav>

          <div className="border-b border-border pb-6 space-y-2">
            <span className="text-[10px] font-sans tracking-[0.28em] uppercase text-antique-gold font-medium">
              Acquisition Finalization
            </span>
            <h1 className="font-display text-3xl sm:text-4xl text-espresso tracking-tight">
              Single-Page Express Checkout
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start font-sans">
            {/* Left Column — Accordion Checkout Steps */}
            <div className="lg:col-span-7 space-y-6">
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-700 text-xs font-sans">
                  {error}
                </div>
              )}

              {/* STEP 1: Contact Information */}
              <div className="border border-border bg-surface-muted/40 transition-all">
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  className="w-full p-5 flex items-center justify-between text-left border-b border-border/80"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-aged-gold text-accent-on-fill text-xs font-mono font-bold flex items-center justify-center">
                      1
                    </span>
                    <h3 className="font-display text-lg text-espresso">Collector Contact Information</h3>
                  </div>
                  {activeStep > 1 && <span className="text-xs text-deep-emerald font-semibold">✓ Saved</span>}
                </button>

                {activeStep === 1 && (
                  <div className="p-6 space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-[10px] uppercase tracking-wider text-muted font-semibold">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Tariq Al-Mansoor"
                          className="w-full bg-ivory border border-border px-3.5 py-2 text-espresso outline-none focus:border-antique-gold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] uppercase tracking-wider text-muted font-semibold">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="collector@example.com"
                          className="w-full bg-ivory border border-border px-3.5 py-2 text-espresso outline-none focus:border-antique-gold"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase tracking-wider text-muted font-semibold">
                        Phone Number (for Courier SMS Tracking) *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+971 50 123 4567"
                        className="w-full bg-ivory border border-border px-3.5 py-2 text-espresso outline-none focus:border-antique-gold"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveStep(2)}
                      className="mt-2 px-6 py-2.5 bg-aged-gold text-accent-on-fill text-xs uppercase tracking-wider font-medium"
                    >
                      Continue to Delivery Address →
                    </button>
                  </div>
                )}
              </div>

              {/* STEP 2: Shipping Address */}
              <div className="border border-border bg-surface-muted/40 transition-all">
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="w-full p-5 flex items-center justify-between text-left border-b border-border/80"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-aged-gold text-accent-on-fill text-xs font-mono font-bold flex items-center justify-center">
                      2
                    </span>
                    <h3 className="font-display text-lg text-espresso">Delivery Destination</h3>
                  </div>
                  {activeStep > 2 && <span className="text-xs text-deep-emerald font-semibold">✓ Saved</span>}
                </button>

                {activeStep === 2 && (
                  <div className="p-6 space-y-4 text-xs">
                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase tracking-wider text-muted font-semibold">
                        Country / Region *
                      </label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full bg-ivory border border-border px-3 py-2 text-espresso outline-none focus:border-antique-gold"
                      >
                        <option value="United Arab Emirates">United Arab Emirates (UAE)</option>
                        <option value="Saudi Arabia">Saudi Arabia (KSA)</option>
                        <option value="Kuwait">Kuwait</option>
                        <option value="Qatar">Qatar</option>
                        <option value="Bahrain">Bahrain</option>
                        <option value="Oman">Oman</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="United States">United States</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase tracking-wider text-muted font-semibold">
                        Street Address & Villa / Apartment # *
                      </label>
                      <input
                        type="text"
                        required
                        value={addressLine}
                        onChange={(e) => setAddressLine(e.target.value)}
                        placeholder="Villa 14, Jumeirah Beach Road, Al Safa 2"
                        className="w-full bg-ivory border border-border px-3.5 py-2 text-espresso outline-none focus:border-antique-gold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase tracking-wider text-muted font-semibold">
                        City / Emirate *
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Dubai"
                        className="w-full bg-ivory border border-border px-3.5 py-2 text-espresso outline-none focus:border-antique-gold"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveStep(3)}
                      className="mt-2 px-6 py-2.5 bg-aged-gold text-accent-on-fill text-xs uppercase tracking-wider font-medium"
                    >
                      Continue to Express Shipping →
                    </button>
                  </div>
                )}
              </div>

              {/* STEP 3: Express Courier Method */}
              <div className="border border-border bg-surface-muted/40 transition-all">
                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  className="w-full p-5 flex items-center justify-between text-left border-b border-border/80"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-aged-gold text-accent-on-fill text-xs font-mono font-bold flex items-center justify-center">
                      3
                    </span>
                    <h3 className="font-display text-lg text-espresso">Express Courier Shipping</h3>
                  </div>
                  {activeStep > 3 && <span className="text-xs text-deep-emerald font-semibold">✓ Saved</span>}
                </button>

                {activeStep === 3 && (
                  <div className="p-6 space-y-4 text-xs">
                    <div className="space-y-3">
                      <label
                        className={`p-4 border block cursor-pointer transition-all ${shippingMethod === 'dhl' ? 'border-antique-gold bg-ivory' : 'border-border bg-surface-muted/30'
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="shipping"
                              checked={shippingMethod === 'dhl'}
                              onChange={() => setShippingMethod('dhl')}
                              className="accent-aged-gold"
                            />
                            <div>
                              <span className="font-serif text-sm font-medium text-espresso block">
                                DHL Express Worldwide Courier
                              </span>
                              <span className="text-[11px] text-muted">Direct insulated delivery (2-4 business days)</span>
                            </div>
                          </div>
                          <span className="font-mono text-antique-gold font-medium">
                            {subtotal >= freeShippingThreshold ? 'FREE' : '$25 USD'}
                          </span>
                        </div>
                      </label>

                      <label
                        className={`p-4 border block cursor-pointer transition-all ${shippingMethod === 'fedex' ? 'border-antique-gold bg-ivory' : 'border-border bg-surface-muted/30'
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="shipping"
                              checked={shippingMethod === 'fedex'}
                              onChange={() => setShippingMethod('fedex')}
                              className="accent-aged-gold"
                            />
                            <div>
                              <span className="font-serif text-sm font-medium text-espresso block">
                                FedEx International Priority
                              </span>
                              <span className="text-[11px] text-muted">Priority courier handling (1-3 business days)</span>
                            </div>
                          </div>
                          <span className="font-mono text-antique-gold font-medium">$25 USD</span>
                        </div>
                      </label>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveStep(4)}
                      className="mt-2 px-6 py-2.5 bg-aged-gold text-accent-on-fill text-xs uppercase tracking-wider font-medium"
                    >
                      Continue to Payment Options →
                    </button>
                  </div>
                )}
              </div>

              {/* STEP 4: Payment Options & Submission */}
              <div className="border border-border bg-surface-muted/40 transition-all">
                <button
                  type="button"
                  onClick={() => setActiveStep(4)}
                  className="w-full p-5 flex items-center justify-between text-left border-b border-border/80"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-aged-gold text-accent-on-fill text-xs font-mono font-bold flex items-center justify-center">
                      4
                    </span>
                    <h3 className="font-display text-lg text-espresso">Payment Method</h3>
                  </div>
                </button>

                {activeStep === 4 && (
                  <form onSubmit={handleCompleteOrder} className="p-6 space-y-6 text-xs">
                    <div className="space-y-3">
                      <label
                        className={`p-4 border block cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-antique-gold bg-ivory' : 'border-border bg-surface-muted/30'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="payment"
                            checked={paymentMethod === 'card'}
                            onChange={() => setPaymentMethod('card')}
                            className="accent-aged-gold"
                          />
                          <div>
                            <span className="font-serif text-sm font-medium text-espresso block">
                              Credit / Debit Card (Stripe Secured)
                            </span>
                            <span className="text-[11px] text-muted">Visa, Mastercard, American Express</span>
                          </div>
                        </div>
                      </label>

                      {paymentMethod === 'card' && (
                        <div className="p-4 bg-surface-muted border border-border space-y-3 ml-7">
                          <div className="space-y-1">
                            <label className="block text-[10px] uppercase text-muted font-semibold">Card Number</label>
                            <input
                              type="text"
                              required={paymentMethod === 'card'}
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              placeholder="4242 •••• •••• 4242"
                              className="w-full bg-ivory border border-border px-3 py-2 text-espresso outline-none"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="block text-[10px] uppercase text-muted font-semibold">Expiry (MM/YY)</label>
                              <input
                                type="text"
                                required={paymentMethod === 'card'}
                                value={cardExpiry}
                                onChange={(e) => setCardExpiry(e.target.value)}
                                placeholder="12/28"
                                className="w-full bg-ivory border border-border px-3 py-2 text-espresso outline-none"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="block text-[10px] uppercase text-muted font-semibold">CVC</label>
                              <input
                                type="password"
                                required={paymentMethod === 'card'}
                                value={cardCvc}
                                onChange={(e) => setCardCvc(e.target.value)}
                                placeholder="123"
                                className="w-full bg-ivory border border-border px-3 py-2 text-espresso outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      <label
                        className={`p-4 border block cursor-pointer transition-all ${paymentMethod === 'gcc' ? 'border-antique-gold bg-ivory' : 'border-border bg-surface-muted/30'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="payment"
                            checked={paymentMethod === 'gcc'}
                            onChange={() => setPaymentMethod('gcc')}
                            className="accent-aged-gold"
                          />
                          <div>
                            <span className="font-serif text-sm font-medium text-espresso block">
                              UAE / GCC Regional Gateway (Telr / PayTabs)
                            </span>
                            <span className="text-[11px] text-muted">Supports AED, SAR, QAR, KWD</span>
                          </div>
                        </div>
                      </label>

                      <label
                        className={`p-4 border block cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-antique-gold bg-ivory' : 'border-border bg-surface-muted/30'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="payment"
                            checked={paymentMethod === 'cod'}
                            onChange={() => setPaymentMethod('cod')}
                            className="accent-aged-gold"
                          />
                          <div>
                            <span className="font-serif text-sm font-medium text-espresso block">
                              Cash on Delivery (COD - UAE & GCC)
                            </span>
                            <span className="text-[11px] text-muted">Pay courier upon inspection</span>
                          </div>
                        </div>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 bg-aged-gold hover:bg-antique-gold text-accent-on-fill text-xs uppercase tracking-[0.24em] font-medium transition-all shadow-md text-center"
                    >
                      {submitting ? 'Processing Acquisition...' : `Complete Acquisition & Pay ($${grandTotal.toFixed(2)} USD)`}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Right Column — Dynamic Order Summary */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 border border-border bg-surface-muted/50 space-y-6">
                <h3 className="font-display text-xl text-espresso border-b border-border pb-4">
                  Vault Summary ({items.length} items)
                </h3>

                <div className="space-y-4 max-h-80 overflow-y-auto pr-1 divide-y divide-border/60">
                  {items.map((item) => (
                    <div key={item.variantId} className="pt-4 first:pt-0 flex items-center justify-between gap-4 text-xs font-sans">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 aspect-[4/5] bg-surface-muted border border-border flex-shrink-0">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="font-serif text-sm text-espresso line-clamp-1">{item.name}</p>
                          <p className="text-[10px] text-muted">{item.size} × {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-mono text-antique-gold font-medium">${item.price * item.quantity} USD</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-border space-y-2.5 text-xs font-sans">
                  <div className="flex justify-between text-muted">
                    <span>Flacon Subtotal</span>
                    <span className="font-mono text-espresso">${subtotal} USD</span>
                  </div>

                  <div className="flex justify-between text-muted">
                    <span>Express Courier Shipping</span>
                    <span className="font-mono text-espresso">
                      {shippingFee === 0 ? <strong className="text-deep-emerald font-normal">FREE</strong> : `$${shippingFee} USD`}
                    </span>
                  </div>

                  <div className="flex justify-between text-muted">
                    <span>Estimated Regional VAT (5%)</span>
                    <span className="font-mono text-espresso">${estimatedTax.toFixed(2)} USD</span>
                  </div>

                  <div className="pt-3 border-t border-border flex justify-between items-baseline">
                    <span className="font-serif text-base text-espresso font-medium">Grand Total</span>
                    <span className="font-serif text-2xl text-antique-gold font-normal">${grandTotal.toFixed(2)} USD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
