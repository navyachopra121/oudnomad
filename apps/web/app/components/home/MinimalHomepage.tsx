'use client';

import Image from 'next/image';
import Link from 'next/link';
import Container from '../Container';
import Reveal from './Reveal';
import UGCSection from './UGCSection';

const TOP_SELLERS_PRODUCTS = [
  {
    id: 'cedre',
    name: 'CEDRE EXTRAIT [ 100ML ]',
    price: 'AED 495.00',
    slug: 'cedre',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'selene',
    name: 'SELENE EXTRAIT [ 100ML ]',
    price: 'AED 495.00',
    slug: 'selene',
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'ivoire',
    name: 'IVOIRE EXTRAIT [ 100ML ]',
    price: 'AED 495.00',
    slug: 'ivoire',
    image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=1000&q=80',
  },
];


export default function MinimalHomepage() {
  return (
    <div className="w-full bg-[#000000] text-white font-sans selection:bg-[#ffb91d]/30 selection:text-white">

      {/* ── SECTION 1: HERO VIDEO BANNER ── */}
      <section className="relative min-h-screen overflow-hidden bg-black text-white">
        {/* Full-bleed background video */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover object-center"
            aria-hidden="true"
          >
            <source src="/banner.mp4" type="video/mp4" />
          </video>
          {/* Gradient: strong at bottom for text, barely-there at top so header is transparent */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>

        {/* Content pinned to bottom-center of the hero */}
        <div className="absolute bottom-0 left-0 right-0 z-10 pb-12 sm:pb-16 text-center">
          <Reveal>
            <div className="max-w-2xl mx-auto px-4 space-y-4">
              <p className="font-sans text-[13px] sm:text-[14px] leading-[1.7] text-white font-normal tracking-[0.06em] drop-shadow-lg">
                &ldquo;We believe that a perfumer is a poet or a storyteller who use intangible ingredients to create emotions. The main idea behind Oud Nomad is to Abstract memories that evoke our cores. We paint pictures without using paint. We are storytellers who do not need words.&rdquo;
              </p>
              <div className="pt-2">
                <Link
                  href="/collections"
                  className="inline-block text-[11px] uppercase tracking-[0.22em] text-[#ffb91d] border-b border-[#ffb91d] pb-0.5 hover:text-white hover:border-white transition-colors font-normal"
                >
                  LEARN MORE
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── SECTION 2: TOP SELLERS ── */}
      {TOP_SELLERS_PRODUCTS.length > 0 && (
        <section id="top-sellers" className="py-14 sm:py-20 bg-[#000000] border-t border-[#ffb91d]/15">
          <Container>
            <Reveal>
              <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14">
                {/* Reference site section h2: 14px, font-weight 400, letter-spacing 0.3em, uppercase */}
                <h2 className="font-sans text-[13px] sm:text-[14px] text-[#ffb91d] font-normal uppercase tracking-[0.3em]">
                  TOP SELLERS
                </h2>
              </div>
            </Reveal>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 lg:gap-10">
              {TOP_SELLERS_PRODUCTS.map((product, idx) => (
                <Reveal key={product.id} delayMs={idx * 80}>
                  <Link href={`/products/${product.slug}`} className="block text-center cursor-pointer group">
                    <div className="relative aspect-square w-full overflow-hidden bg-[#070707] border border-[#ffb91d]/15 mb-3 group-hover:border-[#ffb91d]/40 transition-colors">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 33vw"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    {/* Product name: 11px, font-weight 400, letter-spacing 0.16em */}
                    <h3 className="font-sans text-[11px] font-normal tracking-[0.16em] uppercase text-[#ffb91d] mb-1">
                      {product.name}
                    </h3>
                    {/* Product price: 11px, font-weight 400 */}
                    <p className="text-[11px] font-normal text-white tracking-[0.05em]">
                      {product.price}
                    </p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ── SECTION 3: SHOP BY CATEGORY ── */}
      <section className="py-14 sm:py-20 bg-[#000000] border-t border-[#ffb91d]/15">
        <Container>
          <Reveal>
            <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14">
              <h2 className="font-sans text-[13px] sm:text-[14px] text-[#ffb91d] font-normal uppercase tracking-[0.3em]">
                SHOP BY CATEGORY
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* PERFUMES BANNER */}
            <Reveal delayMs={100}>
              <Link
                href="/collections/perfumes"
                className="group relative aspect-[4/3] overflow-hidden block border border-[#ffb91d]/25 shadow-2xl"
              >
                <Image
                  src="/perfume-banner.jpg"
                  alt="Perfumes Collection"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-x-0 bottom-6 flex justify-center">
                  {/* Category label: 11px, font-weight 400, letter-spacing 0.25em */}
                  <span className="px-6 py-2 bg-black/85 backdrop-blur-xs border border-[#ffb91d]/60 text-[#ffb91d] font-normal text-[11px] uppercase tracking-[0.25em]">
                    PERFUMES
                  </span>
                </div>
              </Link>
            </Reveal>

            {/* MISTS BANNER */}
            <Reveal delayMs={200}>
              <Link
                href="/collections/mists"
                className="group relative aspect-[4/3] overflow-hidden block border border-[#ffb91d]/25 shadow-2xl"
              >
                <Image
                  src="/attar-banner.jpg"
                  alt="Hair & Body Mists Collection"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-x-0 bottom-6 flex justify-center">
                  <span className="px-6 py-2 bg-black/85 backdrop-blur-xs border border-[#ffb91d]/60 text-[#ffb91d] font-normal text-[11px] uppercase tracking-[0.25em]">
                    MISTS
                  </span>
                </div>
              </Link>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ── SECTION 4: BAKHOOR SET (Commented as requested) ── */}
      {/*
      <section className="py-14 sm:py-20 bg-[#000000] border-t border-[#ffb91d]/15">
        <Container>
          <Reveal>
            <div className="text-center max-w-xl mx-auto mb-10 sm:mb-12">
              <h2 className="font-sans text-[13px] sm:text-[14px] text-[#ffb91d] font-normal uppercase tracking-[0.3em]">
                BAKHOOR SET
              </h2>
            </div>
          </Reveal>

          <Reveal delayMs={150}>
            <div className="max-w-md mx-auto text-center">
              <Link href="/collections/bakhoor" className="block cursor-pointer group">
                <div className="relative aspect-square w-full overflow-hidden bg-[#070707] border border-[#ffb91d]/20 mb-4 group-hover:border-[#ffb91d]/40 transition-colors">
                  <Image
                    src="/banners.jpg"
                    alt="Royal Bakhoor Burner Set"
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-sans text-[11px] font-normal tracking-[0.16em] uppercase text-[#ffb91d] mb-1">
                  ROYAL BAKHOOR BURNER SET [ 100G ]
                </h3>
                <p className="text-[11px] font-normal text-white tracking-[0.05em]">
                  Rs. 6,990.00
                </p>
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
      */}

      {/* ── SECTION 5: FEATURED ── */}
      <section className="py-14 sm:py-20 bg-[#000000] border-t border-[#ffb91d]/15">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <Reveal>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative aspect-[4/5] border border-[#ffb91d]/20 overflow-hidden">
                  <Image src="/woody.avif" alt="Featured Oud Accord 1" fill className="object-cover" />
                </div>
                <div className="relative aspect-[4/5] border border-[#ffb91d]/20 overflow-hidden">
                  <Image src="/tobacoo.avif" alt="Featured Oud Accord 2" fill className="object-cover" />
                </div>
              </div>
            </Reveal>

            <Reveal delayMs={200}>
              <div className="space-y-4 text-center lg:text-left">
                <h2 className="font-sans text-[13px] sm:text-[14px] text-[#ffb91d] font-normal uppercase tracking-[0.3em]">
                  FEATURED
                </h2>
                {/* Body text: 13-14px, font-weight 400, leading 1.7 */}
                <p className="text-[13px] sm:text-[14px] leading-[1.7] text-white font-normal max-w-lg mx-auto lg:mx-0">
                  Immerse yourself in a universe where scents become memories, and luxury becomes your second skin.
                </p>
                <div className="pt-2">
                  {/* Button: 11px, font-weight 400, letter-spacing 0.22em */}
                  <Link
                    href="/collections"
                    className="inline-block px-8 py-3 text-[11px] uppercase tracking-[0.22em] font-normal bg-[#ffb91d] text-black hover:bg-[#e5a61a] transition-all"
                  >
                    VISIT GALLERY
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ── SECTION 5b: AS SEEN ON REELS (UGC / Instagram) ── */}
      <UGCSection />

      {/* ── SECTION 6: GCC EXPRESS SHIPPING ── */}
      <section className="relative py-24 sm:py-32 bg-black overflow-hidden border-t border-[#ffb91d]/15">
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
            <div className="max-w-xl bg-black/85 backdrop-blur-md border border-[#ffb91d]/40 p-8 sm:p-12 text-left">
              {/* Eyebrow: 10px, font-weight 400, letter-spacing 0.25em */}
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#ffb91d] font-normal block mb-2">
                EXPRESS SHIPPING
              </span>
              <h2 className="font-sans text-[13px] sm:text-[14px] text-[#ffb91d] font-normal uppercase tracking-[0.2em] mb-3 leading-snug">
                DELIVERING ACROSS ALL GCC COUNTRIES
              </h2>
              <p className="text-[13px] text-white font-normal leading-[1.7] mb-6">
                Fast & insured courier shipping to UAE, Saudi Arabia, Qatar, Kuwait, Oman & Bahrain. UK shipping coming soon.
              </p>
              <Link
                href="/collections"
                className="inline-block px-8 py-3 text-[11px] uppercase tracking-[0.22em] font-normal bg-[#ffb91d] text-black hover:bg-[#e5a61a] transition-all"
              >
                EXPLORE COLLECTIONS
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ── SECTION 7: A FRAGRANCE STORY ── */}
      <section className="py-14 sm:py-20 bg-[#000000] text-white border-t border-[#ffb91d]/15">
        <Container className="max-w-4xl mx-auto text-center px-4">
          <Reveal>
            <h2 className="font-sans text-[13px] sm:text-[14px] font-normal uppercase tracking-[0.3em] text-[#ffb91d] mb-5">
              A FRAGRANCE STORY
            </h2>
            <p className="text-[13px] sm:text-[14px] leading-[1.7] text-white font-normal tracking-[0.04em] max-w-3xl mx-auto">
              Oud Nomad was born from a desire to elevate Oriental perfumery to its highest expression. Combining centuries-old Arabian distillation traditions with modern Parisian elegance, each flacon contains liquid gold born of patient aging and uncompromising passion.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* ── STICKY WHATSAPP BUTTON (Right side) ── */}
      <div className="fixed bottom-5 right-5 z-40">
        <a
          href="https://wa.me/971585719731"
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-transform"
          aria-label="Chat with Concierge on WhatsApp"
        >
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M12.031 0C5.396 0 .02 5.37.02 12.006c0 2.12.553 4.19 1.604 6.014L0 24l6.143-1.611A11.97 11.97 0 0012.03 24c6.634 0 12.01-5.37 12.01-12.006C24.04 5.37 18.665 0 12.031 0zm6.98 16.945c-.29.815-1.442 1.492-2.38 1.693-.64.137-1.474.246-4.288-.916-3.597-1.487-5.912-5.148-6.091-5.387-.18-.239-1.46-1.944-1.46-3.708 0-1.764.922-2.632 1.25-2.986.327-.354.714-.443.952-.443.238 0 .476.002.684.012.22.01.517-.084.81.619.3.703 1.026 2.508 1.116 2.69.09.18.15.39.03.626-.12.238-.18.388-.358.598-.18.21-.378.47-.54.631-.18.18-.368.376-.158.736.21.36.936 1.545 2.01 2.502 1.382 1.233 2.548 1.616 2.908 1.796.36.18.57.15.78-.09.21-.24.9-1.05 1.14-1.41.24-.36.48-.3.81-.18.33.12 2.096.99 2.456 1.17.36.18.6.27.69.42.09.15.09.87-.2 1.685z" />
          </svg>
        </a>
      </div>
    </div>
  );
}
