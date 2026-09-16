'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Container from '../Container';
import { HOME_IMAGES } from './images';
import CornerBrackets from './motifs/CornerBrackets';
import Reveal from './Reveal';
import SectionImage from './SectionImage';
import { useReducedMotion } from './use-reduced-motion';

export default function HeritageSection() {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (inView) setOffset((window.innerHeight - rect.top) * 0.04);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [reduceMotion]);

  return (
    <section
      id="sanctuary"
      ref={ref}
      className="relative overflow-hidden bg-ivory text-espresso section-py border-b border-border"
    >
      <Container className="relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Visual Showcase Framing (Store DNA) */}
          <div className="lg:col-span-6">
            <Reveal>
              <div className="relative aspect-[4/5] max-h-[75vw] md:max-h-none border border-border bg-surface-muted/60 p-2 sm:p-3 overflow-hidden rounded-sm shadow-md">
                <CornerBrackets />

                <div className="relative h-full w-full overflow-hidden bg-ivory border border-border">
                  <SectionImage
                    src={HOME_IMAGES.heritage.src}
                    alt="The Oud Nomad boutique sanctuary interior with carved mahogany and chandeliers"
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover object-center transition-transform duration-700 hover:scale-105"
                  />
                </div>

                {/* Floating Architectural Annotation */}
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-ivory/95 backdrop-blur-md border border-border text-[11px] text-espresso shadow-md rounded-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-deep-emerald" />
                    <span className="uppercase tracking-[0.2em] text-antique-gold font-medium text-[10px]">
                      The Physical Sanctuary
                    </span>
                  </div>
                  <p className="font-light text-xs text-muted">
                    Exposed red brick, hand-carved mahogany consoles, crystal chandeliers, and Persian
                    carpets underfoot.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Narrative Column */}
          <div className="lg:col-span-6">
            <Reveal delayMs={140}>
              <div className="inline-flex items-center gap-3 mb-5">
                <span className="h-[1px] w-8 bg-antique-gold/60" />
                <p className="text-[11px] uppercase tracking-[0.3em] text-antique-gold font-medium">
                  The Sanctuary DNA
                </p>
              </div>

              <h2 className="font-display text-fluid-h2 text-espresso font-normal leading-[1.12]">
                Ottoman opulence. <br />
                A moody sanctuary for the senses.
              </h2>

              <p
                className="font-arabic text-lg text-antique-gold mt-3 font-light"
                dir="rtl"
                lang="ar"
              >
                أصالة الضيافة العربية في رحاب الطراز العثماني العتيق
              </p>

              <blockquote className="font-display text-fluid-quote leading-snug italic text-espresso my-7 border-l-2 border-antique-gold pl-5">
                &ldquo;Walking through our doors is an unhurried journey into another era — where
                bottles glow like jewels in display vitrines and conversations linger over hot tea and
                bakhoor smoke.&rdquo;
              </blockquote>

              <p className="text-sm md:text-base text-muted leading-relaxed font-light space-y-3">
                <span>
                  Oud Nomad was born out of rejection for commercial, flat perfume counters. In our
                  atelier, raw wood beams meet Chinoiserie floral tapestries and antique Persian rugs.
                  Every guest is welcomed not as a buyer, but as a patron of ancient perfumery.
                </span>
              </p>

              {/* Boutique Features Pills */}
              <div className="grid grid-cols-2 gap-4 my-8 pt-6 border-t border-border">
                <div className="space-y-1">
                  <p className="font-display text-xl text-espresso">1998</p>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted">
                    Founding Atelier
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="font-display text-xl text-espresso">100%</p>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted">
                    Uncut Pure Resins
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <Link
                  href="/search"
                  className="inline-flex items-center justify-center px-8 py-3.5 text-[11px] uppercase tracking-[0.22em] font-medium bg-aged-gold text-accent-on-fill hover:opacity-90 transition-opacity duration-400"
                >
                  Acquire Our Blends
                </Link>
                <Link
                  href="#majlis"
                  className="text-xs uppercase tracking-[0.2em] text-antique-gold hover:text-espresso transition-colors duration-300 nav-link"
                >
                  Join Private Majlis →
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
