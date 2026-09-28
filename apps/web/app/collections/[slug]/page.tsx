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

const COLLECTION_METAS: Record<string, { title: string; subtitle: string; banner: string }> = {
  all: {
    title: 'All Fragrances',
    subtitle: 'Explore the complete universe of Oud Arabia Dubai luxury perfumes, concentrated attars, and sacred bakhoors.',
    banner: 'https://cdn.shopify.com/s/files/1/0812/5077/9453/files/Jannat-e-zuhur-1.jpg?v=1692390618',
  },
  'top-sellers': {
    title: 'Top Sellers',
    subtitle: 'Our most celebrated creations coveted across Dubai, India, and worldwide for their intoxicating sillage.',
    banner: 'https://cdn.shopify.com/s/files/1/0812/5077/9453/files/Voice_of_the_soul_1.jpg?v=1692390886',
  },
  perfumes: {
    title: 'Luxury Perfumes',
    subtitle: 'Handcrafted Eau de Parfum and Extraits de Parfum made with Grasse flower oils and rare agarwood extracts.',
    banner: 'https://cdn.shopify.com/s/files/1/0812/5077/9453/files/Nadeem_1.jpg?v=1692390847',
  },
  attars: {
    title: 'Concentrated Attars',
    subtitle: 'Pure non-alcoholic botanical distillates infused over Mysore sandalwood oil in handcrafted copper stills.',
    banner: 'https://cdn.shopify.com/s/files/1/0812/5077/9453/files/Artboard_1_copy_3_3adc834e-2708-444e-a224-0d3149cc0981.png?v=1764672655',
  },
  'bakhoor-set': {
    title: 'Bakhoor Set & Incense',
    subtitle: 'Handcrafted gold brass burners and traditional fragrant agarwood chips for sacred home sanctuary.',
    banner: 'https://cdn.shopify.com/s/files/1/0812/5077/9453/files/Bakhoor_Burner_Set.jpg?v=1692391200',
  },
  'emerald-collection': {
    title: 'Emerald Collection',
    subtitle: 'Prestige limited edition flacons housed in hand-polished crystal and plush velvet presentation boxes.',
    banner: 'https://cdn.shopify.com/s/files/1/0812/5077/9453/files/Oud_Arabia_No_1.jpg?v=1692390950',
  },
};

const CATEGORY_TABS = [
  { slug: 'all', label: 'All Fragrances' },
  { slug: 'top-sellers', label: 'Top Sellers' },
  { slug: 'perfumes', label: 'Perfumes' },
  { slug: 'attars', label: 'Attars & Oils' },
  { slug: 'bakhoor-set', label: 'Bakhoor Set' },
  { slug: 'emerald-collection', label: 'Emerald Collection' },
];

