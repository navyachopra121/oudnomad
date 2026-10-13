'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SiteHeader from '../components/header/SiteHeader';
import SandWindCanvas from './SandWindCanvas';
import LiquidDripCanvas from './LiquidDripCanvas';
import ElevatedHeatChamber from './ElevatedHeatChamber';
import NomadProtagonistStory from './NomadProtagonistStory';
import CinematicAudioHUD, { useCinematicAudio } from './CinematicAudio';

export default function CinematicAboutPage() {
  const { playDrop, setHeat } = useCinematicAudio();
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

  return (
    <div className="min-h-screen bg-[#060504] text-[#f4efe8] font-sans selection:bg-[#ffb91d] selection:text-black relative overflow-x-hidden">
      <CinematicAudioHUD />

      {/* Scroll Spine Meridian */}
      <div className="hidden xl:block fixed left-6 top-1/2 -translate-y-1/2 z-40 pointer-events-none">
        <div className="flex flex-col items-center gap-2.5">
          <span className="text-[7px] font-mono tracking-[0.35em] uppercase text-white/30 [writing-mode:vertical-rl] rotate-180">
            MERIDIAN • 25°N DUBAI
          </span>
          <div className="w-[1px] h-28 bg-white/10 relative overflow-hidden">
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
        <SiteHeader transparentMode />

        <main className="w-full">

          {/* SCENE I — HERO */}
          <section className="relative w-full min-h-screen flex flex-col justify-between pt-24 pb-10 px-5 sm:px-12 lg:px-20 overflow-hidden">
            <div className="absolute inset-0 z-0 overflow-hidden">
              <Image
                src="/cinematic/sand-dunes.jpg"
                alt="Sweeping golden desert dunes — a woman's journey begins at the horizon"
                fill
                priority
                sizes="100vw"
                className="object-cover object-center scale-105 brightness-70"
              />
              <SandWindCanvas className="opacity-75" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060504] via-black/30 to-black/40" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            </div>

            <div className="relative z-10 flex items-center justify-between text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.14em] text-white/60 pb-6 max-w-7xl mx-auto w-full">
              <div className="flex items-center gap-2">
                <span className="text-[#ffb91d]">AMRITSAR</span>
                <span>/</span>
                <span>DUBAI</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline">OUD NOMAD</span>
                <span>•</span>
                <span className="text-[#ffb91d]">A FRAGRANCE HOUSE</span>
              </div>
            </div>

            <div className="relative z-10 max-w-3xl my-auto py-8 sm:py-20 space-y-4 sm:space-y-6">
              <div className="w-16 sm:w-20 h-10 relative opacity-90">
                <Image
                  src="/camelfinallogo-transparent.png"
                  alt="Oud Nomad Emblem"
                  fill
                  className="object-contain object-left [filter:sepia(1)_saturate(5)_hue-rotate(5deg)_brightness(1.2)]"
                  priority
                />
              </div>

              <div className="space-y-3">
                <span className="text-[11px] sm:text-xs font-sans uppercase font-medium tracking-[0.16em] text-[#ffb91d] block">
                  A FRAGRANCE HOUSE FOR WOMEN WHO DON'T FIT INTO ONE WORLD
                </span>
                <h1 className="text-xl sm:text-4xl md:text-4xl font-serif font-medium text-white leading-[1.3] sm:leading-snug">
                  Some women are born <br />with a place. <br />
                  Others are born <br className="hidden sm:block" />with a horizon.
                </h1>
              </div>

              <p className="text-[13px] sm:text-base md:text-lg font-serif text-white/80 max-w-xl leading-[1.65]">
                Oud Nomad is for the woman who has lived between two worlds — between home and ambition, between roots and wandering, between the East and everywhere else.
              </p>

              <p className="text-[12px] sm:text-base font-serif text-white/60 max-w-lg leading-relaxed italic">
                This is not just a fragrance. It is a declaration.
              </p>

              <div className="pt-1 flex flex-wrap items-center gap-4 sm:gap-8 text-[11px] sm:text-xs font-sans uppercase font-medium tracking-[0.12em] sm:tracking-[0.14em]">
                <a
                  href="#our-story"
                  className="px-7 py-3 rounded-full bg-[#ffb91d] text-black font-semibold hover:bg-white transition-all shadow-[0_0_25px_rgba(255,185,29,0.35)]"
                >
                  Enter Her Story
                </a>
                <a
                  href="#heat-crucible"
                  className="text-white/80 hover:text-[#ffb91d] underline underline-offset-8 transition-colors flex items-center gap-2"
                >
                  <span>Feel the Heat</span>
                  <span>&gt;</span>
                </a>
              </div>
            </div>

            <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-6 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.12em] text-white/50 max-w-7xl mx-auto w-full">
              <div>
                <span className="text-white">Extrait de Parfum</span>
                <span className="mx-2 text-white/20">•</span>
                <span>Crafted in Dubai</span>
              </div>
              <div className="text-[#ffb91d]">Wear Your Journey.</div>
            </div>
          </section>

          {/* SCENE II — OUR STORY */}
          <section
            id="our-story"
            className="relative w-full min-h-[85vh] flex flex-col justify-center py-14 sm:py-32 px-5 sm:px-12 lg:px-20 overflow-hidden"
          >
            <div className="absolute inset-0 z-0">
              <Image
                src="/cinematic/taif-rose-oud.jpg"
                alt="Golden hour — two worlds, two cities, one journey"
                fill
                sizes="100vw"
                className="object-cover object-center brightness-50 scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/80" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#060504] via-transparent to-[#060504]" />
            </div>

            <div className="relative z-20 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
              <div className="lg:col-span-5 relative">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-[10px] sm:text-xs font-mono uppercase tracking-[0.16em] text-[#ffb91d]">
                    <span className="w-8 h-[1px] bg-[#ffb91d]" />
                    <span>THE ORIGIN</span>
                  </div>
                  <div className="space-y-2 text-[9px] font-mono uppercase tracking-[0.3em] text-white/30">
                    <div>AMRITSAR • INDIA</div>
                    <div className="text-[#ffb91d]/60">to</div>
                    <div>DUBAI • UAE</div>
                  </div>
                  <p className="text-[3rem] sm:text-[5rem] font-serif text-white/[0.06] leading-none select-none">
                    "Two<br />worlds."
                  </p>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-7">
                <div className="flex items-center gap-3 text-[10px] sm:text-xs font-mono uppercase tracking-[0.16em] text-[#ffb91d]">
                  <span className="w-8 h-[1px] bg-[#ffb91d]" />
                  <span>IT STARTED BETWEEN TWO WORLDS</span>
                </div>

                <h2 className="text-xl sm:text-4xl md:text-4xl font-serif font-medium text-white leading-[1.3] sm:leading-snug">
                  She didn't leave one world <br />behind. She carried both.
                </h2>

                <div className="space-y-3 sm:space-y-4 text-[13px] sm:text-base font-serif text-white/75 leading-[1.7]">
                  <p>
                    Our founder grew up in Amritsar — a city of spices, silk, and stories that never quite ended. When she moved to Dubai, she expected to find herself. Instead, she found a gap.
                  </p>
                  <p>
                    European perfumes were beautiful — but they dissolved by midday under the desert sun. Arabian ouds were powerful — but they felt like they belonged to another era, another identity.
                  </p>
                  <p className="text-white font-normal">
                    She wanted something that understood her. A fragrance that could hold the warmth of the Punjab and the ambition of Dubai. Something that didn't ask her to choose.
                  </p>
                  <p className="text-white/90">So she built it.</p>
                </div>

                <div className="space-y-2 pt-3 border-l-2 border-[#ffb91d]/60 pl-4 text-[10px] sm:text-xs font-mono uppercase tracking-[0.05em] sm:tracking-[0.06em] text-white/80">
                  <p className="text-white">Amritsar roots. Dubai soul. Global spirit.</p>
                  <p className="text-white/70">Built to survive 48°C heat without compromise.</p>
                  <p className="text-[#ffb91d]">Crafted for the woman who belongs everywhere.</p>
                </div>
              </div>
            </div>
          </section>

          {/* SCENE III — FRAGRANCE AND CLIMATE */}
          <div id="heat-crucible">
            <ElevatedHeatChamber
              onTempChange={(temp) => {
                const factor = Math.max(0, Math.min(1, (temp - 20) / 28));
                setHeat(factor);
              }}
            />
          </div>

          {/* SCENE IV — THE OUD NOMAD WOMAN AND THE CAMEL */}
          <NomadProtagonistStory />

          {/* SCENE V — FRAGRANCE AS A JOURNEY */}
          <section
            id="fragrance-journey"
            className="relative w-full min-h-[85vh] flex flex-col justify-center py-14 sm:py-32 px-5 sm:px-12 lg:px-20 overflow-hidden"
          >
            <div className="absolute inset-0 z-0">
              <Image
                src="/cinematic/molten-dripping.jpg"
                alt="Liquid gold — fragrance as a wordless journey"
                fill
                sizes="100vw"
                className="object-cover object-center brightness-55 scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/92 via-black/75 to-black/88" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#060504] via-transparent to-[#060504]" />
            </div>

            <LiquidDripCanvas
              className="z-10"
              onDropSound={() => playDrop()}
            />

            <div className="relative z-20 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
              <div className="lg:col-span-5 space-y-6">
                <div className="flex items-center gap-3 text-[10px] sm:text-xs font-mono uppercase tracking-[0.16em] text-[#ffb91d]">
                  <span className="w-8 h-[1px] bg-[#ffb91d]" />
                  <span>FRAGRANCE AS A JOURNEY</span>
                </div>
                <h2 className="text-xl sm:text-4xl md:text-4xl font-serif font-medium text-white leading-[1.3] sm:leading-snug">
                  We tell stories <br />without words.
                </h2>
                <p className="text-[12px] sm:text-base font-serif text-white/70 italic leading-[1.65]">
                  "Every scent we create is a chapter — a place, a mood, a memory you didn't know you had."
                </p>
                <div className="text-[9px] font-mono uppercase tracking-[0.25em] text-white/30 pt-2">
                  Tap anywhere to ripple the canvas
                </div>
              </div>

              <div className="lg:col-span-7 space-y-0">
                <div className="space-y-3 pb-7 border-b border-white/10">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#ffb91d]">The Opening</span>
                  <h3 className="text-lg sm:text-xl font-serif font-medium text-white">The first spray is an arrival.</h3>
                  <p className="text-sm font-serif text-white/70 leading-relaxed">
                    The moment it touches your skin, Kashmir saffron and Calabrian bergamot cut through the air — bright, decisive, immediate. Like stepping off a plane into sunlight.
                  </p>
                </div>

                <div className="space-y-3 py-7 border-b border-white/10">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#ffb91d]">The Heart</span>
                  <h3 className="text-lg sm:text-xl font-serif font-medium text-white">The middle is where you settle in.</h3>
                  <p className="text-sm font-serif text-white/70 leading-relaxed">
                    Taif Damask rose unfurls slowly, warming with your skin temperature. This is the hour when you stop performing and simply become. Unhurried. Magnetic.
                  </p>
                </div>

                <div className="space-y-3 pt-7">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#ffb91d]">The Drydown</span>
                  <h3 className="text-lg sm:text-xl font-serif font-medium text-white">The base is your legend.</h3>
                  <p className="text-sm font-serif text-white/70 leading-relaxed">
                    Aged Assamese Dehn Al Oud, sacred frankincense, amber resin. The sillage that remains hours — and sometimes days — after you've left the room. Your story, told in trace.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* SCENE VI — OUR CRAFTSMANSHIP */}
          <section
            id="craftsmanship"
            className="relative w-full py-14 sm:py-32 px-5 sm:px-12 lg:px-20 overflow-hidden bg-gradient-to-b from-[#060504] via-[#080705] to-[#060504]"
          >
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none blur-[200px]"
              style={{ backgroundColor: 'rgba(255, 185, 29, 0.07)' }}
              aria-hidden="true"
            />

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center relative z-10">
              <div className="lg:col-span-6 relative">
                <div className="relative w-full aspect-[4/3] overflow-hidden group">
                  <Image
                    src="/cinematic/taif-rose-oud.jpg"
                    alt="Crafted with intention — the Oud Nomad atelier process"
                    fill
                    sizes="(min-width: 1024px) 600px, 100vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out brightness-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080705] via-transparent to-transparent opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#080705]/80" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[9px] font-mono uppercase tracking-[0.25em] text-white/50">
                    <span>Atelier Formulation</span>
                    <span className="text-[#ffb91d]">Taif • Assam • Oman</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 space-y-7">
                <div className="flex items-center gap-3 text-[10px] sm:text-xs font-mono uppercase tracking-[0.16em] text-[#ffb91d]">
                  <span className="w-8 h-[1px] bg-[#ffb91d]" />
                  <span>OUR CRAFTSMANSHIP</span>
                </div>

                <h2 className="text-xl sm:text-4xl md:text-4xl font-serif font-medium text-white leading-[1.3] sm:leading-snug">
                  Crafted with intention. <br />Not just ingredients.
                </h2>

                <div className="space-y-3 sm:space-y-4 text-[13px] sm:text-base font-serif text-white/75 leading-[1.7]">
                  <p>
                    We don't pour fragrances by formula. Every Oud Nomad creation begins with a question: <span className="text-white italic">What does this woman need to feel?</span>
                  </p>
                  <p>
                    Our raw materials are sourced from the same regions that have produced the world's finest botanical extracts for centuries. Kashmir saffron. High-altitude Taif Damask rose. Aged Assamese agarwood. Omani frankincense.
                  </p>
                  <p className="text-white">
                    Each ingredient is chosen not just for its scent — but for its endurance, its resonance, its story.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-white/10">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-sans font-medium uppercase tracking-[0.14em] text-[#ffb91d] block">Concentration</span>
                    <p className="text-sm font-serif text-white font-medium">35% Extrait</p>
                    <p className="text-[11px] font-serif text-white/50 leading-relaxed">Pure oil, no dilution.</p>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-sans font-medium uppercase tracking-[0.14em] text-[#ffb91d] block">Origin</span>
                    <p className="text-sm font-serif text-white font-medium">Multi-Region</p>
                    <p className="text-[11px] font-serif text-white/50 leading-relaxed">India, Saudi Arabia, Oman.</p>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-sans font-medium uppercase tracking-[0.14em] text-[#ffb91d] block">Longevity</span>
                    <p className="text-sm font-serif text-white font-medium">24+ Hours</p>
                    <p className="text-[11px] font-serif text-white/50 leading-relaxed">Engineered for desert climates.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FINALE — CLOSING BRAND STATEMENT */}
          <section className="relative w-full py-16 sm:py-36 px-5 sm:px-12 text-center overflow-hidden border-t border-white/10">
            <div
              className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[800px] h-[400px] rounded-t-full bg-gradient-to-t from-[#ffb91d]/20 via-[#ff9900]/5 to-transparent blur-[160px] pointer-events-none"
              aria-hidden="true"
            />

            <div className="max-w-3xl mx-auto space-y-7 sm:space-y-10 relative z-10">
              <span className="text-[10px] sm:text-xs font-sans font-medium uppercase tracking-[0.16em] text-[#ffb91d] block">
                OUD NOMAD DUBAI
              </span>

              <h2 className="text-xl sm:text-4xl md:text-4xl font-serif font-medium text-white leading-[1.3] sm:leading-snug">
                For the woman <br />you already are.
              </h2>

              <div className="space-y-4 max-w-lg mx-auto">
                <p className="text-[13px] sm:text-base text-white/75 font-serif leading-[1.7]">
                  You don't need a perfume to transform you. You need one that finally sees you — the complexity, the contradictions, the quiet power you carry between worlds.
                </p>
                <p className="text-sm text-white/50 font-serif italic">
                  Oud Nomad is that fragrance.
                </p>
              </div>

              <div className="pt-4">
                <p className="text-base sm:text-2xl font-serif font-light text-[#ffb91d] tracking-[0.1em] sm:tracking-[0.12em] uppercase">
                  Wear your journey.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                <Link
                  href="/collections"
                  className="w-auto px-9 py-3.5 rounded-full bg-[#ffb91d] text-black text-xs font-sans font-semibold uppercase tracking-[0.14em] hover:bg-white transition-all shadow-[0_0_30px_rgba(255,185,29,0.35)]"
                >
                  Explore the Collection
                </Link>
                <Link
                  href="/fragrance-finder"
                  className="w-auto px-9 py-3.5 rounded-full bg-white/5 border border-white/20 text-white text-xs font-sans font-medium uppercase tracking-[0.14em] hover:border-[#ffb91d] hover:text-[#ffb91d] transition-all"
                >
                  Find Your Scent
                </Link>
              </div>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
