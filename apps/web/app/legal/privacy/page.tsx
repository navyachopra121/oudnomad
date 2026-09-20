'use client';

import React from 'react';
import Link from 'next/link';
import SiteHeader from '../../components/header/SiteHeader';
import Container from '../../components/Container';

export default function PrivacyPolicyPage() {
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
            <span className="text-antique-gold font-medium shrink-0">Privacy Policy</span>
          </nav>

          {/* Header */}
          <div className="border-b border-border pb-6 space-y-2">
            <span className="text-[10px] tracking-[0.28em] uppercase text-antique-gold font-semibold block">
              Data Protection & Privacy
            </span>
            <h1 className="font-display text-3xl sm:text-4xl text-espresso tracking-tight">
              Privacy & Data Governance Policy
            </h1>
            <p className="text-xs text-muted">
              Last Updated: September 17, 2026 • Compliant with GDPR, CCPA & UAE Data Protection Laws
            </p>
          </div>

          <div className="space-y-8 text-xs sm:text-sm text-espresso/90 leading-relaxed">
            <section className="space-y-3">
              <h2 className="font-display text-xl text-espresso">1. Who We Are</h2>
              <p>
                OudNomad operates as an artisanal luxury perfumery headquartered in Dubai, United Arab Emirates, offering worldwide distribution of rare botanical extracts, oud oils, and fine perfumes.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl text-espresso">2. Information We Collect</h2>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-muted">
                <li><strong>Collector Identity:</strong> Full name, telephone contact, email address, and encrypted credentials.</li>
                <li><strong>Order & Fulfillment Details:</strong> Shipping address, courier transit history, and itemized perfume acquisitions.</li>
                <li><strong>Secured Payments:</strong> Credit/debit card numbers are tokenized directly via Stripe/Telr. We never store raw cardholder data on our servers (PCI-DSS SAQ A compliant).</li>
                <li><strong>Digital Footprint:</strong> Device specifications, IP addresses, cookie preferences, and interaction logs.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl text-espresso">3. How We Utilize Collector Data</h2>
              <p>
                We use collected information strictly to fulfill bespoke orders, dispatch DHL/FedEx courier waybill alerts, generate personalized fragrance recommendations, prevent transaction fraud, and provide 24/7 concierge support.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl text-espresso">4. International Transfers & Security Protocols</h2>
              <p>
                All data transfers are encrypted in transit via TLS 1.3 and at rest via AES-256. Cross-border processing adheres to standard European Commission contractual clauses and regional GCC data residency regulations.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl text-espresso">5. Collector Rights & Inquiries</h2>
              <p>
                You may exercise your right to access, download, or permanently delete your personal archive data at any time by contacting our privacy compliance officer at <a href="mailto:privacy@oudnomad.com" className="text-antique-gold underline">privacy@oudnomad.com</a>.
              </p>
            </section>
          </div>
        </Container>
      </main>
    </div>
  );
}
