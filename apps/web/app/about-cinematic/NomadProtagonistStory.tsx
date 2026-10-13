'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ArchetypeTrait {
  id: string;
  name: string;
  monologue: string;
}

const TRAITS: ArchetypeTrait[] = [
  {
    id: 'sovereign',
    name: 'Sovereign',
    monologue:
      `She doesn't ask where she belongs. She decides. She has lived between two worlds long enough to know that belonging is not given — it is claimed. She walks into any room, any culture, any conversation, and she is at home — not because she conforms, but because she is entirely, unapologetically herself.`,
  },
  {
    id: 'enduring',
    name: 'Enduring',
    monologue:
      `She is not built for fleeting moments. She is built for the long journey. Like aged agarwood that takes fifteen years of darkness to release its most profound depth, she does not rush her becoming. She understands that everything of true worth requires patience, pressure, and time.`,
  },
  {
    id: 'between-worlds',
    name: 'Between Worlds',
    monologue:
      `She carries the warmth of her roots and the ambition of her chosen city. She is simultaneously soft and fierce, traditional and bold, Eastern and global. She does not choose one identity. She holds all of them — and that tension is where her power lives.`,
  },
  {
    id: 'fearless',
    name: 'Fearless',
    monologue:
      `She has crossed borders — literal and invisible. She has stood in rooms where she was the only one who looked like her, smelled like her, thought like her. She didn't shrink. The unknown is not a threat to her. It is an invitation.`,
  },
  {
    id: 'quietly-powerful',
    name: 'Quietly Powerful',
    monologue:
      `True power does not shout. It lingers. It is in the slow, deliberate way she enters a space — the fragrance arriving before she does, the silence she commands without demanding it. She does not need validation. She is the validation.`,
  },
  {
    id: 'untamed',
    name: 'Untamed',
    monologue:
      `She was never meant to be tamed by a trend, a season, or a single story. She writes her own. She has shed the identities that were handed to her and chosen, slowly and deliberately, the one that is hers. She belongs everywhere. She is owned by nowhere.`,
  },
];

