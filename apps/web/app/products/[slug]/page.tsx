'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const { addItem } = useCart();
  const { formatPrice, currency } = useCurrency();

  const [product, setProduct] = useState<ProductItem | null>(null);
  const [recommendations, setRecommendations] = useState<ProductItem[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  // Review Modal Form State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewHoverRating, setReviewHoverRating] = useState(0);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewBody, setReviewBody] = useState('');
  const [reviewLongevity, setReviewLongevity] = useState('12+ Hours (Exceptional)');
  const [reviewSillage, setReviewSillage] = useState('Regal & Enveloping');

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
      <div className="min-h-screen bg-background text-foreground flex flex-col font-serif">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center font-sans text-xs uppercase tracking-[0.25em] text-muted py-32">
          Unsealing flacon archives...
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col font-serif">
        <SiteHeader />
        <main className="flex-1 flex flex-col items-center justify-center text-center py-32 font-sans space-y-4">
          <p className="text-sm text-muted">The requested perfume archive could not be located.</p>
          <Link href="/collections" className="text-xs uppercase tracking-[0.2em] text-antique-gold underline">
            Return to Archives
          </Link>
        </main>
      </div>
    );
  }

  const activeVariantObj = product.variants?.find((v) => v.id === selectedVariant) || {
    price: product.price,
    size: 'Standard Flacon',
  };

  const handleAddToCart = () => {
    if (!product) return;
    const variantId = selectedVariant || product.variants?.[0]?.id || product.id;
    const variantObj = product.variants?.find((v) => v.id === variantId);
    addItem({
      productId: product.id,
      variantId,
      name: product.name,
      slug: product.slug,
      image: selectedImage || product.images?.[0] || '',
      price: variantObj?.price || product.price,
      size: variantObj?.size || 'Standard Flacon',
      quantity,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const handleHelpful = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, helpfulCount: r.helpfulCount + 1 } : r))
    );
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setSubmittingReview(true);
    try {
      const created = await StoreApi.createReview(product.id, {
        rating: reviewRating,
        title: reviewTitle,
        body: reviewBody,
        authorName: reviewAuthor || 'Distinguished Collector',
        variantPurchased: activeVariantObj?.size || 'Standard Flacon',
        longevity: reviewLongevity,
        sillage: reviewSillage,
      });
      setReviews([created, ...reviews]);
      setReviewSuccessMsg('Your olfactory impression has been registered and sealed in the archives.');
      setTimeout(() => {
        setShowReviewModal(false);
        setReviewSuccessMsg(null);
        setReviewTitle('');
        setReviewBody('');
        setReviewAuthor('');
      }, 2000);
    } catch (err: any) {
      alert('Failed to submit appraisal: ' + err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
      : (product.rating || 5.0).toFixed(1);

  const starCounts = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => Math.round(r.rating) === stars).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { stars, count, percentage };
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-serif">
      <SiteHeader />
      <JsonLd
        data={generateProductJsonLd({
          name: product.name,
          description: product.description,
          images: product.images,
          price: activeVariantObj.price,
          slug: product.slug,
          rating: parseFloat(avgRating),
          reviewCount: totalReviews,
        })}
      />

      <main className="flex-1 w-full py-6 sm:py-2">
        <Container className="space-y-8 sm:space-y-16">
          {/* Breadcrumb Navigation */}
          <nav className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.14em] sm:tracking-[0.2em] text-muted flex flex-wrap items-center gap-1.5 sm:gap-2 leading-relaxed py-0.5">
            <Link href="/" className="hover:text-espresso transition-colors shrink-0">Home</Link>
            <span className="opacity-50">/</span>
            <Link href="/collections" className="hover:text-espresso transition-colors shrink-0">Collections</Link>
            <span className="opacity-50">/</span>
            <Link href={`/collections/${product.category}`} className="hover:text-espresso transition-colors shrink-0">{product.category}</Link>
            <span className="opacity-50">/</span>
            <span className="text-antique-gold font-medium truncate max-w-[160px] sm:max-w-none">{product.name}</span>
          </nav>

          {/* Product Detail Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
            {/* Left Image Gallery */}
            <div className="lg:col-span-7 space-y-3 sm:space-y-4">
              <div className="relative aspect-[4/5] bg-surface-muted/30 overflow-hidden">
                <Image
                  src={selectedImage || product.images[0]}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />

                {product.concentration && (
                  <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-ivory/95 backdrop-blur-sm text-espresso text-[9px] sm:text-[10px] font-sans uppercase tracking-[0.18em] px-2.5 py-1">
                    {product.concentration}
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`relative w-16 sm:w-20 aspect-square overflow-hidden flex-shrink-0 transition-all ${selectedImage === img ? 'ring-2 ring-antique-gold' : 'opacity-60 hover:opacity-100'
                        }`}
                    >
                      <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover object-center" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Information & Actions */}
            <div className="lg:col-span-5 space-y-5 sm:space-y-8 font-sans">
              <div className="space-y-2 sm:space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[11px] sm:text-xs text-antique-gold">
                  <span className="uppercase tracking-[0.16em] sm:tracking-[0.24em] font-medium leading-snug">
                    {product.origin || 'Artisanal Distillation'}
                  </span>
                  {product.rating && (
                    <span className="font-mono flex items-center gap-1 text-[11px] shrink-0">
                      ★ {product.rating.toFixed(1)} <span className="text-muted text-[10px]">({product.reviewCount || 0} appraisals)</span>
                    </span>
                  )}
                </div>

                <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-normal text-espresso tracking-tight leading-snug sm:leading-tight">
                  {product.name}
                </h1>

                <div className="text-xl sm:text-2xl font-serif text-antique-gold pt-0.5">
                  {formatPrice(activeVariantObj.price)}{' '}
                  <span className="text-[11px] font-sans text-muted">{currency.code} (Taxes & Duties Included)</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-espresso/85 leading-relaxed font-sans">
                {product.description}
              </p>

              {/* Variant Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-2.5 pt-3.5 sm:pt-4">
                  <label className="block text-[10px] uppercase tracking-[0.18em] sm:tracking-[0.22em] text-muted font-semibold">
                    Select Size & Flacon Volume:
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v.id)}
                        className={`w-full p-2.5 sm:p-3.5 text-left flex items-center justify-between text-xs transition-all ${selectedVariant === v.id
                          ? 'bg-aged-gold/15 text-espresso font-medium'
                          : 'bg-surface-muted/40 text-muted hover:bg-surface-muted'
                          }`}
                      >
                        <span className="font-serif text-xs sm:text-sm">{v.size}</span>
                        <span className="font-mono text-antique-gold font-medium text-xs sm:text-sm">{formatPrice(v.price)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions & Quantity */}
              <div className="space-y-3 pt-3.5 sm:pt-4 border-t border-border">
                <div className="flex items-center gap-2.5 sm:gap-4">
                  <div className="flex items-center border border-border bg-ivory">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-muted hover:text-espresso text-xs sm:text-sm font-mono"
                    >
                      -
                    </button>
                    <span className="px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs font-mono font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-muted hover:text-espresso text-xs sm:text-sm font-mono"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="flex-1 py-3 sm:py-3.5 px-4 sm:px-6 bg-aged-gold text-accent-on-fill hover:bg-antique-gold text-[11px] sm:text-xs uppercase tracking-[0.18em] sm:tracking-[0.24em] font-medium transition-all duration-400 shadow-md text-center"
                  >
                    {addedToCart ? '✔ Added to Vault' : 'Acquire Flacon'}
                  </button>
                </div>

                {addedToCart && (
                  <div className="p-3 bg-deep-emerald/10 border border-deep-emerald/20 text-deep-emerald text-xs font-sans text-center">
                    Flacon reserved in cart. Ready for review at checkout.
                  </div>
                )}
              </div>

              {/* Fragrance Notes Accordion */}
              {product.notes && (
                <div className="pt-6 border-t border-border space-y-4">
                  <h3 className="text-xs uppercase tracking-[0.25em] text-antique-gold font-semibold">
                    Olfactory Fragrance Pyramid
                  </h3>
                  <div className="space-y-3 text-xs bg-surface-muted/60 p-4 border border-border">
                    <div>
                      <span className="text-muted uppercase text-[10px] tracking-wider block mb-1">Top Notes:</span>
                      <p className="text-espresso font-serif">{product.notes.top.join(' • ')}</p>
                    </div>
                    <div className="pt-2 border-t border-border/60">
                      <span className="text-muted uppercase text-[10px] tracking-wider block mb-1">Heart Notes:</span>
                      <p className="text-espresso font-serif">{product.notes.heart.join(' • ')}</p>
                    </div>
                    <div className="pt-2 border-t border-border/60">
                      <span className="text-muted uppercase text-[10px] tracking-wider block mb-1">Base Notes:</span>
                      <p className="text-espresso font-serif">{product.notes.base.join(' • ')}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Customer Reviews Section */}
          <section id="reviews" className="pt-16 border-t border-border space-y-10">
            {/* Reviews Header & Scorecard */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-8 border-b border-border">
              <div className="space-y-3">
                <span className="text-[10px] font-sans tracking-[0.28em] uppercase text-antique-gold font-medium block">
                  Olfactory Appraisals
                </span>
                <h2 className="font-display text-2xl sm:text-3xl text-espresso">
                  Collector Impressions & Reviews
                </h2>
                <div className="flex items-center gap-3">
                  <div className="flex items-center text-antique-gold text-lg">
                    {'★'.repeat(Math.round(Number(avgRating)))}
                    <span className="text-border">{'★'.repeat(5 - Math.round(Number(avgRating)))}</span>
                  </div>
                  <span className="font-display text-xl text-espresso font-semibold">{avgRating} / 5.0</span>
                  <span className="text-xs text-muted font-sans">• Based on {totalReviews} authenticated appraisals</span>
                </div>
              </div>

              {/* Star Breakdown Bar Chart */}
              <div className="w-full lg:w-72 space-y-1.5 font-sans text-xs">
                {starCounts.map(({ stars, count, percentage }) => (
                  <div key={stars} className="flex items-center gap-2">
                    <span className="w-8 text-muted text-[11px] font-mono">{stars} ★</span>
                    <div className="flex-1 h-2 bg-surface-muted border border-border/80 overflow-hidden">
                      <div
                        className="h-full bg-aged-gold transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-6 text-right text-muted text-[10px] font-mono">{count}</span>
                  </div>
                ))}
              </div>

              {/* Share Experience CTA */}
              <div className="shrink-0 font-sans">
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="w-full sm:w-auto px-6 py-3 bg-aged-gold hover:bg-antique-gold text-accent-on-fill text-xs uppercase tracking-[0.2em] font-medium transition-colors shadow-sm"
                >
                  Submit An Appraisal
                </button>
              </div>
            </div>

            {/* Reviews Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-surface-muted/40 p-6 sm:p-7 border border-border space-y-4 hover:border-antique-gold/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1 text-antique-gold text-sm tracking-wider">
                        {'★'.repeat(rev.rating)}
                        <span className="text-border">{'★'.repeat(5 - rev.rating)}</span>
                      </div>
                      <h4 className="font-display text-base text-espresso mt-1">{rev.title}</h4>
                    </div>

                    {rev.verifiedBuyer && (
                      <span className="px-2.5 py-0.5 text-[9px] uppercase tracking-wider font-medium bg-aged-gold/15 text-antique-gold border border-antique-gold/30 shrink-0">
                        ✓ Verified Collector
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-espresso/90 leading-relaxed font-sans">
                    {rev.body}
                  </p>

                  {/* Longevity & Sillage Tags */}
                  {(rev.longevity || rev.sillage) && (
                    <div className="flex flex-wrap gap-2 pt-1 text-[10px]">
                      {rev.longevity && (
                        <span className="px-2 py-0.5 bg-ivory border border-border text-muted">
                          Longevity: <strong className="text-espresso font-normal">{rev.longevity}</strong>
                        </span>
                      )}
                      {rev.sillage && (
                        <span className="px-2 py-0.5 bg-ivory border border-border text-muted">
                          Sillage: <strong className="text-espresso font-normal">{rev.sillage}</strong>
                        </span>
                      )}
                      {rev.variantPurchased && (
                        <span className="px-2 py-0.5 bg-ivory border border-border text-muted">
                          Flacon: <strong className="text-espresso font-normal">{rev.variantPurchased}</strong>
                        </span>
                      )}
                    </div>
                  )}

                  {/* Footer with Author & Helpful Button */}
                  <div className="pt-3 border-t border-border/80 flex items-center justify-between text-xs text-muted">
                    <div>
                      <span className="text-espresso font-medium">{rev.authorName}</span>
                      <span className="opacity-60 text-[10px] ml-1.5">• {rev.date}</span>
                    </div>

                    <button
                      onClick={() => handleHelpful(rev.id)}
                      className="hover:text-espresso transition-colors text-[11px] flex items-center gap-1.5"
                    >
                      <span>👍 Helpful</span>
                      <span className="font-mono text-[10px]">({rev.helpfulCount})</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Review Submission Modal */}
            {showReviewModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/60 backdrop-blur-sm font-sans">
                <div className="bg-ivory border border-border p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-antique-gold font-medium block">
                        Artisanal Appraisal
                      </span>
                      <h3 className="font-display text-xl text-espresso">
                        Share Your Olfactory Impression
                      </h3>
                    </div>
                    <button
                      onClick={() => setShowReviewModal(false)}
                      className="text-muted hover:text-espresso text-lg"
                    >
                      ✕
                    </button>
                  </div>

                  {reviewSuccessMsg ? (
                    <div className="p-6 bg-deep-emerald/10 border border-deep-emerald/30 text-center space-y-2">
                      <div className="text-2xl text-deep-emerald">✓</div>
                      <p className="font-serif text-base text-espresso">{reviewSuccessMsg}</p>
                      <p className="text-xs text-muted">Sealing appraisal in public archive...</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
                      {/* Rating Stars Picker */}
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-muted font-semibold mb-1">
                          Overall Rating
                        </label>
                        <div className="flex items-center gap-1.5 cursor-pointer">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewRating(star)}
                              onMouseEnter={() => setReviewHoverRating(star)}
                              onMouseLeave={() => setReviewHoverRating(0)}
                              className="text-2xl text-antique-gold transition-transform hover:scale-110"
                            >
                              {star <= (reviewHoverRating || reviewRating) ? '★' : '☆'}
                            </button>
                          ))}
                          <span className="ml-2 font-mono text-sm text-espresso">
                            {reviewHoverRating || reviewRating} / 5 Stars
                          </span>
                        </div>
                      </div>

                      {/* Collector Name */}
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-muted font-semibold mb-1">
                          Collector Name or Handle
                        </label>
                        <input
                          type="text"
                          required
                          value={reviewAuthor}
                          onChange={(e) => setReviewAuthor(e.target.value)}
                          placeholder="e.g. Tariq Al-Mansoor, Collector #884"
                          className="w-full bg-background border border-border p-2.5 text-xs text-espresso focus:outline-none focus:border-antique-gold"
                        />
                      </div>

                      {/* Appraisal Headline */}
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-muted font-semibold mb-1">
                          Appraisal Headline
                        </label>
                        <input
                          type="text"
                          required
                          value={reviewTitle}
                          onChange={(e) => setReviewTitle(e.target.value)}
                          placeholder="e.g. Intoxicating depth of aged wild agarwood"
                          className="w-full bg-background border border-border p-2.5 text-xs text-espresso focus:outline-none focus:border-antique-gold"
                        />
                      </div>

                      {/* Detailed Impression */}
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-muted font-semibold mb-1">
                          Detailed Scent Commentary & Evolution
                        </label>
                        <textarea
                          required
                          rows={4}
                          value={reviewBody}
                          onChange={(e) => setReviewBody(e.target.value)}
                          placeholder="Describe the top, heart, and dry-down transition on your skin..."
                          className="w-full bg-background border border-border p-2.5 text-xs text-espresso focus:outline-none focus:border-antique-gold"
                        />
                      </div>

                      {/* Longevity & Sillage Selectors */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-muted font-semibold mb-1">
                            Longevity on Skin
                          </label>
                          <select
                            value={reviewLongevity}
                            onChange={(e) => setReviewLongevity(e.target.value)}
                            className="w-full bg-background border border-border p-2 text-xs text-espresso focus:outline-none focus:border-antique-gold"
                          >
                            <option value="6-8 Hours">6-8 Hours (Moderate)</option>
                            <option value="10-12 Hours">10-12 Hours (Long)</option>
                            <option value="14+ Hours (Exceptional)">14+ Hours (Exceptional)</option>
                            <option value="24+ Hours on Fabric">24+ Hours on Fabric</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-muted font-semibold mb-1">
                            Sillage Presence
                          </label>
                          <select
                            value={reviewSillage}
                            onChange={(e) => setReviewSillage(e.target.value)}
                            className="w-full bg-background border border-border p-2 text-xs text-espresso focus:outline-none focus:border-antique-gold"
                          >
                            <option value="Intimate Skin Scent">Intimate Skin Scent</option>
                            <option value="Moderate Regal Trail">Moderate Regal Trail</option>
                            <option value="Regal & Enveloping">Regal & Enveloping</option>
                            <option value="Potent Room-Filling">Potent Room-Filling</option>
                          </select>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setShowReviewModal(false)}
                          className="px-4 py-2 border border-border text-xs uppercase tracking-wider text-muted hover:text-espresso"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={submittingReview}
                          className="px-6 py-2.5 bg-aged-gold hover:bg-antique-gold text-accent-on-fill text-xs uppercase tracking-wider font-medium transition-colors shadow-sm disabled:opacity-50"
                        >
                          {submittingReview ? 'Archiving...' : 'Register Appraisal'}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* Recommendations Section */}
          {recommendations.length > 0 && (
            <section className="pt-16 border-t border-border space-y-8">
              <div className="text-center space-y-2">
                <span className="text-[10px] font-sans tracking-[0.28em] uppercase text-antique-gold font-medium">Bespoke Complements</span>
                <h2 className="font-display text-2xl text-espresso">Complementary Flacons</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
                {recommendations.map((rec) => (
                  <article
                    key={rec.id}
                    className="group bg-surface-muted/40 border border-border hover:border-antique-gold/50 p-4 rounded-none space-y-4 transition-all"
                  >
                    <Link href={`/products/${rec.slug}`} className="block aspect-[4/5] bg-background border border-border relative overflow-hidden">
                      <Image
                        src={rec.images?.[0] || 'https://picsum.photos/seed/rec-tile/600/800'}
                        alt={rec.name}
                        fill
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      />
                    </Link>
                    <div className="font-sans space-y-1">
                      <Link href={`/products/${rec.slug}`}>
                        <h3 className="font-display text-base text-espresso group-hover:text-antique-gold transition-colors">{rec.name}</h3>
                      </Link>
                      <p className="text-xs font-mono text-antique-gold">{formatPrice(rec.price)}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </Container>
      </main>
    </div>
  );
}
