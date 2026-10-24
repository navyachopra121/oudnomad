'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SiteHeader from '../../components/header/SiteHeader';
import Container from '../../components/Container';
import { StoreApi, ProductItem } from '../../store-api';
import { useCart } from '../../components/cart/CartContext';
import { useCurrency } from '../../components/concierge/CurrencyContext';

const COLLECTION_METAS: Record<string, { title: string; subtitle: string; banner: string }> = {
  all: {
    title: 'All Fragrances',
    subtitle: 'Explore the complete Oud Nomad universe — luxury perfumes and refreshing mists, crafted for the GCC.',
    banner: '/perfume-banner.jpg',
  },
  perfumes: {
    title: 'Perfumes',
    subtitle: 'Intense, long-lasting Extrait de Parfum and Eau de Parfum blends built around rare agarwood, saffron, and precious florals.',
    banner: '/perfume-banner.jpg',
  },
  mists: {
    title: 'Mists',
    subtitle: 'Light, refreshing body and hair mists — the perfect everyday scent for warm GCC days and effortless layering.',
    banner: '/banners.jpg',
  },
};

const CATEGORY_TABS = [
  { slug: 'all', label: 'All Fragrances' },
  { slug: 'perfumes', label: 'Perfumes' },
  { slug: 'mists', label: 'Mists' },
];

interface CollectionPlpClientProps {
  slug: string;
  initialProducts: ProductItem[];
}