export default function NomadProtagonistStory() {
  const [activeTraitId, setActiveTraitId] = useState<string>('sovereign');

  const activeTrait = TRAITS.find((t) => t.id === activeTraitId) || TRAITS[0];

  return (
    <>
      {/* THE OUD NOMAD WOMAN */}
      <section className="relative w-full py-16 sm:py-36 px-5 sm:px-12 lg:px-20 overflow-hidden bg-gradient-to-b from-transparent via-[#080705] to-transparent">
        {/* Background Watermark */}
        <div
          aria-hidden="true"
          className="absolute top-1/3 right-60 text-[10vw] font-serif font-light text-white/[0.018] uppercase select-none pointer-events-none translate-x-1/4"
        >
          NOMAD
        </div>

        <div className="relative z-10 max-w-7xl mx-auto space-y-12 sm:space-y-28">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="flex items-center justify-center gap-3 text-[10px] sm:text-xs font-mono uppercase tracking-[0.16em] text-[#ffb91d]">
              <span className="w-8 h-[1px] bg-[#ffb91d]/50" />
              <span>THE OUD NOMAD WOMAN</span>
              <span className="w-8 h-[1px] bg-[#ffb91d]/50" />
            </div>

            <h2 className="text-xl sm:text-4xl md:text-4xl font-serif font-medium text-white leading-[1.3] sm:leading-snug">
              She doesn't ask where <br />
              she belongs. She decides.
            </h2>

            <p className="text-[12px] sm:text-base font-serif italic text-white/70 leading-[1.65] max-w-xl mx-auto">
              "She is not one thing. She is the warmth of Punjab and the ambition of Dubai. The softness of rose and the weight of oud. She is the woman who has always been too much for one world — so she built her own."
            </p>
          </div>

          {/* Asymmetric Editorial Spread */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left: Nomad image with feathered vignette */}
            <div className="lg:col-span-6 relative">
              <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] overflow-hidden">
                <Image
                  src="/cinematic/nomad-camel.jpg"
                  alt="The Oud Nomad Woman — standing at the horizon, between worlds"
                  fill
                  sizes="(min-width: 1024px) 600px, 100vw"
                  className="object-cover object-center brightness-85 hover:scale-105 transition-transform duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080705] via-transparent to-transparent opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#080705]/80" />

                <div className="absolute bottom-6 left-6 right-6 space-y-2 z-10">
                  <div className="w-14 h-8 relative opacity-90">
                    <Image
                      src="/camelfinallogo-transparent.png"
                      alt="Camel emblem"
                      fill
                      className="object-contain object-left [filter:sepia(1)_saturate(5)_hue-rotate(5deg)_brightness(1.2)]"
                    />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#ffb91d] block">
                    THE NOMAD WOMAN
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Interactive Trait Index */}
            <div className="lg:col-span-6 space-y-10">
              <div className="space-y-3">
                <span className="text-[10px] font-sans font-medium uppercase tracking-[0.14em] text-white/40 block">
                  WHO SHE IS
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

              {/* Active Trait Monologue */}
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <span className="text-xs font-sans font-medium uppercase tracking-[0.14em] text-[#ffb91d]">
                    {activeTrait.name}
                  </span>
                </div>

                <p className="text-[13px] sm:text-base font-serif text-white/80 leading-[1.7] pl-4 border-l-2 border-[#ffb91d]/60">
                  {activeTrait.monologue}
                </p>
              </div>

              {/* Three Manifesto Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-white/10">
                <div className="space-y-1">
                  <span className="text-xs font-serif text-[#ffb91d] block">Fierce</span>
                  <p className="text-[11px] font-serif text-white/60 leading-relaxed">
                    She does not wait for permission.
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-serif text-[#ffb91d] block">Delicate</span>
                  <p className="text-[11px] font-serif text-white/60 leading-relaxed">
                    Softness is her sharpest edge.
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-serif text-[#ffb91d] block">Nomadic</span>
                  <p className="text-[11px] font-serif text-white/60 leading-relaxed">
                    Owned by nowhere. At home everywhere.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE CAMEL — A SYMBOL OF STRENGTH */}
      <section className="relative w-full py-14 sm:py-28 px-5 sm:px-12 lg:px-20 overflow-hidden">
        {/* Sand dune background for camel section */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/cinematic/sand-dunes.jpg"
            alt="Desert horizon — the camel's domain"
            fill
            sizes="100vw"
            className="object-cover object-[center_70%] brightness-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#060504] via-black/50 to-[#060504]" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/70" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Left: Camel manifesto */}
          <div className="lg:col-span-7 space-y-7">
            <div className="flex items-center gap-3 text-[10px] sm:text-xs font-mono uppercase tracking-[0.16em] text-[#ffb91d]">
              <span className="w-8 h-[1px] bg-[#ffb91d]" />
              <span>THE CAMEL — A SYMBOL OF STRENGTH</span>
            </div>

            <h2 className="text-xl sm:text-4xl md:text-4xl font-serif font-medium text-white leading-[1.3] sm:leading-snug">
              She carries what others <br />cannot. Without complaint. <br />Without breaking.
            </h2>

            <div className="space-y-3 sm:space-y-4 text-[13px] sm:text-base font-serif text-white/75 leading-[1.7]">
              <p>
                The camel does not rush. She does not beg the sun for mercy. She carries what others cannot — across impossible distances, through impossible heat — and she arrives.
              </p>
              <p>
                She is not delicate. She is not fragile. She is patient, powerful, and perfectly designed for the world she inhabits.
              </p>
              <p className="text-white">
                She is the Oud Nomad woman's oldest companion. Her totem. Her mirror.
              </p>
            </div>

            {/* Seven spirit words — the camel's essence */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-3 pt-2 border-t border-white/10">
              {['Patient', 'Enduring', 'Dignified', 'Resilient', 'Unbothered', 'Powerful', 'Free'].map((word) => (
                <div key={word} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#ffb91d] flex-shrink-0" />
                  <span className="text-xs font-serif text-white/70 tracking-[0.06em]">{word}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Camel image close-up with feathering */}
          <div className="lg:col-span-5 relative">
            <div className="relative w-full aspect-[3/4] overflow-hidden">
              <Image
                src="/cinematic/nomad-camel.jpg"
                alt="The desert camel — a symbol of endurance, dignity and quiet power"
                fill
                sizes="(min-width: 1024px) 500px, 100vw"
                className="object-cover object-[center_30%] brightness-80 hover:scale-105 transition-transform duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060504] via-transparent to-transparent opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#060504]/60" />

              {/* Camel emblem overlay */}
              <div className="absolute bottom-6 right-6 space-y-2 z-10 text-right">
                <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#ffb91d]/80 block">THE TOTEM</span>
                <p className="text-[11px] font-serif text-white/60 italic">
                  Quiet luxury.<br />Immovable grace.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
