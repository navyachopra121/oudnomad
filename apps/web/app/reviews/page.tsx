'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SiteHeader from '../components/header/SiteHeader';
import Container from '../components/Container';

interface FeaturedReview {
  id: string;
  author: string;
  location: string;
  productName: string;
  productSlug: string;
  image: string;
  category: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  longevity: string;
  sillage: string;
}

const FEATURED_REVIEWS: FeaturedReview[] = [
  {
    id: 'f-1',
    author: 'Tariq Al-Mansoor',
    location: 'Dubai, UAE',
    productName: 'Malaki Extrait No. 1',
    productSlug: 'malaki-extrait-no-1',
    image: 'https://picsum.photos/seed/malaki-bottle-1/900/1100',
    category: 'oud',
    rating: 5,
    title: 'The apex of artisanal Assam oud — pure royalty',
    body: 'Opens with fiery saffron and dew-drenched Taif rose before settling into an astonishingly dark, resinous Assam agarwood and vintage ambergris. Radiates 16+ hours on skin. Haute perfumery in its purest historical expression.',
    date: 'September 12, 2026',
    longevity: '16+ Hours',
    sillage: 'Regal & Enveloping',
  },
  {
    id: 'f-2',
    author: 'Eleanor Vance',
    location: 'London, UK',
    productName: 'Noor Pure Attar',
    productSlug: 'noor-pure-attar',
    image: 'https://picsum.photos/seed/noor-bottle-1/900/1100',
    category: 'attars',
    rating: 5,
    title: 'Sublime Mysore sandalwood heart with ethereal floral warmth',
    body: 'The non-alcoholic hydro-distillation gives this attar an organic glow that merges seamlessly with natural body warmth. White musk and saffron balance the creamy sandalwood impeccably.',
    date: 'September 04, 2026',
    longevity: '12+ Hours',
    sillage: 'Graceful & Intimate',
  },
  {
    id: 'f-3',
    author: 'Karim B.',
    location: 'Paris, France',
    productName: 'Royal Cambodi Reserve',
    productSlug: 'royal-cambodi-reserve',
    image: 'https://picsum.photos/seed/cambodi-bottle-1/900/1100',
    category: 'oud',
    rating: 5,
    title: 'Pure aged Cambodian oud nectar with honeyed depth',
    body: 'Warm, molasses-like honey sweetness transitioning into deep animalic and woody undertones. A collector flacon worth every dirham. Unrivaled complexity.',
    date: 'August 02, 2026',
    longevity: '24+ Hours on Fabric',
    sillage: 'Intimate Scent Aura',
  },
  {
    id: 'f-4',
    author: 'Dr. Julian Sterling',
    location: 'Geneva, Switzerland',
    productName: 'Dusk Mukhallat Impériale',
    productSlug: 'dusk-mukhallat-imperiale',
    image: 'https://picsum.photos/seed/dusk-bottle-1/900/1100',
    category: 'mukhallat',
    rating: 5,
    title: 'Hypnotic smoky sweetness with golden amber warmth',
    body: 'A mysterious harmony of frankincense smoke, dark plum, and aged resin. Perfect for formal winter evenings. The drydown is deeply meditative.',
    date: 'September 08, 2026',
    longevity: '14 Hours',
    sillage: 'Pronounced Trail',
  },
];

