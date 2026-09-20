'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import SiteHeader from '../components/header/SiteHeader';
import Container from '../components/Container';
import { StoreApi } from '../store-api';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

const CATEGORY_IMAGES: Record<string, string> = {
  oud: 'https://picsum.photos/seed/oud-category-tile/1000/1200',
  attars: 'https://picsum.photos/seed/attars-category-tile/1000/1200',
  bakhoor: 'https://picsum.photos/seed/bakhoor-category-tile/1000/1200',
  mukhallat: 'https://picsum.photos/seed/mukhallat-category-tile/1000/1200',
};

export default function CollectionsPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await StoreApi.getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-serif">
      <SiteHeader />

      <main className="flex-1 w-full py-12 sm:py-20">
        <Container className="space-y-16">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <p className="text-[11px] font-sans tracking-[0.28em] uppercase text-antique-gold font-medium">
              The Vault Archives
            </p>
            <h1 className="font-display text-3xl sm:text-5xl font-normal text-espresso tracking-tight">
              Olfactory Collections
            </h1>
            <p className="text-xs sm:text-sm text-muted leading-relaxed font-sans max-w-lg mx-auto">
              Rare wild-harvested agarwood oils, pure non-alcoholic attars, and sacred incense resins aged in shade.
            </p>
          </div>

          {/* Categories Grid */}
          {loading ? (
            <div className="text-center py-20 text-xs uppercase tracking-[0.22em] text-muted font-sans">
              Loading archives...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {categories.map((cat) => {
                const imageSrc = CATEGORY_IMAGES[cat.slug] || 'https://picsum.photos/seed/perfume-tile/1000/1200';
                return (
                  <Link
                    key={cat.id}
                    href={`/collections/${cat.slug}`}
                    className="group relative overflow-hidden border border-border bg-surface-muted/60 p-8 sm:p-10 flex flex-col justify-end aspect-[4/3] transition-all duration-500 hover:border-antique-gold shadow-sm"
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-70 group-hover:opacity-85 group-hover:scale-105 transition-all duration-700 ease-out"
                      style={{ backgroundImage: `url(${imageSrc})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-espresso/90 via-espresso/35 to-transparent" />

                    <div className="relative z-10 space-y-3">
                      <span className="inline-block text-[10px] font-sans tracking-[0.25em] uppercase text-champagne-sand">
                        Collection Archive
                      </span>
                      <h2 className="font-display text-2xl sm:text-3xl text-ivory group-hover:text-aged-gold transition-colors duration-300">
                        {cat.name}
                      </h2>
                      <p className="text-xs text-ivory/80 font-sans max-w-md line-clamp-2 leading-relaxed">
                        {cat.description || 'Rare olfactory expressions crafted with time-honored artisanal patience.'}
                      </p>
                      <div className="pt-2 flex items-center gap-2 text-[11px] font-sans tracking-[0.2em] uppercase text-champagne-sand group-hover:translate-x-1.5 transition-transform duration-300">
                        <span>Discover Collection</span>
                        <span>→</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </Container>
      </main>
    </div>
  );
}