export default function CollectionPlpPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const rawSlug = resolvedParams.slug;
  const slug = rawSlug.toLowerCase();

  const { addItem, openDrawer } = useCart();
  const { formatPrice } = useCurrency();

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<string>('featured');
  const [activeCategory, setActiveCategory] = useState<string>(slug);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  // Quick View State
  const [quickViewProduct, setQuickViewProduct] = useState<ProductItem | null>(null);
  const [addedSuccess, setAddedSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
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

      <main className="flex-1 w-full pt-28 pb-20">
        <Container className="space-y-8">
          {/* Breadcrumbs */}
          <nav className="text-[11px] font-sans tracking-[0.2em] uppercase text-white/50 flex flex-wrap items-center gap-2">
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

          {/* Collection Header Banner */}
          <div className="relative border border-[#ffb91d]/20 bg-gradient-to-b from-[#141414] via-[#0d0d0d] to-[#070707] p-8 sm:p-14 text-center rounded-none overflow-hidden shadow-2xl">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffb91d_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.35em] uppercase text-[#ffb91d] block">
                OUD ARABIA DUBAI • ARCHIVES
              </span>
              <h1 className="text-3xl sm:text-5xl font-light tracking-[0.18em] uppercase text-white font-serif">
                {meta.title}
              </h1>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans max-w-xl mx-auto">
                {meta.subtitle}
              </p>
            </div>
          </div>

          {/* Category Filter Pills & Sort Bar */}
          <div className="border border-white/10 bg-[#0e0e0e] p-4 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-20 z-30 backdrop-blur-md">
            {/* Category tabs */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-none pb-2 md:pb-0">
              {CATEGORY_TABS.map((tab) => {
                const isActive = activeCategory === tab.slug;
                return (
                  <button
                    key={tab.slug}
                    onClick={() => setActiveCategory(tab.slug)}
                    className={`shrink-0 px-4 py-2 text-[11px] uppercase tracking-[0.2em] transition-all font-medium border ${
                      isActive
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
                const img1 = prod.images?.[0] || 'https://cdn.shopify.com/s/files/1/0812/5077/9453/files/Jannat-e-zuhur-1.jpg?v=1692390618';
                const img2 = prod.images?.[1] || img1;
                const isHovered = hoveredProduct === prod.id;

                return (
                  <div
                    key={prod.id}
                    onMouseEnter={() => setHoveredProduct(prod.id)}
                    onMouseLeave={() => setHoveredProduct(null)}
                    className="group border border-white/10 bg-[#0d0d0d] hover:border-[#ffb91d]/50 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-2xl"
                  >
                    {/* Image Area */}
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#141414]">
                      <Link href={`/products/${prod.slug}`} className="block w-full h-full">
                        {/* Primary Image */}
                        <Image
                          src={img1}
                          alt={prod.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className={`object-cover object-center transition-all duration-700 ${
                            isHovered && prod.images?.length > 1
                              ? 'opacity-0 scale-105'
                              : 'opacity-100 scale-100 group-hover:scale-105'
                          }`}
                        />
                        {/* Secondary Image on Hover */}
                        {prod.images?.length > 1 && (
                          <Image
                            src={img2}
                            alt={`${prod.name} view 2`}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className={`object-cover object-center transition-all duration-700 absolute inset-0 ${
                              isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
                            }`}
                          />
                        )}
                      </Link>

                      {/* Best seller / category badge */}
                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
                        {prod.categories?.includes('top-sellers') && (
                          <span className="bg-[#ffb91d] text-black text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 shadow">
                            Top Seller
                          </span>
                        )}
                        <span className="bg-black/80 backdrop-blur-sm text-white/90 text-[8px] sm:text-[9px] font-mono tracking-wider px-2 py-0.5 border border-white/10">
                          {prod.features?.quantity || (prod.category === 'attars' ? '12ml' : '100ml')}
                        </span>
                      </div>

                      {/* Quick Action Overlay (Desktop) */}
                      <div className="absolute inset-x-3 bottom-3 hidden lg:flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                        <button
                          type="button"
                          onClick={() => setQuickViewProduct(prod)}
                          className="flex-1 py-2.5 bg-black/90 hover:bg-black text-white text-[10px] uppercase tracking-[0.2em] font-medium border border-white/20 hover:border-[#ffb91d] transition-all text-center"
                        >
                          Quick View
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickAddToCart(prod)}
                          className="px-3.5 py-2.5 bg-[#d89528] hover:bg-[#ffb91d] text-black transition-all font-bold text-xs"
                          title="Quick Add to Bag"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between space-y-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[#ffb91d]">
                          <span>{prod.category === 'attars' ? 'Pure Attar' : 'Extrait De Parfum'}</span>
                          <span className="text-white/40">★ 4.9</span>
                        </div>

                        <Link
                          href={`/products/${prod.slug}`}
                          className="font-serif text-sm sm:text-base text-white hover:text-[#ffb91d] transition-colors block line-clamp-1"
                        >
                          {prod.name}
                        </Link>

                        <p className="text-[11px] text-white/50 line-clamp-1 font-sans">
                          {prod.features?.topNotes ? `Notes: ${prod.features.topNotes}` : prod.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                        <span className="text-sm sm:text-base font-medium text-[#ffb91d] tracking-wide">
                          {formatPrice(prod.price)}
                        </span>

                        {/* Mobile quick add button */}
                        <button
                          type="button"
                          onClick={() => handleQuickAddToCart(prod)}
                          className="lg:hidden text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 bg-[#ffb91d] text-black rounded-none active:scale-95 transition-all"
                        >
                          + Add
                        </button>
                      </div>
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
                  OUD ARABIA DUBAI
                </span>
                <h3 className="text-2xl font-serif text-white tracking-wide">
                  {quickViewProduct.name}
                </h3>
                <p className="text-xl text-[#ffb91d] font-medium font-mono">
                  {formatPrice(quickViewProduct.price)}
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
                    Add to Bag • {formatPrice(quickViewProduct.price)}
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
