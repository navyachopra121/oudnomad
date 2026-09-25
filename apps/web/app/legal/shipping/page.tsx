'use client';

import React from 'react';
import Link from 'next/link';
import SiteHeader from '../../components/header/SiteHeader';
import Container from '../../components/Container';

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-serif">
      <SiteHeader />

      <main className="flex-1 w-full py-8 sm:py-16">
        <Container className="max-w-4xl space-y-10 font-sans">
          {/* Breadcrumbs */}
          <nav className="text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-muted flex flex-wrap items-center gap-1.5 sm:gap-2 leading-relaxed py-1">
            <Link href="/" className="hover:text-espresso transition-colors shrink-0">Home</Link>
            <span className="opacity-50">/</span>
            <span className="text-muted shrink-0">Legal</span>
            <span className="opacity-50">/</span>
            <span className="text-antique-gold font-medium shrink-0">Shipping & Delivery</span>
          </nav>

          {/* Header */}
          <div className="border-b border-border pb-6 space-y-2">
            <span className="text-[10px] tracking-[0.28em] uppercase text-antique-gold font-semibold block">
              Atelier Logistics & Courier Service
            </span>
            <h1 className="font-display text-3xl sm:text-4xl text-espresso tracking-tight">
              GCC Express Shipping & Delivery Policy
            </h1>
            <p className="text-xs text-muted">
              Last Updated: September 17, 2026 • Effective for GCC Region
            </p>
          </div>

          <div className="space-y-8 text-xs sm:text-sm text-espresso/90 leading-relaxed">
            {/* Courier Section */}
            <section className="space-y-3">
              <h2 className="font-display text-xl text-espresso">1. White-Glove Courier Transit</h2>
              <p>
                All OudNomad extraits, concentrated attars, and bakhoor resins are dispatched exclusively via our verified international courier partners: <strong>DHL Express GCC Regional Courier</strong> and <strong>Aramex / FedEx GCC Priority Express</strong>.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-surface-muted/50 border border-border space-y-1 text-xs">
                  <span className="font-semibold text-espresso block">GCC & Middle East</span>
                  <span className="text-antique-gold font-medium">1 – 2 Business Days</span>
                  <p className="text-[11px] text-muted">Direct dispatch from our Dubai fulfillment atelier.</p>
                </div>
                <div className="p-4 bg-surface-muted/50 border border-border space-y-1 text-xs">
                  <span className="font-semibold text-espresso block">UK & Western Europe</span>
                  <span className="text-antique-gold font-medium">2 – 4 Business Days</span>
                  <p className="text-[11px] text-muted">Air express via Frankfurt and London hubs.</p>
                </div>
                <div className="p-4 bg-surface-muted/50 border border-border space-y-1 text-xs">
                  <span className="font-semibold text-espresso block">North America & Asia</span>
                  <span className="text-antique-gold font-medium">3 – 5 Business Days</span>
                  <p className="text-[11px] text-muted">Expedited customs clearance with live signature confirmation.</p>
                </div>
              </div>
            </section>

            {/* Packaging Guarantee */}
            <section className="space-y-3">
              <h2 className="font-display text-xl text-espresso">2. Temperature-Controlled & Shockproof Packaging</h2>
              <p>
                Natural agarwood oils and floral extracts are volatile botanical treasures sensitive to extreme thermal shifts. Each flacon is hand-inspected, wax-sealed, and encased in our custom high-density shock-absorbing presentation coffrets.
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-muted">
                <li>Double-walled thermal insulation protecting against extreme transit temperatures.</li>
                <li>Tamper-evident serial seal guaranteeing provenance from our master perfumer.</li>
                <li>Individual cushioning for crystal dipsticks and gold-plated caps.</li>
              </ul>
            </section>

            {/* Complimentary Tier */}
            <section className="space-y-3">
              <h2 className="font-display text-xl text-espresso">3. Complimentary Shipping Thresholds</h2>
              <p>
                We provide complimentary GCC express shipping on all orders totaling <strong>$250 USD</strong> (or local currency equivalent) or more. For acquisitions below this threshold, a flat-rate courier fee of <strong>$25 USD</strong> applies at checkout.
              </p>
            </section>

            {/* Duties & Taxes */}
            <section className="space-y-3">
              <h2 className="font-display text-xl text-espresso">4. Delivered Duty Paid (DDP) Guarantee</h2>
              <p>
                All orders destined for the UAE, Saudi Arabia, Qatar, Kuwait, the United Kingdom, the European Union, and the United States are dispatched under <strong>Delivered Duty Paid (DDP)</strong> terms. You will never be asked to pay unexpected import duties or tariff fees upon courier arrival.
              </p>
            </section>

            {/* Tracking & Assistance */}
            <section className="space-y-3">
              <h2 className="font-display text-xl text-espresso">5. Real-Time Tracking & Signature Delivery</h2>
              <p>
                Upon dispatch, your digital Order Dossier is updated with an authoritative waybill number accessible via your <Link href="/account/orders" className="text-antique-gold underline underline-offset-2">Account Orders</Link> dashboard. All deliveries require an adult signature upon delivery.
              </p>
              <p className="text-xs text-muted pt-2">
                For special courier accommodations, diplomatic delivery, or bespoke hand-courier inquiries, please consult our concierge at <a href="mailto:concierge@oudnomad.com" className="text-antique-gold underline">concierge@oudnomad.com</a>.
              </p>
            </section>
          </div>
        </Container>
      </main>
    </div>
  );
}
