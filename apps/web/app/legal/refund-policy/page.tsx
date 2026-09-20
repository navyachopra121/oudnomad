'use client';

import React from 'react';
import Link from 'next/link';
import SiteHeader from '../../components/header/SiteHeader';
import Container from '../../components/Container';

export default function RefundPolicyPage() {
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
            <span className="text-antique-gold font-medium shrink-0">Returns & Refunds</span>
          </nav>

          {/* Header */}
          <div className="border-b border-border pb-6 space-y-2">
            <span className="text-[10px] tracking-[0.28em] uppercase text-antique-gold font-semibold block">
              Atelier Guarantee & Consumer Rights
            </span>
            <h1 className="font-display text-3xl sm:text-4xl text-espresso tracking-tight">
              Returns, Exchanges & Refund Policy
            </h1>
            <p className="text-xs text-muted">
              Last Updated: September 17, 2026 • Honoring 14-Day Statutory Returns
            </p>
          </div>

          <div className="space-y-8 text-xs sm:text-sm text-espresso/90 leading-relaxed">
            <section className="space-y-3">
              <h2 className="font-display text-xl text-espresso">1. 14-Day Return Window</h2>
              <p>
                We offer a 14-day return window from the timestamp of courier delivery. Collectors in the European Union benefit from an unconditional 14-day statutory right of withdrawal.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl text-espresso">2. Flacon Integrity & Conditions for Return</h2>
              <p>
                Due to the intimate, sanitary, and volatile nature of haute perfumery and concentrated attars:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-muted">
                <li>Flacons must remain unopened in their original coffret with wax seal and tamper-evident band intact.</li>
                <li>Crystal dipsticks and presentation droppers must not have contacted human skin.</li>
                <li>Discovery sample sets included complimentary with select orders may be sampled prior to opening the main flacon.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl text-espresso">3. Transit Damage Guarantee</h2>
              <p>
                In the rare event that a crystal bottle or coffret sustains damage during courier transit, contact us at <a href="mailto:support@oudnomad.com" className="text-antique-gold underline">support@oudnomad.com</a> within 48 hours of delivery with photographic documentation. We will immediately dispatch a priority replacement or issue a full refund.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl text-espresso">4. Refund Issuance & Timelines</h2>
              <p>
                Upon inspection of the returned flacon at our Dubai atelier, refunds are credited back to the original payment source (Stripe / Telr / Credit Card) within 3 to 5 business days.
              </p>
            </section>
          </div>
        </Container>
      </main>
    </div>
  );
}
