'use client';

import { forwardRef } from 'react';
import Container from '../Container';
import { TESTIMONIALS } from './data';
import CornerBrackets from './motifs/CornerBrackets';
import Reveal from './Reveal';
import { useDragScroll } from './use-drag-scroll';

const TestimonialsSection = forwardRef<HTMLElement>(function TestimonialsSection(_props, ref) {
  const scrollRef = useDragScroll<HTMLDivElement>();

  return (
    <section
      ref={ref}
      className="bg-ivory text-espresso border-t border-border overflow-hidden"
      style={{ paddingBlock: 'var(--section-py)' }}
      aria-labelledby="majlis-heading"
    >
      {/* Heading uses Container */}
      <Container className="mb-12">
        <Reveal>
          <div className="flex items-center gap-3 mb-3">
            <span className="h-[1px] w-6 bg-antique-gold/60" />
            <p className="text-[10px] uppercase tracking-[0.32em] text-antique-gold font-medium">
              Patron Testimonies
            </p>
          </div>
          <h2 id="majlis-heading" className="font-display text-fluid-h2 text-espresso font-normal">
            Guestbook inscriptions, not ratings.
          </h2>
          <p className="text-sm text-muted font-light mt-2 max-w-md">
            Words recorded by patrons who have stepped into our sanctuary and worn our extraits.
          </p>
        </Reveal>
      </Container>

      {/*
       * Horizontal scroll strip — NOT inside Container so it goes edge-to-edge.
       * px-4 md:px-6 xl:px-10 mirrors the Container padding so cards align.
       */}
      <div
        ref={scrollRef}
        className="flex gap-6 md:gap-8 overflow-x-auto px-4 md:px-6 xl:px-10 pb-6 snap-x snap-mandatory scroll-smooth hide-scrollbar select-none"
      >
        {TESTIMONIALS.map((t, i) => (
          <Reveal
            key={t.id}
            delayMs={i * 60}
            className="snap-start shrink-0 w-[min(88vw,23rem)] md:w-[26rem]"
          >
            <figure className="bg-surface-muted/40 border border-border p-8 md:p-10 h-full flex flex-col justify-between rounded-sm relative shadow-sm hover:shadow-md transition-shadow">
              <CornerBrackets />
              <div>
                <span
                  className="font-display text-4xl text-antique-gold leading-none block mb-2"
                  aria-hidden
                >
                  &ldquo;
                </span>
                <blockquote className="font-display text-lg md:text-xl italic text-espresso leading-relaxed font-light">
                  {t.quote}
                </blockquote>
              </div>
              <figcaption className="mt-8 pt-4 border-t border-border flex items-center justify-between text-xs text-antique-gold uppercase tracking-[0.2em] font-medium">
                <span>— {t.author}</span>
                <span className="text-muted lowercase tracking-normal">{t.city}</span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
});

export default TestimonialsSection;
