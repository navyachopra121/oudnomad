'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SiteHeader from '../components/header/SiteHeader';
import SandWindCanvas from './SandWindCanvas';
import LiquidDripCanvas from './LiquidDripCanvas';
import CinematicAudioHUD, { useCinematicAudio } from './CinematicAudio';

const CHAPTERS = [
  { id: 'home', label: 'HOME' },
  { id: 'two-worlds', label: 'TWO WORLDS' },
  { id: 'heat', label: 'HEAT' },
  { id: 'she-decides', label: 'SHE DECIDES' },
  { id: 'the-camel', label: 'THE CAMEL' },
  { id: 'stories', label: 'STORIES' },
  { id: 'intention', label: 'INTENTION' },
  { id: 'wear-your-journey', label: 'WEAR YOUR JOURNEY' },
];

export default function CinematicAboutPage() {
  const { playDrop } = useCinematicAudio();
  const [currentChapter, setCurrentChapter] = useState<number>(0);
  const [selectedHeatTemp, setSelectedHeatTemp] = useState<number>(45);
  const isAnimatingRef = useRef<boolean>(false);
  const touchStartYRef = useRef<number>(0);
  const touchEndYRef = useRef<number>(0);

  const totalChapters = CHAPTERS.length;

  const goToChapter = useCallback(
    (index: number) => {
      if (index >= 0 && index < totalChapters && !isAnimatingRef.current) {
        isAnimatingRef.current = true;
        setCurrentChapter(index);
        setTimeout(() => {
          isAnimatingRef.current = false;
        }, 750);
      }
    },
    [totalChapters]
  );

  const nextChapter = useCallback(() => {
    if (currentChapter < totalChapters - 1) {
      goToChapter(currentChapter + 1);
    }
  }, [currentChapter, totalChapters, goToChapter]);

  const prevChapter = useCallback(() => {
    if (currentChapter > 0) {
      goToChapter(currentChapter - 1);
    }
  }, [currentChapter, goToChapter]);

  // Wheel listener for slide-by-slide scrolling on desktop
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isAnimatingRef.current) return;
      if (Math.abs(e.deltaY) < 25) return;

      if (e.deltaY > 0) {
        if (currentChapter < totalChapters - 1) {
          isAnimatingRef.current = true;
          setCurrentChapter((prev) => Math.min(prev + 1, totalChapters - 1));
          setTimeout(() => {
            isAnimatingRef.current = false;
          }, 800);
        }
      } else {
        if (currentChapter > 0) {
          isAnimatingRef.current = true;
          setCurrentChapter((prev) => Math.max(prev - 1, 0));
          setTimeout(() => {
            isAnimatingRef.current = false;
          }, 800);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [currentChapter, totalChapters]);

  // Touch listener for swipe up / swipe down on mobile and tablets
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (isAnimatingRef.current) return;
    const deltaY = touchStartYRef.current - touchEndYRef.current;
    const threshold = 40;

    if (deltaY > threshold) {
      // Swiped UP -> Move to next chapter
      nextChapter();
    } else if (deltaY < -threshold) {
      // Swiped DOWN -> Return to previous chapter
      prevChapter();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        nextChapter();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        prevChapter();
      } else if (e.key === 'Home') {
        e.preventDefault();
        goToChapter(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goToChapter(totalChapters - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextChapter, prevChapter, goToChapter, totalChapters]);

  const meridianProgress = Math.round(((currentChapter + 1) / totalChapters) * 100);

  return (
    <div
      className="fixed inset-0 h-[100dvh] w-screen bg-[#060504] text-[#f4efe8] font-sans selection:bg-[#ffb91d] selection:text-black overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <SiteHeader transparentMode />
      <CinematicAudioHUD />

      {/* Meridian progress indicator (Left rail on large screens) */}
      <div className="hidden xl:block fixed left-6 top-1/2 -translate-y-1/2 z-40 pointer-events-none">
        <div className="flex flex-col items-center gap-2.5">
          <span className="text-[7px] font-mono tracking-[0.35em] uppercase text-white/30 [writing-mode:vertical-rl] rotate-180">
            MERIDIAN • 25°N DUBAI
          </span>
          <div className="w-[1px] h-28 bg-white/10 relative overflow-hidden">
            <div
              className="absolute top-0 left-0 w-full bg-[#ffb91d] transition-all duration-500"
              style={{ height: `${meridianProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Right Rail: Slide Indicators (Dots & Labels without numbers) */}
      <nav
        aria-label="Section Indicators"
        className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-end gap-2.5 sm:gap-3"
      >
        {CHAPTERS.map((ch, idx) => {
          const isActive = currentChapter === idx;
          return (
            <button
              key={ch.id}
              type="button"
              onClick={() => goToChapter(idx)}
              aria-label={`Jump to ${ch.label}`}
              className="group flex items-center gap-2 sm:gap-3 py-1 cursor-pointer focus:outline-none"
            >
              {/* <span
                className={`hidden md:inline-block text-[9px] font-mono uppercase tracking-[0.2em] transition-all duration-300 ${
                  isActive
                    ? 'text-[#ffb91d] opacity-100 translate-x-0'
                    : 'text-white/40 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2'
                }`}
              >
                {ch.label}
              </span> */}
              <span
                className={`transition-all duration-400 rounded-full ${isActive
                  ? 'w-2 h-7 sm:w-2.5 sm:h-8 bg-[#ffb91d] shadow-[0_0_12px_rgba(255,185,29,0.7)]'
                  : 'w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/20 group-hover:bg-white/60'
                  }`}
              />
            </button>
          );
        })}
      </nav>

      {/* Floating Navigation Arrows (Desktop & Mobile) */}
      <div className="fixed bottom-4 sm:bottom-6 right-3 sm:right-6 z-40 flex items-center gap-2">
        <button
          type="button"
          onClick={prevChapter}
          disabled={currentChapter === 0}
          aria-label="Swipe down to return to previous section"
          className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-white/15 bg-black/50 backdrop-blur-md flex items-center justify-center text-white transition-all duration-300 ${currentChapter === 0
            ? 'opacity-25 cursor-not-allowed border-white/5'
            : 'hover:border-[#ffb91d] hover:text-[#ffb91d] hover:bg-black/80 hover:scale-105 active:scale-95'
            }`}
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>

        <button
          type="button"
          onClick={nextChapter}
          disabled={currentChapter === totalChapters - 1}
          aria-label="Swipe up to move to next section"
          className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-white/15 bg-black/50 backdrop-blur-md flex items-center justify-center text-white transition-all duration-300 ${currentChapter === totalChapters - 1
            ? 'opacity-25 cursor-not-allowed border-white/5'
            : 'hover:border-[#ffb91d] hover:text-[#ffb91d] hover:bg-black/80 hover:scale-105 active:scale-95'
            }`}
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Mobile Section Indicator Pill without numbers */}
      <div className="fixed bottom-4 left-4 z-40 md:hidden flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono tracking-widest text-[#ffb91d] uppercase font-medium">
        {CHAPTERS[currentChapter].label}
      </div>

      {/* Main Slide-By-Slide Track */}
      <main
        className="w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
        style={{ transform: `translateY(-${currentChapter * 100}%)` }}
      >
        {/* ========================================================
            SECTION: HOME
            ======================================================== */}
        <section className="h-[100dvh] w-full shrink-0 relative flex flex-col justify-between pt-20 pb-12 sm:pt-24 sm:pb-14 px-5 sm:px-12 lg:px-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/cinematic/sand-dunes.jpg"
              alt="Oud Nomad Desert Horizon"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center brightness-[0.72] scale-105"
            />
            <SandWindCanvas className="opacity-70" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060504] via-black/25 to-black/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-black/60" />
          </div>

          {/* Top subtle brand emblem */}
          <div className="relative z-10 max-w-7xl mx-auto w-full flex items-center justify-between">
            <div className="w-12 sm:w-16 h-8 relative opacity-90">
              <Image
                src="/camelfinallogo-transparent.png"
                alt="Oud Nomad Emblem"
                fill
                className="object-contain object-left [filter:sepia(1)_saturate(5)_hue-rotate(5deg)_brightness(1.2)]"
                priority
              />
            </div>
          </div>

          {/* Main Two-Column Editorial Spread */}
          <div className="relative z-10 max-w-7xl mx-auto w-full my-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
            {/* Left text */}
            <div className="md:col-span-7 space-y-4 sm:space-y-6">
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-white uppercase tracking-[0.06em] leading-[1.2]">
                SOME WOMEN<br />
                ARE BORN WITH<br />
                A PLACE TO CALL HOME.
              </h1>
              <p className="text-xl sm:text-3xl md:text-4xl font-serif italic text-white/90 font-light tracking-wide leading-snug">
                OTHERS CARRY<br />
                HOME WITH THEM.
              </p>
            </div>

            {/* Right text */}
            <div className="md:col-span-5 md:text-right space-y-2 sm:space-y-3 md:pl-6 border-l md:border-l-0 md:border-r border-[#ffb91d]/40 pl-4 md:pr-6">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif text-white uppercase tracking-[0.12em] font-normal">
                OUD NOMAD
              </h2>
              <p className="text-xs sm:text-sm lg:text-base font-serif text-white/80 uppercase tracking-[0.14em] leading-relaxed">
                A FRAGRANCE HOUSE<br />
                FOR WOMEN WHO DON'T<br />
                FIT INTO ONE WORLD.
              </p>
            </div>
          </div>

          {/* Bottom Swipe Prompt */}
          <div className="relative z-10 max-w-7xl mx-auto w-full flex items-center justify-between text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.2em] text-white/50">
            <span className="hidden sm:inline">DUBAI • EXTRAIT DE PARFUM</span>
            <button
              type="button"
              onClick={nextChapter}
              className="flex items-center gap-2 text-[#ffb91d] hover:text-white transition-colors cursor-pointer mx-auto sm:mx-0 animate-pulse"
            >
              <span>SWIPE UP TO CONTINUE</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </div>
        </section>

        {/* ========================================================
            SECTION: IT STARTED BETWEEN TWO WORLDS
            ======================================================== */}
        <section className="h-[100dvh] w-full shrink-0 relative flex flex-col justify-center pt-20 pb-12 sm:pt-24 sm:pb-14 px-5 sm:px-12 lg:px-20 overflow-hidden bg-[#070605]">
          <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
            {/* Visual banner: Amritsar to Dubai transition */}
            <div className="lg:col-span-7 relative">
              <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden rounded-sm border border-white/10 shadow-2xl group">
                <Image
                  src="/cinematic/amritsar-dubai.jpg"
                  alt="Amritsar Golden Temple and Dubai Skyline"
                  fill
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out brightness-[0.88]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.2em] text-white/70">
                  <span>AMRITSAR</span>
                  <span className="text-[#ffb91d]">— • —</span>
                  <span>DUBAI</span>
                </div>
              </div>
            </div>

            {/* Right text card */}
            <div className="lg:col-span-5 space-y-4 sm:space-y-6 bg-black/60 lg:bg-transparent p-5 sm:p-7 lg:p-0 rounded-sm backdrop-blur-sm lg:backdrop-blur-none border border-white/10 lg:border-none">
              <div className="space-y-2 border-b border-white/10 pb-4">
                <h2 className="text-xl sm:text-3xl lg:text-4xl font-serif text-white uppercase tracking-[0.08em] leading-snug">
                  IT STARTED<br />
                  BETWEEN TWO WORLDS.
                </h2>
              </div>

              <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm lg:text-base font-serif text-white/80 leading-[1.7]">
                <p>
                  Born in Amritsar. Drawn to Dubai.<br />
                  Inspired by the East. Curious about the world.
                </p>
                <p>
                  I loved the depth of Oriental perfumery.<br />
                  I loved the refinement of modern fragrance.<br />
                  But I wanted something that felt like both — and neither.
                </p>
                <p className="text-white font-medium tracking-[0.14em] uppercase text-[11px] sm:text-xs pt-2">
                  SO I CREATED IT. —
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION: HEAT
            ======================================================== */}
        <section className="h-[100dvh] w-full shrink-0 relative flex flex-col justify-center pt-20 pb-12 sm:pt-24 sm:pb-14 px-5 sm:px-12 lg:px-20 overflow-hidden bg-[#080705]">
          <div className="absolute inset-0 z-0">
            <Image
              src="/cinematic/molten-dripping.jpg"
              alt="Golden amber drops in heat"
              fill
              sizes="100vw"
              className="object-cover object-center brightness-[0.35]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#080705] via-[#080705]/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#080705] via-transparent to-[#080705]" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            {/* Left text */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl sm:text-3xl lg:text-4xl font-serif text-white uppercase tracking-[0.06em] leading-snug">
                  WE DIDN'T CREATE<br />
                  FOR PERFECT WEATHER.
                </h2>
                <h3 className="text-xl sm:text-3xl lg:text-4xl font-serif text-[#ffb91d] uppercase tracking-[0.06em]">
                  WE CREATED FOR HEAT.
                </h3>
              </div>

              <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm lg:text-base font-serif text-white/80 leading-[1.7] max-w-xl">
                <p>
                  In the Gulf, fragrance lives differently.<br />
                  Heat changes the way it opens.<br />
                  The way it moves.<br />
                  The way it stays.
                </p>
                <p>
                  So we made the climate part of the experience.
                </p>
                <p className="text-white uppercase tracking-[0.12em] font-medium text-[11px] sm:text-xs pt-1">
                  THE SKIN BECOMES<br />
                  THE FINAL INGREDIENT.
                </p>
              </div>
            </div>

            {/* Right: Three temperature indicators */}
            <div className="lg:col-span-5 space-y-4">
              <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
                {[
                  { temp: 20, state: 'MILD' },
                  { temp: 32, state: 'WARM' },
                  { temp: 45, state: 'CRUCIBLE' },
                ].map((item) => {
                  const isActive = selectedHeatTemp === item.temp;
                  return (
                    <button
                      key={item.temp}
                      type="button"
                      onClick={() => setSelectedHeatTemp(item.temp)}
                      className={`p-3 sm:p-5 rounded-sm border text-center transition-all duration-300 flex flex-col items-center justify-center cursor-pointer ${isActive
                        ? 'border-[#ffb91d] bg-[#ffb91d]/10 shadow-[0_0_20px_rgba(255,185,29,0.25)]'
                        : 'border-white/10 bg-black/40 hover:border-white/30'
                        }`}
                    >
                      <span
                        className={`text-2xl sm:text-4xl font-serif font-light transition-colors ${isActive ? 'text-[#ffb91d]' : 'text-white'
                          }`}
                      >
                        {item.temp}°C
                      </span>
                      <span
                        className={`text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.2em] mt-1.5 ${isActive ? 'text-[#ffb91d]' : 'text-white/50'
                          }`}
                      >
                        {item.state}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="relative w-full aspect-[16/9] rounded-sm overflow-hidden border border-white/10">
                <Image
                  src="/cinematic/molten-dripping.jpg"
                  alt="Golden liquid amber droplets"
                  fill
                  sizes="(min-width: 1024px) 400px, 100vw"
                  className="object-cover object-center brightness-75 hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 text-[9px] font-mono uppercase tracking-[0.2em] text-[#ffb91d]">
                  {selectedHeatTemp}°C ACTIVE CONCENTRATION
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION: SHE DECIDES
            ======================================================== */}
        <section className="h-[100dvh] w-full shrink-0 relative flex flex-col justify-center pt-20 pb-12 sm:pt-24 sm:pb-14 px-5 sm:px-12 lg:px-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/cinematic/woman-perfume.jpg"
              alt="Woman applying perfume in desert sunset"
              fill
              sizes="100vw"
              className="object-cover object-center brightness-[0.65] scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/80" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060504] via-transparent to-[#060504]" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto w-full text-center space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif text-white uppercase tracking-[0.08em] leading-snug">
                SHE DOESN'T ASK<br />
                WHERE SHE BELONGS.
              </h2>
              <p className="text-xl sm:text-3xl md:text-4xl font-serif italic text-[#ffb91d] tracking-wide">
                SHE DECIDES.
              </p>
            </div>

            <div className="space-y-2 sm:space-y-3 text-xs sm:text-base lg:text-lg font-serif text-white/85 leading-[1.7] max-w-xl mx-auto">
              <p>She adapts without losing herself.</p>
              <p>She travels without needing to be told where to go.</p>
              <p>She is strong, yet gentle.</p>
              <p>Elegant without asking to be noticed.</p>
              <p>Curious enough to leave.</p>
              <p>Brave enough to begin again.</p>
            </div>

            <p className="text-xs sm:text-sm lg:text-base font-serif uppercase tracking-[0.18em] text-white font-medium pt-2">
              SHE IS THE OUD NOMAD WOMAN.
            </p>
          </div>
        </section>

        {/* ========================================================
            SECTION: THE CAMEL
            ======================================================== */}
        <section className="h-[100dvh] w-full shrink-0 relative flex flex-col justify-center pt-20 pb-12 sm:pt-24 sm:pb-14 px-5 sm:px-12 lg:px-20 overflow-hidden bg-[#070605]">
          <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
            {/* Left: Camel Dune Silhouette */}
            <div className="hidden md:block lg:col-span-3 relative">
              <div className="relative w-full aspect-[4/5] rounded-sm overflow-hidden border border-white/10">
                <Image
                  src="/cinematic/nomad-camel.jpg"
                  alt="Camel in the desert dunes"
                  fill
                  sizes="(min-width: 1024px) 300px, 30vw"
                  className="object-cover object-center brightness-[0.8] hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </div>
            </div>

            {/* Center: Main Camel Manifesto */}
            <div className="lg:col-span-5 space-y-4 sm:space-y-6">
              <div className="space-y-1.5">
                <h2 className="text-xl sm:text-3xl lg:text-4xl font-serif text-white uppercase tracking-[0.06em] leading-snug">
                  WE LOOKED TO THE DESERT<br />
                  FOR A SYMBOL.
                </h2>
                <p className="text-lg sm:text-2xl font-serif italic text-[#ffb91d]">
                  WE FOUND THE CAMEL.
                </p>
              </div>

              <div className="space-y-3 text-xs sm:text-sm lg:text-base font-serif text-white/80 leading-[1.7]">
                <p>
                  It crosses landscapes where others cannot.<br />
                  It endures. It adapts. It carries what matters.<br />
                  It keeps moving — and never needs to be loud<br />
                  about its strength.
                </p>
              </div>
            </div>

            {/* Right: Trait Box & Camel Eye Close-up */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-4 items-center">
              {/* Trait list */}
              <div className="space-y-2 border-l border-[#ffb91d]/50 pl-4 py-2 text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-white/90">
                <div>ENDURING</div>
                <div>ADAPTABLE</div>
                <div>INDEPENDENT</div>
                <div>GRACEFUL</div>
                <div>RESOURCEFUL</div>
                <div>FEARLESS</div>
                <div className="text-[#ffb91d]">FREE</div>
              </div>

              {/* Camel Eye Portrait */}
              <div className="relative aspect-square rounded-sm overflow-hidden border border-white/10 group">
                <Image
                  src="/cinematic/camel-eye.jpg"
                  alt="Camel eye portrait"
                  fill
                  sizes="200px"
                  className="object-cover object-center brightness-[0.85] group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 text-right space-y-0.5">
                  <div className="text-[9px] sm:text-[10px] font-serif uppercase tracking-[0.14em] text-white">
                    NOT A MASCOT.
                  </div>
                  <div className="text-[10px] sm:text-xs font-serif uppercase tracking-[0.16em] text-[#ffb91d] font-semibold">
                    A SPIRIT.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION: STORIES
            ======================================================== */}
        <section className="h-[100dvh] w-full shrink-0 relative flex flex-col justify-center pt-20 pb-12 sm:pt-24 sm:pb-14 px-5 sm:px-12 lg:px-20 overflow-hidden bg-[#060504]">
          <div className="absolute inset-0 z-0">
            <Image
              src="/cinematic/molten-dripping.jpg"
              alt="Explosion of golden liquid fragrance"
              fill
              sizes="100vw"
              className="object-cover object-center brightness-[0.4]"
            />
            <LiquidDripCanvas className="z-10" onDropSound={() => playDrop()} />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/80" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#060504] via-transparent to-[#060504]" />
          </div>

          <div className="relative z-20 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            {/* Left text */}
            <div className="lg:col-span-6 space-y-4 sm:space-y-6">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif text-white uppercase tracking-[0.06em] leading-snug">
                WE TELL STORIES<br />
                WITHOUT WORDS.
              </h2>

              <div className="space-y-3 sm:space-y-4 text-xs sm:text-base font-serif text-white/80 leading-[1.7] max-w-lg">
                <p>
                  A fragrance can take you somewhere.<br />
                  To a place you've never seen.<br />
                  To a memory you thought you'd forgotten.<br />
                  To a version of yourself you haven't met yet.
                </p>
                <div className="pt-2 space-y-1">
                  <p className="text-white uppercase tracking-[0.14em] font-medium text-xs sm:text-sm">
                    NOT JUST A SCENT.
                  </p>
                  <p className="text-[#ffb91d] uppercase tracking-[0.16em] font-medium text-xs sm:text-sm">
                    A TRACE OF A JOURNEY.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Visual Accent */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-square rounded-full border border-dashed border-[#ffb91d]/30 flex items-center justify-center p-6">
                <div className="relative w-full h-full rounded-full overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(255,185,29,0.2)]">
                  <Image
                    src="/cinematic/molten-dripping.jpg"
                    alt="Molten gold droplets"
                    fill
                    sizes="(min-width: 1024px) 450px, 80vw"
                    className="object-cover object-center brightness-90 animate-pulse"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center text-center p-4">
                    <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-white/70">
                      TAP ANYWHERE TO RIPPLE
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION: INTENTION
            ======================================================== */}
        <section className="h-[100dvh] w-full shrink-0 relative flex flex-col justify-center pt-20 pb-12 sm:pt-24 sm:pb-14 px-5 sm:px-12 lg:px-20 overflow-hidden bg-[#070605]">
          <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-center">
            {/* Left Image: Raw Ingredients */}
            <div className="hidden md:block md:col-span-3 relative">
              <div className="relative w-full aspect-[3/4] rounded-sm overflow-hidden border border-white/10 shadow-xl group">
                <Image
                  src="/cinematic/raw-ingredients.jpg"
                  alt="Delicate white flower and raw agarwood bark"
                  fill
                  sizes="(min-width: 1024px) 300px, 30vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 text-[9px] font-mono uppercase tracking-[0.2em] text-[#ffb91d]">
                  RAW BOTANICALS
                </div>
              </div>
            </div>

            {/* Center: Intention Content */}
            <div className="md:col-span-6 space-y-4 sm:space-y-6 text-center md:text-left">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif text-white uppercase tracking-[0.06em] leading-snug">
                CRAFTED<br />
                WITH INTENTION.
              </h2>

              <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm lg:text-base font-serif text-white/80 leading-[1.7] max-w-md mx-auto md:mx-0">
                <p>
                  Every detail has a reason.<br />
                  The materials. The concentration.<br />
                  The way the fragrance develops on warm skin.<br />
                  The way the bottle feels in the hand.
                </p>
                <p className="text-white/90">
                  Nothing is there simply to decorate.<br />
                  Everything is part of the experience.
                </p>
              </div>
            </div>

            {/* Right Image: Gold Perfume Bottle */}
            <div className="md:col-span-3 relative">
              <div className="relative w-full aspect-[3/4] rounded-sm overflow-hidden border border-white/10 shadow-2xl group">
                <Image
                  src="/cinematic/bottle-gold.jpg"
                  alt="Oud Nomad luxury golden bottle"
                  fill
                  sizes="(min-width: 1024px) 300px, 50vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 right-3 text-[9px] font-mono uppercase tracking-[0.2em] text-[#ffb91d]">
                  EXTRAIT DE PARFUM
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION: WEAR YOUR JOURNEY
            ======================================================== */}
        <section className="h-[100dvh] w-full shrink-0 relative flex flex-col justify-between pt-20 pb-12 sm:pt-24 sm:pb-14 px-5 sm:px-12 lg:px-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/cinematic/woman-sunset.jpg"
              alt="Woman in billowing black abaya in desert sunset"
              fill
              sizes="100vw"
              className="object-cover object-center brightness-[0.7] scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060504] via-black/40 to-black/50" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-black/70" />
          </div>

          {/* Top subtle brand emblem */}
          <div className="relative z-10 max-w-7xl mx-auto w-full flex items-center justify-between">
            <div className="w-12 sm:w-16 h-8 relative opacity-90">
              <Image
                src="/camelfinallogo-transparent.png"
                alt="Camel emblem"
                fill
                className="object-contain object-left [filter:sepia(1)_saturate(5)_hue-rotate(5deg)_brightness(1.2)]"
              />
            </div>
          </div>

          {/* Center Content Spread */}
          <div className="relative z-10 max-w-7xl mx-auto w-full my-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
            {/* Left text */}
            <div className="md:col-span-7 space-y-4 sm:space-y-6">
              <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-white uppercase tracking-[0.06em] leading-[1.2]">
                FOR THE WOMAN<br />
                YOU ALREADY ARE.
              </h2>
              <p className="text-xl sm:text-3xl md:text-4xl font-serif italic text-white/90 font-light tracking-wide leading-snug">
                AND THE WOMAN<br />
                YOU ARE BECOMING.
              </p>
            </div>

            {/* Right text */}
            <div className="md:col-span-5 md:text-right space-y-3 sm:space-y-4 md:pl-6 border-l md:border-l-0 md:border-r border-[#ffb91d]/40 pl-4 md:pr-6">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-white uppercase tracking-[0.14em]">
                OUD NOMAD
              </h3>
              <p className="text-xs sm:text-sm font-mono uppercase tracking-[0.25em] text-[#ffb91d]">
                DUBAI
              </p>
              <p className="text-base sm:text-xl lg:text-2xl font-serif italic text-white/90 pt-1">
                Wear your journey.
              </p>

              <div className="pt-4 flex flex-wrap md:justify-end gap-3">
                <Link
                  href="/collections"
                  className="px-6 py-2.5 rounded-full bg-[#ffb91d] text-black text-xs font-semibold uppercase tracking-[0.14em] hover:bg-white transition-all shadow-[0_0_20px_rgba(255,185,29,0.35)]"
                >
                  Explore Collection
                </Link>
                <button
                  type="button"
                  onClick={() => goToChapter(0)}
                  className="px-6 py-2.5 rounded-full border border-white/20 text-white text-xs uppercase tracking-[0.14em] hover:border-[#ffb91d] hover:text-[#ffb91d] transition-all"
                >
                  Return to Start
                </button>
              </div>
            </div>
          </div>

          {/* Bottom brand closure */}
          <div className="relative z-10 max-w-7xl mx-auto w-full flex items-center justify-between text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
            <span>EXTRAIT DE PARFUM</span>
            <span>AMRITSAR • DUBAI • THE WORLD</span>
          </div>
        </section>
      </main>
    </div>
  );
}
