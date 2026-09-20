'use client';

import React from 'react';
import Link from 'next/link';
import SiteHeader from './components/header/SiteHeader';
import Container from './components/Container';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-serif">
      <SiteHeader />

      <main className="flex-1 w-full py-16 sm:py-24 flex items-center justify-center">
        <Container className="max-w-2xl text-center space-y-8 font-sans">
          <div className="space-y-3">
            <span className="text-[10px] uppercase tracking-[0.32em] text-antique-gold font-semibold block">
              Error 404 • Scent Archive Missing
            </span>
            <h1 className="font-display text-4xl sm:text-6xl text-espresso tracking-tight">
              Flacon Not Located
            </h1>
            <p className="text-xs sm:text-sm text-muted max-w-md mx-auto leading-relaxed">
              The archive chamber or perfume flacon you seek is no longer within our active collection, or has moved to an uncataloged vault.
            </p>
          </div>

          <div className="p-6 bg-surface-muted/40 border border-border space-y-4 max-w-md mx-auto text-left">
            <span className="text-[10px] uppercase tracking-wider text-muted font-semibold block">
              Recommended Navigation
            </span>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/collections" className="text-espresso hover:text-antique-gold transition-colors flex items-center justify-between">
                  <span>✦ Explore Permanent Collections</span>
                  <span className="text-antique-gold">→</span>
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-espresso hover:text-antique-gold transition-colors flex items-center justify-between">
                  <span>✦ Search Atelier Archive by Note</span>
                  <span className="text-antique-gold">→</span>
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="text-espresso hover:text-antique-gold transition-colors flex items-center justify-between">
                  <span>✦ Read Connoisseur Appraisals</span>
                  <span className="text-antique-gold">→</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="w-full sm:w-auto px-8 py-3.5 bg-aged-gold hover:bg-antique-gold text-accent-on-fill text-xs uppercase tracking-[0.22em] font-medium transition-colors shadow-sm"
            >
              Return to Sanctuary
            </Link>
            <Link
              href="/collections"
              className="w-full sm:w-auto px-8 py-3.5 border border-border text-espresso hover:border-antique-gold text-xs uppercase tracking-[0.22em] font-medium transition-colors"
            >
              View All Flacons
            </Link>
          </div>
        </Container>
      </main>
    </div>
  );
}
