'use client';

import Image from 'next/image';
import Link from 'next/link';
import Container from '../Container';
import { VITRINE_MASTERPIECES } from './data';
import Reveal from './Reveal';

export default function MinimalHomepage() {
  const featuredProducts = VITRINE_MASTERPIECES.slice(0, 4);

  const getProductSlug = (name: string) => {
    if (name.includes('Malaki')) return 'malaki-extrait-no-1';
    if (name.includes('Noor')) return 'noor-pure-attar';
    if (name.includes('Dusk')) return 'dusk-mukhallat-imperiale';
    if (name.includes('Cambodi')) return 'royal-cambodi-reserve';
    return name.toLowerCase().replace(/\s+/g, '-');
  };

  const categories = [
    {
      name: 'Oud',
      href: '/collections/oud',
      image: 'https://picsum.photos/seed/oud-category-tile/800/1000',
    },
    {
      name: 'Attars',
      href: '/collections/attars',
      image: 'https://picsum.photos/seed/attars-category-tile/800/1000',
    },
    {
      name: 'Bakhoor',
      href: '/collections/bakhoor',
      image: 'https://picsum.photos/seed/bakhoor-category-tile/800/1000',
    },
    {
      name: 'Mukhallat',
      href: '/collections/mukhallat',
      image: 'https://picsum.photos/seed/mukhallat-category-tile/800/1000',
    },
  ];

  return (
    <div className="  w-full bg-background text-foreground">
      {/* SECTION 3 — HERO */}
      <section className="relative min-h-[80vh] sm:min-h-[88vh] flex items-center justify-center overflow-hidden bg-background text-foreground">
        {/* Full-bleed background image with clear visibility */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/banners.jpg"
            alt="Single flacon lit in dark shadow"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-90 scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
        </div>

        <Container className="relative z-10 text-center py-20 px-4 flex flex-col items-center justify-center max-w-4xl mx-auto">
          <Reveal>
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight leading-[1.08] text-ivory drop-shadow-md">
              Bottled like jewels. <br />
              Aged in shadow.
            </h1>

            <p
              className="font-arabic text-base sm:text-lg md:text-xl text-antique-gold/90 mt-6 font-light tracking-wide"
              dir="rtl"
              lang="ar"
            >
              عبق نادر، معتّق في الظل
            </p>

            <div className="mt-10 sm:mt-12">
              <Link
                href="/collections"
                className="inline-flex items-center justify-center px-8 py-4 text-xs uppercase tracking-[0.24em] font-medium bg-aged-gold text-accent-on-fill hover:bg-antique-gold transition-colors duration-500 shadow-md"
              >
                Explore the Collection
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* SECTION 4 — FEATURED PIECES (THE GRAND VITRINE) */}
      <section id="featured" className="py-20 md:py-28 bg-background text-foreground">
        <Container>
          <Reveal>
            <div className="text-center max-w-xl mx-auto mb-14 md:mb-20">
              <p className="text-[11px] uppercase tracking-[0.28em] text-antique-gold font-medium mb-3">
                The Grand Vitrine
              </p>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-foreground font-normal leading-tight">
                Extracted in limited batches. Released only when ready.
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {featuredProducts.map((product, idx) => (
              <Reveal key={product.id} delayMs={idx * 100}>
                <article className="group flex flex-col justify-between h-full">
                  <div>
                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface-muted/30 mb-5">
                      <Image
                        src={product.image.src}
                        alt={product.image.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="font-display text-lg sm:text-xl text-foreground group-hover:text-antique-gold transition-colors duration-300 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-antique-gold mb-5">
                      {product.price}
                    </p>
                  </div>
                  <Link
                    href={`/products/${getProductSlug(product.name)}`}
                    className="w-full inline-flex items-center justify-center py-3 text-[10px] uppercase tracking-[0.22em] font-medium bg-aged-gold/10 text-antique-gold hover:bg-aged-gold hover:text-accent-on-fill transition-all duration-300"
                  >
                    Acquire Flacon
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* SECTION 5 — BRAND STATEMENT */}
      <section className="py-24 sm:py-32 bg-background text-foreground">
        <Container className="text-center max-w-3xl mx-auto px-4">
          <Reveal>
            <p className="font-display text-2xl sm:text-3xl md:text-4xl text-foreground font-normal leading-relaxed mb-8">
              Composed in Dubai, for those who enter expecting another world.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center text-xs uppercase tracking-[0.25em] text-antique-gold hover:text-foreground font-medium transition-colors duration-400 pb-1"
            >
              Discover Our Story &rarr;
            </Link>
          </Reveal>
        </Container>
      </section>

      {/* SECTION 6 — SHOP BY CATEGORY */}
      <section className="py-20 md:py-28 bg-background text-foreground">
        <Container>
          <Reveal>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-foreground font-normal text-center mb-12 md:mb-16">
              Find your note.
            </h2>
          </Reveal>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((cat, idx) => (
              <Reveal key={cat.name} delayMs={idx * 100}>
                <Link
                  href={cat.href}
                  className="group relative aspect-[3/4] overflow-hidden bg-surface-muted transition-all duration-500 flex items-end p-6"
                >
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
                  <span className="relative z-10 font-display text-xl sm:text-2xl text-foreground tracking-wide group-hover:text-antique-gold transition-colors duration-300">
                    {cat.name}
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* SECTION 7 — TESTIMONIAL */}
      <section className="py-24 sm:py-32 bg-background text-foreground">
        <Container className="text-center max-w-3xl mx-auto px-4">
          <Reveal>
            <blockquote className="space-y-6">
              <p className="font-display italic text-2xl sm:text-3xl md:text-4xl text-foreground font-normal leading-relaxed">
                &ldquo;Finally a fragrance house that feels like the boutique &mdash; not a discount shelf online.&rdquo;
              </p>
              <cite className="block not-italic text-xs uppercase tracking-[0.22em] text-antique-gold font-medium">
                &mdash; Layla, Riyadh
              </cite>
            </blockquote>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
