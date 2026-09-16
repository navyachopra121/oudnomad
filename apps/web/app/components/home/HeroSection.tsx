'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Container from '../Container';
import { HOME_IMAGES } from './images';
import ChinoiseriePattern from './motifs/ChinoiseriePattern';
import SectionImage from './SectionImage';
import { useReducedMotion } from './use-reduced-motion';

export default function HeroSection() {
  const reduceMotion = useReducedMotion();
  const [loaded, setLoaded] = useState(reduceMotion);
  const [parallaxY, setParallaxY] = useState(0);

  useEffect(() => {
    if (reduceMotion) {
      setLoaded(true);
      return;
    }
    const t = window.setTimeout(() => setLoaded(true), 150);
    return () => window.clearTimeout(t);
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return;
    const onScroll = () => {
      const y = Math.min(window.scrollY, window.innerHeight);
      setParallaxY(y * 0.18);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [reduceMotion]);

  const stagger = (ms: number) =>
    reduceMotion
      ? {}
      : {
        opacity: loaded ? 1 : 0,
        transform: loaded ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 800ms var(--ease-luxury) ${ms}ms, transform 900ms var(--ease-luxury) ${ms}ms`,
      };

  return (
    <section className="relative min-h-[94svh] flex items-center bg-ivory text-espresso overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
      {/* Full-bleed background with light atmospheric veil */}
      <div
        className="absolute inset-0"
        style={{ transform: reduceMotion ? undefined : `translate3d(0, ${parallaxY}px, 0)` }}
      >
        <SectionImage
          src={HOME_IMAGES.hero.src}
          alt={HOME_IMAGES.hero.alt}
          priority
          sizes="100vw"
          className="object-cover object-center scale-105"
        />
        {/* Soft light ivory atmospheric tint ensuring pure typography contrast */}
        <div className="absolute inset-0 bg-ivory/80" aria-hidden />
        <div
          className="absolute inset-0 bg-gradient-to-t from-ivory via-ivory/70 to-ivory/90"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-ivory via-ivory/80 to-transparent"
          aria-hidden
        />
      </div>

      {/* Subtle Chinoiserie wallpaper watermark in antique gold */}
      <ChinoiseriePattern opacity={0.05} />

      <Container className="relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Main Editorial Text Column */}
          <div className="lg:col-span-7 xl:col-span-8 max-w-[min(100%,680px)]">
            {/* Top Brand Tag */}
            <div className="flex items-center gap-3 mb-6" style={stagger(0)}>
              <span className="h-[1px] w-8 bg-antique-gold/60" />
              <p className="text-[11px] uppercase tracking-[0.32em] text-antique-gold font-medium">
                Haute Parfumerie & Sacred Resins
              </p>
            </div>

            {/* Main Headline */}
            <h1
              className="font-display text-fluid-hero leading-[1.08] text-espresso font-normal"
              style={stagger(100)}
            >
              Step into a <span className="italic font-light text-antique-gold">different</span> world.
            </h1>

            {/* Arabic accolade */}
            <div className="mt-4 flex items-center gap-3" style={stagger(200)}>
              <p
                className="font-arabic text-lg md:text-xl text-antique-gold font-light"
                dir="rtl"
                lang="ar"
              >
                عالمٌ من الفخامة والأصالة العتيقة
              </p>
              <span className="text-xs text-border-strong">·</span>
              <span className="text-[11px] tracking-[0.2em] text-muted uppercase">
                Est. Dubai 1998
              </span>
            </div>

            {/* Narrative Body */}
            <p
              className="mt-6 text-sm sm:text-base md:text-lg text-muted leading-relaxed font-light max-w-xl"
              style={stagger(300)}
            >
              Wild Cambodian agarwood, hand-aged attars, and centuries of Arabian fragrance craft. Gathered
              under one roof in Dubai for those who expect another world.
            </p>

            {/* Sharp Architectural CTAs */}
            <div
              className="mt-10 flex flex-wrap items-center gap-4 sm:gap-6"
              style={stagger(400)}
            >
              <Link
                href="/search"
                className="inline-flex items-center justify-center px-8 py-4 text-[11px] uppercase tracking-[0.24em] font-medium bg-aged-gold text-accent-on-fill hover:opacity-90 active:opacity-90 transition-opacity duration-500 shadow-sm"
              >
                Discover Extraits
              </Link>
              <Link
                href="#sanctuary"
                className="inline-flex items-center justify-center px-8 py-4 text-[11px] uppercase tracking-[0.24em] font-medium border border-antique-gold/50 text-antique-gold hover:bg-surface-muted hover:text-espresso transition-all duration-400"
              >
                The Sanctuary Story
              </Link>
            </div>

            {/* Trust Micro-Badges */}
            <div
              className="mt-12 pt-8 border-t border-border flex flex-wrap items-center gap-6 sm:gap-10 text-[11px] text-muted"
              style={stagger(500)}
            >
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-deep-emerald ring-2 ring-deep-emerald/20" />
                <span>Wild Harvest Agarwood</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-aged-gold ring-2 ring-aged-gold/20" />
                <span>Small Batch Alembic Distillation</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-antique-brass ring-2 ring-antique-brass/20" />
                <span>Cask-Aged in Cedarwood</span>
              </div>
            </div>
          </div>

          {/* Right Flacon Vitrine Showcase */}
          <div
            className="lg:col-span-5 xl:col-span-4 flex justify-center lg:justify-end"
            style={stagger(450)}
          >
            <div className="relative w-full max-w-[340px] sm:max-w-[380px] p-6 sm:p-7 bg-surface-muted/60 border border-border rounded-sm shadow-[0_20px_50px_-20px_rgba(28,20,15,0.12)]">
              {/* Corner Filigree Accents */}
              <div className="absolute top-2 left-2 text-antique-gold/40 text-[10px]">⌜</div>
              <div className="absolute top-2 right-2 text-antique-gold/40 text-[10px]">⌝</div>
              <div className="absolute bottom-2 left-2 text-antique-gold/40 text-[10px]">⌞</div>
              <div className="absolute bottom-2 right-2 text-antique-gold/40 text-[10px]">⌟</div>

              {/* Showcase Bottle Card */}
              <div className="relative aspect-[3/4] w-full overflow-hidden border border-border bg-ivory">
                <SectionImage
                  src={HOME_IMAGES.heroBottle.src}
                  alt={HOME_IMAGES.heroBottle.alt}
                  sizes="(max-width: 768px) 100vw, 380px"
                  className="object-cover object-center transition-transform duration-700 hover:scale-105"
                />
                {/* Concentration Badge */}
                <div className="absolute top-3 left-3 px-3 py-1 bg-ivory/95 border border-border text-[10px] uppercase tracking-[0.2em] text-antique-gold font-medium shadow-sm">
                  Extrait de Parfum · 38%
                </div>
              </div>

              {/* Vitrine Caption */}
              <div className="mt-5 space-y-2">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-xl text-espresso tracking-wide">
                    Malaki Oud No. 1
                  </h3>
                  <span className="text-sm text-antique-gold font-medium">AED 790</span>
                </div>
                <p className="text-xs text-muted line-clamp-2 leading-relaxed font-light">
                  25-Year Assam Agarwood layered with Taif Rose and Grey Ambergris.
                </p>
                <div className="pt-2 flex items-center justify-between text-[11px] text-antique-gold">
                  <span className="uppercase tracking-[0.18em]">View Flacon Notes</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
