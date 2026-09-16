'use client';

import { FormEvent, useState } from 'react';
import Container from '../Container';
import ChinoiseriePattern from './motifs/ChinoiseriePattern';
import CornerBrackets from './motifs/CornerBrackets';
import WaxSealMedallion from './motifs/WaxSealMedallion';
import Reveal from './Reveal';

export default function JoinMajlisSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitted'>('idle');

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('submitted');
  };

  return (
    <section
      id="majlis"
      className="relative bg-surface-muted/40 text-espresso section-py overflow-hidden border-t border-border"
    >
      {/* Subtle Chinoiserie floral wallpaper watermark overlay in antique gold */}
      <ChinoiseriePattern opacity={0.04} />

      <Container className="relative z-10">
        <Reveal className="max-w-2xl mx-auto text-center">
          <div className="relative p-8 sm:p-12 md:p-14 bg-ivory border border-border rounded-sm shadow-md">
            <CornerBrackets />

            {/* Centered Wax Seal Medallion */}
            <div className="flex justify-center mb-6">
              <WaxSealMedallion surface="ivory" />
            </div>

            <p className="text-[11px] uppercase tracking-[0.3em] text-antique-gold font-medium mb-2">
              Private Client Allocation
            </p>

            <h2 className="font-display text-fluid-h2 text-espresso font-normal leading-[1.15]">
              The Inner Majlis
            </h2>

            <p
              className="font-arabic text-lg text-antique-gold mt-2 font-light"
              dir="rtl"
              lang="ar"
            >
              عضوية مجلس العود الخاص — إصدارات حصرية ونادرة
            </p>

            <p className="mt-4 text-xs sm:text-sm text-muted leading-relaxed font-light max-w-md mx-auto">
              Reserved for patrons of high perfumery. Receive allocations of numbered single-cask
              extraits, private atelier invites, and confidential scent consultations.
            </p>

            {status === 'submitted' ? (
              <div className="mt-8 p-4 bg-surface-muted/60 border border-border text-center rounded-sm animate-in fade-in duration-500">
                <p className="text-sm text-espresso font-display">
                  Your petition has been inscribed into the Majlis ledger.
                </p>
                <p className="text-xs text-muted mt-1">
                  Our private concierge will dispatch word before the next cask release.
                </p>
              </div>
            ) : (
              <form
                onSubmit={onSubmit}
                className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center max-w-md mx-auto"
              >
                <div className="w-full relative">
                  <label htmlFor="majlis-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="majlis-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your patron email address"
                    className="w-full bg-surface-muted border border-border px-4 py-3.5 text-xs text-espresso placeholder:text-muted/70 focus:outline-none focus:border-antique-gold transition-colors rounded-sm"
                    autoComplete="email"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto shrink-0 px-7 py-3.5 text-[10px] uppercase tracking-[0.24em] font-medium bg-aged-gold text-accent-on-fill hover:opacity-90 transition-opacity duration-400 rounded-sm whitespace-nowrap"
                >
                  Join Majlis
                </button>
              </form>
            )}

            <div className="mt-8 pt-6 border-t border-border flex items-center justify-center gap-6 text-[10px] uppercase tracking-[0.16em] text-muted">
              <span>Private Casks</span>
              <span>·</span>
              <span>Bespoke Flights</span>
              <span>·</span>
              <span>Zero Spam</span>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
