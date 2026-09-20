'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SiteHeader from '../components/header/SiteHeader';
import Container from '../components/Container';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-serif">
      <SiteHeader />

      <main className="flex-1 w-full py-8 sm:py-16">
        <Container className="space-y-16 sm:space-y-24">
          {/* Breadcrumbs */}
          <nav className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.16em] text-muted flex flex-wrap items-center gap-1.5 sm:gap-2 leading-relaxed py-1">
            <Link href="/" className="hover:text-espresso transition-colors shrink-0">Home</Link>
            <span className="opacity-50">/</span>
            <span className="text-antique-gold font-medium shrink-0">Our Heritage & Story</span>
          </nav>

          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <span className="text-[10px] font-sans tracking-[0.34em] uppercase text-antique-gold font-semibold block">
              The Genesis of Haute Artisanal Perfumery
            </span>
            <h1 className="font-display text-4xl sm:text-6xl text-espresso tracking-tight leading-none">
              Born from the Whispering Sands & Ancient Woods
            </h1>
            <p className="text-sm sm:text-base font-sans text-muted leading-relaxed max-w-2xl mx-auto">
              OudNomad was established to resurrect an ancient truth: that real perfume is not a fleeting synthetic veil, but an immortal botanical presence carrying the soul of sacred forests.
            </p>
          </div>

          {/* Hero Image Collage */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7 aspect-[16/11] relative bg-espresso/5 border border-border overflow-hidden">
              <Image
                src="https://picsum.photos/seed/oud-heritage-desert/1200/800"
                alt="Ancient Arabian Desert at Twilight"
                fill
                priority
                className="object-cover object-center"
              />
            </div>
            <div className="md:col-span-5 space-y-6 p-4 sm:p-8 bg-surface-muted/50 border border-border">
              <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-antique-gold font-semibold block">
                The Nomadic Origin
              </span>
              <h2 className="font-display text-2xl sm:text-3xl text-espresso">
                Across the Frankincense Trails
              </h2>
              <p className="text-xs sm:text-sm font-sans text-muted leading-relaxed">
                For centuries, nomadic traders crossed the dunes between Dhofar, the mountains of Taif, and the maritime ports of the Indian Ocean, safeguarding rare resins, ambergris boulders, and bundles of wild agarwood.
              </p>
              <p className="text-xs sm:text-sm font-sans text-muted leading-relaxed">
                We inherit this unbroken thread: sourcing each precious drop directly from multi-generational distillers who honor nature’s slow rhythms.
              </p>
            </div>
          </div>

          {/* Scent Philosophy */}
          <div className="max-w-3xl mx-auto space-y-8 text-center">
            <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-antique-gold font-semibold block">
              Our Ethos
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-espresso">
              The Antidote to Industrial Perfumery
            </h2>
            <p className="text-xs sm:text-sm font-sans text-muted leading-relaxed">
              Modern commercial fragrance was conquered by cost-cutting chemicals, synthetic oud replacements, and watered-down alcohol sprays. OudNomad exists in deliberate opposition.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 text-left font-sans">
              <div className="p-6 bg-ivory border border-border space-y-2">
                <span className="text-antique-gold font-mono text-sm block">01 / Provenance</span>
                <h3 className="font-display text-lg text-espresso">Wild Harvest Only</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Wild-harvested old growth trees naturally resinified over decades. Never lab-accelerated chemicals.
                </p>
              </div>

              <div className="p-6 bg-ivory border border-border space-y-2">
                <span className="text-antique-gold font-mono text-sm block">02 / Alchemy</span>
                <h3 className="font-display text-lg text-espresso">Copper Distillation</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Traditional deg-bhapka copper alembics fueled by slow wood fires, capturing volatile heart molecules.
                </p>
              </div>

              <div className="p-6 bg-ivory border border-border space-y-2">
                <span className="text-antique-gold font-mono text-sm block">03 / Patience</span>
                <h3 className="font-display text-lg text-espresso">Vintage Carboy Aging</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Oils rested in subterranean vaults for years, softening sharpness into velvety, honeyed balsamic nectar.
                </p>
              </div>
            </div>
          </div>

          {/* Letter from Master Perfumer */}
          <div className="p-8 sm:p-14 bg-surface-muted/60 border border-antique-gold/40 max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-0.5 bg-antique-gold" />
              <span className="text-[10px] font-sans uppercase tracking-[0.28em] text-antique-gold font-semibold">
                Atelier Manifesto
              </span>
            </div>

            <blockquote className="font-display text-xl sm:text-2xl text-espresso italic leading-relaxed">
              &ldquo;When you wear pure agarwood oil, you wear geological time. You wear sixty years of rainforest rain, mountain sunlight, and the tree’s sacred response to nature. We do not invent scent; we preserve sacred memory.&rdquo;
            </blockquote>

            <div className="pt-2 flex items-center justify-between font-sans text-xs">
              <div>
                <p className="font-semibold text-espresso">Hamdan Al-Fahim</p>
                <p className="text-muted text-[11px]">Master Perfumer & Founder, OudNomad</p>
              </div>
              <span className="font-arabic text-xl text-antique-gold" dir="rtl">
                عود نوماد
              </span>
            </div>
          </div>

          {/* Bottom CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 font-sans pt-4">
            <Link
              href="/craft"
              className="w-full sm:w-auto px-8 py-3.5 bg-aged-gold hover:bg-antique-gold text-accent-on-fill text-xs uppercase tracking-[0.22em] font-medium transition-colors shadow-sm text-center"
            >
              Explore The Craft & Distillation
            </Link>
            <Link
              href="/collections"
              className="w-full sm:w-auto px-8 py-3.5 border border-border text-espresso hover:border-antique-gold text-xs uppercase tracking-[0.22em] font-medium transition-colors text-center"
            >
              Acquire Flacons
            </Link>
          </div>
        </Container>
      </main>
    </div>
  );
}
