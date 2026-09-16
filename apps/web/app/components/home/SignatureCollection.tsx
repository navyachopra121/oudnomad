'use client';

import Link from 'next/link';
import { useState } from 'react';
import Container from '../Container';
import { SIGNATURE_PRODUCTS } from './data';
import CornerBrackets from './motifs/CornerBrackets';
import Reveal from './Reveal';
import SectionImage from './SectionImage';

function ProductBlock({
  product,
  index,
}: {
  product: (typeof SIGNATURE_PRODUCTS)[number];
  index: number;
}) {
  const [notesOpen, setNotesOpen] = useState(false);
  const imageFirst = product.imageSide === 'left';

  const image = (
    <button
      type="button"
      className="group relative aspect-[4/5] w-full overflow-hidden border border-border bg-surface-muted text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-antique-gold"
      onClick={() => setNotesOpen((v) => !v)}
      aria-expanded={notesOpen}
      aria-label={`${product.name} fragrance notes`}
    >
      <SectionImage src={product.image.src} alt={product.image.alt} sizes="(max-width: 1024px) 100vw, 50vw" />
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 via-obsidian/10 to-transparent pointer-events-none" aria-hidden />
      <CornerBrackets />
      <div
        className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 transition-opacity duration-[400ms]"
        style={{ opacity: notesOpen ? 0 : 1 }}
      >
        <span className="text-[10px] uppercase tracking-[0.28em] text-ivory/70">Signature</span>
        <span className="font-display text-2xl text-ivory mt-1">{product.name}</span>
      </div>
      {/* Notes panel — tap to reveal on all devices */}
      <div
        className="absolute inset-0 bg-obsidian/88 p-6 md:p-8 flex flex-col justify-center transition-opacity duration-[400ms]"
        style={{ opacity: notesOpen ? 1 : 0 }}
        aria-hidden={!notesOpen}
      >
        <p className="text-[10px] uppercase tracking-[0.24em] text-champagne-sand mb-3">Fragrance pyramid</p>
        <p className="text-sm text-ivory/90 leading-relaxed">
          <span className="text-antique-gold">Top:</span> {product.notes.top}
          <br />
          <span className="text-antique-gold">Heart:</span> {product.notes.heart}
          <br />
          <span className="text-antique-gold">Base:</span> {product.notes.base}
        </p>
      </div>
    </button>
  );

  const copy = (
    <div className="flex flex-col justify-center py-6 md:py-10 lg:py-0">
      <h3 className="font-display text-fluid-h3 text-espresso">
        {product.name}
        <span className="block text-lg md:text-xl text-muted font-sans mt-2 not-italic">{product.price}</span>
      </h3>
      <p className="mt-6 text-sm md:text-base text-muted leading-relaxed max-w-md">{product.story}</p>
      <Link
        href="/search"
        className="mt-8 inline-flex text-xs uppercase tracking-[0.2em] text-antique-gold hover:text-mahogany active:text-mahogany transition-colors duration-[400ms] w-fit nav-link"
      >
        Discover →
      </Link>
    </div>
  );

  return (
    <div className="border-b border-border/80 last:border-0" style={{ paddingBlock: 'var(--section-py)' }}>
      <Container>
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {imageFirst ? (
            <>
              {/* Image left, copy right — DOM order matches visual order */}
              <Reveal delayMs={index * 80}>{image}</Reveal>
              <Reveal delayMs={index * 80 + 150}>{copy}</Reveal>
            </>
          ) : (
            <>
              {/* Image right on desktop, but on mobile image comes first (DOM order) */}
              <Reveal delayMs={index * 80 + 150}>{copy}</Reveal>
              <Reveal delayMs={index * 80} className="lg:order-first">
                {image}
              </Reveal>
            </>
          )}
        </div>
      </Container>
    </div>
  );
}

export default function SignatureCollection() {
  return (
    <section className="bg-ivory" aria-labelledby="signature-heading">
      <Container className="pt-16 md:pt-24 pb-4">
        <Reveal>
          <p className="text-[10px] uppercase tracking-[0.32em] text-antique-gold mb-3">Signature collection</p>
          <h2 id="signature-heading" className="font-display text-fluid-h2 text-espresso max-w-lg">
            Edited for the house — not arranged like a catalog.
          </h2>
        </Reveal>
      </Container>
      {SIGNATURE_PRODUCTS.map((product, index) => (
        <ProductBlock key={product.id} product={product} index={index} />
      ))}
    </section>
  );
}
