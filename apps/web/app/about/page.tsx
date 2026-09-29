'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SiteHeader from '../components/header/SiteHeader';
import Container from '../components/Container';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#070707] text-[#f2efe9] flex flex-col font-sans selection:bg-[#ffb91d] selection:text-black">
      <SiteHeader />

      <main className="flex-1 w-full pt-8 pb-20">
        <Container className="space-y-16 sm:space-y-24">
          {/* Breadcrumbs */}
          <nav className="text-[11px] font-sans uppercase tracking-[0.2em] text-white/50 flex items-center gap-2">
            <Link href="/" className="hover:text-[#ffb91d] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#ffb91d] font-medium">About Us</span>
          </nav>

          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[10px] font-mono tracking-[0.35em] uppercase text-[#ffb91d] block">
              HEADQUARTERED IN DUBAI • CRAFTED WITHOUT COMPROMISE
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-white tracking-wide uppercase leading-tight">
              About Oud Arabia
            </h1>
            <p className="text-xs sm:text-sm font-sans text-white/70 leading-relaxed max-w-2xl mx-auto">
              “We believe that a perfumer is a poet or a storyteller who use intangible ingredients to create emotions. The main idea behind Oud Arabia is to abstract memories that evoke our cores. We paint pictures without using paint. We are storytellers who do not need words.”
            </p>
          </div>

          {/* Main Heritage Card with Image */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-white/10 bg-[#0e0e0e] p-6 sm:p-10">
            <div className="lg:col-span-6 relative aspect-[4/3] w-full bg-[#161616] overflow-hidden border border-white/10">
              <Image
                src="https://cdn.shopify.com/s/files/1/0812/5077/9453/files/Jannat-e-zuhur-1.jpg?v=1692390618"
                alt="Oud Arabia Luxury Perfumes Dubai"
                fill
                priority
                className="object-cover object-center"
              />
            </div>

            <div className="lg:col-span-6 space-y-5 text-xs sm:text-sm text-white/80 font-sans leading-relaxed">
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#ffb91d] block">
                THE SACRED ESSENCE
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-white">
                Extracted from 100-Year-Old Trees
              </h2>
              <p>
                Oud Arabia is a premium perfume brand headquartered in Dubai. Oud itself is an ingredient that is extracted from a special kind of Fungus from 100 years old tree. Oud is sweet, woody, aromatic, and complex scent and can last sometimes as long as five days.
              </p>
              <p>
                Oud Arabia firmly believes that there is a perfume for everyone, and we tried to capture the very essence of life in a bottle. Our aim has never been to create just a perfume brand but a world inspired by poetry, painting, and stories that have been told since time immemorial.
              </p>
            </div>
          </div>

          {/* Boutique Retail Experience */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-white/10 bg-[#0e0e0e] p-6 sm:p-10">
            <div className="lg:col-span-6 space-y-5 text-xs sm:text-sm text-white/80 font-sans leading-relaxed order-2 lg:order-1">
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#ffb91d] block">
                CREATIVE BOUTIQUE EXPERIENCE
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-white">
                Hands-On Luxury Retail
              </h2>
              <p>
                Oud Arabia is equally well known for its creative boutique style retail outlets, for the most luxurious hands-on experience of its products to the consumers.
              </p>
              <p>
                The concept for Oud Arabia is simple; it is our fundamental belief that there is a perfect perfume for everyone, and the collection is a balanced palette of scents that allows a client to find the perfect scent for them.
              </p>
              <div className="pt-2">
                <Link
                  href="/stores"
                  className="inline-block px-6 py-3 bg-[#d89528] hover:bg-[#ffb91d] text-black text-xs uppercase tracking-widest font-semibold transition-all shadow-md"
                >
                  Explore Boutique Stores →
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 relative aspect-[4/3] w-full bg-[#161616] overflow-hidden border border-white/10 order-1 lg:order-2">
              <Image
                src="https://cdn.shopify.com/s/files/1/0812/5077/9453/files/Voice_of_the_soul_1.jpg?v=1692390886"
                alt="Oud Arabia Boutique Flacons"
                fill
                className="object-cover object-center"
              />
            </div>
          </div>

          {/* Raw Materials & Master Craftsmanship */}
          <div className="space-y-8 text-center max-w-4xl mx-auto">
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#ffb91d] block">
              WORLD’S RAREST INGREDIENTS
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-white uppercase tracking-wider">
              Finest Quality Materials in the Industry
            </h2>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans max-w-2xl mx-auto">
              Oud Arabia is renowned for working with only the finest quality materials in the industry; from Rose de Mai (France), Jasmine de Grasse (France), natural Ambergris (Pacific Ocean), Oud/Agarwood (Vietnam, Cambodia, Indonesia), Bergamot (Calabria).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-left">
              <div className="p-6 bg-[#0e0e0e] border border-white/10 space-y-3">
                <span className="text-[#ffb91d] font-mono text-xs block">01 / BOTANICALS</span>
                <h3 className="font-serif text-lg text-white">Rose & Jasmine de Grasse</h3>
                <p className="text-xs text-white/60 leading-relaxed font-sans">
                  Sourced from Grasse (France), blooming for only 30 minutes a year. It takes 700 kilograms of flowers to produce just 1 kilogram of pure flower oil.
                </p>
              </div>

              <div className="p-6 bg-[#0e0e0e] border border-white/10 space-y-3">
                <span className="text-[#ffb91d] font-mono text-xs block">02 / FLACONS</span>
                <h3 className="font-serif text-lg text-white">Handpolished Crystal</h3>
                <p className="text-xs text-white/60 leading-relaxed font-sans">
                  Packed in handmade velvet and leather presentation boxes, and handpolished Turkey crystal bottles with handcrafted metal caps.
                </p>
              </div>

              <div className="p-6 bg-[#0e0e0e] border border-white/10 space-y-3">
                <span className="text-[#ffb91d] font-mono text-xs block">03 / HERITAGE</span>
                <h3 className="font-serif text-lg text-white">Master Perfumers (20+ Years)</h3>
                <p className="text-xs text-white/60 leading-relaxed font-sans">
                  Each scent is made in Dubai and handcrafted by master perfumers with more than 20 years of experience. Oud Arabia attars are mixed and painstakingly poured by hand.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
