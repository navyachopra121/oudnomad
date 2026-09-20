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
