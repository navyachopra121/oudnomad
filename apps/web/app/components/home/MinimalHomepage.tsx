'use client';

import Image from 'next/image';
import Link from 'next/link';
import Container from '../Container';
import Reveal from './Reveal';

const TOP_SELLERS_PRODUCTS = [
  {
    id: 'majesty-extrait',
    name: 'MAJESTY EXTRAIT [ 100ML ]',
    price: 'Rs. 4,990.00',
    slug: 'majesty-extrait-100ml',
    image: 'https://picsum.photos/seed/malaki-oud-bottle/900/1100',
  },
  {
    id: 'amber-royale',
    name: 'AMBER ROYALE [ 100ML ]',
    price: 'Rs. 4,990.00',
    slug: 'amber-royale-100ml',
    image: 'https://picsum.photos/seed/noor-attar-stilllife/900/1100',
  },
  {
    id: 'ramsay-extrait',
    name: 'RAMSAY [ 100ML ]',
    price: 'Rs. 5,490.00',
    slug: 'ramsay-extrait-100ml',
    image: 'https://picsum.photos/seed/dusk-mukhallat-bottle/900/1100',
  },
  {
    id: 'royal-oud-extrait',
    name: 'ROYAL OUD EXTRAIT [ 100ML ]',
    price: 'Rs. 4,990.00',
    slug: 'royal-oud-100ml',
    image: 'https://picsum.photos/seed/royal-cambodi-oud/900/1100',
  },
  {
    id: 'vintage-attar',
    name: 'VINTAGE ATTAR [ 50ML ]',
    price: 'Rs. 3,990.00',
    slug: 'vintage-attar-50ml',
    image: 'https://picsum.photos/seed/raw-agarwood-heartwood/800/800',
  },
  {
    id: 'imperial-resin',
    name: 'IMPERIAL RESIN [ 100ML ]',
    price: 'Rs. 5,990.00',
    slug: 'imperial-resin-100ml',
    image: 'https://picsum.photos/seed/taif-rose-petals/800/800',
  },
];