export default function CollectionPlpClient({ slug, initialProducts }: CollectionPlpClientProps) {
  const { addItem, openDrawer } = useCart();
  const { formatPrice } = useCurrency();

  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState<string>('featured');
  const [activeCategory, setActiveCategory] = useState<string>(slug);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  // Quick View State
  const [quickViewProduct, setQuickViewProduct] = useState<ProductItem | null>(null);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Track whether this is the initial mount — skip first run since data comes from SSR
  const isInitialMount = useRef(true);

  // Re-fetch ONLY when the user changes category or sort (not on initial mount)
  useEffect(() => {
    if (isInitialMount.current) {
      // First render: SSR data is already in state — skip the fetch
      isInitialMount.current = false;
      return;
    }
    setLoading(true);
    async function load() {
      try {
        const queryCategory = activeCategory === 'all' ? undefined : activeCategory;
        const res = await StoreApi.getProducts({
          category: queryCategory,
          sort: sort !== 'featured' ? sort : undefined,
        });
        setProducts(res.items || []);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [activeCategory, sort]);

  const handleQuickAddToCart = (prod: ProductItem) => {
    addItem({
      productId: prod.id,
      variantId: `${prod.id}-std`,
      name: prod.name,
      slug: prod.slug,
      image: prod.images?.[0] || '',
      price: prod.price,
      size: prod.features?.quantity || '100ml',
      quantity: 1,
    });
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      openDrawer();
    }, 600);
  };

  const meta = COLLECTION_METAS[activeCategory] || {
    title: `${activeCategory.replace('-', ' ').toUpperCase()} Collection`,
    subtitle: 'Explore our curated olfactory creations handcrafted in Dubai.',
    banner: 'https://cdn.shopify.com/s/files/1/0812/5077/9453/files/Jannat-e-zuhur-1.jpg?v=1692390618',
  };

  return (
    <div className="min-h-screen bg-[#070707] text-[#f2efe9] flex flex-col font-sans selection:bg-[#ffb91d] selection:text-black">
      <SiteHeader />

      <main className="flex-1 w-full pt-4 pb-12 sm:pt-8 sm:pb-20">
        <Container className="space-y-8">
          {/* Breadcrumbs */}
          <nav className="text-[8px] sm:text-[11px] font-sans tracking-[0.2em] uppercase text-white/50 flex flex-wrap items-center gap-2">
            <Link href="/" className="hover:text-[#ffb91d] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/collections/all" className="hover:text-[#ffb91d] transition-colors">
              Collections
            </Link>
            <span>/</span>
            <span className="text-[#ffb91d] font-medium">{meta.title}</span>
          </nav>

          {/* Category Filter Pills & Sort Bar */}
          <div className="p-0 sm:px-0 sm:py-4 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-20 z-30 backdrop-blur-md">
            {/* Category tabs */}
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto w-full md:w-auto scrollbar-none pb-2 md:pb-0">
              {CATEGORY_TABS.map((tab) => {
                const isActive = activeCategory === tab.slug;
                return (
                  <button
                    key={tab.slug}
                    onClick={() => setActiveCategory(tab.slug)}
                    className={`shrink-0 px-2 sm:px-4 py-2 sm:py-2 text-[9px] sm:text-[11px] uppercase tracking-[0.2em] transition-all font-medium  ${isActive
                      ? 'bg-[#ffb91d] text-black border-[#ffb91d] shadow-md'
                      : 'bg-transparent text-white/75 border-white/10 hover:border-[#ffb91d]/50 hover:text-white'
                      }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Sort & Count */}
            <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto border-t md:border-t-0 border-white/10 pt-3 md:pt-0">
              <span className="text-[11px] uppercase tracking-wider text-white/50 font-mono">
                {products.length} Products
              </span>

              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest text-white/40 hidden sm:inline">
                  Sort:
                </span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="bg-[#141414] text-white border border-white/15 px-3 py-1.5 text-[11px] uppercase tracking-wider outline-none focus:border-[#ffb91d] cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="title-asc">Alphabetically: A-Z</option>
                  <option value="title-desc">Alphabetically: Z-A</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="py-24 text-center">
              <div className="inline-block w-8 h-8 border-2 border-[#ffb91d] border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-xs uppercase tracking-[0.25em] text-white/50">
                Unveiling Flacon Catalog...
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center border border-white/10 bg-[#0e0e0e] p-8 space-y-4">
              <p className="text-sm text-white/60">No fragrances found in this collection.</p>
              <button
                onClick={() => setActiveCategory('all')}
                className="px-6 py-2 bg-[#ffb91d] text-black text-xs uppercase tracking-widest font-semibold hover:brightness-110 transition-all"
              >
                View All Fragrances
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {products.map((prod) => {
                const fallbackImg = 'https://cdn.shopify.com/s/files/1/0812/5077/9453/files/Jannat-e-zuhur-1.jpg?v=1692390618';
                const rawImg1 = prod.images?.[0];
                const img1 = (typeof rawImg1 === 'string' && rawImg1.length > 0 ? rawImg1 : (rawImg1 as any)?.url) || fallbackImg;
                const rawImg2 = prod.images?.[1];
                const img2 = (typeof rawImg2 === 'string' && rawImg2.length > 0 ? rawImg2 : (rawImg2 as any)?.url) || img1;
                const isHovered = hoveredProduct === prod.id;
                const prodPrice = typeof prod.price === 'number' && !isNaN(prod.price)
                  ? prod.price
                  : (!isNaN(Number(prod.variants?.[0]?.price)) ? Number(prod.variants?.[0]?.price) : 495);

                return (
                  <div
                    key={prod.id}
                    onMouseEnter={() => setHoveredProduct(prod.id)}
                    onMouseLeave={() => setHoveredProduct(null)}
                    className="group bg-[#0d0d0d] transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-2xl"
                  >
                    {/* Image Area */}
                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#141414]">
                      <Link href={`/products/${prod.slug}`} className="block w-full h-full">
                        {/* Primary Image */}
                        <Image
                          src={img1}
                          alt={prod.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className={`object-cover object-center transition-all duration-700 ${isHovered && prod.images?.length > 1
                            ? 'opacity-0 scale-105'
                            : 'opacity-100 scale-100'
                            }`}
                        />
                        {/* Secondary Image on Hover */}
                        {prod.images?.length > 1 && (
                          <Image
                            src={img2}
                            alt={`${prod.name} view 2`}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className={`object-cover object-center transition-all duration-700 absolute inset-0 ${isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
                              }`}
                          />
                        )}
                      </Link>
                    </div>

                    {/* Meta Info */}
                    <div className="px-3.5 py-3 flex items-center justify-between gap-2">
                      <Link
                        href={`/products/${prod.slug}`}
                        className="font-serif text-sm text-white uppercase hover:text-[#ffb91d] transition-colors truncate tracking-wide"
                      >
                        {prod.name}
                      </Link>
                      <span className="text-sm font-medium text-[#ffb91d] tracking-wide shrink-0 font-mono">
                        {formatPrice(prodPrice, (prod as any).regionalPrices)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Container>
      </main>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setQuickViewProduct(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-[#111111] border border-[#ffb91d]/40 p-6 sm:p-8 shadow-2xl text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 text-white/60 hover:text-white text-xl p-2"
              aria-label="Close"
            >
              ✕
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 items-center">
              <div className="relative aspect-[3/4] w-full bg-[#161616] border border-white/10 overflow-hidden">
                <Image
                  src={quickViewProduct.images?.[0] || ''}
                  alt={quickViewProduct.name}
                  fill
                  className="object-cover object-center"
                />
              </div>

              <div className="space-y-4">
                <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#ffb91d]">
                  OUD NOMAD
                </span>
                <h3 className="text-2xl font-serif text-white tracking-wide">
                  {quickViewProduct.name}
                </h3>
                <p className="text-xl text-[#ffb91d] font-medium font-mono">
                  {formatPrice(quickViewProduct.price, (quickViewProduct as any).regionalPrices)}
                </p>

                <p className="text-xs text-white/70 leading-relaxed line-clamp-3">
                  {quickViewProduct.description}
                </p>

                <div className="space-y-1.5 text-xs text-white/60 pt-2 border-t border-white/10">
                  <p>
                    <strong className="text-white/90">Top Notes:</strong>{' '}
                    {quickViewProduct.features?.topNotes}
                  </p>
                  <p>
                    <strong className="text-white/90">Longevity:</strong>{' '}
                    {quickViewProduct.features?.longevity || '48 Hours'}
                  </p>
                  <p>
                    <strong className="text-white/90">Volume:</strong>{' '}
                    {quickViewProduct.features?.quantity || '100ml'}
                  </p>
                </div>

                <div className="pt-4 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleQuickAddToCart(quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                    className="w-full py-3 bg-[#d89528] hover:bg-[#ffb91d] text-black font-semibold text-xs uppercase tracking-[0.2em] transition-all shadow-md active:scale-98"
                  >
                    Add to Bag • {formatPrice(quickViewProduct.price, (quickViewProduct as any).regionalPrices)}
                  </button>
                  <Link
                    href={`/products/${quickViewProduct.slug}`}
                    className="w-full py-2.5 text-center text-xs uppercase tracking-[0.18em] text-white/70 hover:text-white underline underline-offset-4"
                  >
                    View Full Product Details →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
