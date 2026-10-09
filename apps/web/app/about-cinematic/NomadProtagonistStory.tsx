'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ArchetypeTrait {
  id: string;
  number: string;
  name: string;
  summary: string;
  monologue: string;
  fragranceSillage: string;
}

const TRAITS: ArchetypeTrait[] = [
  {
    id: 'resilient',
    number: '01',
    name: 'Resilient',
    summary: 'Keeps moving through difficult terrain.',
    monologue:
      'The desert does not bend for anyone. Neither do you. When the storms roll across the dunes, you do not panic or seek shelter in someone else’s shadow. You lower your head, steady your pulse, and keep walking. Your strength is not loud — it is inevitable.',
    fragranceSillage: 'Pure 35% Extrait oil base that clings to your skin through the most demanding journeys.',
  },
  {
    id: 'enduring',
    number: '02',
    name: 'Enduring',
    summary: 'Built for long journeys, not instant gratification.',
    monologue:
      'You are playing a longer game. You do not chase transient applause or fast validation. Like ancient agarwood aged in darkness for fifteen years before releasing its gold, you understand that everything of true worth requires endurance.',
    fragranceSillage: 'Aged Assamese oud macerated over decades to linger for 24+ continuous hours.',
  },
  {
    id: 'independent',
    number: '03',
    name: 'Independent',
    summary: 'Comfortable travelling her own path.',
    monologue:
      'You do not need a crowd to validate your direction. Walking alone under the open desert sky or commanding a boardroom in Dubai, you carry your own compass. You belong everywhere because you are owned by nowhere.',
    fragranceSillage: 'An assertive woody-floral trail unburdened by sweet commercial compromises.',
  },
  {
    id: 'adaptable',
    number: '04',
    name: 'Adaptable',
    summary: 'Survives and thrives in changing environments.',
    monologue:
      'From dawn flights over oceans to midnight conversations by desert campfires — you transition seamlessly between worlds without losing an atom of who you are. The terrain changes; your grace remains untouched.',
    fragranceSillage: 'Heat-reactive botanical molecules that bloom richer as your skin temperature rises.',
  },
  {
    id: 'elegant',
    number: '05',
    name: 'Elegant & Quietly Luxurious',
    summary: 'Understated confidence rather than loud status.',
    monologue:
      'True luxury never shouts. It is in the slow cadence of your steps, the calm intensity of your gaze, and the fragrance that lingers long after you have departed. You do not wear perfume to impress strangers; you wear it as your private armor.',
    fragranceSillage: 'Rare Taif Damask Rose softened with cashmere amber — magnetic, unforgettable, never shrill.',
  },
  {
    id: 'strong-gentle',
    number: '06',
    name: 'Strong but Gentle',
    summary: 'Power without aggression.',
    monologue:
      'You do not need sharp edges to command respect. Like the gentle eye of the camel carrying sacred frankincense across treacherous ridges without complaint, your softness is not weakness — it is sovereign control.',
    fragranceSillage: 'Rich dark agarwood harmonized with velvety bourbon vanilla and golden saffron.',
  },
  {
    id: 'fearless-traveller',
    number: '07',
    name: 'Fearless Traveller',
    summary: 'Crosses borders, cultures, and expectations.',
    monologue:
      'You are at home across borders. From the ancient spice souks of the Levant to the glass towers of international capitals, you carry the spirit of the nomad girl hero. The horizon is not a boundary; it is an invitation.',
    fragranceSillage: 'Solar Calabrian bergamot meeting sacred Omani resin — a global odyssey in a drop.',
  },
  {
    id: 'visionary',
    number: '08',
    name: 'Visionary',
    summary: 'Always looking beyond the horizon.',
    monologue:
      'While others look at their feet, your eyes are fixed on the distant ridge. You see what is arriving long before the caravan reaches the crest. You create your own tomorrow with deliberate poise.',
    fragranceSillage: 'The pioneering formulation created specifically for high-heat resilience.',
  },
];

