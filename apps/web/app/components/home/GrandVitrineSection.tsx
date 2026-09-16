'use client';

import Link from 'next/link';
import { useState } from 'react';
import Container from '../Container';
import { VITRINE_MASTERPIECES } from './data';
import CornerBrackets from './motifs/CornerBrackets';
import IlluminatedSprig from './motifs/IlluminatedSprig';
import Reveal from './Reveal';
import SectionImage from './SectionImage';

export default function GrandVitrineSection() {
  const [selectedFlacon, setSelectedFlacon] = useState<string | null>(null);

  return (
    <section id="vitrine" className="relative bg-ivory text-espresso section-py overflow-hidden border-b border-border">
      <Container className="relative z-10">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-16 md:mb-20">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <span className="h-[1px] w-6 bg-antique-gold/50" />
            <p className="text-[11px] uppercase tracking-[0.28em] text-antique-gold font-medium">
              The Grand Vitrine
            </p>
            <span className="h-[1px] w-6 bg-antique-gold/50" />
          </div>

          <h2 className="font-display text-fluid-h2 text-espresso font-normal leading-[1.12]">
            Bottled like jewels. <br className="hidden sm:inline" />
            Aged in shadow.
          </h2>

          <p
            className="font-arabic text-base md:text-lg text-antique-gold mt-3 font-light"
            dir="rtl"
            lang="ar"
          >
            تحف عطرية نادرة معتّقة في خوابي خشب الأرز
          </p>

          <p className="mt-5 text-sm md:text-base text-muted leading-relaxed font-light">
            Inspired by our boutique’s display vitrines. Each extrait is extracted in strictly limited
            batches and aged for multiple seasons before release.
          </p>

          <div className="mt-6 flex justify-center">
            <IlluminatedSprig className="text-antique-gold/60 w-24 h-4" />
          </div>
        </div>

        {/* 4-Column Grand Vitrine Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-7">
          {VITRINE_MASTERPIECES.map((flacon, index) => {
            const isExpanded = selectedFlacon === flacon.id;

            return (
              <Reveal key={flacon.id} delayMs={index * 120} className="h-full">
                <article className="group relative h-full flex flex-col bg-surface-muted/40 border border-border hover:border-antique-gold/40 rounded-sm overflow-hidden p-5 sm:p-6 transition-all duration-500 hover:shadow-[0_16px_36px_-10px_rgba(28,20,15,0.1)]">
                  {/* Corner Filigree Brackets */}
                  <div className="opacity-40 group-hover:opacity-100 transition-opacity duration-500">
                    <CornerBrackets />
                  </div>

                  {/* Flacon Image Showcase Container */}
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-ivory border border-border mb-6">
                    <SectionImage
                      src={flacon.image.src}
                      alt={flacon.image.alt}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Concentration & Volume Badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-ivory/95 backdrop-blur-sm border border-border text-[9px] uppercase tracking-[0.18em] text-antique-gold font-medium">
                      {flacon.volume}
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      {/* Concentration */}
                      <p className="text-[10px] uppercase tracking-[0.2em] text-antique-gold font-medium mb-1">
                        {flacon.concentration}
                      </p>

                      {/* Title & Price */}
                      <div className="flex items-baseline justify-between gap-2 mb-3">
                        <h3 className="font-display text-xl text-espresso group-hover:text-antique-gold transition-colors duration-400">
                          {flacon.name}
                        </h3>
                        <span className="text-sm font-medium text-antique-gold whitespace-nowrap">
                          {flacon.price}
                        </span>
                      </div>

                      {/* Accords preview */}
                      <p className="text-xs text-muted font-light leading-relaxed mb-4">
                        {flacon.accords}
                      </p>

                      {/* Interactive Olfactory Notes Drawer Button */}
                      <button
                        type="button"
                        onClick={() => setSelectedFlacon(isExpanded ? null : flacon.id)}
                        className="w-full text-left py-2 px-3 text-[10px] uppercase tracking-[0.16em] text-espresso bg-ivory hover:bg-surface-muted border border-border rounded-sm flex items-center justify-between transition-colors duration-300 mb-4"
                      >
                        <span>{isExpanded ? 'Conceal Olfactory Notes' : 'Inspect Olfactory Notes'}</span>
                        <span className="text-xs text-antique-gold">{isExpanded ? '−' : '+'}</span>
                      </button>

                      {/* Expandable Notes Breakdown */}
                      {isExpanded && (
                        <div className="space-y-2 py-3 px-3.5 bg-ivory border border-border text-[11px] rounded-sm mb-4 animate-in fade-in duration-300">
                          <div>
                            <span className="text-[9px] uppercase tracking-[0.16em] text-antique-gold font-medium">
                              Head:
                            </span>{' '}
                            <span className="text-muted">{flacon.notes.top}</span>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase tracking-[0.16em] text-antique-gold font-medium">
                              Heart:
                            </span>{' '}
                            <span className="text-muted">{flacon.notes.heart}</span>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase tracking-[0.16em] text-antique-gold font-medium">
                              Base:
                            </span>{' '}
                            <span className="text-muted">{flacon.notes.base}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                      <Link
                        href={`/search?q=${encodeURIComponent(flacon.name)}`}
                        className="w-full inline-flex items-center justify-center py-3 text-[10px] uppercase tracking-[0.22em] font-medium border border-antique-gold/60 text-antique-gold hover:bg-aged-gold hover:text-accent-on-fill hover:border-aged-gold transition-all duration-400"
                      >
                        Acquire Flacon
                      </Link>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        {/* Bottom Editorial Quote */}
        <div className="mt-16 text-center">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">
            Each flacon is serialized and delivered in silk-wrapped atelier coffrets
          </p>
        </div>
      </Container>
    </section>
  );
}