export default function MinimalHomepage() {
  return (
    <div className="w-full bg-[#000000] text-white font-sans selection:bg-[#d89527]/30 selection:text-white">
      {/* ── SECTION 1: HERO SLIDER / BANNER ── */}
      <section className="relative min-h-[80vh] sm:min-h-[88vh] flex items-center justify-center overflow-hidden bg-black text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="/banners.jpg"
            alt="Oud Nomad Dubai Luxury Fragrance"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
        </div>

        <Container className="relative z-10 text-center py-16 px-4 flex flex-col items-center justify-center max-w-3xl mx-auto">
          <Reveal>
            <div className="space-y-6">
              <p className="font-sans text-xs sm:text-sm md:text-base leading-relaxed text-[#d89527] font-normal tracking-[0.12em] max-w-2xl mx-auto">
                &ldquo;We believe that a perfumer is a poet or a storyteller who use intangible ingredients to create emotions. The main idea behind Oud Nomad is to Abstract memories that evoke our cores. We paint pictures without using paint. We are storytellers who do not need words.&rdquo;
              </p>
              <div className="pt-3">
                <Link
                  href="/collections"
                  className="inline-block text-[10px] sm:text-xs uppercase tracking-[0.28em] text-[#d89527] border-b border-[#d89527] pb-1 hover:text-white hover:border-white transition-colors font-medium"
                >
                  LEARN MORE
                </Link>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ── SECTION 2: TOP SELLERS (NO HOVER EFFECTS) ── */}
      <section id="top-sellers" className="py-14 sm:py-20 bg-[#000000] border-t border-[#d89527]/15">
        <Container>
          <Reveal>
            <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14">
              <h2 className="font-sans text-xs sm:text-base md:text-lg text-[#d89527] font-semibold uppercase tracking-[0.28em]">
                TOP SELLERS
              </h2>
            </div>
          </Reveal>

          {/* 3-Column Product Grid on Desktop, 2-Column on Mobile - Pure Static Display */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 lg:gap-10">
            {TOP_SELLERS_PRODUCTS.map((product, idx) => (
              <Reveal key={product.id} delayMs={idx * 80}>
                <Link href={`/products/${product.slug}`} className="block text-center cursor-pointer">
                  <div className="relative aspect-square w-full overflow-hidden bg-[#070707] border border-[#d89527]/15 mb-3">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 33vw"
                      className="object-cover object-center"
                    />
                  </div>
                  <h3 className="font-sans text-[11px] sm:text-xs font-semibold tracking-[0.16em] uppercase text-[#d89527] mb-1">
                    {product.name}
                  </h3>
                  <p className="text-[10px] sm:text-xs font-normal text-white/80">
                    {product.price}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ── SECTION 3: SHOP BY CATEGORY ── */}
      <section className="py-14 sm:py-20 bg-[#000000] border-t border-[#d89527]/15">
        <Container>
          <Reveal>
            <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14">
              <h2 className="font-sans text-xs sm:text-base md:text-lg text-[#d89527] font-semibold uppercase tracking-[0.28em]">
                SHOP BY CATEGORY
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* PERFUMES BANNER */}
            <Reveal delayMs={100}>
              <Link
                href="/collections/perfumes"
                className="group relative aspect-[4/3] overflow-hidden block border border-[#d89527]/25 shadow-2xl"
              >
                <Image
                  src="/perfume-banner.jpg"
                  alt="Perfumes Collection"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/25" />
                <div className="absolute inset-x-0 bottom-6 flex justify-center">
                  <span className="px-6 py-2 bg-black/80 backdrop-blur-xs border border-[#d89527]/60 text-[#d89527] font-semibold text-[11px] sm:text-xs uppercase tracking-[0.25em]">
                    PERFUMES
                  </span>
                </div>
              </Link>
            </Reveal>

            {/* ATTARS BANNER */}
            <Reveal delayMs={200}>
              <Link
                href="/collections/attars"
                className="group relative aspect-[4/3] overflow-hidden block border border-[#d89527]/25 shadow-2xl"
              >
                <Image
                  src="/attar-banner.jpg"
                  alt="Attars & Oils Collection"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/25" />
                <div className="absolute inset-x-0 bottom-6 flex justify-center">
                  <span className="px-6 py-2 bg-black/80 backdrop-blur-xs border border-[#d89527]/60 text-[#d89527] font-semibold text-[11px] sm:text-xs uppercase tracking-[0.25em]">
                    ATTARS
                  </span>
                </div>
              </Link>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ── SECTION 4: BAKHOOR SET (NO HOVER EFFECTS) ── */}
      <section className="py-14 sm:py-20 bg-[#000000] border-t border-[#d89527]/15">
        <Container>
          <Reveal>
            <div className="text-center max-w-xl mx-auto mb-10 sm:mb-12">
              <h2 className="font-sans text-xs sm:text-base md:text-lg text-[#d89527] font-semibold uppercase tracking-[0.28em]">
                BAKHOOR SET
              </h2>
            </div>
          </Reveal>

          <Reveal delayMs={150}>
            <div className="max-w-md mx-auto text-center">
              <Link href="/collections/bakhoor" className="block cursor-pointer">
                <div className="relative aspect-square w-full overflow-hidden bg-[#070707] border border-[#d89527]/20 mb-4">
                  <Image
                    src="/banners.jpg"
                    alt="Royal Bakhoor Burner Set"
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover object-center"
                  />
                </div>
                <h3 className="font-sans text-[11px] sm:text-xs font-semibold tracking-[0.16em] uppercase text-[#d89527] mb-1">
                  ROYAL BAKHOOR BURNER SET [ 100G ]
                </h3>
                <p className="text-[10px] sm:text-xs font-normal text-white/80">
                  Rs. 6,990.00
                </p>
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ── SECTION 5: FEATURED ── */}
      <section className="py-14 sm:py-20 bg-[#000000] border-t border-[#d89527]/15">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* 2 Side-by-side Images Left */}
            <Reveal>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative aspect-[4/5] border border-[#d89527]/20 overflow-hidden">
                  <Image src="/woody.avif" alt="Featured 1" fill className="object-cover" />
                </div>
                <div className="relative aspect-[4/5] border border-[#d89527]/20 overflow-hidden">
                  <Image src="/tobacoo.avif" alt="Featured 2" fill className="object-cover" />
                </div>
              </div>
            </Reveal>

            {/* Text and Button Right */}
            <Reveal delayMs={200}>
              <div className="space-y-5 text-center lg:text-left">
                <h2 className="font-sans text-xs sm:text-base md:text-lg text-[#d89527] font-semibold uppercase tracking-[0.28em]">
                  FEATURED
                </h2>
                <p className="text-xs sm:text-sm leading-relaxed text-white/80 font-normal max-w-lg mx-auto lg:mx-0">
                  Immerse yourself in a universe where scents become memories, and luxury becomes your second skin.
                </p>
                <div className="pt-2">
                  <Link
                    href="/collections"
                    className="inline-block px-8 py-3 text-[11px] sm:text-xs uppercase tracking-[0.22em] font-semibold bg-[#d89527] text-black hover:bg-[#c58b2b] transition-all"
                  >
                    VISIT GALLERY
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ── SECTION 6: GCC & WORLDWIDE EXPRESS SHIPPING (REPLACED LOCATIONS/STORES) ── */}
      <section className="relative py-24 sm:py-32 bg-black overflow-hidden border-t border-[#d89527]/15">
        <div className="absolute inset-0 z-0">
          <Image
            src="/boutique-store.jpg"
            alt="Oud Nomad Luxury Fragrances"
            fill
            sizes="100vw"
            className="object-cover object-center opacity-50"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <Container className="relative z-20">
          <Reveal>
            <div className="max-w-xl bg-black/85 backdrop-blur-md border border-[#d89527]/40 p-8 sm:p-12 text-left">
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#d89527] font-semibold block mb-2">
                EXPRESS SHIPPING
              </span>
              <h2 className="font-sans text-sm sm:text-base md:text-lg text-white font-semibold uppercase tracking-[0.2em] mb-3 leading-snug">
                DELIVERING ACROSS ALL GCC COUNTRIES & WORLDWIDE
              </h2>
              <p className="text-[11px] sm:text-xs text-white/80 font-normal leading-relaxed mb-6">
                Fast & insured courier shipping to UAE, Saudi Arabia (KSA), Qatar, Kuwait, Oman, Bahrain & International destinations.
              </p>
              <Link
                href="/collections"
                className="inline-block px-8 py-3 text-[10px] sm:text-xs uppercase tracking-[0.2em] font-bold bg-[#d89527] text-black hover:bg-[#c58b2b] transition-all"
              >
                EXPLORE COLLECTIONS
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ── SECTION 7: A FRAGRANCE STORY (LIGHT CONTRAST STRIP) ── */}
      <section className="py-14 sm:py-20 bg-[#FFFFFF] text-[#000000]">
        <Container className="max-w-4xl mx-auto text-center px-4">
          <Reveal>
            <h2 className="font-sans text-xs sm:text-sm font-semibold uppercase tracking-[0.28em] text-[#000000] mb-4">
              A FRAGRANCE STORY
            </h2>
            <p className="text-[10px] sm:text-xs leading-relaxed text-[#333333] font-normal tracking-[0.12em] uppercase max-w-3xl mx-auto">
              Oud Nomad Dubai was born from a desire to elevate Oriental perfumery to its highest expression. Combining centuries-old Arabian distillation traditions with modern Parisian elegance, each flacon contains liquid gold born of patient aging and uncompromising passion.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* ── FLOATING ACTION BUTTONS (WHATSAPP & CALL) ── */}
      <div className="fixed bottom-5 left-5 z-40">
        <a
          href="https://wa.me/971500000000"
          target="_blank"
          rel="noopener noreferrer"
          className="w-11 h-11 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform"
          aria-label="Chat on WhatsApp"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12.031 0C5.396 0 .02 5.37.02 12.006c0 2.12.553 4.19 1.604 6.014L0 24l6.143-1.611A11.97 11.97 0 0012.03 24c6.634 0 12.01-5.37 12.01-12.006C24.04 5.37 18.665 0 12.031 0zm6.98 16.945c-.29.815-1.442 1.492-2.38 1.693-.64.137-1.474.246-4.288-.916-3.597-1.487-5.912-5.148-6.091-5.387-.18-.239-1.46-1.944-1.46-3.708 0-1.764.922-2.632 1.25-2.986.327-.354.714-.443.952-.443.238 0 .476.002.684.012.22.01.517-.084.81.619.3.703 1.026 2.508 1.116 2.69.09.18.15.39.03.626-.12.238-.18.388-.358.598-.18.21-.378.47-.54.631-.18.18-.368.376-.158.736.21.36.936 1.545 2.01 2.502 1.382 1.233 2.548 1.616 2.908 1.796.36.18.57.15.78-.09.21-.24.9-1.05 1.14-1.41.24-.36.48-.3.81-.18.33.12 2.096.99 2.456 1.17.36.18.6.27.69.42.09.15.09.87-.2 1.685z" />
          </svg>
        </a>
      </div>

      <div className="fixed bottom-5 right-5 z-40">
        <a
          href="tel:+971500000000"
          className="w-11 h-11 bg-[#d89527] text-black rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform"
          aria-label="Call Customer Concierge"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
          </svg>
        </a>
      </div>
    </div>
  );
}
