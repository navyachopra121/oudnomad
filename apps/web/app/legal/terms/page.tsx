'use client';

import React from 'react';
import Link from 'next/link';
import SiteHeader from '../../components/header/SiteHeader';
import Container from '../../components/Container';

export default function TermsOfServicePage() {
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
            <span className="text-antique-gold font-medium shrink-0">Terms of Service</span>
          </nav>

          {/* Header */}
          <div className="border-b border-border pb-6 space-y-2">
            <span className="text-[10px] tracking-[0.28em] uppercase text-antique-gold font-semibold block">
              Atelier Governance
            </span>
            <h1 className="font-display text-3xl sm:text-4xl text-espresso tracking-tight">
              Terms of Acquisition & Service
            </h1>
            <p className="text-xs text-muted">
              Last Updated: September 17, 2026 • Governing Worldwide Storefront Orders
            </p>
          </div>

          <div className="space-y-8 text-xs sm:text-sm text-espresso/90 leading-relaxed">
            <section className="space-y-3">
              <h2 className="font-display text-xl text-espresso">1. Acceptance of Terms</h2>
              <p>
                By navigating this website, registering an account dossier, or purchasing flacons from OudNomad, you enter into a binding agreement governed by these Terms of Service and applicable UAE commercial regulations.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl text-espresso">2. Artisanal Batch Provenance & Botanical Nature</h2>
              <p>
                Our perfumes and concentrated attars are formulated using rare, wild-harvested natural raw materials (including Assam agarwood, Mysore sandalwood, Taif roses, and ambergris). Because these are living extracts distilled in limited seasonal harvests, subtle organoleptic variations between vintage years are natural hallmarks of authentic perfumery.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl text-espresso">3. Pricing, Taxes & Binding Acquisitions</h2>
              <p>
                All prices are stated in USD or indicated local currencies with transparent breakdowns of applicable duties and taxes. Orders become definitive upon issuance of the digital confirmation receipt and assigned waybill dossier.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl text-espresso">4. Connoisseur Appraisals & Community Standards</h2>
              <p>
                Customer impressions and reviews submitted on our platform reflect authentic experiences of verified patrons. We reserve the right to moderate or delete submissions containing defamatory language, commercial solicitations, or fraudulent claims.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl text-espresso">5. Governing Law & Atelier Concierge</h2>
              <p>
                These terms are governed by the laws of Dubai and the United Arab Emirates. For any resolution, inquiries, or mediation, contact our legal atelier at <a href="mailto:legal@oudnomad.com" className="text-antique-gold underline">legal@oudnomad.com</a>.
              </p>
            </section>
          </div>
        </Container>
      </main>
    </div>
  );
}
