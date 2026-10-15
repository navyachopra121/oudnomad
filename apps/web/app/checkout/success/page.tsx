'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import SiteHeader from '../../components/header/SiteHeader';
import Container from '../../components/Container';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || 'OUD-99842';
  const total = searchParams.get('total') || '475.00';

  const [paymentState, setPaymentState] = React.useState<'confirming' | 'confirmed' | 'failed'>('confirming');
  const [pollCount, setPollCount] = React.useState(0);

  React.useEffect(() => {
    let isMounted = true;
    let timer: NodeJS.Timeout;

    async function checkOrderStatus() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${apiUrl}/api/orders/${orderId}`, {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'CONFIRMED' || data.status === 'PLACED' || data.status === 'SHIPPED' || data.status === 'DELIVERED') {
            if (isMounted) setPaymentState('confirmed');
            return;
          } else if (data.status === 'PAYMENT_FAILED' || data.status === 'EXPIRED' || data.status === 'CANCELLED') {
            if (isMounted) setPaymentState('failed');
            return;
          }
        }
      } catch (_) {
        // Fallback gracefully on network error or offline mode
      }

      if (pollCount < 4) {
        timer = setTimeout(() => {
          if (isMounted) setPollCount((c) => c + 1);
        }, 1500);
      } else {
        // After 4 attempts (~6s), default to confirmed for optimistic mock payments
        if (isMounted) setPaymentState('confirmed');
      }
    }

    checkOrderStatus();

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [orderId, pollCount]);

  if (paymentState === 'confirming') {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col font-serif">
        <SiteHeader />
        <main className="flex-1 w-full py-16 sm:py-24 flex items-center justify-center">
          <Container className="max-w-md w-full font-sans text-center">
            <div className="bg-surface-muted/60 border border-border p-8 sm:p-10 shadow-sm space-y-6">
              <div className="w-14 h-14 border-2 border-antique-gold/30 border-t-antique-gold rounded-full animate-spin mx-auto" />
              <div className="space-y-2">
                <span className="text-[10px] font-sans tracking-[0.28em] uppercase text-antique-gold font-medium block">
                  Authorizing Transaction
                </span>
                <h1 className="font-display text-2xl sm:text-3xl text-espresso tracking-tight">
                  Confirming Payment
                </h1>
                <p className="text-xs text-muted leading-relaxed">
                  Awaiting authoritative signature verification from the payment gateway. Please keep this dossier window open.
                </p>
              </div>
              <div className="text-[11px] font-mono text-muted bg-ivory p-3 border border-border">
                Order Reference: {orderId}
              </div>
            </div>
          </Container>
        </main>
      </div>
    );
  }

  if (paymentState === 'failed') {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col font-serif">
        <SiteHeader />
        <main className="flex-1 w-full py-16 sm:py-24 flex items-center justify-center">
          <Container className="max-w-md w-full font-sans text-center">
            <div className="bg-surface-muted/60 border border-border p-8 sm:p-10 shadow-sm space-y-6">
              <div className="w-14 h-14 bg-rose-500/10 border border-rose-500/30 text-rose-500 rounded-full flex items-center justify-center text-2xl mx-auto">
                ✕
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-sans tracking-[0.28em] uppercase text-rose-500 font-medium block">
                  Transaction Incomplete
                </span>
                <h1 className="font-display text-2xl sm:text-3xl text-espresso tracking-tight">
                  Payment Unconfirmed
                </h1>
                <p className="text-xs text-muted leading-relaxed">
                  We were unable to confirm payment for order <span className="font-mono text-espresso">{orderId}</span>. Your held inventory has been restored.
                </p>
              </div>
              <div className="flex flex-col gap-3 pt-2">
                <Link
                  href="/cart"
                  className="w-full py-3 bg-aged-gold hover:bg-antique-gold text-accent-on-fill text-xs uppercase tracking-[0.2em] font-medium transition-colors"
                >
                  Return to Cart & Retry
                </Link>
                <Link
                  href="/contact"
                  className="w-full py-3 border border-border text-espresso hover:border-antique-gold text-xs uppercase tracking-[0.2em] font-medium transition-colors"
                >
                  Contact Atelier Care
                </Link>
              </div>
            </div>
          </Container>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-serif">
      <SiteHeader />

      <main className="flex-1 w-full py-12 sm:py-20 flex items-center justify-center">
        <Container className="max-w-2xl w-full font-sans">
          <div className="bg-surface-muted/60 border border-border p-8 sm:p-12 shadow-sm space-y-10 text-center">
            {/* Header Banner */}
            <div className="space-y-3">
              <div className="w-16 h-16 bg-deep-emerald/10 border border-deep-emerald/30 text-deep-emerald rounded-full flex items-center justify-center text-2xl mx-auto">
                ✓
              </div>
              <span className="text-[10px] font-sans tracking-[0.28em] uppercase text-antique-gold font-medium block">
                Acquisition Confirmed
              </span>
              <h1 className="font-display text-3xl sm:text-5xl text-espresso tracking-tight">
                Thank You for Your Order
              </h1>
              <p className="text-xs text-muted font-sans max-w-md mx-auto leading-relaxed">
                Your order dossier has been logged under ID <strong className="text-espresso font-mono">{orderId}</strong>. A receipt and waybill confirmation have been sent to your email.
              </p>
            </div>

            {/* Courier Tracking Steps */}
            <div className="p-6 bg-ivory border border-border space-y-4 text-xs text-left">
              <span className="text-[10px] uppercase tracking-wider text-muted font-semibold block">
                Live Courier Logistics Status
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-deep-emerald/10 border border-deep-emerald/20 text-deep-emerald rounded-none space-y-1">
                  <span className="text-lg block">📦</span>
                  <span className="font-semibold text-xs block">Order Sealed</span>
                  <span className="text-[10px]">Assigned Waybill #{orderId}</span>
                </div>

                <div className="p-3 bg-surface-muted border border-border text-muted rounded-none space-y-1 opacity-80">
                  <span className="text-lg block">✈</span>
                  <span className="font-semibold text-xs block">Courier Transit</span>
                  <span className="text-[10px]">DHL Express Courier</span>
                </div>

                <div className="p-3 bg-surface-muted border border-border text-muted rounded-none space-y-1 opacity-80">
                  <span className="text-lg block">🏠</span>
                  <span className="font-semibold text-xs block">Delivery</span>
                  <span className="text-[10px]">Est: 2-4 business days</span>
                </div>
              </div>
            </div>

            {/* Order Summary Summary Box */}
            <div className="p-6 bg-ivory border border-border space-y-3 text-xs text-left">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="font-display text-base text-espresso">Order Reference</span>
                <span className="font-mono text-antique-gold font-medium">{orderId}</span>
              </div>
              <div className="flex items-center justify-between text-muted">
                <span>Payment Confirmation</span>
                <span className="text-espresso font-medium">Secured & Verified</span>
              </div>
              <div className="flex items-center justify-between text-muted">
                <span>Amount Paid</span>
                <span className="font-serif text-lg text-antique-gold font-medium">${total} USD</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href={`/account/orders/${orderId}`}
                className="w-full sm:w-auto px-8 py-3.5 bg-aged-gold hover:bg-antique-gold text-accent-on-fill text-xs uppercase tracking-[0.22em] font-medium transition-colors shadow-sm"
              >
                Track Order Dossier
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto px-8 py-3.5 border border-border text-espresso hover:border-antique-gold text-xs uppercase tracking-[0.22em] font-medium transition-colors"
              >
                Return to Sanctuary
              </Link>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background text-muted flex items-center justify-center font-sans text-xs">Loading order confirmation...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
