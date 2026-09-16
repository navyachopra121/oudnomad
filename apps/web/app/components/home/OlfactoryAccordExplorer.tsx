'use client';

import { useState } from 'react';
import Container from '../Container';
import { RAW_ELEMENTS, RawElement } from './data';
import CornerBrackets from './motifs/CornerBrackets';
import Reveal from './Reveal';
import SectionImage from './SectionImage';

export default function OlfactoryAccordExplorer() {
  const [activeElement, setActiveElement] = useState<RawElement>(RAW_ELEMENTS[0]);

  return (
    <section id="alchemy" className="relative bg-surface-muted/30 text-espresso section-py overflow-hidden border-b border-border">
      <Container className="relative z-10">
        {/* Section Header */}
        <div className="max-w-2xl mb-14 md:mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="h-[1px] w-8 bg-antique-gold/60" />
            <p className="text-[11px] uppercase tracking-[0.3em] text-antique-gold font-medium">
              The Raw Alchemy
            </p>
          </div>
          <h2 className="font-display text-fluid-h2 text-espresso font-normal leading-[1.14]">
            Before the flacon, <br className="hidden sm:inline" />
            there was the forest.
          </h2>
          <p className="mt-4 text-sm md:text-base text-muted leading-relaxed font-light">
            We extract pure absolutes through century-old methods. No synthetic extenders, no rush.
            Select an essence below to explore its origin and sacred extraction.
          </p>
        </div>

        {/* Interactive Accord Explorer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Interactive Element Selector Pills */}
          <div className="lg:col-span-5 space-y-3">
            {RAW_ELEMENTS.map((elem) => {
              const isActive = activeElement.id === elem.id;

              return (
                <button
                  key={elem.id}
                  type="button"
                  onClick={() => setActiveElement(elem)}
                  className={`w-full text-left p-5 sm:p-6 transition-all duration-300 rounded-sm border ${
                    isActive
                      ? 'bg-ivory border-antique-gold ring-1 ring-antique-gold/30 shadow-md'
                      : 'bg-ivory/60 hover:bg-ivory border-border text-espresso'
                  }`}
                >
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span
                      className={`font-display text-lg sm:text-xl transition-colors ${
                        isActive ? 'text-espresso font-medium' : 'text-espresso/80'
                      }`}
                    >
                      {elem.name}
                    </span>
                    <span
                      className={`font-arabic text-sm transition-colors ${
                        isActive ? 'text-antique-gold' : 'text-antique-gold/60'
                      }`}
                    >
                      {elem.arabicName}
                    </span>
                  </div>

                  <p className="text-xs text-antique-gold uppercase tracking-[0.16em] mb-2 font-medium">
                    {elem.provenance}
                  </p>

                  <p className="text-xs text-muted font-light line-clamp-2 leading-relaxed">
                    {elem.character}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Right Column: In-Depth Showcase of Active Element */}
          <div className="lg:col-span-7">
            <Reveal key={activeElement.id} delayMs={100}>
              <div className="relative bg-ivory p-6 sm:p-8 md:p-10 rounded-sm border border-border shadow-md">
                <CornerBrackets />

                {/* Split Content within active display */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                  {/* Visual Image Plate */}
                  <div className="md:col-span-5 relative aspect-square overflow-hidden bg-surface-muted border border-border shadow-inner">
                    <SectionImage
                      src={activeElement.image.src}
                      alt={activeElement.image.alt}
                      sizes="(max-width: 768px) 100vw, 360px"
                      className="object-cover object-center"
                    />
                  </div>

                  {/* Informational Prose */}
                  <div className="md:col-span-7 space-y-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.24em] text-antique-gold font-medium">
                        Botanical Heritage
                      </p>
                      <h3 className="font-display text-2xl sm:text-3xl text-espresso mt-1">
                        {activeElement.name}
                      </h3>
                      <p className="font-arabic text-base text-antique-gold mt-1 font-light" dir="rtl" lang="ar">
                        {activeElement.arabicName}
                      </p>
                    </div>

                    <div className="space-y-3 pt-2 text-xs sm:text-sm text-espresso leading-relaxed font-light">
                      <div>
                        <span className="uppercase tracking-[0.18em] text-[10px] text-antique-gold font-medium block mb-0.5">
                          Sensory Profile
                        </span>
                        <p className="text-muted">{activeElement.character}</p>
                      </div>

                      <div>
                        <span className="uppercase tracking-[0.18em] text-[10px] text-antique-gold font-medium block mb-0.5">
                          Alchemical Extraction
                        </span>
                        <p className="text-muted">{activeElement.alchemy}</p>
                      </div>

                      <div className="pt-2">
                        <span className="uppercase tracking-[0.18em] text-[10px] text-antique-gold font-medium block mb-0.5">
                          Harvest Provenance
                        </span>
                        <p className="text-antique-gold font-medium">{activeElement.provenance}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
