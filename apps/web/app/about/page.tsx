'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SiteHeader from '../components/header/SiteHeader';
import GoldParticleField from './GoldParticleField';

export default function AboutPage() {
  const [activeTemp, setActiveTemp] = useState<number>(45);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress(window.scrollY / totalScroll);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const tempStories: Record<number, { state: string; poem: string; note: string }> = {
    20: {
      state: 'The Whisper Accord (20°C)',
      poem: 'Solar bergamot and crisp Kashmir saffron open with crystalline precision. The scent breathes quietly, staying close like a secret in cool air.',
      note: 'Luminous top notes suspended in botanical oils.',
    },
    32: {
      state: 'The Floral Awakening (32°C)',
      poem: 'Skin warmth releases the Taif Damask rose and amber crystals. The petals unfurl, sending a honeyed floral sillage that commands the room.',
      note: 'Feminine core expands without turning sweet or fragile.',
    },
    45: {
      state: 'The Immortal Crucible (45°C)',
      poem: 'Where ordinary European scents vanish by noon, Oud Nomad awakens. Rare Assam Dehn Al Oud and ancient resins liquefy under the desert sun, creating a magnetic halo that refuses to die.',
      note: 'Pure Extrait de Parfum engineered to flourish in peak Arabian heat.',
    },
  };

  return (
    <div className="min-h-screen bg-[#070707] text-[#f2efe9] font-sans selection:bg-[#ffb91d] selection:text-black relative overflow-x-hidden">
      {/* Universal Floating Scent Molecule Background */}
      <GoldParticleField className="fixed inset-0 z-0 opacity-40 pointer-events-none" />

      {/* Ambient Radial Color Washes (Organic luxury light) */}
      <div
        className="fixed top-1/4 -left-64 w-[500px] h-[500px] rounded-full pointer-events-none opacity-20 blur-[140px] bg-[#ffb91d]/20 z-0"
        aria-hidden="true"
      />
      <div
        className="fixed bottom-1/3 -right-64 w-[550px] h-[550px] rounded-full pointer-events-none opacity-15 blur-[160px] bg-[#d99b26]/20 z-0"
        aria-hidden="true"
      />

      {/* Floating Scroll Spine (Delicate Gold Meridian - Only on large desktop screens) */}
      <div className="hidden xl:block fixed left-8 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
        <div className="flex flex-col items-center gap-2.5">
          <span className="text-[8px] font-mono tracking-[0.3em] uppercase text-white/30 [writing-mode:vertical-rl] rotate-180">
            MERIDIAN • 25°N
          </span>
          <div className="w-[1px] h-24 bg-white/10 relative overflow-hidden">
            <div
              className="absolute top-0 left-0 w-full bg-[#ffb91d] transition-all duration-300"
              style={{ height: `${Math.max(10, scrollProgress * 100)}%` }}
            />
          </div>
          <span className="text-[8px] font-mono text-[#ffb91d]">
            {Math.round(scrollProgress * 100)}%
          </span>
        </div>
      </div>

      <div className="relative z-10">
        <SiteHeader />

        <main className="w-full">
          {/* ========================================================= */}
          {/* OVERTURE: THE INVOCATION (Clean, Refined Editorial Hero)   */}
          {/* ========================================================= */}
          <section className="relative min-h-[75vh] sm:min-h-[82vh] flex flex-col justify-between pt-8 sm:pt-14 pb-12 sm:pb-16 px-5 sm:px-10 lg:px-10 max-w-7xl mx-auto">
            {/* Top Minimal Breadcrumb & Coordinates */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.001em] md:tracking-[0.25em] text-white/45 pb-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Link href="/" className="hover:text-[#ffb91d] transition-colors">
                  Oud Nomad
                </Link>
                <span>/</span>
                <span className="text-[#ffb91d]">About Us</span>
              </div>
              <div className="flex items-center gap-3 text-white/40">
                <span>Atelier Dubai</span>
                <span>•</span>
                <span>25.2048° N</span>
              </div>
            </div>

            {/* Main Editorial Hero Block */}
            <div className="my-auto py-8 sm:py-12 max-w-4xl">
              {/* Subtle Camel Nomad Emblem in Warm Gold */}
              <div className="w-16 sm:w-20 h-9 sm:h-11 relative mb-5 sm:mb-7 opacity-85">
                <Image
                  src="/camelfinallogo-transparent.png"
                  alt="Oud Nomad Emblem"
                  fill
                  className="object-contain object-left [filter:sepia(1)_saturate(5)_hue-rotate(5deg)_brightness(1.1)]"
                  priority
                />
              </div>

              <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.35em] text-[#ffb91d] block mb-3">
                A MANIFESTO IN SCENT
              </span>

              {/* Clean, uniform heading — no mixed casing or styles */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-white tracking-wide leading-[1.3] sm:leading-[1.2]">
                A fragrance house for women who don’t fit into one world.
              </h1>

              {/* Clean, flowing quote */}
              <div className="mt-5 sm:mt-7 max-w-xl">
                <p className="text-xs sm:text-sm md:text-base font-serif text-white/75 leading-relaxed">
                  Every woman carries a quiet strength within her. You may not always see it, but you can feel it — much like a fragrance that lingers long after she has left the room.
                </p>
                <div className="mt-3 flex items-center gap-2 text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
                  <span className="w-6 h-[1px] bg-[#ffb91d]" />
                  <span>The Sillage Philosophy</span>
                </div>
              </div>
            </div>

            {/* Bottom Scent Vapor Indicator */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-white/5 text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.2em] text-white/45">
              <div>
                <span className="text-white">Pure Extrait Concentration</span>
                <span className="mx-2 text-white/20">•</span>
                <span>Formulated in Dubai</span>
              </div>

              <div className="flex items-center gap-2 text-[#ffb91d]">
                <span>Explore Sillage</span>
                <span className="inline-block animate-bounce text-xs">↓</span>
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* ACT I: CARTOGRAPHY OF TWO WORLDS (Amritsar to Dubai)      */}
          {/* ========================================================= */}
          <section className="relative py-16 sm:py-24 md:py-32 px-5 sm:px-10 lg:px-10 max-w-7xl mx-auto">
            {/* Liquid Dune Curve SVG Flowing in Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20" aria-hidden="true">
              <svg
                viewBox="0 0 1440 800"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full object-cover text-[#ffb91d]/20"
              >
                <path
                  d="M-100,200 C300,500 800,100 1200,400 C1400,550 1600,200 1700,300"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="4 8"
                />
              </svg>
            </div>

            <div className="space-y-12 sm:space-y-20 relative">
              {/* Clean Section Header */}
              <div className="max-w-xl">
                <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.35em] text-[#ffb91d] block mb-2">
                  01 / THE CARTOGRAPHY
                </span>
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif text-white tracking-wide leading-snug">
                  Nothing on the shelf felt made for me.
                </h2>
              </div>

              {/* Fluid Layout: Large Feathered Photo + Flowing Narrative */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
                {/* Visual Artwork: Image with feathered organic vignette mask (No border, no box) */}
                <div className="lg:col-span-6 relative">
                  <div
                    className="relative w-full aspect-[4/5] sm:aspect-[3/4] overflow-hidden"
                    style={{
                      maskImage: 'radial-gradient(ellipse 85% 85% at 50% 50%, black 50%, transparent 100%)',
                      WebkitMaskImage: 'radial-gradient(ellipse 85% 85% at 50% 50%, black 50%, transparent 100%)',
                    }}
                  >
                    <Image
                      src="https://cdn.shopify.com/s/files/1/0812/5077/9453/files/Jannat-e-zuhur-1.jpg?v=1692390618"
                      alt="Oud Nomad flacon dissolving into shadows"
                      fill
                      sizes="(min-width: 1024px) 550px, 100vw"
                      className="object-cover object-center scale-105 hover:scale-110 transition-transform duration-1000 brightness-90"
                    />
                  </div>

                  {/* Clean text label */}
                  <div className="mt-3 flex items-center justify-between text-[9px] font-mono tracking-widest text-white/40 uppercase">
                    <span>Fig. 01 — Flacon de Voyage</span>
                    <span className="text-[#ffb91d]">Assam / Grasse / Dubai</span>
                  </div>
                </div>

                {/* Right Column: Clean Literary Story */}
                <div className="lg:col-span-6 space-y-6 sm:space-y-8">
                  <div className="space-y-4 text-xs sm:text-sm md:text-base text-white/75 font-serif leading-[1.85]">
                    <p className="text-base sm:text-lg md:text-xl text-white font-normal leading-snug">
                      At 24, living in Dubai and originally from Amritsar, I found myself suspended between two worlds.
                    </p>
                    <p className="text-white/60 font-sans text-xs sm:text-sm leading-relaxed">
                      European perfumes were beautiful, but often disappeared by noon — dissolving instantly in Dubai’s unforgiving heat. The ouds lasted, but they felt heavier, more traditional, and crafted for someone else’s rituals.
                    </p>
                    <p className="text-[#ffb91d] text-base sm:text-lg md:text-xl pt-1">
                      I wanted something different.
                    </p>
                  </div>

                  {/* Flowing Stanza Lines */}
                  <div className="space-y-4 pt-2 border-l border-[#ffb91d]/30 pl-5 sm:pl-7">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#ffb91d]">
                        THE DUAL TENSION
                      </span>
                      <p className="text-xs sm:text-sm md:text-base text-white/90 font-serif">
                        Something that could withstand 45°C heat and still feel feminine.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#ffb91d]">
                        THE MODERN TOUCH
                      </span>
                      <p className="text-xs sm:text-sm md:text-base text-white/90 font-serif">
                        Something luxurious without feeling formal, stifling, or antique.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#ffb91d]">
                        THE NOMAD SPIRIT
                      </span>
                      <p className="text-xs sm:text-sm md:text-base text-white/90 font-serif">
                        A scent for a woman who chooses what she wears rather than inheriting what she is expected to wear.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-base sm:text-lg md:text-xl font-serif text-white tracking-wide">
                      So I decided to build it myself.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* ACT II: THE 45°C SOLAR CRUCIBLE (Artistic Solar Continuum)*/}
          {/* ========================================================= */}
          <section className="relative py-16 sm:py-24 md:py-32 px-5 sm:px-10 lg:px-10 max-w-7xl mx-auto overflow-hidden">
            {/* Luminous Solar Aura radiating in the center */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] rounded-full pointer-events-none opacity-20 blur-[140px] transition-all duration-700"
              style={{
                backgroundColor: activeTemp === 45 ? '#ffb91d' : activeTemp === 32 ? '#e59a22' : '#8a6e35',
              }}
              aria-hidden="true"
            />

            <div className="space-y-12 sm:space-y-16 relative">
              {/* Clean Headline */}
              <div className="text-center space-y-3 max-w-2xl mx-auto">
                <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.35em] text-[#ffb91d] block">
                  02 / THE CRUCIBLE OF HEAT
                </span>
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif text-white tracking-wide leading-snug">
                  The heat a scent had to survive, and still feel feminine.
                </h2>
                <p className="text-xs sm:text-sm text-white/60 font-sans max-w-md mx-auto">
                  Select the temperature to witness how our botanical resins awaken as ambient warmth intensifies.
                </p>
              </div>

              {/* Sculptural Temperature Dial (Non-boxy, organic linear continuum) */}
              <div className="space-y-10">
                {/* The Golden Continuum Track */}
                <div className="relative py-4 max-w-xl mx-auto">
                  {/* Subtle golden guide rail */}
                  <div className="h-[2px] w-full bg-gradient-to-r from-white/10 via-[#ffb91d]/40 to-[#ffb91d]" />

                  {/* 3 Interactive Solar Nodes */}
                  <div className="flex justify-between items-center -mt-[11px] relative px-2">
                    {[20, 32, 45].map((temp) => (
                      <button
                        key={temp}
                        onClick={() => setActiveTemp(temp)}
                        className="group flex flex-col items-center focus:outline-none transition-transform active:scale-95"
                      >
                        {/* Glowing Sun Dot */}
                        <div
                          className={`w-5 h-5 rounded-full transition-all duration-500 flex items-center justify-center ${activeTemp === temp
                            ? 'bg-[#ffb91d] shadow-[0_0_20px_#ffb91d] scale-125'
                            : 'bg-[#181818] border border-white/20 group-hover:border-[#ffb91d]'
                            }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${activeTemp === temp ? 'bg-black' : 'bg-white/40'
                              }`}
                          />
                        </div>

                        {/* Temp Label below */}
                        <div className="mt-3 text-center">
                          <span
                            className={`text-base sm:text-xl font-serif transition-colors duration-300 block ${activeTemp === temp ? 'text-[#ffb91d]' : 'text-white/40 group-hover:text-white/80'
                              }`}
                          >
                            {temp}°C
                          </span>
                          <span className="text-[8px] sm:text-[9px] font-mono tracking-widest uppercase text-white/30 block mt-0.5">
                            {temp === 20 ? 'Mild' : temp === 32 ? 'Warm' : 'Crucible'}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Real-time Reveal of the Solar Reaction */}
                <div className="text-center max-w-2xl mx-auto space-y-4 pt-4">
                  <div className="inline-block border-b border-[#ffb91d]/40 pb-1.5">
                    <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[#ffb91d]">
                      {tempStories[activeTemp].state}
                    </span>
                  </div>

                  <p className="text-sm sm:text-base md:text-lg font-serif text-white/90 leading-relaxed max-w-xl mx-auto">
                    {tempStories[activeTemp].poem}
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.2em] text-white/45 pt-3">
                    <span className="text-white">Longevity: 14+ Hours</span>
                    <span className="text-white/20">•</span>
                    <span className="text-white">Concentration: 35% Extrait</span>
                    <span className="text-white/20">•</span>
                    <span className="text-[#ffb91d]">{tempStories[activeTemp].note}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* ACT III: THE LIVING OLFACTORY SPIRAL (Botanical Whispers)  */}
          {/* ========================================================= */}
          <section className="relative py-16 sm:py-24 md:py-32 px-5 sm:px-10 lg:px-10 max-w-7xl mx-auto">
            <div className="space-y-16 sm:space-y-24">
              {/* Clean Section Title */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-5xl">
                <div>
                  <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.35em] text-[#ffb91d] block mb-2">
                    03 / THE OLFACTORY SPIRAL
                  </span>
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif text-white tracking-wide">
                    Anatomy of the Sillage
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-white/50 font-sans max-w-sm leading-relaxed">
                  Crafted without volatile fillers. Every essence is sourced from heritage terroirs where time moves slowly.
                </p>
              </div>

              {/* Free-flowing botanical sequence */}
              <div className="space-y-16 sm:space-y-28">
                {/* 1. TOP ACCORD */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-12 items-center">
                  <div className="lg:col-span-5 space-y-3">
                    <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.25em] uppercase text-[#ffb91d]">
                      PHASE I • THE SOLAR DAWN
                    </span>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-serif text-white">
                      Solar Bergamot & Kashmir Saffron
                    </h3>
                    <p className="text-xs sm:text-sm text-white/70 font-sans leading-relaxed">
                      Hand-plucked saffron stigmas from Pampore, Kashmir, married with Calabrian sun-ripened bergamot. An instantaneous burst of golden fire that kisses the skin without evaporating into harshness.
                    </p>
                    <div className="pt-1 text-[9px] sm:text-[10px] font-mono tracking-widest uppercase text-white/40">
                      Sillage Duration: 0 – 60 Minutes
                    </div>
                  </div>
                  <div className="lg:col-span-7 flex justify-center lg:justify-end">
                    <div
                      className="relative w-full max-w-sm sm:max-w-md aspect-[16/10] overflow-hidden"
                      style={{
                        maskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 40%, transparent 100%)',
                        WebkitMaskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 40%, transparent 100%)',
                      }}
                    >
                      <Image
                        src="/amber.avif"
                        alt="Golden saffron and solar citrus essence"
                        fill
                        className="object-cover object-center brightness-90 hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. HEART ACCORD */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-12 items-center">
                  <div className="lg:col-span-7 order-2 lg:order-1 flex justify-center lg:justify-start">
                    <div
                      className="relative w-full max-w-sm sm:max-w-md aspect-[16/10] overflow-hidden"
                      style={{
                        maskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 40%, transparent 100%)',
                        WebkitMaskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 40%, transparent 100%)',
                      }}
                    >
                      <Image
                        src="/floral.avif"
                        alt="Taif damask roses blooming in morning mist"
                        fill
                        className="object-cover object-center brightness-90 hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  </div>
                  <div className="lg:col-span-5 space-y-3 order-1 lg:order-2">
                    <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.25em] uppercase text-[#ffb91d]">
                      PHASE II • THE SOVEREIGN HEART
                    </span>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-serif text-white">
                      Taif Damask Rose & Cashmere Amber
                    </h3>
                    <p className="text-xs sm:text-sm text-white/70 font-sans leading-relaxed">
                      Harvested at dawn in the high Saudi plateau of Taif. Deep, honeyed, velvety petals that reject fragile stereotypes. A heart that pulses with sovereign feminine authority.
                    </p>
                    <div className="pt-1 text-[9px] sm:text-[10px] font-mono tracking-widest uppercase text-white/40">
                      Sillage Duration: Hour 1 – Hour 6
                    </div>
                  </div>
                </div>

                {/* 3. BASE ACCORD */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-12 items-center">
                  <div className="lg:col-span-5 space-y-3">
                    <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.25em] uppercase text-[#ffb91d]">
                      PHASE III • THE ENDURING LEGACY
                    </span>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-serif text-white">
                      Aged Assam Dehn Al Oud & Bourbon Vanilla
                    </h3>
                    <p className="text-xs sm:text-sm text-white/70 font-sans leading-relaxed">
                      Dark, resinous agarwood distilled across 15 years in Assam. We soften its raw power with smoked Bourbon vanilla bean and Omani Hojari frankincense tears. The scent that lingers on silk coats long after midnight.
                    </p>
                    <div className="pt-1 text-[9px] sm:text-[10px] font-mono tracking-widest uppercase text-[#ffb91d]">
                      Sillage Duration: 24+ Hours Extrait
                    </div>
                  </div>
                  <div className="lg:col-span-7 flex justify-center lg:justify-end">
                    <div
                      className="relative w-full max-w-sm sm:max-w-md aspect-[16/10] overflow-hidden"
                      style={{
                        maskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 40%, transparent 100%)',
                        WebkitMaskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 40%, transparent 100%)',
                      }}
                    >
                      <Image
                        src="/woody.avif"
                        alt="Aged Assam Oud wood and sacred resin"
                        fill
                        className="object-cover object-center brightness-90 hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* ACT IV: THE ATELIER CREED                                  */}
          {/* ========================================================= */}
          <section className="relative py-16 sm:py-24 md:py-32 px-5 sm:px-10 lg:px-10 max-w-7xl mx-auto">
            <div className="space-y-12 sm:space-y-16">
              {/* Center Visual */}
              <div
                className="relative w-full aspect-[16/9] sm:aspect-[21/9] overflow-hidden"
                style={{
                  maskImage: 'radial-gradient(ellipse 90% 80% at 50% 50%, black 40%, transparent 100%)',
                  WebkitMaskImage: 'radial-gradient(ellipse 90% 80% at 50% 50%, black 40%, transparent 100%)',
                }}
              >
                <Image
                  src="https://cdn.shopify.com/s/files/1/0812/5077/9453/files/Voice_of_the_soul_1.jpg?v=1692390886"
                  alt="Voice of the Soul fragrance"
                  fill
                  className="object-cover object-center brightness-85"
                />
              </div>

              {/* Atelier Belief & Philosophy */}
              <div className="text-center max-w-2xl mx-auto space-y-6">
                <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.35em] text-[#ffb91d] block">
                  04 / OUR CREED
                </span>

                <blockquote className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif text-white tracking-wide leading-snug">
                  “We believe luxury doesn’t have to be loud, and femininity doesn’t have to mean delicate.”
                </blockquote>

                <p className="text-xs sm:text-sm text-white/70 font-sans max-w-lg mx-auto leading-relaxed">
                  Every Oud Nomad scent is made to travel with you, stay with you through desert afternoons and midnight departures, and leave something unforgettable behind.
                </p>

                {/* Oud Nomad Atelier Mark */}
                <div className="pt-4 flex flex-col items-center justify-center gap-2">
                  <div className="w-12 sm:w-16 h-7 sm:h-9 relative opacity-90">
                    <Image
                      src="/camelfinallogo-transparent.png"
                      alt="Oud Nomad Atelier"
                      fill
                      className="object-contain [filter:sepia(1)_saturate(5)_hue-rotate(5deg)_brightness(1.1)]"
                    />
                  </div>
                  <div className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.25em] text-[#ffb91d]">
                    Oud Nomad • Atelier Dubai
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* ACT V: THE NOMAD CODE                                     */}
          {/* ========================================================= */}
          <section className="relative py-16 sm:py-24 px-5 sm:px-10 lg:px-10 max-w-7xl mx-auto border-t border-white/5">
            <div className="space-y-12">
              <div className="text-center space-y-2">
                <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.35em] text-[#ffb91d] block">
                  05 / THE NOMAD CODE
                </span>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-white tracking-wide">
                  Four Tenets of the Sovereign Woman
                </h2>
              </div>

              {/* Seamless Typography Rows */}
              <div className="divide-y divide-white/10 space-y-0">
                {[
                  {
                    num: 'I',
                    title: 'Weightless Grandeur',
                    text: 'True luxury refuses to suffocate. Potency and longevity exist in harmony with effortless breathing room.',
                  },
                  {
                    num: 'II',
                    title: 'Heat-Activated Alchemy',
                    text: 'Formulated to treat sunlight and skin warmth not as enemies of scent, but as natural catalysts of projection.',
                  },
                  {
                    num: 'III',
                    title: 'Nomadic Sovereignty',
                    text: 'Crafted for the woman crossing continents, airports, and cultures — belonging everywhere, owned by nowhere.',
                  },
                  {
                    num: 'IV',
                    title: 'Sacred Distillation',
                    text: 'Pure aged botanical extracts and ethical Assamese agarwood with zero synthetic bulking agents or dilutions.',
                  },
                ].map((tenet) => (
                  <div
                    key={tenet.num}
                    className="py-6 sm:py-8 grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-baseline group hover:text-[#ffb91d] transition-colors"
                  >
                    <div className="md:col-span-2 text-[10px] sm:text-xs font-mono text-[#ffb91d] tracking-widest">
                      [ {tenet.num} ]
                    </div>
                    <div className="md:col-span-4 text-base sm:text-lg md:text-xl font-serif text-white group-hover:text-[#ffb91d] transition-colors">
                      {tenet.title}
                    </div>
                    <div className="md:col-span-6 text-xs sm:text-sm text-white/60 font-sans leading-relaxed">
                      {tenet.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* FINALE: THE HORIZON (Sensory Invitation)                  */}
          {/* ========================================================= */}
          <section className="relative py-20 sm:py-32 px-5 sm:px-10 text-center overflow-hidden">
            {/* Background Ambient Desert Sun */}
            <div
              className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[600px] h-[300px] rounded-t-full bg-gradient-to-t from-[#ffb91d]/15 to-transparent blur-[140px] pointer-events-none"
              aria-hidden="true"
            />

            <div className="max-w-2xl mx-auto space-y-8 relative z-10">
              <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.4em] text-[#ffb91d] block">
                THIS IS ONLY THE BEGINNING
              </span>

              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif text-white tracking-wide leading-snug">
                A fragrance for the woman you already are — and the woman you’re becoming.
              </h2>

              {/* Minimal Luxury Underline Actions */}
              <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
                <Link
                  href="/fragrance-finder"
                  className="group relative pb-1.5 text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-white hover:text-[#ffb91d] transition-colors"
                >
                  <span>Find Your Scent</span>
                  <span className="block absolute bottom-0 left-0 w-full h-[1px] bg-[#ffb91d] transition-all group-hover:h-[2px]" />
                </Link>

                <span className="hidden sm:inline-block text-white/20">•</span>

                <Link
                  href="/collections"
                  className="group relative pb-1.5 text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-white hover:text-[#ffb91d] transition-colors"
                >
                  <span>Shop The Collections</span>
                  <span className="block absolute bottom-0 left-0 w-full h-[1px] bg-white/40 group-hover:bg-[#ffb91d] transition-all group-hover:h-[2px]" />
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}