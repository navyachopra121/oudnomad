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
      {/* Floating Audio Engine Controller */}
      <CinematicAudioHUD />

      {/* Floating Scroll Spine (Delicate Gold Meridian - Desktop) */}
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

      {/* Sleek Floating Version Switcher Capsule Badge - Non-intrusive luxury pill */}
      {/* <div className="fixed top-24 right-6 z-40 hidden sm:flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/70 backdrop-blur-xl border border-[#ffb91d]/30 shadow-2xl text-[9px] font-mono uppercase tracking-[0.25em] text-white/80">
        <span className="w-1.5 h-1.5 rounded-full bg-[#ffb91d] animate-ping" />
        <span className="text-[#ffb91d]">Cinematic Concept</span>
        <span className="text-white/20">•</span>
        <Link
          href="/about"
          className="text-white/60 hover:text-white transition-colors underline underline-offset-4 decoration-[#ffb91d]/40"
        >
          Classic Editorial ↗
        </Link>
      </div> */}

      <div className="relative z-10">
        <SiteHeader transparentMode />

        <main className="w-full">
          {/* ========================================================= */}
          {/* SCENE I: THE HORIZON & NOMAD PROTAGONIST (FULL BLEED HERO) */}
          {/* ========================================================= */}
          <section className="relative w-full min-h-screen flex flex-col justify-between pt-28 pb-16 px-6 sm:px-12 lg:px-20 overflow-hidden">
            {/* Edge-to-Edge Desert Dunes Visual Canvas (100vw, No card borders) */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <Image
                src="/cinematic/sand-dunes.jpg"
                alt="Sweeping golden desert dunes with nomad woman walking into horizon"
                fill
                priority
                sizes="100vw"
                className="object-cover object-center scale-105 brightness-70"
              />
              {/* Dynamic Sand Particles blowing across the dunes */}
              <SandWindCanvas className="opacity-75" />
              {/* Cinematic Vignettes and Lighting Gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#060504] via-black/30 to-black/40" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            </div>

            {/* Coordinates & Act Indicator */}
            <div className="relative z-10 flex items-center justify-between text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.14em] text-white/60 pb-6  max-w-7xl mx-auto w-full">
              <div className="flex items-center gap-2">
                <span className="text-[#ffb91d]">ACT 01</span>
                <span>/</span>
                <span>THE NOMAD PROTAGONIST</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline">DUBAI RUB&apos; AL KHALI</span>
                <span>•</span>
                <span className="text-[#ffb91d]">25.2048° N</span>
              </div>
            </div>

            {/* Editorial Hero Prose Floating Seamlessly on Sand */}
            <div className="relative z-10 max-w-3xl my-auto py-12 sm:py-20 space-y-6">
              {/* Camel Emblem */}
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
                <span className="text-[11px] sm:text-xs font-sans uppercase font-medium uppercase tracking-[0.16em] text-[#ffb91d] block">
                  YOU WERE NOT BORN TO BLEND IN
                </span>
                <h1 className="text-2xl sm:text-4xl md:text-4xl lg:text-[2.6rem] font-serif font-medium text-white ">
                  You don’t follow  <br />the caravan. <br />
                  You lead it.
                </h1>
              </div>

              <p className="text-sm sm:text-base md:text-lg font-serif text-white/80 max-w-xl leading-relaxed">
                Step into the dunes. The desert does not yield to force — it answers only to quiet endurance. A fragrance crafted for the woman who walks her own path with unhurried sovereignty.
              </p>

              {/* Minimalist Floating Action Links */}
              <div className="pt-2 flex flex-wrap items-center gap-5 sm:gap-8 text-xs font-sans uppercase font-medium tracking-[0.14em]">
                <a
                  href="#distillation"
                  className="px-7 py-3 rounded-full bg-[#ffb91d] text-black font-semibold hover:bg-white transition-all shadow-[0_0_25px_rgba(255,185,29,0.35)]"
                >
                  Enter Her Story ↓
                </a>
                <a
                  href="#heat-crucible"
                  className="text-white/80 hover:text-[#ffb91d] underline underline-offset-8 transition-colors flex items-center gap-2"
                >
                  <span>Experience the 48°C Heat Dial</span>
                  <span>➔</span>
                </a>
              </div>
            </div>

            {/* Bottom Atmospheric Scent Specs */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-6  text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.12em] text-white/50 max-w-7xl mx-auto w-full">
              <div>
                <span className="text-white">Pure Extrait • 35% Concentration</span>
                <span className="mx-2 text-white/20">•</span>
                <span>Distilled in Dubai</span>
              </div>
              <div className="text-[#ffb91d]">
                Desert Wind Activated • Tactile Experience
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* SCENE II: THE SACRED DISTILLATION (FULL BLEED LIQUID DRIP) */}
          {/* ========================================================= */}
          <section
            id="distillation"
            className="relative w-full min-h-[85vh] flex flex-col justify-center py-18 sm:py-26 px-6 sm:px-12 lg:px-20 overflow-hidden bg-gradient-to-b from-[#060504] via-[#090806] to-[#060504]"
          >
            {/* Background Liquid Visual & Interactive Ripple Canvas */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/cinematic/molten-dripping.jpg"
                alt="Viscous molten oud oil dripping into golden ripples"
                fill
                sizes="100vw"
                className="object-cover object-center brightness-60 scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/85" />
            </div>

            {/* Interactive Concentric Golden Ripple Canvas */}
            <LiquidDripCanvas
              className="z-10"
              onDropSound={() => playDrop()}
            />

            {/* Editorial Narrative Floating Directly on Liquid Canvas */}
            <div className="relative z-20 max-w-3xl mx-auto w-full space-y-6">
              <div className="flex items-center gap-3 text-[10px] sm:text-xs font-mono uppercase tracking-[0.16em] text-[#ffb91d]">
                <span className="w-8 h-[1px] bg-[#ffb91d]" />
                <span>ACT 02 • THE SACRED DISTILLATION</span>
              </div>

              <h2 className="text-2xl sm:text-4xl md:text-4xl lg:text-[2.6rem] font-serif font-medium text-white">
                Liquid gold does not rush. <br />
                It gathers under pressure.
              </h2>

              <p className="text-sm sm:text-base font-serif text-white/80 leading-relaxed max-w-xl">
                Notice how a single drop of aged Assamese Dehn Al Oud falls with deliberate gravity. It takes fifteen years of slow fermentation in ancient agarwood trunks to yield this single droplet. We do not dilute it with cheap cosmetic alcohol. We preserve its untamed density.
              </p>

              {/* Seamless Typographic Columns (No Cards, No Box Borders) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-white/10 text-xs font-mono tracking-[0.06em] max-w-xl">
                <div className="space-y-1">
                  <span className="text-white/40 block uppercase text-[10px]">VISCOSITY</span>
                  <span className="text-[#ffb91d] text-sm font-semibold">Slow Velvet Drip</span>
                </div>
                <div className="space-y-1">
                  <span className="text-white/40 block uppercase text-[10px]">EXTRACTION</span>
                  <span className="text-white text-sm font-semibold">Hydro-Distilled Assam</span>
                </div>
                <div className="space-y-1">
                  <span className="text-white/40 block uppercase text-[10px]">INTERACTION</span>
                  <span className="text-white/70 text-sm">Tap anywhere to ripple</span>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* SCENE III: THE HEAT CRUCIBLE (SENSORY CLIMATE MERIDIAN)   */}
          {/* ========================================================= */}
          <div id="heat-crucible">
            <ElevatedHeatChamber
              onTempChange={(temp) => {
                // Modulate heat factor in audio engine (20C = 0, 48C = 1)
                const factor = Math.max(0, Math.min(1, (temp - 20) / 28));
                setHeat(factor);
              }}
            />
          </div>

          {/* ========================================================= */}
          {/* SCENE IV: THE NOMAD GIRL HERO & HER CAMEL (THE TOTEM)     */}
          {/* ========================================================= */}
          <NomadProtagonistStory />

          {/* ========================================================= */}
          {/* SCENE V: THE MIDNIGHT ATELIER (AMRITSAR TO DUBAI ORIGIN)  */}
          {/* ========================================================= */}
          <section className="relative w-full py-18 sm:py-26 px-6 sm:px-12 lg:px-20 overflow-hidden bg-gradient-to-b from-[#060504] via-[#080705] to-[#060504]">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
              {/* Asymmetric Image Visual with Soft Luxury Vignette Mask */}
              <div className="lg:col-span-6 relative">
                <div className="relative w-full aspect-[4/3] overflow-hidden group">
                  <Image
                    src="/cinematic/taif-rose-oud.jpg"
                    alt="Taif damask rose petals bathed in amber light and incense smoke"
                    fill
                    sizes="(min-width: 1024px) 600px, 100vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out brightness-85"
                  />
                  {/* Subtle Gradient Feathering at edges */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080705] via-transparent to-transparent opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#080705]/80" />

                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[9px] font-mono uppercase tracking-[0.25em] text-white/50">
                    <span>Atelier Formulation</span>
                    <span className="text-[#ffb91d]">Taif • Assam • Omani Frankincense</span>
                  </div>
                </div>
              </div>

              {/* The Founder's Raw Personal Narrative */}
              <div className="lg:col-span-6 space-y-6">
                <div className="flex items-center gap-3 text-[10px] sm:text-xs font-mono uppercase tracking-[0.16em] text-[#ffb91d]">
                  <span className="w-8 h-[1px] bg-[#ffb91d]" />
                  <span>ACT 05 • THE ORIGIN</span>
                </div>

                <h2 className="text-2xl sm:text-4xl md:text-4xl lg:text-[2.6rem] font-serif font-medium text-white">
                  &ldquo;Nothing on the shelf was made for who I am.&rdquo;
                </h2>

                <div className="space-y-4 text-sm sm:text-base font-serif text-white/75 leading-relaxed">
                  <p>
                    At 24, moving from Amritsar to Dubai, I found two fragrance worlds pulling in opposite directions.
                  </p>
                  <p>
                    European perfumes smelled charming at 9 AM in an air-conditioned room, but by midday the desert sun had erased them. Traditional Arabian ouds were long-lasting, but felt heavy, antique, and crafted for ceremonies of a past era.
                  </p>
                  <p className="text-white font-normal">
                    I wanted a fragrance for the modern nomadic woman who is both fierce and delicate. A perfume that does not whisper for approval, nor suffocate the room with arrogance.
                  </p>
                </div>

                {/* 3 Golden Inscriptions */}
                <div className="space-y-2.5 pt-3 border-l-2 border-[#ffb91d]/60 pl-5 text-xs font-mono uppercase tracking-[0.06em] text-white/80">
                  <p className="text-white">I. Built to withstand 48°C heat without decaying.</p>
                  <p className="text-white/80">II. Sovereign femininity — power without fragility.</p>
                  <p className="text-[#ffb91d]">III. Nomadic independence — belonging everywhere, owned by nowhere.</p>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* FINALE: CLAIM YOUR PLACE AT THE HEAD OF THE CARAVAN       */}
          {/* ========================================================= */}
          <section className="relative w-full py-18 sm:py-26 px-6 sm:px-12 text-center overflow-hidden border-t border-white/10">
            {/* Luminous Sun Flare Aura on Horizon */}
            <div
              className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[800px] h-[400px] rounded-t-full bg-gradient-to-t from-[#ffb91d]/20 via-[#ff9900]/5 to-transparent blur-[160px] pointer-events-none"
              aria-hidden="true"
            />

            <div className="max-w-3xl mx-auto space-y-8 relative z-10">
              <span className="text-[10px] sm:text-xs font-sans font-medium uppercase tracking-[0.16em] text-[#ffb91d] block">
                THE SILLAGE IS YOURS
              </span>

              <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-medium text-white tracking-[-0.015em] leading-[1.2]">
                Claim your place at the head of the caravan
              </h2>

              <p className="text-sm sm:text-base text-white/75 font-serif max-w-lg mx-auto leading-relaxed">
                Experience the pure 35% Extrait de Parfum creations engineered to flourish under the golden Arabian sun.
              </p>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                <Link
                  href="/fragrance-finder"
                  className="w-auto sm:w-auto px-9 py-3.5 rounded-full bg-[#ffb91d] text-black text-xs font-sans font-semibold uppercase tracking-[0.14em] hover:bg-white transition-all shadow-[0_0_30px_rgba(255,185,29,0.35)]"
                >
                  Find Your Nomad Scent
                </Link>

                <Link
                  href="/collections"
                  className="w-auto sm:w-auto px-9 py-3.5 rounded-full bg-white/5 border border-white/20 text-white text-xs font-sans font-medium uppercase tracking-[0.14em] hover:border-[#ffb91d] hover:text-[#ffb91d] transition-all"
                >
                  Explore Collections
                </Link>

                <Link
                  href="/about"
                  className="text-xs font-sans font-medium uppercase tracking-[0.14em] text-white/50 hover:text-white transition-colors underline underline-offset-4 py-2 sm:py-0"
                >
                  View Classic Editorial
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
