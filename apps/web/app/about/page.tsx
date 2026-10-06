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

      <main className="flex-1 w-full pt-8 pb-16 sm:pb-24">
        <Container className="space-y-14 sm:space-y-24">
          {/* Breadcrumbs (unchanged, stays on top) */}
          <nav className="text-[11px] font-sans uppercase tracking-[0.2em] text-white/50 flex items-center gap-2">
            <Link href="/" className="hover:text-[#ffb91d] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#ffb91d] font-medium">About Us</span>
          </nav>

          {/* Hero */}
          <header className="max-w-2xl space-y-5 sm:space-y-6">
            <h1 className=" text-[1.35rem] sm:text-xl lg:text-2xl leading-[1.55] text-white">
              A fragrance house for women who don’t fit into one world.
            </h1>
            <p className="text-sm sm:text-base text-white/60 leading-relaxed">
              Every woman carries a quiet strength within her. You may not always see it, but you
              can feel it — much like a fragrance that lingers long after she has left the room.
            </p>
          </header>

          {/* Image */}
          <div className="relative w-full aspect-[4/3] sm:aspect-[21/9] overflow-hidden bg-[#111]">
            <Image
              src="https://cdn.shopify.com/s/files/1/0812/5077/9453/files/Jannat-e-zuhur-1.jpg?v=1692390618"
              alt="Oud Nomad fragrance"
              fill
              priority
              sizes="(min-width: 1280px) 1200px, 100vw"
              className="object-cover object-center"
            />
          </div>

          {/* Story */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <p className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-none text-[#ffb91d]">
                  45°C
                </p>
                <p className="mt-3 max-w-[15rem] text-xs sm:text-sm text-white/50 leading-relaxed">
                  The heat a scent had to survive, and still feel feminine.
                </p>
              </div>
            </div>

            <div className="lg:col-span-8 max-w-xl space-y-5 sm:space-y-6 text-sm sm:text-base text-white/70 leading-[1.8]">
              <h2 className="font-serif text-xl sm:text-2xl leading-snug text-white">
                Oud Nomad began with a simple frustration: nothing on the shelf felt made for me.
              </h2>

              <p>
                At 24, living in Dubai and originally from Amritsar, I found myself somewhere
                between two worlds. European perfumes were beautiful, but often disappeared by noon
                — especially in Dubai’s heat. The ouds lasted, but they felt heavier, more
                traditional, and made for someone else.
              </p>

              <p className="font-serif text-lg sm:text-xl text-white pt-2">
                I wanted something different.
              </p>

              <ul className="space-y-2 text-white/85">
                <li>Something that could withstand 45°C heat and still feel feminine.</li>
                <li>Something luxurious without feeling formal.</li>
                <li>Something experimental, modern, and effortless.</li>
              </ul>

              <p>
                A scent for a woman who chooses what she wears rather than inheriting what she is
                expected to wear.
              </p>

              <p className="text-white">So I decided to build it myself.</p>

              <p>
                Born in Dubai, shaped by journeys and inspired by a world that is constantly
                changing, Oud Nomad creates fragrances for a new generation — women who are curious,
                confident, and unapologetically themselves.
              </p>
            </div>
          </section>

          {/* Belief */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            <div className="lg:col-span-4 relative w-full aspect-[4/3] lg:aspect-[3/4] overflow-hidden bg-[#111] order-2 lg:order-1">
              <Image
                src="https://cdn.shopify.com/s/files/1/0812/5077/9453/files/Voice_of_the_soul_1.jpg?v=1692390886"
                alt="Oud Nomad flacons"
                fill
                sizes="(min-width: 1024px) 380px, 100vw"
                className="object-cover object-center"
              />
            </div>

            <div className="lg:col-span-8 max-w-xl space-y-5 sm:space-y-6 order-1 lg:order-2">
              <p className="font-serif text-2xl sm:text-3xl leading-snug text-white">
                We believe luxury doesn’t have to be loud.
                <br />
                <span className="text-white/50">And femininity doesn’t have to mean delicate.</span>
              </p>
              <p className="text-sm sm:text-base text-white/70 leading-[1.8]">
                Every Oud Nomad scent is made to travel with you, stay with you, and leave something
                behind.
              </p>
            </div>
          </section>

          {/* Closing */}
          <section className="max-w-xl space-y-5 sm:space-y-6">
            <p className="font-serif text-xl sm:text-2xl leading-snug text-white">
              A fragrance for the woman you already are — and the woman you’re becoming.
            </p>
            <p className="text-sm text-white/45">This is only the beginning.</p>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                href="/collections"
                className="px-7 py-3 bg-[#ffb91d] hover:bg-[#ffc94d] text-black text-sm font-medium text-center transition-colors"
              >
                Shop the collection
              </Link>
              <Link
                href="/fragrance-finder"
                className="px-7 py-3 text-white/80 hover:text-white text-sm text-center ring-1 ring-white/20 hover:ring-white/50 transition-colors"
              >
                Find your scent
              </Link>
            </div>
          </section>
        </Container>
      </main>
    </div>
  );
}