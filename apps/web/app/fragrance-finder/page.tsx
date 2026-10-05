'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import SiteHeader from '../components/header/SiteHeader';

/* ─────────────────────────────────────────────────────────────
   QUIZ DATA  (mirrors Kayali 3-step structure)
───────────────────────────────────────────────────────────── */

// Step 1 — how you want to feel  (image tiles, multi-select)
const FEEL_OPTIONS = [
  { id: 'glamorous', label: 'Glamorous', img: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&q=80' },
  { id: 'fresh', label: 'Fresh & Energised', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80' },
  { id: 'captivating', label: 'Captivating', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80' },
  { id: 'confident', label: 'Confident', img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80' },
  { id: 'nostalgic', label: 'Nostalgic', img: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=400&q=80' },
  { id: 'dreamy', label: 'Dreamy', img: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&q=80' },
  { id: 'comfort', label: 'Comfort', img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80' },
];

// Step 2 — what mood/scene  (scroll grid, multi-select)
const MOOD_OPTIONS = [
  { id: 'cozy-night', label: 'Cozy night in', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80' },
  { id: 'italy', label: 'Wandering Italy', img: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=300&q=80' },
  { id: 'rose-garden', label: 'Rose garden', img: 'https://images.unsplash.com/photo-1490750967868-88df5691cc9a?w=300&q=80' },
  { id: 'fruit', label: 'Fresh fruit market', img: 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=300&q=80' },
  { id: 'confidence', label: 'Walking with purpose', img: 'https://images.unsplash.com/photo-1529903384028-929ae5dccdf1?w=300&q=80' },
  { id: 'dancing', label: 'Dancing all night', img: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&q=80' },
  { id: 'love-letter', label: 'A love letter', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&q=80' },
  { id: 'crisp-sheets', label: 'Crisp white sheets', img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300&q=80' },
  { id: 'souk', label: 'Spice souk', img: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=300&q=80' },
  { id: 'desert-sunset', label: 'Desert sunset', img: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=300&q=80' },
  { id: 'ocean', label: 'Ocean breeze', img: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=300&q=80' },
  { id: 'hammam', label: 'Hammam ritual', img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=300&q=80' },
];

// Step 3 — fragrance family  (up to 2, grid)
const FAMILY_OPTIONS = [
  { id: 'oud', label: 'Oud & Woody', desc: 'Deep, resinous, earthy', emoji: '🌲' },
  { id: 'floral', label: 'Floral & Rose', desc: 'Romantic, delicate, soft', emoji: '🌹' },
  { id: 'oriental', label: 'Amber & Oriental', desc: 'Warm, sensual, rich', emoji: '🏺' },
  { id: 'coffee', label: 'Coffee & Spice', desc: 'Bold, addictive, smoky', emoji: '☕' },
  { id: 'fresh', label: 'Fresh & Aquatic', desc: 'Clean, light, airy', emoji: '💧' },
  { id: 'musky', label: 'Musk & Skin', desc: 'Intimate, powdery, soft', emoji: '🌫️' },
];

/* ─────────────────────────────────────────────────────────────
   PRODUCT DATA + SCORING
───────────────────────────────────────────────────────────── */
interface Product {
  title: string;
  handle: string;
  collection: string;
  image: string;
  description: string;
  notes: string;
  feel: string[];
  mood: string[];
  family: string[];
  price: string;
  layersWith?: string;
}

const PRODUCTS: Product[] = [
  {
    title: 'Dakhoon',
    handle: 'dakhoon-100ml',
    collection: 'perfumes',
    image: 'https://cdn.shopify.com/s/files/1/0812/5077/9453/files/Dakhoon.jpg?v=1770415101',
    description: 'An opulent fusion of agarwood, rose, saffron and amber — a smoky oriental masterpiece born in the heart of the Middle East.',
    notes: 'Agarwood · Rose · Vanilla · Saffron · Frankincense · Amber',
    feel: ['glamorous', 'captivating', 'confident'],
    mood: ['cozy-night', 'souk', 'desert-sunset', 'hammam'],
    family: ['oud', 'oriental'],
    price: 'AED 495',
    layersWith: 'Coffee Oud',
  },
  {
    title: 'Coffee Oud',
    handle: 'coffee-oud-100ml',
    collection: 'perfumes',
    image: 'https://cdn.shopify.com/s/files/1/0812/5077/9453/files/CoffeeOud.jpg?v=1770414703',
    description: 'Bold, addictive, irresistibly warm — freshly brewed coffee kissed with spicy cardamom and deep oud wood.',
    notes: 'Coffee · Cardamom · Cinnamon · Caramel · Cedar · Agarwood · Vanilla',
    feel: ['confident', 'captivating', 'glamorous'],
    mood: ['cozy-night', 'confidence', 'dancing'],
    family: ['coffee', 'oud', 'oriental'],
    price: 'AED 495',
    layersWith: 'Dakhoon',
  },
  {
    title: 'The Dark Horse',
    handle: 'the-dark-horse-100ml',
    collection: 'perfumes',
    image: 'https://cdn.shopify.com/s/files/1/0812/5077/9453/files/Dark_Horse.png?v=1770388755',
    description: 'Enigmatic and powerful — bergamot and leather oud with neroli heart and sandalwood depth for those who dare to stand out.',
    notes: 'Lemon · Bergamot · Leather Oud · Neroli · Freesia · Sandalwood · Musk',
    feel: ['confident', 'fresh', 'captivating'],
    mood: ['confidence', 'dancing', 'italy'],
    family: ['oud', 'oriental', 'fresh'],
    price: 'AED 495',
    layersWith: 'Royal Oud',
  },
  {
    title: 'Royal Oud',
    handle: 'royal-oud-attar',
    collection: 'attars',
    image: 'https://cdn.shopify.com/s/files/1/0812/5077/9453/files/Artboard_1_copy_3_3adc834e-2708-444e-a224-0d3149cc0981.png?v=1764672655',
    description: 'Pure wild oud — 48-hour longevity, oil-based luxury. The quintessential Middle Eastern treasure for the true connoisseur.',
    notes: 'Jasmine · Taif Rose · Aged Wild Oud · White Musk · Madagascar Vanilla',
    feel: ['nostalgic', 'captivating', 'comfort'],
    mood: ['love-letter', 'souk', 'hammam', 'desert-sunset'],
    family: ['oud', 'floral'],
    price: 'AED 495',
    layersWith: 'Nomad Mist — Bloom',
  },
  {
    title: 'Nomad Mist — Bloom',
    handle: 'mist-bloom',
    collection: 'mists',
    image: 'https://cdn.shopify.com/s/files/1/0812/5077/9453/files/Artboard_1_copy_3_3adc834e-2708-444e-a224-0d3149cc0981.png?v=1764672655',
    description: 'Delicate florals kissed with white musk — a weightless mist for everyday radiance and feminine grace.',
    notes: 'Rose · Peony · White Musk · Light Amber · Bergamot',
    feel: ['dreamy', 'fresh', 'nostalgic'],
    mood: ['rose-garden', 'crisp-sheets', 'ocean'],
    family: ['floral', 'musky', 'fresh'],
    price: 'AED 270',
    layersWith: 'Royal Oud',
  },
  {
    title: 'Nomad Mist — Velvet Oud',
    handle: 'mist-velvet-oud',
    collection: 'mists',
    image: 'https://cdn.shopify.com/s/files/1/0812/5077/9453/files/Artboard_1_copy_3_3adc834e-2708-444e-a224-0d3149cc0981.png?v=1764672655',
    description: 'Warm oud and amber in a silky mist — everyday oriental luxury, effortlessly wearable from morning to dusk.',
    notes: 'Oud · Amber · Sandalwood · Vanilla · Soft Musk',
    feel: ['comfort', 'dreamy', 'glamorous'],
    mood: ['crisp-sheets', 'hammam', 'cozy-night'],
    family: ['oud', 'musky', 'oriental'],
    price: 'AED 270',
    layersWith: 'Dakhoon',
  },
];

function scoreProducts(feel: string[], mood: string[], family: string[]): Product[] {
  const scored = PRODUCTS.map((p) => {
    let s = 0;
    feel.forEach((f) => { if (p.feel.includes(f)) s += 2; });
    mood.forEach((m) => { if (p.mood.includes(m)) s += 2; });
    family.forEach((f) => { if (p.family.includes(f)) s += 3; });
    return { p, s };
  });
  scored.sort((a, b) => b.s - a.s);
  const top = scored.filter((x) => x.s > 0).slice(0, 3);
  return top.length ? top.map((x) => x.p) : [PRODUCTS[0], PRODUCTS[1], PRODUCTS[4]];
}

/* ─────────────────────────────────────────────────────────────
   PAGE COMPONENT
───────────────────────────────────────────────────────────── */
type Screen = 'intro' | 'step1' | 'step2' | 'step3' | 'results';

export default function FragranceFinderPage() {
  const [screen, setScreen] = useState<Screen>('intro');
  const [feelSel, setFeelSel] = useState<string[]>([]);
  const [moodSel, setMoodSel] = useState<string[]>([]);
  const [familySel, setFamilySel] = useState<string[]>([]);
  const [results, setResults] = useState<Product[]>([]);
  const [animOut, setAnimOut] = useState(false);

  const STEPS: Screen[] = ['step1', 'step2', 'step3'];
  const stepIdx = STEPS.indexOf(screen);
  const stepNum = stepIdx + 1;
  const totalSteps = 3;
  const progress = stepNum > 0 ? Math.round((stepNum / totalSteps) * 100) : 0;

  function transition(to: Screen) {
    setAnimOut(true);
    setTimeout(() => { setScreen(to); setAnimOut(false); }, 280);
  }

  function toggleFeel(id: string) {
    setFeelSel((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  }
  function toggleMood(id: string) {
    setMoodSel((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  }
  function toggleFamily(id: string) {
    setFamilySel((p) =>
      p.includes(id) ? p.filter((x) => x !== id) :
        p.length >= 2 ? [...p.slice(1), id] : [...p, id]
    );
  }

  function handleReveal() {
    setResults(scoreProducts(feelSel, moodSel, familySel));
    transition('results');
  }
  function handleRestart() {
    setFeelSel([]); setMoodSel([]); setFamilySel([]);
    setResults([]);
    transition('intro');
  }

  const checkIcon = (
    <svg className="w-3 h-3 text-black" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 6l3 3 5-5" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-[#070707] text-white" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
      <SiteHeader transparentMode={false} />

      {/* ── INTRO ── */}
      {screen === 'intro' && (
        <div
          style={{ animation: animOut ? 'ffOut 0.28s ease forwards' : 'ffIn 0.5s ease both' }}
          className="relative min-h-[calc(100vh-72px)] flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Background glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(255,185,29,0.11)_0%,transparent_60%)]" />
          </div>

          {/* Floating bottle images — left */}
          <div className="absolute left-0 top-0 bottom-0 w-[22%] hidden lg:flex flex-col items-start justify-center gap-10 pl-8 pointer-events-none">
            <div style={{ animation: 'floatA 6s ease-in-out infinite' }} className="relative w-32 h-52 opacity-55">
              <Image src="https://cdn.shopify.com/s/files/1/0812/5077/9453/files/Dakhoon.jpg?v=1770415101" alt="Dakhoon" fill className="object-cover rounded-sm" sizes="128px" />
            </div>
            <div style={{ animation: 'floatB 7.5s ease-in-out infinite' }} className="relative w-24 h-40 opacity-35 ml-10">
              <Image src="https://cdn.shopify.com/s/files/1/0812/5077/9453/files/CoffeeOud.jpg?v=1770414703" alt="Coffee Oud" fill className="object-cover rounded-sm" sizes="96px" />
            </div>
          </div>

          {/* Floating bottle images — right */}
          <div className="absolute right-0 top-0 bottom-0 w-[22%] hidden lg:flex flex-col items-end justify-center gap-10 pr-8 pointer-events-none">
            <div style={{ animation: 'floatB 5.5s ease-in-out infinite' }} className="relative w-28 h-44 opacity-50">
              <Image src="https://cdn.shopify.com/s/files/1/0812/5077/9453/files/Dark_Horse.png?v=1770388755" alt="The Dark Horse" fill className="object-cover rounded-sm" sizes="112px" />
            </div>
            <div style={{ animation: 'floatA 8s ease-in-out infinite' }} className="relative w-20 h-36 opacity-30 mr-8">
              <Image src="https://cdn.shopify.com/s/files/1/0812/5077/9453/files/Artboard_1_copy_3_3adc834e-2708-444e-a224-0d3149cc0981.png?v=1764672655" alt="Royal Oud" fill className="object-cover rounded-sm" sizes="80px" />
            </div>
          </div>

          {/* Center */}
          <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
            <p className="text-[9px] sm:text-[10px] font-sans uppercase tracking-[0.35em] text-[#ffb91d] mb-4 whitespace-nowrap">
              Oud Nomad &middot; Fragrance Finder
            </p>
            <h1 className="text-[1.4rem] sm:text-[2rem] leading-[1.1] uppercase tracking-[0.05em] text-white mb-4">
              Find Your Signature Scent
            </h1>
            <p className="text-xs sm:text-sm text-white/45 leading-relaxed mb-8 max-w-xs sm:max-w-md mx-auto font-sans">
              Answer three questions and discover your perfect Oud Nomad fragrance.
            </p>

            {/* Single Begin Quiz button */}
            <button
              onClick={() => transition('step1')}
              className="inline-block border border-[#ffb91d] px-10 py-3.5 text-[10px] font-sans uppercase tracking-[0.4em] text-[#ffb91d] hover:bg-[#ffb91d] hover:text-black transition-all duration-300 mb-6"
            >
              Begin Quiz
            </button>
            <p className="text-[9px] font-sans text-white/20 uppercase tracking-[0.3em]">3 steps &middot; Personalised curation</p>
          </div>
        </div>
      )}

      {/* ── STEP 1: HOW DO YOU WANT TO FEEL ── */}
      {screen === 'step1' && (
        <div style={{ animation: animOut ? 'ffOut 0.28s ease forwards' : 'ffIn 0.4s ease both' }} className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <StepHeader stepNum={1} totalSteps={totalSteps} progress={33} question="How do you want your fragrance to make you feel?" sub="Tap one to continue" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-10">
            {FEEL_OPTIONS.map((opt) => {
              const sel = feelSel.includes(opt.id);
              return (
                <button key={opt.id} onClick={() => { setFeelSel([opt.id]); transition('step2'); }}
                  className={`group relative overflow-hidden aspect-[3/4] border transition-all duration-300 ${sel ? 'border-[#ffb91d]' : 'border-white/10 hover:border-[#ffb91d]/40'}`}
                >
                  <Image src={opt.img} alt={opt.label} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width:640px) 50vw,200px" />
                  <div className="absolute inset-0 bg-black/45 group-hover:bg-[#ffb91d]/25 transition-all duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/85 to-transparent">
                    <span className="text-[10px] sm:text-xs font-sans uppercase tracking-[0.18em] font-medium text-white group-hover:text-[#ffb91d] transition-colors">{opt.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
          <button onClick={() => transition('intro')} className="text-[11px] font-sans uppercase tracking-wider text-white/35 hover:text-white transition-colors">← Back</button>
        </div>
      )}

      {/* ── STEP 2: WHAT MOOD / SCENE ── */}
      {screen === 'step2' && (
        <div style={{ animation: animOut ? 'ffOut 0.28s ease forwards' : 'ffIn 0.4s ease both' }} className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <StepHeader stepNum={2} totalSteps={totalSteps} progress={66} question="What mood should your perfume radiate?" sub="Tap one to continue" />
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 mb-10">
            {MOOD_OPTIONS.map((opt) => {
              const sel = moodSel.includes(opt.id);
              return (
                <button key={opt.id} onClick={() => { setMoodSel([opt.id]); transition('step3'); }}
                  className={`group relative overflow-hidden aspect-square border transition-all duration-300 ${sel ? 'border-[#ffb91d]' : 'border-white/10 hover:border-[#ffb91d]/40'}`}
                >
                  <Image src={opt.img} alt={opt.label} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width:640px) 33vw,180px" />
                  <div className="absolute inset-0 bg-black/48 group-hover:bg-[#ffb91d]/22 transition-all duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/85 to-transparent">
                    <span className="text-[9px] sm:text-[10px] font-sans uppercase tracking-[0.12em] leading-tight block text-white group-hover:text-[#ffb91d] transition-colors">{opt.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
          <button onClick={() => transition('step1')} className="text-[11px] font-sans uppercase tracking-wider text-white/35 hover:text-white transition-colors">← Back</button>
        </div>
      )}

      {/* ── STEP 3: FRAGRANCE FAMILY (up to 2, auto-reveals at 2) ── */}
      {screen === 'step3' && (
        <div style={{ animation: animOut ? 'ffOut 0.28s ease forwards' : 'ffIn 0.4s ease both' }} className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <StepHeader stepNum={3} totalSteps={totalSteps} progress={100} question="What kind of fragrances do you gravitate towards?" sub="Select up to 2 — reveals automatically" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
            {FAMILY_OPTIONS.map((opt) => {
              const sel = familySel.includes(opt.id);
              return (
                <button key={opt.id} onClick={() => {
                  const next = sel
                    ? familySel.filter((x) => x !== opt.id)
                    : familySel.length >= 2 ? [...familySel.slice(1), opt.id] : [...familySel, opt.id];
                  setFamilySel(next);
                  if (next.length === 2) {
                    setResults(scoreProducts(feelSel, moodSel, next));
                    transition('results');
                  }
                }}
                  className={`group relative flex flex-col items-center justify-center gap-3 p-6 border transition-all duration-300 text-center ${sel ? 'border-[#ffb91d] bg-[#ffb91d]/8' : 'border-white/10 bg-[#0d0d0d] hover:border-[#ffb91d]/40 hover:bg-white/5'}`}
                >
                  {sel && <div className="absolute top-2.5 right-2.5 w-5 h-5 bg-[#ffb91d] rounded-full flex items-center justify-center">{checkIcon}</div>}
                  <span className="text-3xl">{opt.emoji}</span>
                  <div>
                    <span className={`text-[11px] font-sans uppercase tracking-[0.2em] font-medium block transition-colors ${sel ? 'text-[#ffb91d]' : 'text-white/90 group-hover:text-white'}`}>{opt.label}</span>
                    <span className="text-[10px] font-sans text-white/35 mt-0.5 block">{opt.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between gap-4">
            <button onClick={() => transition('step2')} className="text-[11px] font-sans uppercase tracking-wider text-white/35 hover:text-white transition-colors">← Back</button>
            {familySel.length === 1 && (
              <button onClick={handleReveal} className="px-8 py-3.5 bg-[#ffb91d] text-black text-[11px] font-sans uppercase tracking-[0.25em] font-semibold hover:bg-[#e5a61a] transition-all duration-200">
                Reveal My Scent →
              </button>
            )}
            {familySel.length === 0 && (
              <span className="text-[10px] font-sans text-white/28 uppercase tracking-widest">Select 1 or 2 families</span>
            )}
          </div>
        </div>
      )}

      {/* ── RESULTS ── */}
      {screen === 'results' && results.length > 0 && (
        <div style={{ animation: animOut ? 'ffOut 0.28s ease forwards' : 'ffIn 0.55s ease both' }} className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="text-center mb-12 space-y-3">
            <p className="text-[10px] font-sans uppercase tracking-[0.45em] text-[#ffb91d]">Your Results</p>
            <h2 className="text-3xl sm:text-5xl uppercase tracking-[0.06em] text-white">Your Signature Scents</h2>
            <p className="text-sm font-sans text-white/50 max-w-md mx-auto leading-relaxed">
              Based on your olfactory profile, our concierge has curated these exceptional Oud Nomad creations for you.
            </p>
          </div>

          <div className="space-y-5 mb-12">
            {results.map((product, index) => (
              <div key={product.handle}
                className={`group relative border overflow-hidden transition-all duration-300 hover:border-[#ffb91d]/50 ${index === 0 ? 'border-[#ffb91d]/60 bg-[#ffb91d]/5' : 'border-white/10 bg-[#0d0d0d]'}`}
              >
                {index === 0 && <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ffb91d]/60 to-transparent" />}
                {index === 0 && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="text-[9px] font-sans uppercase tracking-[0.25em] bg-[#ffb91d] text-black font-bold px-2.5 py-1">★ Top Match</span>
                  </div>
                )}
                <div className="flex gap-0">
                  <div className="relative w-28 sm:w-40 shrink-0 bg-[#111] overflow-hidden" style={{ minHeight: '160px' }}>
                    <Image src={product.image} alt={product.title} fill className="object-cover object-center group-hover:scale-105 transition-transform duration-500" sizes="(max-width:640px) 112px,160px" />
                  </div>
                  <div className="flex-1 p-5 sm:p-7 flex flex-col justify-between gap-4">
                    <div>
                      <span className="text-[9px] font-sans uppercase tracking-[0.4em] text-[#ffb91d] block mb-1">
                        {product.collection === 'mists' ? 'Hair & Body Mist' : product.collection === 'attars' ? 'Attar Oil' : 'Luxury Perfume'} · {product.price}
                      </span>
                      <h3 className="text-xl sm:text-2xl uppercase tracking-wider text-white mb-2">{product.title}</h3>
                      <p className="text-xs font-sans text-white/55 leading-relaxed mb-3">{product.description}</p>
                      <p className="text-[10px] font-sans text-white/35">
                        <span className="text-[#ffb91d]/50 uppercase tracking-wider text-[9px]">Notes — </span>
                        {product.notes}
                      </p>
                      {product.layersWith && (
                        <p className="text-[10px] font-sans text-white/35 mt-1">
                          <span className="text-[#ffb91d]/50 uppercase tracking-wider text-[9px]">Layers well with — </span>
                          {product.layersWith}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <Link href={`/collections/${product.collection}/products/${product.handle}`} className="px-5 py-2.5 bg-[#ffb91d] text-black text-[10px] font-sans uppercase tracking-[0.2em] font-semibold hover:bg-[#e5a61a] transition-colors">Shop Now</Link>
                      <Link href={`/collections/${product.collection}`} className="px-5 py-2.5 border border-white/20 text-white text-[10px] font-sans uppercase tracking-[0.2em] hover:border-[#ffb91d]/50 transition-colors">View Collection</Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Layering CTA */}
          <div className="border border-[#ffb91d]/20 p-7 sm:p-9 text-center mb-8" style={{ background: 'rgba(255,185,29,0.04)' }}>
            <p className="text-[10px] font-sans uppercase tracking-[0.4em] text-[#ffb91d] mb-2">The Art of Layering</p>
            <h4 className="text-xl uppercase tracking-wider text-white mb-3">Create Your Signature Stack</h4>
            <p className="text-xs font-sans text-white/50 leading-relaxed mb-6 max-w-sm mx-auto">
              Each Oud Nomad fragrance is crafted to layer beautifully. Your top match pairs exquisitely with its companion — shop both to create a scent entirely yours.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/collections/all" className="px-6 py-3 border border-[#ffb91d]/40 text-[#ffb91d] text-[11px] font-sans uppercase tracking-wider hover:bg-[#ffb91d] hover:text-black transition-all duration-200">All Fragrances</Link>
              <Link href="/collections/perfumes" className="px-6 py-3 border border-white/15 text-white/60 text-[11px] font-sans uppercase tracking-wider hover:border-[#ffb91d]/40 hover:text-white transition-all duration-200">Perfumes</Link>
              <Link href="/collections/mists" className="px-6 py-3 border border-white/15 text-white/60 text-[11px] font-sans uppercase tracking-wider hover:border-[#ffb91d]/40 hover:text-white transition-all duration-200">Mists</Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={handleRestart} className="text-[11px] font-sans uppercase tracking-[0.22em] text-white/35 hover:text-white transition-colors border border-white/10 px-6 py-3 hover:border-white/25">
              ← Retake Quiz
            </button>
            <a
              href="https://wa.me/971585719731?text=Hello%2C+I+took+the+Fragrance+Finder+quiz+and+would+love+help+choosing+my+signature+scent."
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white text-[11px] font-sans uppercase tracking-[0.2em] font-semibold hover:bg-[#20bd5a] transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.031 0C5.396 0 .02 5.37.02 12.006c0 2.12.553 4.19 1.604 6.014L0 24l6.143-1.611A11.97 11.97 0 0012.03 24c6.634 0 12.01-5.37 12.01-12.006C24.04 5.37 18.665 0 12.031 0zm6.98 16.945c-.29.815-1.442 1.492-2.38 1.693-.64.137-1.474.246-4.288-.916-3.597-1.487-5.912-5.148-6.091-5.387-.18-.239-1.46-1.944-1.46-3.708 0-1.764.922-2.632 1.25-2.986.327-.354.714-.443.952-.443.238 0 .476.002.684.012.22.01.517-.084.81.619.3.703 1.026 2.508 1.116 2.69.09.18.15.39.03.626-.12.238-.18.388-.358.598-.18.21-.378.47-.54.631-.18.18-.368.376-.158.736.21.36.936 1.545 2.01 2.502 1.382 1.233 2.548 1.616 2.908 1.796.36.18.57.15.78-.09.21-.24.9-1.05 1.14-1.41.24-.36.48-.3.81-.18.33.12 2.096.99 2.456 1.17.36.18.6.27.69.42.09.15.09.87-.2 1.685z" /></svg>
              Chat with Our Concierge
            </a>
          </div>
        </div>
      )}

      <style>{`
        @keyframes ffIn  { from { opacity:0; transform:translateY(14px) } to { opacity:1; transform:translateY(0) } }
        @keyframes ffOut { from { opacity:1; transform:translateY(0) }  to { opacity:0; transform:translateY(-10px) } }
        @keyframes floatA { 0%,100% { transform:translateY(0) rotate(-1deg) } 50% { transform:translateY(-18px) rotate(1deg) } }
        @keyframes floatB { 0%,100% { transform:translateY(0) rotate(1.5deg) } 50% { transform:translateY(-12px) rotate(-1deg) } }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────────────────────── */
function StepHeader({ stepNum, totalSteps, progress, question, sub }: {
  stepNum: number; totalSteps: number; progress: number; question: string; sub: string;
}) {
  return (
    <div className="mb-8 sm:mb-10">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-sans uppercase tracking-[0.35em] text-white/35">Step {stepNum} of {totalSteps}</span>
        <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-[#ffb91d]">{progress}% Complete</span>
      </div>
      <div className="h-px bg-white/10 overflow-hidden mb-7">
        <div className="h-full bg-[#ffb91d] transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-xl sm:text-3xl uppercase tracking-[0.05em] text-white">{question}</h2>
        <p className="text-[11px] font-sans text-white/35 uppercase tracking-[0.3em]">{sub}</p>
      </div>
    </div>
  );
}

function StepNav({ onBack, onNext, nextLabel, canNext, selCount }: {
  onBack: () => void; onNext: () => void; nextLabel: string; canNext: boolean; selCount: number;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <button onClick={onBack} className="text-[11px] font-sans uppercase tracking-wider text-white/35 hover:text-white transition-colors">
        ← Back
      </button>
      {selCount > 0 && (
        <span className="text-[10px] font-sans text-white/28 uppercase tracking-wider">{selCount} selected</span>
      )}
      <button onClick={onNext} disabled={!canNext}
        className={`px-8 py-3.5 text-[11px] font-sans uppercase tracking-[0.25em] font-semibold transition-all duration-200 ${canNext ? 'bg-[#ffb91d] text-black hover:bg-[#e5a61a]' : 'bg-white/8 text-white/25 cursor-not-allowed'}`}
      >
        {nextLabel}
      </button>
    </div>
  );
}
