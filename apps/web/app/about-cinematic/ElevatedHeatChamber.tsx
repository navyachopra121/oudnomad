'use client';

import React, { useState } from 'react';

interface HeatState {
  temp: number;
  label: string;
  subtitle: string;
  sillageRadius: string;
  longevity: string;
  molecularState: string;
  headline: string;
  narrative: string;
  notes: {
    top: { name: string; pct: number };
    heart: { name: string; pct: number };
    base: { name: string; pct: number };
  };
  glowColor: string;
}

const HEAT_LEVELS: Record<number, HeatState> = {
  20: {
    temp: 20,
    label: 'Dawn Whispers',
    subtitle: 'Morning Oasis Cool',
    sillageRadius: 'Intimate Halo • 2 Feet',
    longevity: '12+ Hours Extrait',
    molecularState: 'Suspended top-layer botanical oils; crisp crystalline projection.',
    headline: 'Solar Bergamot & Kashmir Saffron stay close, like a private secret.',
    narrative:
      'In mild morning breezes, the fragrance behaves with aristocratic restraint. Calabrian bergamot and hand-plucked saffron stigmas breathe quietly against your pulse points, intimate and luminous.',
    notes: {
      top: { name: 'Kashmir Saffron & Bergamot', pct: 85 },
      heart: { name: 'Taif Damask Rose (Bud)', pct: 35 },
      base: { name: 'Assam Dehn Al Oud (Dormant)', pct: 20 },
    },
    glowColor: 'rgba(218, 165, 32, 0.15)',
  },
  35: {
    temp: 35,
    label: 'The Solar Awakening',
    subtitle: 'Midday Velvet Warmth',
    sillageRadius: 'Commanding Presence • 6 Feet',
    longevity: '18+ Hours Extrait',
    molecularState: 'Skin warmth liquefies amber resin crystals; floral projection awakens.',
    headline: 'Taif Damask Rose expands, commanding the room with effortless poise.',
    narrative:
      'As your body temperature rises with the day, the petals of high-altitude Taif roses unfurl. Honeyed amber molecules soften and project outward, creating a trail that announces your arrival before a single word is spoken.',
    notes: {
      top: { name: 'Kashmir Saffron & Bergamot', pct: 60 },
      heart: { name: 'Taif Damask Rose (Full Bloom)', pct: 95 },
      base: { name: 'Assam Dehn Al Oud (Warming)', pct: 65 },
    },
    glowColor: 'rgba(255, 140, 20, 0.28)',
  },
  48: {
    temp: 48,
    label: 'The Crucible Sun',
    subtitle: 'Peak Arabian Heat',
    sillageRadius: 'Magnetic Halo • 12+ Feet',
    longevity: '24+ Hours Extrait',
    molecularState: 'European scents evaporate; Oud Nomad Assam resins ignite into velvet armor.',
    headline: 'Where ordinary scents vanish by noon, you become immortal.',
    narrative:
      'Ordinary European fragrances use high alcohol formulations that disintegrate under 45°C+ heat by midday. Oud Nomad was born in Dubai: aged Assamese agarwood and sacred resins melt directly into your skin oils, multiplying in intensity and leaving an immortal sillage trail that refuses to surrender.',
    notes: {
      top: { name: 'Kashmir Saffron & Bergamot', pct: 40 },
      heart: { name: 'Taif Damask Rose (Melted)', pct: 80 },
      base: { name: 'Assam Dehn Al Oud (Full Ignition)', pct: 100 },
    },
    glowColor: 'rgba(255, 100, 0, 0.38)',
  },
};

