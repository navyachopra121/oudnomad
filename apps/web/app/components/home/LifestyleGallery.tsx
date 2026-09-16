'use client';

import Container from '../Container';
import { GALLERY_ITEMS } from './data';
import CornerBrackets from './motifs/CornerBrackets';
import Reveal from './Reveal';
import SectionImage from './SectionImage';
import { useDragScroll } from './use-drag-scroll';

export default function LifestyleGallery() {
  const scrollRef = useDragScroll<HTMLDivElement>();

  return (
    <section
      className="bg-surface-muted/30 text-espresso overflow-hidden pt-12 py-30 border-t border-border"
      style={{ paddingBottom: 'var(--section-py)' }}
      aria-labelledby="community-heading"
    >
      {/* Heading inside Container */}
      <Container className="mb-10">
        <Reveal>
          <div className="flex items-center gap-3 mb-2">
            <span className="h-[1px] w-6 bg-antique-gold/60" />
            <p
              id="community-heading"
              className="text-[10px] uppercase tracking-[0.32em] text-antique-gold font-medium"
            >
              @OUDNOMAD · THE CHRONICLES
            </p>
          </div>
          <h2 className="font-display text-fluid-h2 text-espresso font-normal">
            Echoes from the Sanctuary.
          </h2>
        </Reveal>
      </Container>

      {/*
       * Horizontal scroll strip — edge-to-edge, NOT inside Container.
       * px mirrors Container padding so first card aligns to the page grid.
       */}
      <div
        ref={scrollRef}
        className="flex gap-5 md:gap-6 overflow-x-auto px-4 md:px-6 xl:px-10 pb-4 snap-x snap-mandatory hide-scrollbar select-none"
      >
        {GALLERY_ITEMS.map((item, i) => (
          <Reveal key={item.id} delayMs={i * 50} className="snap-start shrink-0">
            <div className="w-56 sm:w-64 md:w-72 aspect-[3/4] border border-border relative overflow-hidden group rounded-sm bg-ivory shadow-sm">
              <SectionImage
                src={item.image.src}
                alt={item.image.alt}
                sizes="288px"
                className="transition-transform duration-700 group-hover:scale-105 group-active:scale-105"
              />
              <CornerBrackets />
              <p className="absolute bottom-0 inset-x-0 py-3.5 px-4 text-[10px] uppercase tracking-[0.22em] text-espresso font-medium bg-ivory/95 backdrop-blur-sm border-t border-border">
                {item.label}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
