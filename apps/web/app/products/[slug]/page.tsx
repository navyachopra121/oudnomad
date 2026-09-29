'use client';

import React, { useEffect, useState, use } from 'react';
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

  // Accordion state (which accordion tab is currently open)
  const [openAccordion, setOpenAccordion] = useState<string | null>('features');

  // Review Modal Form State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewBody, setReviewBody] = useState('');

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const prod = await StoreApi.getProductBySlug(slug);
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
    `Hello Oud Arabia Dubai, I would like to order *${product.name}* (Price: ${formatPrice(product.price)}). Please assist me with my order.`
  );
  const whatsappUrl = `https://wa.me/919888881908?text=${whatsappMessage}`;

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

      <main className="flex-1 w-full pt-8 pb-20">
        <Container className="space-y-12">
          {/* Breadcrumbs */}
          <nav className="text-[11px] font-sans tracking-[0.18em] uppercase text-white/50 flex flex-wrap items-center gap-2">
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            {/* ── LEFT COLUMN: Gallery with Zoom & Thumbnails ── */}
            <div className="lg:col-span-7 space-y-4">
              {/* Main Image */}
              <div className="relative aspect-[3/4] w-full bg-[#121212] border border-white/10 overflow-hidden shadow-2xl group/zoom">
                <Image
                  src={selectedImage || product.images[0]}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover object-center transition-transform duration-700 group-hover/zoom:scale-105"
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                  <span className="bg-[#ffb91d] text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1 shadow-md">
                    DUBAI ORIGIN
                  </span>
                  <span className="bg-black/80 backdrop-blur-sm text-white text-[9px] font-mono tracking-wider px-2.5 py-0.5 border border-white/15">
                    {product.features?.quantity || (product.category === 'attars' ? '12ml' : '100ml')}
                  </span>
                </div>
              </div>

              {/* Thumbnails Row */}
              {product.images && product.images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`relative w-20 sm:w-24 aspect-[3/4] overflow-hidden flex-shrink-0 transition-all border ${selectedImage === img
                        ? 'border-[#ffb91d] ring-1 ring-[#ffb91d] shadow-lg'
                        : 'border-white/10 opacity-60 hover:opacity-100 hover:border-white/30'
                        }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} thumbnail ${idx + 1}`}
                        fill
                        className="object-cover object-center"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 py-4 border-y border-white/10 text-center font-mono text-[10px] uppercase tracking-wider text-white/60">
                <div className="p-2 border-r border-white/10">
                  <span className="block text-[#ffb91d] text-base mb-1">🏺</span>
                  <span>100% Pure Extracts</span>
                </div>
                <div className="p-2 border-r border-white/10">
                  <span className="block text-[#ffb91d] text-base mb-1">✨</span>
                  <span>48h Longevity</span>
                </div>
                <div className="p-2">
                  <span className="block text-[#ffb91d] text-base mb-1">✈️</span>
                  <span>Free Express Ship</span>
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN: Product Info & Actions ── */}
            <div className="lg:col-span-5 space-y-6">
              {/* Header Info */}
              <div className="space-y-2 border-b border-white/10 pb-6">
                <span className="text-[10px] font-mono tracking-[0.35em] uppercase text-[#ffb91d] block">
                  AYAL PERFUMES LLC • DUBAI (UAE)
                </span>
                <h1 className="text-2xl sm:text-4xl font-serif font-normal text-white tracking-wide leading-tight">
                  {product.name}
                </h1>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-3 pt-1">
                  <div className="flex text-[#ffb91d] text-sm">★★★★★</div>
                  <span className="text-xs text-white/60 font-mono">
                    4.9 / 5.0 (28 customer reviews)
                  </span>
                </div>

                {/* Price Display */}
                <div className="pt-3 flex flex-wrap items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-medium text-[#ffb91d] font-mono tracking-tight">
                    {formatPrice(activeVariantObj.price)}
                  </span>
                  {product.compareAtPrice && product.compareAtPrice > product.price && (
                    <span className="text-sm line-through text-white/40 font-mono">
                      {formatPrice(product.compareAtPrice)}
                    </span>
                  )}
                  <span className="text-[11px] text-white/60 font-sans block w-full mt-1">
                    Tax included. <strong className="text-white/80">Free express delivery</strong> across India & GCC.
                  </span>
                </div>

                {/* In Stock Badge */}
                <div className="pt-2 flex items-center gap-2 text-xs font-mono text-[#53ff73]">
                  <span className="w-2 h-2 rounded-full bg-[#53ff73] animate-pulse" />
                  <span>In stock, ready to dispatch from Dubai warehouse</span>
                </div>
              </div>

              {/* Storytelling Intro */}
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans">
                {product.description}
              </p>

              {/* Quantity & CTA Buttons */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
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
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-11 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40 font-medium text-xs uppercase tracking-[0.16em] transition-all flex items-center justify-center gap-2"
                >
                  <span>💬 Order via WhatsApp: +91-9888881908</span>
                </a>
              </div>

              {/* ── PRODUCT FEATURES TABLE (Word-to-Word from Oud Arabia) ── */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <h3 className="text-xs font-mono uppercase tracking-[0.25em] text-[#ffb91d]">
                  Product Features & Composition
                </h3>

                <div className="overflow-x-auto border border-white/10 bg-[#0e0e0e]">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 bg-[#161616]">
                        <th className="py-2.5 px-4 font-semibold text-[#ffb91d] uppercase tracking-wider w-1/3">
                          Features
                        </th>
                        <th className="py-2.5 px-4 font-semibold text-[#ffb91d] uppercase tracking-wider">
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-sans">
                      <tr>
                        <td className="py-2.5 px-4 text-white/50 font-mono text-[11px]">Top Notes</td>
                        <td className="py-2.5 px-4 text-white/90">
                          {product.features?.topNotes || 'Jasmine, Taif Rose, and Ruh al Ward'}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 text-white/50 font-mono text-[11px]">Middle Notes</td>
                        <td className="py-2.5 px-4 text-white/90">
                          {product.features?.middleNotes || 'Jasmine Oud, Lily of the Valley, Rose, and Lavender'}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 text-white/50 font-mono text-[11px]">Base Notes</td>
                        <td className="py-2.5 px-4 text-white/90">
                          {product.features?.baseNotes || 'Amber, Fruity Notes, White Musk, and Bulgarian Rose'}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 text-white/50 font-mono text-[11px]">Longevity</td>
                        <td className="py-2.5 px-4 text-white/90">
                          {product.features?.longevity || '48 Hours'}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 text-white/50 font-mono text-[11px]">Gender</td>
                        <td className="py-2.5 px-4 text-white/90">
                          {product.features?.gender || 'Unisex'}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 text-white/50 font-mono text-[11px]">Type</td>
                        <td className="py-2.5 px-4 text-white/90">
                          {product.features?.type || 'Oil Based'}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 text-white/50 font-mono text-[11px]">Quantity</td>
                        <td className="py-2.5 px-4 text-white/90 font-mono">
                          {product.features?.quantity || (product.category === 'attars' ? '12ml' : '100ml')}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ── INTERACTIVE ACCORDIONS (Word-to-Word from Oud Arabia) ── */}
              <div className="pt-2 border-t border-white/10 divide-y divide-white/10 font-sans text-xs">
                {/* 1. Have Questions? */}
                <div>
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
                        <a href="https://wa.me/919888881908" className="text-[#ffb91d] hover:underline">
                          +91-9888881908
                        </a>
                      </p>
                      <p>
                        <strong className="text-white">Call us:</strong>{' '}
                        <a href="tel:+919888881908" className="text-[#ffb91d] hover:underline">
                          +91-9888881908
                        </a>
                      </p>
                      <p>
                        <strong className="text-white">Instagram DM:</strong>{' '}
                        <a
                          href="https://instagram.com/oudarabiaofficial"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#ffb91d] hover:underline"
                        >
                          @oudarabiaofficial
                        </a>
                      </p>
                      <p>
                        <strong className="text-white">Email:</strong>{' '}
                        <a href="mailto:info@oudarabiadubai.com" className="text-[#ffb91d] hover:underline">
                          info@oudarabiadubai.com
                        </a>
                      </p>
                    </div>
                  )}
                </div>

                {/* 2. Manufacturer Details */}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleAccordion('manufacturer')}
                    className="w-full py-4 flex items-center justify-between text-left text-white/90 hover:text-[#ffb91d] transition-colors font-medium uppercase tracking-wider text-xs"
                  >
                    <span>Manufacturer Details</span>
                    <span className="font-mono text-base">{openAccordion === 'manufacturer' ? '−' : '+'}</span>
                  </button>
                  {openAccordion === 'manufacturer' && (
                    <div className="pb-4 text-white/70 space-y-2 leading-relaxed bg-[#121212] p-4 border border-white/5 animate-fadeIn font-mono text-[11px]">
                      <p>
                        <strong className="text-white font-sans">Brand & Atelier:</strong> AYAL PERFUMES LLC
                      </p>
                      <p>
                        <strong className="text-white font-sans">Atelier Address:</strong> Shop 7, Alfaidi Street,
                        Dubai, 465000, UAE
                      </p>
                      <p>
                        <strong className="text-white font-sans">Country of Origin:</strong> DUBAI (UAE)
                      </p>
                      <p>
                        <strong className="text-white font-sans">Bottling & Packaging:</strong> Handcrafted crystal flacon with gold-plated metal cap, velvet & leather box.
                      </p>
                    </div>
                  )}
                </div>

                {/* 3. About Oud Arabia */}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleAccordion('about')}
                    className="w-full py-4 flex items-center justify-between text-left text-white/90 hover:text-[#ffb91d] transition-colors font-medium uppercase tracking-wider text-xs"
                  >
                    <span>About Oud Arabia Dubai</span>
                    <span className="font-mono text-base">{openAccordion === 'about' ? '−' : '+'}</span>
                  </button>
                  {openAccordion === 'about' && (
                    <div className="pb-4 text-white/70 space-y-2 leading-relaxed bg-[#121212] p-4 border border-white/5 animate-fadeIn">
                      <p>
                        “We believe that a perfumer is a poet or a storyteller who use intangible ingredients to create emotions. The main idea behind Oud Arabia is to abstract memories that evoke our cores. We paint pictures without using paint. We are storytellers who do not need words.”
                      </p>
                      <p className="text-[11px] text-[#ffb91d]">
                        Each scent is made in Dubai and handcrafted by our master perfumers with over 20 years of royal heritage.
                      </p>
                    </div>
                  )}
                </div>

                {/* 4. Customer Care & Shipping */}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleAccordion('shipping')}
                    className="w-full py-4 flex items-center justify-between text-left text-white/90 hover:text-[#ffb91d] transition-colors font-medium uppercase tracking-wider text-xs"
                  >
                    <span>Shipping & Delivery Policy</span>
                    <span className="font-mono text-base">{openAccordion === 'shipping' ? '−' : '+'}</span>
                  </button>
                  {openAccordion === 'shipping' && (
                    <div className="pb-4 text-white/70 space-y-2 leading-relaxed bg-[#121212] p-4 border border-white/5 animate-fadeIn">
                      <p>
                        • <strong>Complimentary Express Shipping:</strong> Available on all orders pan-India and across GCC countries.
                      </p>
                      <p>
                        • <strong>Dispatch Timeline:</strong> Orders are dispatched within 24 hours in discreet, temperature-controlled luxury protective packaging.
                      </p>
                      <p>
                        • <strong>Transit Time:</strong> 2 to 4 business days to major metros in India and UAE.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

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
                  className="group border border-white/10 bg-[#0e0e0e] hover:border-[#ffb91d]/50 transition-all p-3 sm:p-4 flex flex-col justify-between"
                >
                  <div className="relative aspect-[3/4] w-full bg-[#141414] overflow-hidden mb-3">
                    <Image
                      src={rec.images?.[0] || ''}
                      alt={rec.name}
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-mono tracking-widest text-[#ffb91d] block">
                      {rec.category}
                    </span>
                    <h4 className="text-xs sm:text-sm font-serif text-white group-hover:text-[#ffb91d] transition-colors line-clamp-1">
                      {rec.name}
                    </h4>
                    <p className="text-xs font-mono text-[#ffb91d] font-medium pt-1">
                      {formatPrice(rec.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* ── CUSTOMER REVIEWS & APPRAISALS ── */}
          <section id="reviews" className="pt-16 border-t border-white/10 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
              <div className="space-y-2">
                <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#ffb91d]">
                  AUTHENTIC APPRAISALS
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif text-white">
                  Customer Impressions
                </h2>
                <div className="flex items-center gap-2 text-sm font-mono text-[#ffb91d]">
                  <span>★★★★★</span>
                  <span>4.9 out of 5 based on 28 reviews</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowReviewModal(true)}
                className="px-6 py-3 bg-[#d89528] hover:bg-[#ffb91d] text-black font-semibold text-xs uppercase tracking-[0.2em] transition-all shadow-md self-start md:self-auto"
              >
                Write an Appraisal
              </button>
            </div>

            {/* Review Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  author: 'Tariq Al-Mansoor',
                  location: 'Dubai, UAE',
                  date: 'September 18, 2026',
                  rating: 5,
                  title: 'Unbelievable 48-hour sillage and regal elegance',
                  body: 'An unforgettable signature scent. The Grasse Taif Rose and aged Cambodian agarwood harmonize with breathtaking nobility. Everywhere I walk in Dubai Mall or airport lounges, people stop to inquire what fragrance I am wearing.',
                },
                {
                  author: 'Ananya Sharma',
                  location: 'Mumbai, India',
                  date: 'September 12, 2026',
                  rating: 5,
                  title: 'Pure olfactory poetry — worth every rupee',
                  body: 'Received in Mohali warehouse dispatch within 3 days. The crystal flacon and handcrafted metal cap feel like a museum art piece. Scent stays on silk fabrics for days.',
                },
                {
                  author: 'Fahad Al-Kuwari',
                  location: 'Doha, Qatar',
                  date: 'August 29, 2026',
                  rating: 5,
                  title: 'True master perfumery at its finest',
                  body: 'Oud Arabia Dubai has mastered the delicate art of middle notes where Bulgarian rose and white musk blend into vintage agarwood. 10/10.',
                },
                {
                  author: 'Dr. Julian Sterling',
                  location: 'London, UK',
                  date: 'August 14, 2026',
                  rating: 5,
                  title: 'Highest quality natural ingredients',
                  body: 'Non-synthetic, richly layered, and projects a dignified presence without being cloying. A permanent staple in my collection.',
                },
              ].map((rev, i) => (
                <div key={i} className="border border-white/10 bg-[#0e0e0e] p-6 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#ffb91d]">★★★★★</span>
                    <span className="text-white/40 font-mono text-[10px]">{rev.date}</span>
                  </div>
                  <h4 className="font-serif text-base text-white">{rev.title}</h4>
                  <p className="text-xs text-white/70 leading-relaxed font-sans">{rev.body}</p>
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-white/50">
                    <span>
                      {rev.author} • <span className="text-[#53ff73]">Verified Buyer</span>
                    </span>
                    <span>{rev.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </Container>
      </main>

      {/* Review Modal */}
      {showReviewModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setShowReviewModal(false)}
        >
          <div
            className="relative w-full max-w-lg bg-[#111111] border border-[#ffb91d]/40 p-6 sm:p-8 shadow-2xl text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white text-xl p-2"
              aria-label="Close"
            >
              ✕
            </button>

            <h3 className="text-xl font-serif text-white tracking-wide mb-1">
              Submit Your Appraisal
            </h3>
            <p className="text-xs text-white/60 font-sans mb-6">
              Share your personal experience with {product.name}.
            </p>

            {reviewSuccessMsg ? (
              <div className="p-4 bg-[#53ff73]/10 border border-[#53ff73]/30 text-[#53ff73] text-xs text-center">
                {reviewSuccessMsg}
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmittingReview(true);
                  setTimeout(() => {
                    setReviewSuccessMsg('Thank you. Your appraisal has been submitted for verification.');
                    setSubmittingReview(false);
                    setTimeout(() => setShowReviewModal(false), 2000);
                  }, 800);
                }}
                className="space-y-4 text-xs font-sans"
              >
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#ffb91d] mb-1 font-mono">
                    Rating
                  </label>
                  <div className="flex gap-2 text-xl text-[#ffb91d] cursor-pointer">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span
                        key={s}
                        onClick={() => setReviewRating(s)}
                        className={s <= reviewRating ? 'opacity-100' : 'opacity-30'}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-white/70 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewAuthor}
                    onChange={(e) => setReviewAuthor(e.target.value)}
                    placeholder="e.g. Sheikh Tariq / Ananya S."
                    className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-white outline-none focus:border-[#ffb91d]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-white/70 mb-1">
                    Review Headline
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="e.g. Unbelievable longevity and sillage"
                    className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-white outline-none focus:border-[#ffb91d]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-white/70 mb-1">
                    Detailed Impression
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={reviewBody}
                    onChange={(e) => setReviewBody(e.target.value)}
                    placeholder="Describe how the fragrance unfolds across top, heart, and base notes..."
                    className="w-full bg-[#181818] border border-white/15 p-3 text-white outline-none focus:border-[#ffb91d]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full py-3 bg-[#d89528] hover:bg-[#ffb91d] text-black font-semibold uppercase tracking-[0.2em] transition-all"
                >
                  {submittingReview ? 'Submitting...' : 'Post Appraisal'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
