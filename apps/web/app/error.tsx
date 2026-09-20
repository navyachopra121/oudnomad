'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import SiteHeader from './components/header/SiteHeader';
import Container from './components/Container';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Atelier Error Boundary caught exception:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-serif">
      <SiteHeader />

      <main className="flex-1 w-full py-16 sm:py-24 flex items-center justify-center">
        <Container className="max-w-2xl text-center space-y-8 font-sans">
          <div className="space-y-3">
            <span className="text-[10px] uppercase tracking-[0.32em] text-antique-gold font-semibold block">
              Atelier Vault Notice
            </span>
            <h1 className="font-display text-3xl sm:text-5xl text-espresso tracking-tight">
              An Unexpected Interruption
            </h1>
            <p className="text-xs sm:text-sm text-muted max-w-md mx-auto leading-relaxed">
              We encountered a temporary disruption while retrieving archival formulas. Our technical artisans have been notified.
            </p>
          </div>

          <div className="p-4 bg-surface-muted/60 border border-border max-w-md mx-auto font-mono text-[11px] text-muted text-left">
            <p className="text-espresso font-semibold mb-1">Diagnostic Signature:</p>
            <p className="truncate">{error.message || 'Unknown network or parsing error'}</p>
            {error.digest && <p className="text-[10px] text-muted/70 mt-1">Digest: {error.digest}</p>}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => reset()}
              className="w-full sm:w-auto px-8 py-3.5 bg-aged-gold hover:bg-antique-gold text-accent-on-fill text-xs uppercase tracking-[0.22em] font-medium transition-colors shadow-sm"
            >
              Re-attempt Connection
            </button>
            <Link
              href="/"
              className="w-full sm:w-auto px-8 py-3.5 border border-border text-espresso hover:border-antique-gold text-xs uppercase tracking-[0.22em] font-medium transition-colors"
            >
              Return Home
            </Link>
          </div>
        </Container>
      </main>
    </div>
  );
}
