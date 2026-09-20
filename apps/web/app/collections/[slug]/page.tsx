'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SiteHeader from '../../components/header/SiteHeader';
import Container from '../../components/Container';
import { StoreApi, ProductItem } from '../../store-api';
import { useCart } from '../../components/cart/CartContext';
import { useCurrency } from '../../components/concierge/CurrencyContext';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function CategoryPlpPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const { addItem, openDrawer } = useCart();
  const { formatPrice, currency } = useCurrency();

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<string>('default');
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(1000);

  // Quick View State
  const [quickViewProduct, setQuickViewProduct] = useState<ProductItem | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [addedSuccess, setAddedSuccess] = useState(false);

  useEffect(() => {
    if (quickViewProduct?.variants && quickViewProduct.variants.length > 0) {
      setSelectedVariant(quickViewProduct.variants[0].id);
    } else {
      setSelectedVariant('');
    }
  }, [quickViewProduct]);

  const handleQuickAddToCart = () => {
    if (!quickViewProduct) return;
    const variantId = selectedVariant || quickViewProduct.variants?.[0]?.id || quickViewProduct.id;
    const variantObj = quickViewProduct.variants?.find((v) => v.id === variantId);
    addItem({
      productId: quickViewProduct.id,
      variantId,
      name: quickViewProduct.name,
      slug: quickViewProduct.slug,
      image: quickViewProduct.images?.[0] || '',
      price: variantObj?.price || quickViewProduct.price,
      size: variantObj?.size || 'Standard Flacon',
      quantity: 1,
    });
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      setQuickViewProduct(null);
      openDrawer();
    }, 800);
  };

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await StoreApi.getProducts({ category: slug, sort: sort !== 'default' ? sort : undefined });
        setProducts(res.items || []);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug, sort]);

  const filteredProducts = products.filter((p) => (p.price || 0) <= maxPriceFilter);

  const categoryTitles: Record<string, { title: string; subtitle: string }> = {
    oud: {
      title: 'Royal Oud & Extrait Archives',
      subtitle: 'Single-origin wild agarwood oils and aged extraits de parfum, steeped in centuries of heritage.',
    },
    attars: {
      title: 'Pure Concentrated Attars',
      subtitle: 'Alcohol-free botanical distillates infused over pure sandalwood oil in handcrafted copper stills.',
    },
    bakhoor: {
      title: 'Incense & Raw Bakhoor Chips',
      subtitle: 'Rare resin tears, medical-grade green hojari frankincense, and scented agarwood chips.',
    },
    mukhallat: {
      title: 'Bespoke Mukhallat Compositions',
      subtitle: 'Layered olfactory harmonies weaving ambergris, Taif rose, saffron, and aged woods.',
    },
  };

  const info = categoryTitles[slug] || {
    title: `${slug.toUpperCase()} Collection`,
    subtitle: 'Explore our curated olfactory creations.',
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-serif">
      <SiteHeader />

      <main className="flex-1 w-full py-6 sm:py-2">
        <Container className="space-y-10 sm:space-y-14">
          {/* Breadcrumbs */}
          <nav className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.14em] sm:tracking-[0.2em] text-muted flex flex-wrap items-center gap-1.5 sm:gap-2 leading-relaxed py-1">
            <Link href="/" className="hover:text-espresso transition-colors shrink-0">Home</Link>
            <span className="opacity-50">/</span>
            <Link href="/collections" className="hover:text-espresso transition-colors shrink-0">Collections</Link>
            <span className="opacity-50">/</span>
            <span className="text-antique-gold font-medium shrink-0">{slug}</span>
          </nav>

          {/* Category Banner Header */}
          <div className="border-b border-border pb-8 space-y-3">
            <p className="text-[11px] font-sans tracking-[0.28em] uppercase text-antique-gold font-medium">
              Curated Vault Selection
            </p>
            <h1 className="font-display text-3xl sm:text-5xl font-normal text-espresso tracking-tight">
              {info.title}
            </h1>
            <p className="text-xs sm:text-sm text-muted max-w-2xl font-sans leading-relaxed">
              {info.subtitle}
            </p>
          </div>

          {/* Filter & Sort Controls Bar — Sticky under header */}
          <div className="sticky top-[64px] lg:top-[64px] z-40 bg-ivory/95 backdrop-blur-md shadow-sm border border-border p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 font-sans text-xs transition-all duration-300">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <span className="text-muted uppercase tracking-widest text-[10px] font-medium">Max Price ($):</span>
              <input
                type="range"
                min="100"
                max="1000"
                step="50"
                value={maxPriceFilter}
                onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                className="accent-aged-gold cursor-pointer"
              />
              <span className="text-antique-gold font-mono font-medium">${maxPriceFilter}</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <span className="text-muted uppercase tracking-widest text-[10px] font-medium">Sort By:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-ivory text-espresso border border-border rounded-none px-3 py-1.5 outline-none focus:border-antique-gold text-xs"
              >
                <option value="default">Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="py-24 text-center text-xs font-sans uppercase tracking-[0.25em] text-muted">
              Sourcing flacons from vault...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-16 text-center space-y-4 border border-border bg-surface-muted/30 p-12">
              <p className="text-sm font-sans text-muted">No flacons match your price filter.</p>
              <button
                onClick={() => setMaxPriceFilter(1000)}
                className="text-xs uppercase tracking-widest text-antique-gold hover:underline font-sans"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {filteredProducts.map((product) => {
                const imageSrc = product.images?.[0] || 'https://picsum.photos/seed/bottle-default/800/1000';
                return (
                  <article
                    key={product.id}
                    className="group flex flex-col justify-between h-full"
                  >
                    <div>
                      <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface-muted/30 mb-4 group/img">
                        <Link href={`/products/${product.slug}`} className="block relative w-full h-full">
                          <Image
                            src={imageSrc}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                          />
                          {product.concentration && (
                            <span className="absolute top-2.5 left-2.5 bg-ivory/90 backdrop-blur-sm text-espresso text-[9px] font-sans uppercase tracking-[0.18em] px-2 py-0.5">
                              {product.concentration}
                            </span>
                          )}
                        </Link>
                        <button
                          type="button"
                          onClick={() => setQuickViewProduct(product)}
                          className="absolute bottom-2.5 inset-x-3 py-2 bg-ivory/95 hover:bg-aged-gold hover:text-accent-on-fill text-espresso text-[10px] font-sans uppercase tracking-[0.2em] font-medium transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-md text-center"
                        >
                          Quick View
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-muted font-sans mb-1">
                        <span className="uppercase tracking-widest text-[10px]">{product.category}</span>
                        {product.rating && (
                          <span className="text-antique-gold font-mono">★ {product.rating.toFixed(1)}</span>
                        )}
                      </div>

                      <Link href={`/products/${product.slug}`}>
                        <h3 className="font-display text-lg text-espresso group-hover:text-antique-gold transition-colors duration-300 mb-1">
                          {product.name}
                        </h3>
                      </Link>

                      <p className="text-xs text-muted line-clamp-2 font-sans leading-relaxed mb-4">
                        {product.description}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-sm font-sans font-medium text-antique-gold">
                        {formatPrice(product.price)}
                      </span>

                      <Link
                        href={`/products/${product.slug}`}
                        className="inline-flex items-center justify-center px-4 py-2 text-[10px] uppercase tracking-[0.22em] font-medium bg-aged-gold/10 text-antique-gold hover:bg-aged-gold hover:text-accent-on-fill transition-all duration-300"
                      >
                        Acquire Flacon
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Quick View Modal */}
          {quickViewProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/60 backdrop-blur-sm font-sans">
              <div className="bg-ivory border border-border p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-antique-gold font-medium block">
                      Atelier Quick Inspection
                    </span>
                    <h3 className="font-display text-2xl text-espresso">{quickViewProduct.name}</h3>
                  </div>
                  <button
                    onClick={() => setQuickViewProduct(null)}
                    className="text-muted hover:text-espresso text-lg"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
                  {/* Flacon Image */}
                  <div className="relative aspect-[4/5] bg-surface-muted border border-border overflow-hidden">
                    <Image
                      src={quickViewProduct.images?.[0] || 'https://picsum.photos/seed/bottle-default/800/1000'}
                      alt={quickViewProduct.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Details & Selection */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] uppercase tracking-widest text-muted">{quickViewProduct.category}</span>
                        {quickViewProduct.rating && (
                          <span className="text-antique-gold text-xs font-mono">★ {quickViewProduct.rating.toFixed(1)}</span>
                        )}
                      </div>
                      <p className="font-serif text-2xl text-antique-gold font-medium">
                        {formatPrice(quickViewProduct.variants?.find((v) => v.id === selectedVariant)?.price || quickViewProduct.price)}
                      </p>
                    </div>

                    <p className="text-xs text-muted leading-relaxed font-sans">
                      {quickViewProduct.description}
                    </p>

                    {/* Scent Notes Preview */}
                    {quickViewProduct.notes && (
                      <div className="p-3 bg-surface-muted/60 border border-border text-[11px] space-y-1">
                        <span className="text-[10px] uppercase tracking-wider text-antique-gold font-semibold block">Olfactory Notes</span>
                        <p className="text-espresso">
                          <strong className="text-muted font-normal">Top:</strong> {quickViewProduct.notes.top.join(', ')}
                        </p>
                        <p className="text-espresso">
                          <strong className="text-muted font-normal">Heart:</strong> {quickViewProduct.notes.heart.join(', ')}
                        </p>
                      </div>
                    )}

                    {/* Variant Selector */}
                    {quickViewProduct.variants && quickViewProduct.variants.length > 0 && (
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-wider text-muted font-semibold block">
                          Select Concentration & Flacon Size
                        </label>
                        <div className="space-y-1.5">
                          {quickViewProduct.variants.map((v) => (
                            <button
                              key={v.id}
                              type="button"
                              onClick={() => setSelectedVariant(v.id)}
                              className={`w-full p-2.5 text-xs text-left flex justify-between items-center border transition-colors ${
                                selectedVariant === v.id
                                  ? 'border-antique-gold bg-aged-gold/10 text-espresso font-medium'
                                  : 'border-border bg-ivory text-muted hover:border-antique-gold/50'
                              }`}
                            >
                              <span>{v.size}</span>
                              <span className="font-mono text-antique-gold">{formatPrice(v.price)}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action */}
                    <div className="pt-2 space-y-2">
                      <button
                        type="button"
                        onClick={handleQuickAddToCart}
                        disabled={addedSuccess}
                        className="w-full py-3 bg-aged-gold hover:bg-antique-gold text-accent-on-fill text-xs uppercase tracking-[0.22em] font-medium transition-colors shadow-sm"
                      >
                        {addedSuccess ? '✓ Flacon Sealed in Cart' : 'Acquire Flacon Now'}
                      </button>
                      <Link
                        href={`/products/${quickViewProduct.slug}`}
                        className="block w-full py-2.5 border border-border text-center text-espresso hover:border-antique-gold text-[10px] uppercase tracking-wider transition-colors"
                      >
                        View Complete Flacon Dossier →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Container>
      </main>
    </div>
  );
}
