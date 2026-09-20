'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SiteHeader from '../components/header/SiteHeader';
import Container from '../components/Container';

interface Ingredient {
  id: string;
  name: string;
  latinName: string;
  origin: string;
  character: string;
  description: string;
  image: string;
}

const INGREDIENTS: Ingredient[] = [
  {
    id: 'assam-oud',
    name: 'Wild Assam Agarwood',
    latinName: 'Aquilaria Agallocha',
    origin: 'Assam, Northeast India',
    character: 'Smoky, Balsamic, Resinous, Animalic Honey',
    description: 'Harvested strictly from naturally fallen or dying wild forest trees that have defended themselves against fungus for over forty to sixty years. The result is an inky, pitch-black resin of astonishing depth.',
    image: 'https://picsum.photos/seed/assam-agarwood-wood/900/600',
  },
  {
    id: 'mysore-sandalwood',
    name: 'Aged Mysore Sandalwood',
    latinName: 'Santalum Album',
    origin: 'Karnataka, Southern India',
    character: 'Creamy, Lactonic, Woody, Meditative Warmth',
    description: 'The sacred heartwood distilled over steam in traditional copper deg vessels. Serves as the soothing, non-alcoholic botanical base into which volatile floral petals are captured.',
    image: 'https://picsum.photos/seed/sandalwood-heart/900/600',
  },
  {
    id: 'taif-rose',
    name: 'Taif Mountain Rose',
    latinName: 'Rosa Damascena Trigintipetala',
    origin: 'Taif, Saudi Arabia (2,000m Altitude)',
    character: 'Crisp, Spicy Floral, Honeyed, Luminous Citrus Petals',
    description: 'Hand-picked exclusively at first dawn while the morning dew still clings to the petals. Distilled within hours of harvest to preserve the delicate, intoxicatingly crisp top notes.',
    image: 'https://picsum.photos/seed/taif-rose-petals/900/600',
  },
  {
    id: 'ambergris',
    name: 'Vintage White Ambergris',
    latinName: 'Ambra Grisea',
    origin: 'Arabian Sea Shorelines',
    character: 'Salty Marine, Sweet Musky, Velvety Warm Skin Resonance',
    description: 'Found cured after decades drifting across oceanic saltwater and sun. Macerated slowly in vintage sandalwood to yield an ethereal golden tincture that anchors a fragrance for days.',
    image: 'https://picsum.photos/seed/ambergris-tincture/900/600',
  },
];