export default function ElevatedHeatChamber({
  onTempChange,
}: {
  onTempChange?: (temp: number) => void;
}) {
  const [selectedTemp, setSelectedTemp] = useState<number>(48);

  const current = HEAT_LEVELS[selectedTemp] || HEAT_LEVELS[48];

  const handleSelect = (temp: number) => {
    setSelectedTemp(temp);
    if (onTempChange) {
      onTempChange(temp);
    }
  };

  return (
    <section className="relative w-full py-28 sm:py-36 px-6 sm:px-12 lg:px-20 overflow-hidden bg-gradient-to-b from-transparent via-[#090806] to-transparent">
      {/* Radiant Solar Background Aura - Expands seamlessly into the universe */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none blur-[180px] transition-all duration-1000 ease-out"
        style={{ backgroundColor: current.glowColor }}
        aria-hidden="true"
      />

      {/* Atmospheric Background Watermark Typography */}
      {/* <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10vw] font-serif font-light text-white/[0.015] tracking-[0.2em] uppercase select-none pointer-events-none whitespace-nowrap"
      >
        CRUCIBLE 48°C
      </div> */}

      <div className="relative z-10 max-w-6xl mx-auto space-y-16 sm:space-y-24">
        {/* Section Header: Pure Editorial Typography, No Containers */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-3 text-[10px] sm:text-xs font-mono uppercase tracking-[0.16em] text-[#ffb91d]">
            <span className="w-8 h-[1px] bg-[#ffb91d]/50" />
            <span>ACT III • THE HEAT CRUCIBLE</span>
            <span className="w-8 h-[1px] bg-[#ffb91d]/50" />
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-4xl lg:text-[2.6rem] font-serif font-medium text-white">
            The Heat a Perfume <br />
            Must Survive.
          </h2>

          <p className="text-sm sm:text-base font-serif text-white/70 leading-relaxed max-w-xl mx-auto">
            European perfumes are engineered for mild Parisian mornings. By midday in Dubai, they vanish into thin air. Slide across the heat horizon to experience how 35% Extrait comes alive under pressure.
          </p>
        </div>

        {/* Sensory Heat Meridian: Sleek, Borderless Architectural Instrument */}
        <div className="space-y-10">
          {/* Temperature Navigation: Clean luxury typography with gold indicator bar */}
          <div className="flex items-center justify-between max-w-2xl mx-auto border-b border-white/10 pb-5">
            {[20, 35, 48].map((t) => {
              const item = HEAT_LEVELS[t];
              const isActive = selectedTemp === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleSelect(t)}
                  className="group text-left transition-all duration-300 relative py-2"
                >
                  <div className="flex items-baseline gap-2">
                    <span
                      className={`text-2xl sm:text-3xl font-serif font-medium tracking-normal transition-colors duration-300 ${isActive
                        ? 'text-[#ffb91d]'
                        : 'text-white/40 group-hover:text-white/70'
                        }`}
                    >
                      {t}°C
                    </span>
                    <span
                      className={`text-[10px] sm:text-[11px] font-sans font-medium uppercase tracking-[0.12em] hidden sm:inline transition-colors duration-300 ${isActive ? 'text-white/80' : 'text-white/30'
                        }`}
                    >
                      {item.label}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-mono tracking-[0.06em] block mt-1 transition-colors ${isActive ? 'text-[#ffb91d]/90' : 'text-white/20'
                      }`}
                  >
                    {item.subtitle}
                  </span>

                  {/* Active Indicator Underline */}
                  {isActive && (
                    <span className="absolute bottom-[-25px] left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ffb91d] to-transparent shadow-[0_0_12px_#ffb91d]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Interactive Heat Horizon Slider Bar */}
          <div className="max-w-3xl mx-auto space-y-3">
            <div className="relative flex items-center py-4">
              <input
                type="range"
                min="20"
                max="48"
                step="1"
                value={selectedTemp}
                onChange={(e) => handleSelect(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-gradient-to-r from-[#e5c07b]/30 via-[#ff9900]/40 to-[#ff3b00]/70 rounded-full appearance-none cursor-pointer accent-[#ffb91d]"
              />
            </div>
            <div className="flex justify-between text-[9px] font-mono uppercase tracking-[0.25em] text-white/40">
              <span>20°C • Cool Oasis Whisper</span>
              <span className="text-[#ffb91d] font-semibold">Active: {selectedTemp}°C</span>
              <span>48°C • Arabian Crucible Ignition</span>
            </div>
          </div>
        </div>

        {/* Dynamic Editorial Content Spread: Asymmetric, Poetic, Zero Boxes */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Monumental Sillage Radar & Aura */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
              {/* Concentric Radiant Pulse Rings */}
              <div
                className="absolute inset-0 rounded-full border border-dashed border-[#ffb91d]/20 transition-all duration-700 animate-spin"
                style={{
                  transform: `scale(${selectedTemp === 48 ? 1.05 : selectedTemp === 35 ? 0.85 : 0.65})`,
                  animationDuration: selectedTemp === 48 ? '40s' : '80s',
                }}
              />
              <div
                className="absolute inset-6 rounded-full border border-white/10 transition-transform duration-700"
                style={{
                  transform: `scale(${selectedTemp === 48 ? 1 : selectedTemp === 35 ? 0.8 : 0.6})`,
                }}
              />
              <div
                className="absolute inset-14 rounded-full transition-all duration-700 blur-md"
                style={{
                  backgroundColor: current.glowColor,
                }}
              />

              {/* Central Glowing Temperature Sun Core */}
              <div className="relative z-10 text-center space-y-1">
                <span className="text-4xl sm:text-5xl font-serif font-semibold text-white tracking-tight drop-shadow-[0_0_25px_rgba(255,185,29,0.5)]">
                  {current.temp}°C
                </span>
                <span className="text-[10px] font-sans font-medium uppercase tracking-[0.14em] text-[#ffb91d] block">
                  {current.sillageRadius}
                </span>
              </div>
            </div>

            <div className="mt-4 text-center">
              <span className="text-[10px] font-sans font-medium uppercase tracking-[0.14em] text-white/40 block">
                MOLECULAR LONGEVITY
              </span>
              <span className="text-sm font-serif font-medium text-white/90">
                {current.longevity}
              </span>
            </div>
          </div>

          {/* Right Column: The Sensory Story */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-sans font-medium uppercase tracking-[0.16em] text-[#ffb91d] block">
                {current.molecularState}
              </span>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-medium text-white leading-snug">
                {current.headline}
              </h3>
              <p className="text-sm sm:text-base font-serif text-white/80 leading-relaxed">
                {current.narrative}
              </p>
            </div>

            {/* Note Evolution Meridian Lines (Clean typographic bars, no container boxes) */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <span className="text-[10px] font-sans font-medium uppercase tracking-[0.14em] text-white/50 block">
                ACTIVE NOTE DYNAMICS AT {current.temp}°C
              </span>

              {Object.entries(current.notes).map(([key, note]) => (
                <div key={key} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono tracking-wider">
                    <span className="text-white/80">{note.name}</span>
                    <span className="text-[#ffb91d]">{note.pct}% Sillage</span>
                  </div>
                  <div className="w-full h-1 bg-white/10 relative overflow-hidden rounded-full">
                    <div
                      className="h-full bg-gradient-to-r from-[#ffb91d] to-[#ff7a00] transition-all duration-700 ease-out"
                      style={{ width: `${note.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Quiet Luxury Seal */}
            <div className="pt-2 flex items-center gap-4 text-[10px] font-mono tracking-[0.2em] uppercase text-white/50">
              <span className="w-2 h-2 rounded-full bg-[#ffb91d]" />
              <span>Extrait de Parfum • Hydro-Distilled in Dubai</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