export default function NomadProtagonistStory() {
  const [activeTraitId, setActiveTraitId] = useState<string>('resilient');

  const activeTrait = TRAITS.find((t) => t.id === activeTraitId) || TRAITS[0];

  return (
    <section className="relative w-full py-28 sm:py-36 px-6 sm:px-12 lg:px-20 overflow-hidden bg-gradient-to-b from-transparent via-[#080705] to-transparent">
      {/* Background Watermark */}
      <div
        aria-hidden="true"
        className="absolute top-1/3 right-0 text-[16vw] font-serif font-light text-white/[0.015] tracking-[0.2em] uppercase select-none pointer-events-none translate-x-1/4"
      >
        PROTAGONIST
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-20 sm:space-y-28">
        {/* Section Header: Pure Editorial Typographic Flow */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-3 text-[10px] sm:text-xs font-mono uppercase tracking-[0.16em] text-[#ffb91d]">
            <span className="w-8 h-[1px] bg-[#ffb91d]/50" />
            <span>ACT IV • THE PROTAGONIST MANIFESTO</span>
            <span className="w-8 h-[1px] bg-[#ffb91d]/50" />
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-4xl lg:text-[2.6rem] font-serif font-medium text-white">
            You are the Hero <br />
            of this Story 
          </h2>

          <p className="text-sm sm:text-base font-serif italic text-white/70 leading-relaxed max-w-xl mx-auto">
            &ldquo;We didn&rsquo;t craft this perfume for the woman who seeks permission. We crafted it for the woman who leads the caravan.&rdquo;
          </p>
        </div>

        {/* The Asymmetric Editorial Spread: Visual and Prose Breathing Together */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual of Nomad Protagonist with her Camel (Feathered seamlessly, zero hard borders) */}
          <div className="lg:col-span-6 relative">
            <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] overflow-hidden">
              <Image
                src="/cinematic/nomad-camel.jpg"
                alt="Nomad woman standing with her camel across golden desert dunes at sunset"
                fill
                sizes="(min-width: 1024px) 600px, 100vw"
                className="object-cover object-center brightness-85 hover:scale-105 transition-transform duration-1000 ease-out"
              />

              {/* Seamless Vignette Feathering into Obsidian Canvas */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#080705] via-transparent to-transparent opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#080705]/80" />

              {/* Camel Emblem & Story Inscription Overlaid Elegantly */}
              <div className="absolute bottom-6 left-6 right-6 space-y-3 z-10">
                <div className="w-14 h-8 relative opacity-90">
                  <Image
                    src="/camelfinallogo-transparent.png"
                    alt="Camel emblem"
                    fill
                    className="object-contain object-left [filter:sepia(1)_saturate(5)_hue-rotate(5deg)_brightness(1.2)]"
                  />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#ffb91d] block">
                  THE TOTEM • THE DESERT CAMEL
                </span>
                <p className="text-xs sm:text-sm font-serif text-white/80 leading-relaxed">
                  The camel never rushes. She does not beg the sun for mercy. She simply endures with unshakeable dignity. She is the living embodiment of quiet luxury — powerful without aggression.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Archetype Journey */}
          <div className="lg:col-span-6 space-y-10">
            {/* Archetype Chapter Navigation: Horizontal Scrollable luxury index, zero button boxes */}
            <div className="space-y-3">
              <span className="text-[10px] font-sans font-medium uppercase tracking-[0.14em] text-white/40 block">
                EXPLORE HER 8 ESSENTIAL PILLARS
              </span>

              <div className="flex flex-wrap gap-x-5 gap-y-2.5 border-b border-white/10 pb-4">
                {TRAITS.map((trait) => {
                  const isActive = activeTraitId === trait.id;
                  return (
                    <button
                      key={trait.id}
                      type="button"
                      onClick={() => setActiveTraitId(trait.id)}
                      className="group flex items-baseline gap-1.5 transition-colors relative py-1"
                    >
                      <span
                        className={`text-[10px] font-mono transition-colors ${isActive ? 'text-[#ffb91d] font-semibold' : 'text-white/30 group-hover:text-white/60'
                          }`}
                      >
                        {trait.number}
                      </span>
                      <span
                        className={`text-xs sm:text-[13px] font-serif tracking-[0.04em] uppercase transition-colors ${isActive
                          ? 'text-[#ffb91d] font-medium underline underline-offset-8 decoration-[#ffb91d]'
                          : 'text-white/50 group-hover:text-white/80'
                          }`}
                      >
                        {trait.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Archetype Monologue: Direct Emotional Voice */}
            <div className="space-y-5">
              <div className="space-y-1.5">
                <span className="text-xs font-sans font-medium uppercase tracking-[0.14em] text-[#ffb91d]">
                  {activeTrait.number} • {activeTrait.name}
                </span>
                <h3 className="text-lg sm:text-xl md:text-2xl font-serif font-medium text-white/95">
                  &ldquo;{activeTrait.summary}&rdquo;
                </h3>
              </div>

              <p className="text-sm sm:text-base font-serif text-white/80 leading-relaxed pl-4 border-l-2 border-[#ffb91d]/60">
                {activeTrait.monologue}
              </p>

              {/* Fragrance Sillage Pairing */}
              <div className="space-y-1 pt-2">
                <span className="text-[10px] font-sans font-medium uppercase tracking-[0.14em] text-white/40 block">
                  HER SCENT SIGNATURE
                </span>
                <p className="text-xs sm:text-sm font-sans text-[#ffb91d]/90 leading-relaxed font-normal">
                  {activeTrait.fragranceSillage}
                </p>
              </div>
            </div>

            {/* Three Borderless Manifesto Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-white/10">
              <div className="space-y-1">
                <span className="text-xs font-serif text-[#ffb91d] block">I. Sovereign</span>
                <p className="text-[11px] font-serif text-white/60 leading-relaxed">
                  Walking her path without seeking external applause.
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-serif text-[#ffb91d] block">II. Enduring</span>
                <p className="text-[11px] font-serif text-white/60 leading-relaxed">
                  Built for the longest desert crossing.
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-serif text-[#ffb91d] block">III. Untamed</span>
                <p className="text-[11px] font-serif text-white/60 leading-relaxed">
                  Belonging everywhere, owned by nowhere.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