export default function ReviewsPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filtered = activeCategory === 'all'
    ? FEATURED_REVIEWS
    : FEATURED_REVIEWS.filter((r) => r.category === activeCategory);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-serif">
      <SiteHeader />

      <main className="flex-1 w-full py-8 sm:py-16">
        <Container className="space-y-12 sm:space-y-16">
          {/* Breadcrumbs */}
          <nav className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.16em] text-muted flex flex-wrap items-center gap-1.5 sm:gap-2 leading-relaxed py-1">
            <Link href="/" className="hover:text-espresso transition-colors shrink-0">Home</Link>
            <span className="opacity-50">/</span>
            <span className="text-antique-gold font-medium shrink-0">Collector Appraisals</span>
          </nav>

          {/* Hero Header */}
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-antique-gold font-semibold block">
              The Connoisseur Archive
            </span>
            <h1 className="font-display text-3xl sm:text-5xl text-espresso tracking-tight">
              Verified Appraisals & Olfactory Impressions
            </h1>
            <p className="text-xs sm:text-sm font-sans text-muted leading-relaxed">
              Unfiltered reflections from collectors, scholars, and patrons of rare agarwood across the globe.
            </p>
          </div>

          {/* Scorecard Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-sans">
            <div className="bg-surface-muted/50 border border-border p-6 text-center space-y-1">
              <div className="font-display text-3xl text-espresso font-bold">4.96 / 5.0</div>
              <div className="text-antique-gold text-sm">★★★★★</div>
              <p className="text-[11px] text-muted uppercase tracking-wider">Aggregate Collector Rating</p>
            </div>
            <div className="bg-surface-muted/50 border border-border p-6 text-center space-y-1">
              <div className="font-display text-3xl text-espresso font-bold">99.4%</div>
              <div className="text-deep-emerald text-sm">✓ Authenticated</div>
              <p className="text-[11px] text-muted uppercase tracking-wider">Repeat Acquisition Rate</p>
            </div>
            <div className="bg-surface-muted/50 border border-border p-6 text-center space-y-1">
              <div className="font-display text-3xl text-espresso font-bold">1,850+</div>
              <div className="text-antique-gold text-sm">✦ Global Vaults</div>
              <p className="text-[11px] text-muted uppercase tracking-wider">Flacons Archived Worldwide</p>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-3 font-sans text-xs">
            {[
              { id: 'all', label: 'All Appraisals' },
              { id: 'oud', label: 'Royal Oud & Extrait' },
              { id: 'attars', label: 'Pure Attars' },
              { id: 'mukhallat', label: 'Mukhallat Compositions' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-5 py-2.5 uppercase tracking-[0.18em] text-[10px] font-medium transition-colors border ${
                  activeCategory === tab.id
                    ? 'bg-aged-gold text-accent-on-fill border-aged-gold shadow-sm'
                    : 'bg-surface-muted/60 text-muted border-border hover:border-antique-gold/60 hover:text-espresso'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
            {filtered.map((rev) => (
              <div
                key={rev.id}
                className="bg-surface-muted/30 border border-border hover:border-antique-gold/40 p-6 sm:p-8 flex flex-col justify-between gap-6 transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-antique-gold text-sm tracking-wider">
                      {'★'.repeat(rev.rating)}
                    </div>
                    <span className="px-2.5 py-0.5 text-[9px] uppercase tracking-wider font-medium bg-aged-gold/15 text-antique-gold border border-antique-gold/30">
                      ✓ Verified Buyer
                    </span>
                  </div>

                  <h3 className="font-display text-lg text-espresso leading-snug">
                    &ldquo;{rev.title}&rdquo;
                  </h3>

                  <p className="text-xs text-muted leading-relaxed">
                    {rev.body}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1 text-[10px]">
                    <span className="px-2 py-0.5 bg-ivory border border-border text-muted">
                      Longevity: <strong className="text-espresso font-normal">{rev.longevity}</strong>
                    </span>
                    <span className="px-2 py-0.5 bg-ivory border border-border text-muted">
                      Sillage: <strong className="text-espresso font-normal">{rev.sillage}</strong>
                    </span>
                  </div>
                </div>

                {/* Product Reference Card */}
                <div className="pt-4 border-t border-border flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-14 relative bg-espresso/5 border border-border overflow-hidden shrink-0">
                      <Image src={rev.image} alt={rev.productName} fill className="object-cover" />
                    </div>
                    <div>
                      <span className="text-xs text-espresso font-medium block">{rev.author}</span>
                      <span className="text-[10px] text-muted">{rev.location} • {rev.date}</span>
                    </div>
                  </div>

                  <Link
                    href={`/products/${rev.productSlug}`}
                    className="px-3.5 py-2 border border-border text-espresso hover:border-antique-gold hover:text-antique-gold text-[10px] uppercase tracking-wider transition-colors shrink-0"
                  >
                    View Flacon →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Call to Action */}
          <div className="p-8 sm:p-12 bg-ivory border border-border text-center space-y-4 max-w-xl mx-auto font-sans">
            <span className="text-[10px] uppercase tracking-[0.26em] text-antique-gold font-semibold block">
              Experience Bespoke Artisanship
            </span>
            <h2 className="font-display text-2xl sm:text-3xl text-espresso">
              Begin Your Olfactory Journey
            </h2>
            <p className="text-xs text-muted leading-relaxed">
              Explore our permanent collection of pure attars, aged wild ouds, and sacred bakhoor resins.
            </p>
            <div className="pt-2">
              <Link
                href="/collections"
                className="inline-block px-8 py-3.5 bg-aged-gold hover:bg-antique-gold text-accent-on-fill text-xs uppercase tracking-[0.22em] font-medium transition-colors shadow-sm"
              >
                Explore Archives
              </Link>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