export default function CraftPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-serif">
      <SiteHeader />

      <main className="flex-1 w-full py-8 sm:py-16">
        <Container className="space-y-16 sm:space-y-24">
          {/* Breadcrumbs */}
          <nav className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.16em] text-muted flex flex-wrap items-center gap-1.5 sm:gap-2 leading-relaxed py-1">
            <Link href="/" className="hover:text-espresso transition-colors shrink-0">Home</Link>
            <span className="opacity-50">/</span>
            <span className="text-antique-gold font-medium shrink-0">The Raw Alchemy & Craft</span>
          </nav>

          {/* Hero Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4 font-sans">
            <span className="text-[10px] tracking-[0.32em] uppercase text-antique-gold font-semibold block">
              Pre-Industrial Distillation & Raw Botanicals
            </span>
            <h1 className="font-display text-4xl sm:text-6xl text-espresso tracking-tight">
              Raw Alchemy & Distillation
            </h1>
            <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-2xl mx-auto">
              Every flacon born in our atelier begins not in a laboratory, but in deep rainforest canopies, dawn rose terraces, and centuries-old copper alembics.
            </p>
          </div>

          {/* Botanical Ingredients Grid */}
          <div className="space-y-8 font-sans">
            <div className="border-b border-border pb-4 flex items-end justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-[0.24em] text-antique-gold font-semibold block">
                  The Four Pillars
                </span>
                <h2 className="font-display text-2xl sm:text-3xl text-espresso">
                  Sacred Botanical Raw Materials
                </h2>
              </div>
              <span className="text-xs text-muted">100% Traceable Provenance</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {INGREDIENTS.map((ing) => (
                <div
                  key={ing.id}
                  className="bg-surface-muted/30 border border-border hover:border-antique-gold/40 p-6 sm:p-8 flex flex-col justify-between gap-6 transition-all"
                >
                  <div className="space-y-4">
                    <div className="aspect-[16/9] relative bg-espresso/5 border border-border overflow-hidden">
                      <Image
                        src={ing.image}
                        alt={ing.name}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-700"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-antique-gold font-mono uppercase tracking-wider text-[11px] font-semibold">{ing.origin}</span>
                        <span className="italic text-muted text-[11px]">{ing.latinName}</span>
                      </div>
                      <h3 className="font-display text-2xl text-espresso">{ing.name}</h3>
                    </div>

                    <p className="text-xs text-muted leading-relaxed">
                      {ing.description}
                    </p>
                  </div>

                  <div className="p-3 bg-ivory border border-border/80 text-[11px] space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-muted font-semibold block">Aroma Signature:</span>
                    <p className="text-espresso font-medium">{ing.character}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* The 4-Stage Distillation Process */}
          <div className="space-y-10 font-sans">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-[10px] uppercase tracking-[0.28em] text-antique-gold font-semibold block">
                From Forest to Flacon
              </span>
              <h2 className="font-display text-3xl text-espresso">
                The Slow Artisanal Journey
              </h2>
              <p className="text-xs text-muted leading-relaxed">
                A process that refuses to be rushed by mechanical clocks.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-surface-muted/40 border border-border space-y-3">
                <span className="font-mono text-xs text-antique-gold font-bold">STAGE 01</span>
                <h3 className="font-display text-lg text-espresso">Ethical Sourcing</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Only aged agarwood infected naturally over decades is collected. Young trees are left untouched to sustain future forests.
                </p>
              </div>

              <div className="p-6 bg-surface-muted/40 border border-border space-y-3">
                <span className="font-mono text-xs text-antique-gold font-bold">STAGE 02</span>
                <h3 className="font-display text-lg text-espresso">Spring Soaking</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Agarwood chips are gently cleaved by hand and soaked in natural mountain spring water for days to soften resin veins.
                </p>
              </div>

              <div className="p-6 bg-surface-muted/40 border border-border space-y-3">
                <span className="font-mono text-xs text-antique-gold font-bold">STAGE 03</span>
                <h3 className="font-display text-lg text-espresso">Copper Deg Distillation</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Slow hydro-distillation in wood-fired copper cauldrons allows the purest volatile scent heart to condense drop by drop.
                </p>
              </div>

              <div className="p-6 bg-surface-muted/40 border border-border space-y-3">
                <span className="font-mono text-xs text-antique-gold font-bold">STAGE 04</span>
                <h3 className="font-display text-lg text-espresso">Glass Carboy Aging</h3>
                <p className="text-xs text-muted leading-relaxed">
                  The raw extract rests in darkness for years in glass carboys, mellowing into smooth, velvety, timeless perfume nectar.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Invitation */}
          <div className="p-8 sm:p-12 bg-ivory border border-border text-center space-y-4 max-w-xl mx-auto font-sans">
            <span className="text-[10px] uppercase tracking-[0.26em] text-antique-gold font-semibold block">
              Experience the Alchemy
            </span>
            <h2 className="font-display text-2xl sm:text-3xl text-espresso">
              Sample the Distilled Harvest
            </h2>
            <p className="text-xs text-muted leading-relaxed">
              Acquire a flacon of our flagship extraits and pure concentrated attars.
            </p>
            <div className="pt-2">
              <Link
                href="/collections"
                className="inline-block px-8 py-3.5 bg-aged-gold hover:bg-antique-gold text-accent-on-fill text-xs uppercase tracking-[0.22em] font-medium transition-colors shadow-sm"
              >
                Browse The Catalog
              </Link>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
