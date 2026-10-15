'use client';

import React, { useEffect, useState, useRef, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import SiteHeader from '../../components/header/SiteHeader';
import Container from '../../components/Container';
import { StoreApi, ProductItem, ReviewItem } from '../../store-api';
import { useCart } from '../../components/cart/CartContext';
import { useCurrency } from '../../components/concierge/CurrencyContext';
import JsonLd, { generateProductJsonLd } from '../../components/seo/JsonLd';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const { addItem, openDrawer } = useCart();
  const { formatPrice, currency } = useCurrency();

  const [product, setProduct] = useState<ProductItem | null>(null);
  const [recommendations, setRecommendations] = useState<ProductItem[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const primaryCtaRef = useRef<HTMLDivElement>(null);

  // Lightbox + carousel state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const openLightbox = (idx: number) => { setLightboxIndex(idx); setLightboxOpen(true); };
  const closeLightbox = () => setLightboxOpen(false);
  const lightboxPrev = (total: number) => setLightboxIndex((i) => (i - 1 + total) % total);
  const lightboxNext = (total: number) => setLightboxIndex((i) => (i + 1) % total);
  const carouselPrev = (total: number) => setCarouselIndex((i) => (i - 1 + total) % total);
  const carouselNext = (total: number) => setCarouselIndex((i) => (i + 1) % total);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen || !product) return;
    const total = product.images?.length || 0;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') lightboxPrev(total);
      if (e.key === 'ArrowRight') lightboxNext(total);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxOpen, product]);

  // Prevent body scroll when lightbox open
  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightboxOpen]);

  // Show sticky bottom bar once primary CTA scrolls off-screen above viewport
  useEffect(() => {
    const handleScroll = () => {
      if (!primaryCtaRef.current) return;
      const rect = primaryCtaRef.current.getBoundingClientRect();
      // Appears when primary CTA is scrolled off-screen above the viewport
      setShowStickyBar(rect.bottom < 0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [product]);

  // Accordion state
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const prod = await StoreApi.getProductBySlug(slug);
        if (!prod) {
          setProduct(null);
          setLoading(false);
          return;
        }
        setProduct(prod);
        if (prod.images && prod.images.length > 0) {
          setSelectedImage(prod.images[0]);
        }
        if (prod.variants && prod.variants.length > 0) {
          setSelectedVariant(prod.variants[0].id);
        }

        const [recs, revs] = await Promise.all([
          StoreApi.getRecommendations(prod.id),
          StoreApi.getProductReviews(prod.id || slug),
        ]);
        setRecommendations(recs);
        setReviews(revs);
      } catch (err) {
        console.error('Failed to load product details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070707] text-white flex flex-col font-sans">
        <SiteHeader />
        <main className="flex-1 flex flex-col items-center justify-center py-32 space-y-4">
          <div className="w-10 h-10 border-2 border-[#ffb91d] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-[0.25em] text-[#ffb91d]">
            Opening Flacon Archives...
          </p>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#070707] text-white flex flex-col font-sans">
        <SiteHeader />
        <main className="flex-1 flex flex-col items-center justify-center text-center py-32 space-y-4">
          <p className="text-sm text-white/60">The requested perfume could not be located in our archives.</p>
          <Link href="/collections" className="text-xs uppercase tracking-[0.2em] text-[#ffb91d] underline">
            Return to All Fragrances
          </Link>
        </main>
      </div>
    );
  }

  const activeVariantObj = product.variants?.find((v) => v.id === selectedVariant) || {
    price: product.price,
    size: product.features?.quantity || (product.category === 'attars' ? '12ml Tola' : '100ml'),
  };

  const handleAddToCart = () => {
    if (!product) return;
    const variantId = selectedVariant || product.variants?.[0]?.id || product.id;
    addItem({
      productId: product.id,
      variantId,
      name: product.name,
      slug: product.slug,
      image: selectedImage || product.images?.[0] || '',
      price: activeVariantObj?.price || product.price,
      size: activeVariantObj?.size || '100ml',
      quantity,
    });
    setAddedToCart(true);
    setTimeout(() => {
      setAddedToCart(false);
      openDrawer();
    }, 400);
  };

  const handleBuyItNow = () => {
    handleAddToCart();
    setTimeout(() => {
      router.push('/checkout');
    }, 500);
  };

  const toggleAccordion = (id: string) => {
    setOpenAccordion((prev) => (prev === id ? null : id));
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Oud Nomad, I would like to order *${product.name}* (Price: ${formatPrice(product.price)}). Please assist me with my order.`
  );
  const whatsappUrl = `https://wa.me/971585719731?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-[#070707] text-[#f2efe9] flex flex-col font-sans selection:bg-[#ffb91d] selection:text-black">
      <SiteHeader />

      <JsonLd
        data={generateProductJsonLd({
          name: product.name,
          description: product.description,
          images: product.images,
          price: activeVariantObj.price,
          slug: product.slug,
          rating: 4.9,
          reviewCount: reviews.length || 28,
        })}
      />

      <main className="flex-1 w-full pt-4 sm:pt-8 pb-12 sm:pb-20">
        <Container className="space-y-12">
          {/* Breadcrumbs */}
          <nav className="text-[8px] sm:text-[11px] font-sans tracking-[0.2em] uppercase text-white/50 flex flex-wrap items-center gap-1 sm:gap-2">
            <Link href="/" className="hover:text-[#ffb91d] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/collections" className="hover:text-[#ffb91d] transition-colors">
              Collections
            </Link>
            <span>/</span>
            <Link
              href={`/collections/${product.category}`}
              className="hover:text-[#ffb91d] transition-colors uppercase"
            >
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-[#ffb91d] font-medium truncate max-w-[200px] sm:max-w-none">
              {product.name}
            </span>
          </nav>

          {/* Product Detail Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0 items-start">

            {/* ── LEFT COLUMN: Gallery ── */}
            <div className="lg:col-span-7">

              {/* ── MOBILE: Horizontal Carousel ── */}
              <div className="relative lg:hidden">
                {/* Image */}
                <div
                  className="relative aspect-[4/5] w-full bg-[#121212] overflow-hidden cursor-zoom-in"
                  onClick={() => openLightbox(carouselIndex)}
                >
                  <Image
                    src={product.images?.[carouselIndex] || ''}
                    alt={`${product.name} — view ${carouselIndex + 1}`}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-center transition-transform duration-500"
                  />
                  {/* Tap hint */}
                  <div className="absolute bottom-3 right-3 bg-black/50 text-white/70 text-[10px] font-mono px-2 py-1 pointer-events-none">
                    Tap to expand
                  </div>
                </div>

                {/* Prev / Next arrows */}
                {product.images && product.images.length > 1 && (
                  <>
                    <button
                      onClick={() => carouselPrev(product.images!.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-black/60 hover:bg-black/80 flex items-center justify-center text-white border border-white/20 transition-all"
                      aria-label="Previous image"
                    >
                      ‹
                    </button>
                    <button
                      onClick={() => carouselNext(product.images!.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-black/60 hover:bg-black/80 flex items-center justify-center text-white border border-white/20 transition-all"
                      aria-label="Next image"
                    >
                      ›
                    </button>

                    {/* Dot indicators */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                      {product.images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCarouselIndex(idx)}
                          className={`w-1.5 h-1.5 rounded-full transition-all ${idx === carouselIndex
                            ? 'bg-[#ffb91d] w-4'
                            : 'bg-white/40 hover:bg-white/70'
                            }`}
                          aria-label={`Go to image ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* ── DESKTOP: Stacked images (bluorng-style) ── */}
              <div className="hidden lg:flex flex-col">
                {product.images && product.images.length > 0 ? (
                  product.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-[4/5] w-full bg-[#121212] overflow-hidden group/zoom cursor-zoom-in"
                      onClick={() => openLightbox(idx)}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} — view ${idx + 1}`}
                        fill
                        priority={idx === 0}
                        sizes="55vw"
                        className="object-cover object-center transition-transform duration-700 group-hover/zoom:scale-105"
                      />
                      {/* Hover hint */}
                      <div className="absolute inset-0 flex items-end justify-end p-3 opacity-0 group-hover/zoom:opacity-100 transition-opacity">
                        <span className="bg-black/60 text-white/80 text-[10px] font-mono px-2 py-1">
                          Click to expand
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="relative aspect-[4/5] w-full bg-[#121212] overflow-hidden">
                    <Image
                      src={product.images?.[0] || ''}
                      alt={product.name}
                      fill priority
                      sizes="55vw"
                      className="object-cover object-center"
                    />
                  </div>
                )}
              </div>

            </div>

            {/* ── RIGHT COLUMN: Product Info — Sticky ── */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 lg:pl-10 space-y-6">
              {/* Header Info */}
              <div className="space-y-3 border-b border-white/10 pb-6">
                <div className="space-y-1">
                  <h1 className="text-xl sm:text-3xl uppercase font-serif text-white tracking-wide leading-tight">
                    {product.name}
                  </h1>
                  {product.tagline && (
                    <p className="text-[11px] sm:text-xs font-mono tracking-[0.28em] text-[#ffb91d] uppercase font-medium">
                      {product.tagline}
                    </p>
                  )}
                </div>

                {/* Rating & Reviews */}
                {/* <div className="flex items-center gap-3">
                  <div className="flex text-[#ffb91d] text-sm">★★★★★</div>
                  <span className="text-xs text-white/60 font-mono">
                    4.9 / 5.0 (28 customer reviews)
                  </span>
                </div> */}



                {/* Price Display */}
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="text-xl sm:text-2xl font-medium text-[#ffb91d] font-mono tracking-tight">
                    {formatPrice(activeVariantObj.price)}
                  </span>
                  {product.compareAtPrice && product.compareAtPrice > product.price && (
                    <span className="text-sm line-through text-white/40 font-mono">
                      {formatPrice(product.compareAtPrice)}
                    </span>
                  )}
                  <span className="text-[11px] text-white/60 font-sans block w-full mt-[-10px]">
                    Tax included. <strong className="text-white/80">Free express delivery</strong> across all GCC countries.
                  </span>
                </div>

                {/* In Stock Badge */}
                <div className="pt-1 flex items-center gap-2 text-xs font-mono text-[#ffb91d]">
                  <span className="w-2 h-2 rounded-full bg-[#ffb91d] animate-pulse" />
                  <span>In stock, ready to dispatch from Dubai warehouse</span>
                </div>
              </div>


              {/* ── FRAGRANCE NOTES ── */}
              <div className="space-y-3">
                <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#ffb91d]">
                  Fragrance Notes
                </h3>
                <div className="space-y-2.5">
                  {[
                    { label: 'Top', value: product.features?.topNotes || 'Vanilla, Honey' },
                    { label: 'Heart', value: product.features?.middleNotes || 'Amber' },
                    { label: 'Base', value: product.features?.baseNotes || 'Caramel, White Musk' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-start gap-3 text-xs">
                      <span className="shrink-0 w-12 text-[10px] font-mono uppercase tracking-widest text-[#ffb91d] pt-0.5">{label}</span>
                      <span className="text-white/80 leading-relaxed font-sans">{value}</span>
                    </div>
                  ))}
                  {/* Desktop View: untouched and exact */}
                  <div className="hidden sm:flex sm:items-center sm:gap-3 text-xs pt-2 border-t border-white/5">
                    <span className="shrink-0 w-12 text-[10px] font-mono uppercase tracking-widest text-white/40">Vol</span>
                    <span className="text-white/70 font-mono">{product.features?.quantity || '100ml'}</span>
                    <span className="text-white/20 mx-1">·</span>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">Type</span>
                    <span className="text-white/70 font-mono">{product.features?.type || 'Fragrance Mist'}</span>
                    <span className="text-white/20 mx-1">·</span>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">Longevity</span>
                    <span className="text-white/70 font-mono">{product.features?.longevity || '8 Hours'}</span>
                  </div>

                  {/* Mobile View: Clean 3-column layout without awkward broken text */}
                  <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-white/5 sm:hidden">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-white/40">Vol</span>
                      <span className="text-white/80 font-mono text-[11px] mt-0.5">{product.features?.quantity || '100ml'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-white/40">Type</span>
                      <span className="text-white/80 font-mono text-[11px] mt-0.5 leading-snug">{product.features?.type || 'Fragrance Mist'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-white/40">Longevity</span>
                      <span className="text-white/80 font-mono text-[11px] mt-0.5 leading-snug">{product.features?.longevity || '8 Hours'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* The Signature */}
              {product.signature && (
                <div className="border-l-2 border-[#ffb91d] bg-white/[0.02] pl-3 py-1.5 my-2">
                  <span className="block text-[9px] font-mono tracking-[0.25em] uppercase text-white/40">
                    The Signature
                  </span>
                  <p className="text-xs sm:text-sm font-serif italic text-white/90">
                    &ldquo;{product.signature}&rdquo;
                  </p>
                </div>
              )}

              {/* Mood & Character */}
              {product.moodAndCharacter && (
                <div className="pt-1 space-y-1.5">
                  <span className="text-[9px] font-mono tracking-[0.25em] uppercase text-white/40 block">
                    Mood & Character
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(Array.isArray(product.moodAndCharacter)
                      ? product.moodAndCharacter
                      : (product.moods || product.moodAndCharacter.split('·'))
                    ).map((m: string) => (
                      <span
                        key={m}
                        className="px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider border border-[#ffb91d]/30 bg-[#ffb91d]/5 text-[#ffb91d]"
                      >
                        {m.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & CTA Buttons */}
              <div className="space-y-3 pt-2">
                <div ref={primaryCtaRef} className="flex items-center gap-3">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-white/20 bg-[#121212] h-12">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 h-full text-white/70 hover:text-white hover:bg-white/5 font-mono text-base transition-colors"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-4 font-mono font-medium text-white text-sm">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 h-full text-white/70 hover:text-white hover:bg-white/5 font-mono text-base transition-colors"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Primary ADD TO CART Button */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex-1 h-12 px-6 bg-[#d89528] hover:bg-[#ffb91d] text-black font-semibold text-xs sm:text-sm uppercase tracking-[0.2em] transition-all duration-300 shadow-xl flex items-center justify-center gap-2 active:scale-98"
                  >
                    <span>{addedToCart ? '✔ Added to Bag' : 'Add to Cart'}</span>
                  </button>
                </div>

                {/* Secondary BUY IT NOW Button */}
                <button
                  type="button"
                  onClick={handleBuyItNow}
                  className="w-full h-12 bg-white/5 hover:bg-white/10 text-white border border-[#ffb91d]/40 hover:border-[#ffb91d] font-semibold text-xs uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center shadow-md active:scale-98"
                >
                  Buy It Now • Instant Checkout
                </button>

                {/* WhatsApp Order Button */}
                {/* <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-11 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40 font-medium text-xs uppercase tracking-[0.16em] transition-all flex items-center justify-center gap-2"
                >
                  <span>💬  WhatsApp: +971 58 571 9731</span>
                </a> */}
              </div>


              {/* ── ACCORDIONS ── */}
              <div className="pt-2 border-t border-white/10 divide-y divide-white/10 font-sans text-xs">

                {/* 1. The Olfactory Story */}
                {/* <div>
                  <button
                    type="button"
                    onClick={() => toggleAccordion('olfactory')}
                    className="w-full py-4 flex items-center justify-between text-left text-white/90 hover:text-[#ffb91d] transition-colors font-medium uppercase tracking-wider text-xs"
                  >
                    <span>The Olfactory Story</span>
                    <span className="font-mono text-base">{openAccordion === 'olfactory' ? '−' : '+'}</span>
                  </button>
                  {openAccordion === 'olfactory' && (
                    <div className="pb-4 text-white/80 leading-relaxed bg-[#121212] p-5 border border-white/5 animate-fadeIn text-xs sm:text-sm font-serif space-y-3">
                      {(product.olfactoryStory || product.description).split('\n\n').map((para, i) => (
                        <p key={i} className="leading-relaxed">
                          {para}
                        </p>
                      ))}
                    </div>
                  )}
                </div> */}

                {/* 2. The Oud Nomad Philosophy */}
                {/* <div>
                  <button
                    type="button"
                    onClick={() => toggleAccordion('philosophy')}
                    className="w-full py-4 flex items-center justify-between text-left text-white/90 hover:text-[#ffb91d] transition-colors font-medium uppercase tracking-wider text-xs"
                  >
                    <span>The Oud Nomad Philosophy</span>
                    <span className="font-mono text-base">{openAccordion === 'philosophy' ? '−' : '+'}</span>
                  </button>
                  {openAccordion === 'philosophy' && (
                    <div className="pb-4 text-white/80 leading-relaxed bg-[#121212] p-5 border border-white/5 animate-fadeIn text-xs sm:text-sm space-y-3 font-serif">
                      <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#ffb91d]">
                        Born in Dubai, inspired by the spirit of exploration.
                      </p>
                      <p className="text-white/80 leading-relaxed font-sans text-xs sm:text-sm">
                        Oud Nomad approaches fragrance as a personal signature — an invisible expression of presence, memory and individuality. Each composition invites a different encounter with the senses, designed to be experienced rather than simply worn.
                      </p>
                      <div className="border-t border-white/10 pt-3 text-[#ffb91d] font-mono text-[11px] uppercase tracking-wider">
                        Because true luxury does not demand attention. It leaves a trace.
                      </div>
                    </div>
                  )}
                </div> */}

                {/* 3. About This Fragrance */}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleAccordion('description')}
                    className="w-full py-4 flex items-center justify-between text-left text-white/90 hover:text-[#ffb91d] transition-colors font-medium uppercase tracking-wider text-xs"
                  >
                    <span>About This Fragrance</span>
                    <span className="font-mono text-base">{openAccordion === 'description' ? '−' : '+'}</span>
                  </button>
                  {openAccordion === 'description' && (
                    <div className="pb-4 text-white/70 leading-relaxed bg-[#121212] p-4 border border-white/5 animate-fadeIn text-xs sm:text-sm font-sans">
                      {product.description}
                    </div>
                  )}
                </div>

                {/* Ingredients */}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleAccordion('ingredients')}
                    className="w-full py-4 flex items-center justify-between text-left text-white/90 hover:text-[#ffb91d] transition-colors font-medium uppercase tracking-wider text-xs"
                  >
                    <span>Ingredients</span>
                    <span className="font-mono text-base">{openAccordion === 'ingredients' ? '−' : '+'}</span>
                  </button>
                  {openAccordion === 'ingredients' && (
                    <div className="pb-4 text-white/80 leading-relaxed bg-[#121212] p-4 sm:p-5 border border-white/5 animate-fadeIn text-xs space-y-3">
                      <div>

                        <p className="font-mono text-xs sm:text-[13px] text-white/90 uppercase tracking-wider leading-relaxed">
                          {product.ingredients || 'Alcohol Denat. 80%, Fragrance (Parfum) 16%, D.M. Water 4%.'}
                        </p>
                      </div>
                      <p className="text-[10px] text-white/40 pt-2 border-t border-white/5 leading-relaxed font-sans">
                        Formulated in the UAE. Free of parabens, phthalates, and harsh sulfates. Cruelty-free and formulated in accordance with IFRA international fragrance standards.
                      </p>
                    </div>
                  )}
                </div>

                {/* 4. Have Questions? */}
                {/* <div>
                  <button
                    type="button"
                    onClick={() => toggleAccordion('questions')}
                    className="w-full py-4 flex items-center justify-between text-left text-white/90 hover:text-[#ffb91d] transition-colors font-medium uppercase tracking-wider text-xs"
                  >
                    <span>Have Questions?</span>
                    <span className="font-mono text-base">{openAccordion === 'questions' ? '−' : '+'}</span>
                  </button>
                  {openAccordion === 'questions' && (
                    <div className="pb-4 text-white/70 space-y-2 leading-relaxed bg-[#121212] p-4 border border-white/5 animate-fadeIn">
                      <p>
                        <strong className="text-white">WhatsApp:</strong>{' '}
                        <a href="https://wa.me/971585719731" target="_blank" rel="noopener noreferrer" className="text-[#ffb91d] hover:underline">
                          +971 58 571 9731
                        </a>
                      </p>
                      <p>
                        <strong className="text-white">Call us:</strong>{' '}
                        <a href="tel:+971585719731" className="text-[#ffb91d] hover:underline">
                          +971 58 571 9731
                        </a>
                      </p>
                      <p>
                        <strong className="text-white">Instagram DM:</strong>{' '}
                        <a
                          href="https://www.instagram.com/oudnomaddubai?stkn=NWtkMGc4ZmFvc3pv&utm_source=qr"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#ffb91d] hover:underline"
                        >
                          @oudnomaddubai
                        </a>
                      </p>
                      <p>
                        <strong className="text-white">Email:</strong>{' '}
                        <a href="mailto:hello.oudnomaddubai@gmail.com" className="text-[#ffb91d] hover:underline">
                          hello.oudnomaddubai@gmail.com
                        </a>
                      </p>
                    </div>
                  )}
                </div> */}



                {/* 6. Shipping & Delivery */}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleAccordion('shipping')}
                    className="w-full py-4 flex items-center justify-between text-left text-white/90 hover:text-[#ffb91d] transition-colors font-medium uppercase tracking-wider text-xs"
                  >
                    <span>Shipping & Delivery</span>
                    <span className="font-mono text-base">{openAccordion === 'shipping' ? '−' : '+'}</span>
                  </button>
                  {openAccordion === 'shipping' && (
                    <div className="pb-4 text-white/70 space-y-2 leading-relaxed bg-[#121212] p-4 border border-white/5 animate-fadeIn">
                      <p>• <strong className="text-white/90">Complimentary Express Shipping</strong> across all GCC countries (UAE, KSA, Qatar, Kuwait, Oman & Bahrain).</p>
                      <p>• <strong className="text-white/90">Dispatch within 24 hours</strong> in discreet, temperature-controlled packaging.</p>
                      <p>• <strong className="text-white/90">2–4 business days</strong> to major cities across the GCC.</p>
                    </div>
                  )}
                </div>

                {/* 5. Registered Address & Contact */}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleAccordion('manufacturer')}
                    className="w-full py-4 flex items-center justify-between text-left text-white/90 hover:text-[#ffb91d] transition-colors font-medium uppercase tracking-wider text-xs"
                  >
                    <span>Registered Address & Contact</span>
                    <span className="font-mono text-base">{openAccordion === 'manufacturer' ? '−' : '+'}</span>
                  </button>
                  {openAccordion === 'manufacturer' && (
                    <div className="pb-4 text-white/70 space-y-2 leading-relaxed bg-[#121212] p-4 border border-white/5 animate-fadeIn font-mono text-[11px]">
                      <p><strong className="text-white font-sans">Brand:</strong> OUD NOMAD</p>
                      <p><strong className="text-white font-sans">Registered Address:</strong> VUET1829, COMPASS BUILDING — AL HULAILA INDUSTRIAL ZONE-FZ, RAS AL KHAIMAH, UAE</p>
                      <p><strong className="text-white font-sans">Contact:</strong> +971 58 571 9731</p>
                      <p><strong className="text-white font-sans">Country of Origin:</strong> United Arab Emirates</p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>

          {/* ── THE OLFACTORY STORY & MAISON PHILOSOPHY SHOWCASE ── */}
          {/* <section className="pt-16 sm:pt-24 border-t border-white/10">
            <div className="max-w-4xl mx-auto text-center space-y-10 px-4">
              <div className="space-y-3">
                <span className="text-[10px] font-mono tracking-[0.35em] uppercase text-[#ffb91d]">
                  THE OLFACTORY STORY
                </span>
                <h2 className="text-2xl sm:text-4xl font-serif text-white tracking-wide">
                  {product.tagline || product.name}
                </h2>
              </div>

              {product.olfactoryStory && (
                <div className="space-y-6 text-white/80 font-serif text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
                  {product.olfactoryStory.split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              )}

              {product.signature && (
                <div className="pt-4 border-t border-b border-white/10 py-6 max-w-xl mx-auto">
                  <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#ffb91d] block mb-2">
                    THE SIGNATURE
                  </span>
                  <p className="font-serif italic text-lg sm:text-xl text-white">
                    &ldquo;{product.signature}&rdquo;
                  </p>
                </div>
              )}

              <div className="pt-6 space-y-4 max-w-2xl mx-auto">
                <span className="text-[9px] font-mono tracking-[0.35em] uppercase text-white/40 block">
                  THE OUD NOMAD PHILOSOPHY
                </span>
                <p className="text-xs sm:text-sm text-white/60 font-sans tracking-wide leading-relaxed">
                  Born in Dubai, inspired by the spirit of exploration. Oud Nomad approaches fragrance as a personal signature — an invisible expression of presence, memory and individuality. Each composition invites a different encounter with the senses, designed to be experienced rather than simply worn.
                </p>
                <p className="text-xs sm:text-sm font-mono tracking-[0.2em] uppercase text-[#ffb91d] pt-2">
                  Because true luxury does not demand attention. It leaves a trace.
                </p>
              </div>
            </div>
          </section> */}

          {/* ── YOU MAY ALSO LIKE / BEST SELLERS SECTION ── */}
          <section className="pt-16 border-t border-white/10 space-y-8">
            <div className="text-center space-y-2">
              <span className="text-[10px] font-mono tracking-[0.35em] uppercase text-[#ffb91d]">
                CURATED RECOMMENDATIONS
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-white uppercase tracking-wider">
                You May Also Like
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {recommendations.slice(0, 4).map((rec) => (
                <Link
                  key={rec.id}
                  href={`/products/${rec.slug}`}
                  className="group border border-white/10 bg-[#0e0e0e] hover:border-[#ffb91d]/50 transition-all overflow-hidden"
                >
                  <div className="relative aspect-[4/5] w-full bg-[#141414] overflow-hidden">
                    <Image
                      src={rec.images?.[0] || ''}
                      alt={rec.name}
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="px-3.5 py-3 flex items-center justify-between gap-2">
                    <h4 className="text-xs sm:text-sm font-serif text-white uppercase group-hover:text-[#ffb91d] transition-colors truncate tracking-wide">
                      {rec.name}
                    </h4>
                    <p className="text-xs sm:text-sm font-mono text-[#ffb91d] font-medium shrink-0">
                      {formatPrice(rec.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* ── CUSTOMER REVIEWS ── */}
          {/* <section id="reviews" className="pt-16 border-t border-white/10 space-y-8">
            <div className="space-y-1">
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#ffb91d]">CUSTOMER REVIEWS</span>
              <h2 className="text-2xl font-serif text-white">What Our Clients Say</h2>
              <div className="flex items-center gap-2 text-xs font-mono text-[#ffb91d]">
                <span>★★★★★</span>
                <span className="text-white/50">4.9 / 5 &nbsp;·&nbsp; 28 reviews</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                {
                  author: 'Tariq Al-Mansoor',
                  location: 'Dubai, UAE',
                  date: 'Sep 18, 2026',
                  title: 'Unbelievable 48-hour sillage',
                  body: 'An unforgettable signature scent. The Taif Rose and aged Cambodian agarwood harmonize with breathtaking nobility. People stop to ask what I’m wearing.',
                },
                {
                  author: 'Fatima Al-Rashidi',
                  location: 'Riyadh, KSA',
                  date: 'Sep 12, 2026',
                  title: 'Pure olfactory poetry',
                  body: 'Received within 3 days. The crystal flacon feels like a museum art piece. Scent stays on silk fabrics for days. Absolutely worth every dirham.',
                },
              ].map((rev, i) => (
                <div key={i} className="border border-white/10 bg-[#0d0d0d] p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#ffb91d] tracking-wide">★★★★★</span>
                    <span className="text-white/35 font-mono text-[10px]">{rev.date}</span>
                  </div>
                  <h4 className="font-serif text-sm text-white">{rev.title}</h4>
                  <p className="text-xs text-white/65 leading-relaxed font-sans">{rev.body}</p>
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-white/40">
                    <span>{rev.author} · <span className="text-[#53ff73]">Verified</span></span>
                    <span>{rev.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </section> */}
        </Container>
      </main>

      {/* ── LIGHTBOX MODAL ── */}
      {lightboxOpen && product?.images && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Inner — stop propagation so clicks on controls don't close */}
          <div
            className="relative w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Main Image */}
            <div className="relative w-full max-w-2xl mx-auto aspect-[4/5] px-4">
              <Image
                src={product.images[lightboxIndex]}
                alt={`${product.name} — view ${lightboxIndex + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain"
                priority
              />
            </div>

            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/70 hover:bg-black border border-white/20 hover:border-[#ffb91d] flex items-center justify-center text-white text-xl transition-all"
              aria-label="Close"
            >
              ✕
            </button>

            {/* Image counter */}
            <div className="absolute top-4 left-4 text-[11px] font-mono text-white/50 bg-black/60 px-3 py-1.5 border border-white/10">
              {lightboxIndex + 1} / {product.images.length}
            </div>

            {/* Prev arrow */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={() => lightboxPrev(product.images!.length)}
                  className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 bg-black/60 hover:bg-[#ffb91d]/20 border border-white/20 hover:border-[#ffb91d] flex items-center justify-center text-white text-2xl transition-all"
                  aria-label="Previous image"
                >
                  ‹
                </button>

                {/* Next arrow */}
                <button
                  onClick={() => lightboxNext(product.images!.length)}
                  className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 bg-black/60 hover:bg-[#ffb91d]/20 border border-white/20 hover:border-[#ffb91d] flex items-center justify-center text-white text-2xl transition-all"
                  aria-label="Next image"
                >
                  ›
                </button>

                {/* Dot indicators */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                  {product.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setLightboxIndex(idx)}
                      className={`rounded-full transition-all ${idx === lightboxIndex
                        ? 'bg-[#ffb91d] w-5 h-1.5'
                        : 'bg-white/30 hover:bg-white/60 w-1.5 h-1.5'
                        }`}
                      aria-label={`View image ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Backdrop click to close hint */}
            <button
              onClick={closeLightbox}
              className="absolute inset-0 -z-10 w-full h-full cursor-zoom-out"
              aria-label="Close lightbox"
            />
          </div>
        </div>
      )}

      {/* ── STICKY ADD TO CART BAR ── */}
      <div
        className={`fixed z-40 transition-all duration-300 ease-out 
          bottom-0 inset-x-0 sm:bottom-6 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 
          w-full sm:w-[94%] sm:max-w-2xl px-3 sm:px-0
          pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 sm:py-0
          ${showStickyBar ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-full sm:translate-y-12 opacity-0 pointer-events-none'}`}
      >
        <div className="bg-[#101010]/95 backdrop-blur-md border border-[#ffb91d]/30 rounded-xl sm:rounded-full px-3.5 sm:px-5 py-2.5 sm:py-2.5 shadow-[0_10px_35px_rgba(0,0,0,0.85)] flex items-center justify-between gap-3 sm:gap-4">
          {/* Left: Product Thumbnail + Title + Price */}
          <div className="flex items-center gap-2.5 min-w-0">
            {product.images && product.images[0] && (
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-sm sm:rounded-full overflow-hidden bg-stone-900 border border-white/10 shrink-0">
                <Image
                  src={selectedImage || product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs sm:text-sm font-medium text-white truncate tracking-wide">
                  {product.name}
                </h4>
                <span className="hidden md:inline-block text-[10px] font-mono text-white/40 uppercase">
                  · {activeVariantObj.size || '100ml'}
                </span>
              </div>
              <div className="text-[11px] sm:text-xs font-mono font-medium text-[#ffb91d]">
                {formatPrice(activeVariantObj.price)}
              </div>
            </div>
          </div>

          {/* Right: Quantity Selector & Add To Cart Button */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Quantity Stepper */}
            <div className="flex items-center border border-white/20 bg-black/60 rounded sm:rounded-full h-8 sm:h-9">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-7 sm:w-8 h-full text-white/70 hover:text-white hover:bg-white/10 font-mono text-xs sm:text-sm transition-colors rounded-l sm:rounded-l-full flex items-center justify-center"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="px-2 sm:px-2.5 font-mono text-xs font-semibold text-white">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-7 sm:w-8 h-full text-white/70 hover:text-white hover:bg-white/10 font-mono text-xs sm:text-sm transition-colors rounded-r sm:rounded-r-full flex items-center justify-center"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            {/* Sticky Add to Cart Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="h-8 sm:h-9 px-3.5 sm:px-5 bg-[#d89528] hover:bg-[#ffb91d] text-black font-semibold text-[10px] sm:text-xs uppercase tracking-[0.16em] sm:tracking-[0.2em] rounded sm:rounded-full transition-all duration-300 shadow-md flex items-center justify-center gap-1.5 active:scale-95"
            >
              <span>{addedToCart ? '✔ Added' : 'Add to Cart'}</span>
            </button>
          </div>
        </div>
      </div>

    </div>

  );
}
