'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import SiteHeader from '../components/header/SiteHeader';

/* ─────────────────────────────────────────────────────────────
   QUIZ DATA — DUAL FLOW (Scent-Savvy vs New to Perfume)
───────────────────────────────────────────────────────────── */

// BEGINNER PATH (New to perfume)
const BEGINNER_FEEL_OPTIONS = [
  { id: 'glamour', label: 'To add a touch of glamour to every moment', img: 'https://us.kayali.com/cdn/shop/files/touch-of-glamour.jpg?v=1757411575' },
  { id: 'fresh', label: 'To keep me feeling fresh and energized', img: 'https://us.kayali.com/cdn/shop/files/feeling-freshed-and-energised.jpg?v=1757411575' },
  { id: 'alluring', label: 'To leave a captivating & alluring scent trail', img: 'https://us.kayali.com/cdn/shop/files/attractive-seductive-sensual-stylish-woman-boho-dress-sitting-vintage-retro-cafe-holding-perfume.jpg?v=1757411581' },
  { id: 'confident', label: 'To make me feel confident and empowered', img: 'https://us.kayali.com/cdn/shop/files/confidence.jpg?v=1757411579' },
  { id: 'memories', label: 'To spark sweet memories', img: 'https://us.kayali.com/cdn/shop/files/spark-sweet-memories.jpg?v=1757411583' },
  { id: 'dreamy', label: 'To transport me to a dreamy escape', img: 'https://us.kayali.com/cdn/shop/files/dreamy-escape.jpg?v=1757411576' },
  { id: 'comfort', label: 'To wrap me in comfort and warmth', img: 'https://us.kayali.com/cdn/shop/files/wrap-me-in-comfort.jpg?v=1757411589' },
];

const BEGINNER_MOOD_OPTIONS = [
  { id: 'cozy-night', label: 'A cozy night in', img: 'https://us.kayali.com/cdn/shop/files/a-cozy-night-in.jpg?v=1757411576' },
  { id: 'italy', label: 'A cute gelateria in Italy', img: 'https://us.kayali.com/cdn/shop/files/geletaria-in-italy.jpg?v=1757411576' },
  { id: 'rose-garden', label: 'A stroll through a rose garden', img: 'https://us.kayali.com/cdn/shop/files/stroll-through-a-rose-garden.jpg?v=1757411577' },
  { id: 'fruit', label: 'Biting into a juicy, mouthwatering fruit', img: 'https://us.kayali.com/cdn/shop/files/mouthwatering-fruit.jpg?v=1757411577' },
  { id: 'confidence', label: 'Confidence that can’t be ignored', img: 'https://us.kayali.com/cdn/shop/files/confidence-that-cant-be-ignored.jpg?v=1757411577' },
  { id: 'dancing', label: 'Dancing till dawn with friends', img: 'https://us.kayali.com/cdn/shop/files/dancing-with-friends.jpg?v=1757411577' },
  { id: 'love-letter', label: 'Reading a love letter', img: 'https://us.kayali.com/cdn/shop/files/love-letter.jpg?v=1757411577' },
  { id: 'clean-sheets', label: 'Crisp, clean white sheets', img: 'https://us.kayali.com/cdn/shop/files/crisp-clean-white-sheets.jpg?v=1757411578' },
];

// SAVVY PATH (Scent-savvy connoisseur)
const SAVVY_NOTES_OPTIONS = [
  { id: 'fruity-florals', label: 'Juicy Fruity Florals', img: 'https://us.kayali.com/cdn/shop/files/juicy-fruity-florals.jpg?v=1757411568' },
  { id: 'bright-woody', label: 'Bright & Woody', img: 'https://us.kayali.com/cdn/shop/files/bright-and-woody.jpg?v=1757411579' },
  { id: 'bright-florals', label: 'Bright Florals', img: 'https://us.kayali.com/cdn/shop/files/bright-florals.jpg?v=1757411569' },
  { id: 'classic-woods', label: 'Classic Woods', img: 'https://us.kayali.com/cdn/shop/files/classic-woods.jpg?v=1757411569' },
  { id: 'cozy-woods', label: 'Cozy Woods', img: 'https://us.kayali.com/cdn/shop/files/cozy-woods.jpg?v=1757411569' },
  { id: 'delicate-cozy', label: 'Delicate & Cozy', img: 'https://us.kayali.com/cdn/shop/files/delicate-and-cozy.jpg?v=1757411570' },
  { id: 'timeless-florals', label: 'Elegant & Timeless Florals', img: 'https://us.kayali.com/cdn/shop/files/elegant-and-timeless-florals.jpg?v=1757411569' },
  { id: 'fresh-fruity', label: 'Fresh & Fruity', img: 'https://us.kayali.com/cdn/shop/files/fresh-and-fruity.jpg?v=1757411570' },
  { id: 'soft-powdery', label: 'Soft Powdery Florals', img: 'https://us.kayali.com/cdn/shop/files/soft-powdery-florals.jpg?v=1757411570' },
  { id: 'warm-delicious', label: 'Warm & Delicious', img: 'https://us.kayali.com/cdn/shop/files/warm-and-delicious.jpg?v=1757411571' },
  { id: 'warm-sensual', label: 'Warm & Sensual Florals', img: 'https://us.kayali.com/cdn/shop/files/warm-and-sensual-florals.jpg?v=1757411568' },
  { id: 'woody-spices', label: 'Woody Spices', img: 'https://us.kayali.com/cdn/shop/files/woody-spices.jpg?v=1757411571' },
];

const SAVVY_SCENT_TYPE_OPTIONS = [
  { id: 'blooming-garden', label: 'Blooming Fruit Garden', img: 'https://us.kayali.com/cdn/shop/files/blooming-fruit-garden.jpg?v=1757411572' },
  { id: 'comforting-hug', label: 'A Comforting Hug', img: 'https://us.kayali.com/cdn/shop/files/a-comforting-hug.jpg?v=1757411572' },
  { id: 'autumn-morning', label: 'A Crisp Autumn Morning', img: 'https://us.kayali.com/cdn/shop/files/a-crisp-autumn-morning.jpg?v=1757411572' },
  { id: 'arabian-market', label: 'Arabian Spiced Market', img: 'https://us.kayali.com/cdn/shop/files/arabian-spiced-market.jpg?v=1757411572' },
  { id: 'delicious-sweet', label: 'Delicious & Sweet', img: 'https://us.kayali.com/cdn/shop/files/fresh-donut.jpg?v=1757411580' },
  { id: 'new-city', label: 'Exploring a New City', img: 'https://us.kayali.com/cdn/shop/files/exploring-a-new-city.jpg?v=1757411573' },
  { id: 'fresh-bouquet', label: 'Fresh Bouquet of Flowers', img: 'https://us.kayali.com/cdn/shop/files/fresh-bouquet-of-flowers.jpg?v=1757411574' },
  { id: 'misty-midnight', label: 'Misty Midnight', img: 'https://us.kayali.com/cdn/shop/files/mist-midnight.jpg?v=1757411576' },
  { id: 'radiant-sunset', label: 'Radiant Sunset', img: 'https://us.kayali.com/cdn/shop/files/radiant-sunset.jpg?v=1757411574' },
  { id: 'spiced-woods', label: 'Spiced Woods', img: 'https://us.kayali.com/cdn/shop/files/spiced-woods.jpg?v=1757411574' },
];

// SHARED STEP 3 — FRAGRANCE FAMILY
const GRAVITATE_OPTIONS = [
  { id: 'florals', label: 'Florals', img: 'https://us.kayali.com/cdn/shop/files/pexels-secret-garden-333350-931177_Large_a4d09407-4a97-4a51-ab21-2bb7d04285cc.jpg?v=1757411543' },
  { id: 'spicy', label: 'Warm & Spicy', img: 'https://us.kayali.com/cdn/shop/files/different-spices-background_Large_2c7a5f05-47e5-4ce1-9ff4-7a0aa77300ca.jpg?v=1757411545' },
  { id: 'woody', label: 'Earthy & Woody', img: 'https://us.kayali.com/cdn/shop/files/7_5f53593d-dee2-4c35-978c-5c5259901f44.jpg?v=1757411540' },
  { id: 'fresh', label: 'Fresh', img: 'https://us.kayali.com/cdn/shop/files/front-close-view-green-leaf-with-drops-dark-color-nature-dew-forest-green-air-tree_Large_de632c81-13d4-4422-85e2-8768509b7068.jpg?v=1757411543' },
];

/* ─────────────────────────────────────────────────────────────
   PRODUCT DATA + HIGHLY RELATABLE SCORING
───────────────────────────────────────────────────────────── */
interface Product {
  title: string;
  handle: string;
  collection: string;
  image: string;
  description: string;
  notes: string;
  price: string;
  tags: string[];
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
    price: 'AED 495',
    tags: ['glamour', 'alluring', 'comfort', 'cozy-night', 'love-letter', 'spicy', 'woody', 'warm-sensual', 'woody-spices', 'arabian-market', 'spiced-woods'],
    layersWith: 'Coffee Oud',
  },
  {
    title: 'Coffee Oud',
    handle: 'coffee-oud-100ml',
    collection: 'perfumes',
    image: 'https://cdn.shopify.com/s/files/1/0812/5077/9453/files/CoffeeOud.jpg?v=1770414703',
    description: 'Bold, addictive, irresistibly warm — freshly brewed coffee kissed with spicy cardamom and deep oud wood.',
    notes: 'Coffee · Cardamom · Cinnamon · Caramel · Cedar · Agarwood · Vanilla',
    price: 'AED 495',
    tags: ['glamour', 'confident', 'comfort', 'cozy-night', 'dancing', 'spicy', 'woody', 'warm-delicious', 'bright-woody', 'delicious-sweet', 'comforting-hug'],
    layersWith: 'Dakhoon',
  },
  {
    title: 'The Dark Horse',
    handle: 'the-dark-horse-100ml',
    collection: 'perfumes',
    image: 'https://cdn.shopify.com/s/files/1/0812/5077/9453/files/Dark_Horse.png?v=1770388755',
    description: 'Enigmatic and powerful — bergamot and leather oud with neroli heart and sandalwood depth for those who dare to stand out.',
    notes: 'Lemon · Bergamot · Leather Oud · Neroli · Freesia · Sandalwood · Musk',
    price: 'AED 495',
    tags: ['fresh', 'confident', 'confidence', 'dancing', 'fresh', 'woody', 'bright-woody', 'fresh-fruity', 'new-city', 'radiant-sunset'],
    layersWith: 'Royal Oud',
  },
  {
    title: 'Royal Oud',
    handle: 'royal-oud-attar',
    collection: 'attars',
    image: 'https://cdn.shopify.com/s/files/1/0812/5077/9453/files/Artboard_1_copy_3_3adc834e-2708-444e-a224-0d3149cc0981.png?v=1764672655',
    description: 'Pure wild oud — 48-hour longevity, oil-based luxury. The quintessential Middle Eastern treasure for the true connoisseur.',
    notes: 'Jasmine · Taif Rose · Aged Wild Oud · White Musk · Madagascar Vanilla',
    price: 'AED 495',
    tags: ['alluring', 'memories', 'rose-garden', 'love-letter', 'florals', 'woody', 'timeless-florals', 'classic-woods', 'arabian-market', 'misty-midnight'],
    layersWith: 'Nomad Mist — Bloom',
  },
  {
    title: 'Nomad Mist — Bloom',
    handle: 'mist-bloom',
    collection: 'mists',
    image: 'https://cdn.shopify.com/s/files/1/0812/5077/9453/files/Artboard_1_copy_3_3adc834e-2708-444e-a224-0d3149cc0981.png?v=1764672655',
    description: 'Delicate florals kissed with white musk — a weightless mist for everyday radiance and feminine grace.',
    notes: 'Rose · Peony · White Musk · Light Amber · Bergamot',
    price: 'AED 270',
    tags: ['fresh', 'dreamy', 'memories', 'rose-garden', 'clean-sheets', 'italy', 'florals', 'fresh', 'fruity-florals', 'bright-florals', 'soft-powdery', 'blooming-garden', 'fresh-bouquet'],
    layersWith: 'Royal Oud',
  },
  {
    title: 'Nomad Mist — Velvet Oud',
    handle: 'mist-velvet-oud',
    collection: 'mists',
    image: 'https://cdn.shopify.com/s/files/1/0812/5077/9453/files/Artboard_1_copy_3_3adc834e-2708-444e-a224-0d3149cc0981.png?v=1764672655',
    description: 'Warm oud and amber in a silky mist — everyday oriental luxury, effortlessly wearable from morning to dusk.',
    notes: 'Oud · Amber · Sandalwood · Vanilla · Soft Musk',
    price: 'AED 270',
    tags: ['comfort', 'dreamy', 'glamour', 'cozy-night', 'clean-sheets', 'spicy', 'woody', 'delicate-cozy', 'cozy-woods', 'autumn-morning', 'comforting-hug'],
    layersWith: 'Dakhoon',
  },
];

function scoreQuiz(selectedTags: string[]): Product[] {
  const scored = PRODUCTS.map((p) => {
    let s = 0;
    selectedTags.forEach((t) => {
      if (p.tags.includes(t)) s += 2;
    });
    return { p, s };
  });
  scored.sort((a, b) => b.s - a.s);
  const topScored = scored.filter((x) => x.s > 0);

  // Return at least 1 product, maximum 2 products
  if (topScored.length === 0) {
    return [PRODUCTS[0]];
  }
  if (topScored.length >= 2 && topScored[1].s >= topScored[0].s * 0.5) {
    return [topScored[0].p, topScored[1].p];
  }
  return [topScored[0].p];
}

/* ─────────────────────────────────────────────────────────────
   PAGE COMPONENT
───────────────────────────────────────────────────────────── */
type Screen = 'intro' | 'chat' | 'step1' | 'step2' | 'step3' | 'results';
type QuizMode = 'savvy' | 'beginner';

export default function FragranceFinderPage() {
  const [screen, setScreen] = useState<Screen>('intro');
  const [quizMode, setQuizMode] = useState<QuizMode>('beginner');
  const [step1Sel, setStep1Sel] = useState<string[]>([]);
  const [step2Sel, setStep2Sel] = useState<string[]>([]);
  const [step3Sel, setStep3Sel] = useState<string[]>([]);
  const [results, setResults] = useState<Product[]>([]);
  const [animOut, setAnimOut] = useState(false);

  const STEPS: Screen[] = ['step1', 'step2', 'step3'];
  const stepIdx = STEPS.indexOf(screen);
  const stepNum = stepIdx + 1;
  const totalSteps = 3;
  const progress = stepNum > 0 ? Math.round((stepNum / totalSteps) * 100) : 0;

  function transition(to: Screen) {
    setAnimOut(true);
    setTimeout(() => {
      setScreen(to);
      setAnimOut(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 280);
  }

  function handleSelectMode(mode: QuizMode) {
    setQuizMode(mode);
    setStep1Sel([]);
    setStep2Sel([]);
    setStep3Sel([]);
    transition('step1');
  }

  function toggleSel(id: string, current: string[], setter: (v: string[]) => void, maxLimit = 99) {
    if (current.includes(id)) {
      setter(current.filter((x) => x !== id));
    } else {
      if (current.length >= maxLimit) {
        setter([...current.slice(1), id]);
      } else {
        setter([...current, id]);
      }
    }
  }

  function handleFinish() {
    const allSelected = [...step1Sel, ...step2Sel, ...step3Sel];
    setResults(scoreQuiz(allSelected));
    transition('results');
  }

  function handleRestart() {
    setStep1Sel([]);
    setStep2Sel([]);
    setStep3Sel([]);
    setResults([]);
    transition('intro');
  }

  const isSavvy = quizMode === 'savvy';

  return (
    <div className="min-h-screen bg-[#070707] text-white" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
      <SiteHeader transparentMode={false} />

      {/* ─────────────────────────────────────────────────────────
          SCREEN 1: INTRO (Find Your Signature Scent)
      ───────────────────────────────────────────────────────── */}
      {screen === 'intro' && (
        <div
          style={{ animation: animOut ? 'ffOut 0.28s ease forwards' : 'ffIn 0.5s ease both' }}
          className="relative min-h-[calc(100vh-72px)] flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Subtle gold glow */}
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

          {/* Center Content */}
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

            {/* Begin Quiz button */}
            <button
              id="begin-quiz-btn"
              onClick={() => transition('chat')}
              className="inline-block border border-[#ffb91d] px-10 py-3.5 text-[10px] font-sans uppercase tracking-[0.4em] text-[#ffb91d] hover:bg-[#ffb91d] hover:text-black transition-all duration-300 mb-6"
            >
              Begin Quiz
            </button>
            <p className="text-[9px] font-sans text-white/20 uppercase tracking-[0.3em]">
              3 steps &middot; Personalised curation
            </p>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────
          SCREEN 2: CHAT TRANSITION (Dark shade, Camel Logo & Oud Nomad Signature)
          Messages animate one by one from down to up!
      ───────────────────────────────────────────────────────── */}
      {screen === 'chat' && (
        <div
          style={{ animation: animOut ? 'ffOut 0.28s ease forwards' : 'ffIn 0.35s ease both' }}
          className="relative min-h-[calc(100vh-72px)] flex flex-col items-center justify-center px-4 py-12 sm:py-20"
        >
          {/* Subtle gold glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(255,185,29,0.08)_0%,transparent_60%)]" />
          </div>

          <div className="relative z-10 w-full max-w-[420px] flex flex-col items-center gap-5">
            {/* Transparent Camel Logo Avatar */}
            <div className="chat-avatar-animate relative w-[76px] h-[76px] sm:w-[84px] sm:h-[84px] rounded-full flex items-center justify-center p-2.5 bg-black/50 border border-[#ffb91d]/40 shadow-[0_0_24px_rgba(255,185,29,0.18)] ring-2 ring-[#ffb91d]/20 overflow-hidden">
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src="/camelfinallogo-transparent.png"
                  alt="Oud Nomad Camel Logo"
                  fill
                  className="object-contain"
                  sizes="84px"
                  priority
                />
              </div>
            </div>

            {/* Left-Aligned Chat Messages in Dark Shade Palette */}
            <ul className="w-full flex flex-col items-start gap-4 pl-3">
              {/* Message 1 */}
              <li
                className="chat-msg chat-msg-1 relative bg-[#141414] border border-[#ffb91d]/30 text-white/95 text-[13px] sm:text-[14px] font-sans px-4 py-3 shadow-lg max-w-[310px] leading-snug"
              >
                Hi there
              </li>

              {/* Message 2 */}
              <li
                className="chat-msg chat-msg-2 relative bg-[#141414] border border-[#ffb91d]/30 text-white/95 text-[13px] sm:text-[14px] font-sans px-4 py-3 shadow-lg max-w-[340px] leading-snug"
              >
                We have one question to ask before we begin
              </li>

              {/* Message 3 */}
              <li
                className="chat-msg chat-msg-3 relative bg-[#141414] border border-[#ffb91d]/30 text-white/95 text-[13px] sm:text-[14px] font-sans px-4 py-3 shadow-lg max-w-[320px] leading-snug"
              >
                How fragrance obsessed are you?
              </li>
            </ul>

            {/* "Oud Nomad" Signature in Elegant Script Font */}
            <div className="chat-sig w-full flex justify-end pr-6 -mt-1 mb-2">
              <span className="text-2xl sm:text-[26px] italic font-serif tracking-wider text-[#ffb91d]/90 font-light select-none drop-shadow-[0_2px_8px_rgba(255,185,29,0.25)]">
                Oud Nomad
              </span>
            </div>

            {/* Right-Aligned Answer Trigger Bubbles in Refined Dark Gold Shade */}
            <ul className="chat-answers w-full flex flex-col items-end gap-3 pr-3">
              {/* Option 1: Scent-Savvy */}
              <li className="w-full max-w-[310px]">
                <button
                  type="button"
                  onClick={() => handleSelectMode('savvy')}
                  className="chat-answer-bubble group w-full text-left bg-[#181614] hover:bg-[#ffb91d]/15 border border-[#ffb91d]/35 hover:border-[#ffb91d] text-white/90 p-3.5 sm:p-4 flex items-center justify-between gap-3 text-[12px] sm:text-[13px] font-sans leading-snug transition-all duration-200 shadow-md hover:translate-x-[-2px]"
                >
                  <span>I’m scent-savvy, I know my fragrances and wear them with intention.</span>
                  <svg className="w-4 h-4 shrink-0 text-[#ffb91d] transition-transform duration-200 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </li>

              {/* Option 2: Beginner */}
              <li className="w-full max-w-[310px]">
                <button
                  type="button"
                  onClick={() => handleSelectMode('beginner')}
                  className="chat-answer-bubble group w-full text-left bg-[#181614] hover:bg-[#ffb91d]/15 border border-[#ffb91d]/35 hover:border-[#ffb91d] text-white/90 p-3.5 sm:p-4 flex items-center justify-between gap-3 text-[12px] sm:text-[13px] font-sans leading-snug transition-all duration-200 shadow-md hover:translate-x-[-2px]"
                >
                  <span>I’m new to the perfume game and ready to explore and learn!</span>
                  <svg className="w-4 h-4 shrink-0 text-[#ffb91d] transition-transform duration-200 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </li>
            </ul>

            <div className="pt-4">
              <button
                onClick={() => transition('intro')}
                className="text-[10px] font-sans uppercase tracking-wider text-white/35 hover:text-white transition-colors"
              >
                ← Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────
          SCREEN 3: STEP 1 (Savvy or Beginner)
      ───────────────────────────────────────────────────────── */}
      {screen === 'step1' && (
        <div style={{ animation: animOut ? 'ffOut 0.28s ease forwards' : 'ffIn 0.4s ease both' }} className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <StepHeader
            stepNum={1}
            totalSteps={totalSteps}
            progress={33}
            question={isSavvy ? 'Which fragrance notes always get a yes from you?' : 'How do you want your fragrance to make you feel?'}
            sub="Pick a few that you love"
          />

          {/* Options Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-10">
            {(isSavvy ? SAVVY_NOTES_OPTIONS : BEGINNER_FEEL_OPTIONS).map((opt) => {
              const selected = step1Sel.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  onClick={() => toggleSel(opt.id, step1Sel, setStep1Sel)}
                  className={`group relative overflow-hidden aspect-[3/4] border transition-all duration-300 text-left ${selected ? 'border-[#ffb91d] ring-1 ring-[#ffb91d]' : 'border-white/10 hover:border-[#ffb91d]/40'}`}
                >
                  <Image
                    src={opt.img}
                    alt={opt.label}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width:640px) 50vw,200px"
                  />
                  <div className={`absolute inset-0 transition-all duration-300 ${selected ? 'bg-black/35 ring-inset ring-2 ring-[#ffb91d]' : 'bg-black/45 group-hover:bg-[#ffb91d]/20'}`} />

                  {/* Selected checkmark */}
                  {selected && (
                    <div className="absolute top-2.5 right-2.5 w-5 h-5 bg-[#ffb91d] rounded-full flex items-center justify-center text-black z-10 shadow-sm">
                      <svg className="w-3 h-3 text-black" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 6l3 3 5-5" />
                      </svg>
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/85 to-transparent">
                    <span className="text-[10px] sm:text-xs font-sans uppercase tracking-[0.16em] font-medium text-white group-hover:text-[#ffb91d] transition-colors block leading-tight">
                      {opt.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation Bar */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => transition('chat')}
              className="text-[11px] font-sans uppercase tracking-wider text-white/35 hover:text-white transition-colors"
            >
              ← Back
            </button>
            {step1Sel.length > 0 && (
              <span className="text-[10px] font-sans text-white/30 uppercase tracking-wider">{step1Sel.length} selected</span>
            )}
            <button
              onClick={() => transition('step2')}
              disabled={step1Sel.length === 0}
              className={`px-8 py-3.5 text-[11px] font-sans uppercase tracking-[0.25em] font-semibold transition-all duration-200 ${step1Sel.length > 0 ? 'bg-[#ffb91d] text-black hover:bg-[#e5a61a]' : 'bg-white/8 text-white/25 cursor-not-allowed'}`}
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────
          SCREEN 4: STEP 2 (Mood or Scent Type)
      ───────────────────────────────────────────────────────── */}
      {screen === 'step2' && (
        <div style={{ animation: animOut ? 'ffOut 0.28s ease forwards' : 'ffIn 0.4s ease both' }} className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <StepHeader
            stepNum={2}
            totalSteps={totalSteps}
            progress={66}
            question={isSavvy ? 'What’s your favourite type of scent?' : 'What mood should your perfume radiate?'}
            sub="Pick a few that you love"
          />

          {/* Options Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-10">
            {(isSavvy ? SAVVY_SCENT_TYPE_OPTIONS : BEGINNER_MOOD_OPTIONS).map((opt) => {
              const selected = step2Sel.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  onClick={() => toggleSel(opt.id, step2Sel, setStep2Sel)}
                  className={`group relative overflow-hidden aspect-[3/4] border transition-all duration-300 text-left ${selected ? 'border-[#ffb91d] ring-1 ring-[#ffb91d]' : 'border-white/10 hover:border-[#ffb91d]/40'}`}
                >
                  <Image
                    src={opt.img}
                    alt={opt.label}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width:640px) 50vw,200px"
                  />
                  <div className={`absolute inset-0 transition-all duration-300 ${selected ? 'bg-black/35 ring-inset ring-2 ring-[#ffb91d]' : 'bg-black/45 group-hover:bg-[#ffb91d]/20'}`} />

                  {/* Selected checkmark */}
                  {selected && (
                    <div className="absolute top-2.5 right-2.5 w-5 h-5 bg-[#ffb91d] rounded-full flex items-center justify-center text-black z-10 shadow-sm">
                      <svg className="w-3 h-3 text-black" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 6l3 3 5-5" />
                      </svg>
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/85 to-transparent">
                    <span className="text-[10px] sm:text-xs font-sans uppercase tracking-[0.16em] font-medium text-white group-hover:text-[#ffb91d] transition-colors block leading-tight">
                      {opt.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation Bar */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => transition('step1')}
              className="text-[11px] font-sans uppercase tracking-wider text-white/35 hover:text-white transition-colors"
            >
              ← Back
            </button>
            {step2Sel.length > 0 && (
              <span className="text-[10px] font-sans text-white/30 uppercase tracking-wider">{step2Sel.length} selected</span>
            )}
            <button
              onClick={() => transition('step3')}
              disabled={step2Sel.length === 0}
              className={`px-8 py-3.5 text-[11px] font-sans uppercase tracking-[0.25em] font-semibold transition-all duration-200 ${step2Sel.length > 0 ? 'bg-[#ffb91d] text-black hover:bg-[#e5a61a]' : 'bg-white/8 text-white/25 cursor-not-allowed'}`}
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────
          SCREEN 5: STEP 3 (Fragrance Families)
      ───────────────────────────────────────────────────────── */}
      {screen === 'step3' && (
        <div style={{ animation: animOut ? 'ffOut 0.28s ease forwards' : 'ffIn 0.4s ease both' }} className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <StepHeader
            stepNum={3}
            totalSteps={totalSteps}
            progress={100}
            question="What kind of fragrances do you gravitate towards?"
            sub="Select up to 2 — reveals automatically"
          />

          {/* Options Grid (4 main families with authentic Kayali photography) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
            {GRAVITATE_OPTIONS.map((opt) => {
              const selected = step3Sel.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    const next = selected
                      ? step3Sel.filter((x) => x !== opt.id)
                      : step3Sel.length >= 2 ? [...step3Sel.slice(1), opt.id] : [...step3Sel, opt.id];
                    setStep3Sel(next);
                    if (next.length === 2) {
                      const allSelected = [...step1Sel, ...step2Sel, ...next];
                      setResults(scoreQuiz(allSelected));
                      transition('results');
                    }
                  }}
                  className={`group relative overflow-hidden aspect-[3/4] border transition-all duration-300 text-left ${selected ? 'border-[#ffb91d] ring-1 ring-[#ffb91d]' : 'border-white/10 hover:border-[#ffb91d]/40'}`}
                >
                  <Image
                    src={opt.img}
                    alt={opt.label}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width:640px) 50vw,200px"
                  />
                  <div className={`absolute inset-0 transition-all duration-300 ${selected ? 'bg-black/35 ring-inset ring-2 ring-[#ffb91d]' : 'bg-black/45 group-hover:bg-[#ffb91d]/20'}`} />

                  {/* Selected checkmark */}
                  {selected && (
                    <div className="absolute top-2.5 right-2.5 w-5 h-5 bg-[#ffb91d] rounded-full flex items-center justify-center text-black z-10 shadow-sm">
                      <svg className="w-3 h-3 text-black" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 6l3 3 5-5" />
                      </svg>
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/85 to-transparent">
                    <span className="text-[11px] sm:text-xs font-sans uppercase tracking-[0.16em] font-medium text-white group-hover:text-[#ffb91d] transition-colors block leading-tight">
                      {opt.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation Bar */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => transition('step2')}
              className="text-[11px] font-sans uppercase tracking-wider text-white/35 hover:text-white transition-colors"
            >
              ← Back
            </button>
            {step3Sel.length === 1 && (
              <button
                onClick={handleFinish}
                className="px-8 py-3.5 bg-[#ffb91d] text-black text-[11px] font-sans uppercase tracking-[0.25em] font-semibold hover:bg-[#e5a61a] transition-all duration-200"
              >
                Reveal My Scent →
              </button>
            )}
            {step3Sel.length === 0 && (
              <span className="text-[10px] font-sans text-white/28 uppercase tracking-widest">Select 1 or 2 families</span>
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────
          SCREEN 6: RESULTS (Max 2 relatable products, balanced typography)
      ───────────────────────────────────────────────────────── */}
      {screen === 'results' && results.length > 0 && (
        <div style={{ animation: animOut ? 'ffOut 0.28s ease forwards' : 'ffIn 0.55s ease both' }} className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="text-center mb-8 sm:mb-10 space-y-2">
            <p className="text-[9px] sm:text-[10px] font-sans uppercase tracking-[0.35em] text-[#ffb91d]">
              Your Personal Curation
            </p>
            <h2 className="text-[1.4rem] sm:text-[1.85rem] leading-[1.2] uppercase tracking-[0.05em] text-white">
              Your Signature Scents
            </h2>
            <p className="text-xs sm:text-sm font-sans text-white/45 max-w-md mx-auto leading-relaxed">
              Based on your olfactory choices, our atelier has curated {results.length === 1 ? 'this perfect match' : 'these matching creations'} for you.
            </p>
          </div>

          {/* Product Cards (Max 2 products) */}
          <div className="space-y-4 mb-10">
            {results.map((product, index) => (
              <div
                key={product.handle}
                className={`group relative border overflow-hidden transition-all duration-300 hover:border-[#ffb91d]/50 ${index === 0 ? 'border-[#ffb91d]/60 bg-[#ffb91d]/5' : 'border-white/10 bg-[#0d0d0d]'}`}
              >
                {index === 0 && <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ffb91d]/60 to-transparent" />}
                {index === 0 && (
                  <div className="absolute top-3.5 right-3.5 z-10">
                    <span className="text-[8px] sm:text-[9px] font-sans uppercase tracking-[0.2em] bg-[#ffb91d] text-black font-bold px-2 py-0.5">
                      ★ Top Match
                    </span>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-0">
                  <div className="relative w-full sm:w-36 md:w-40 shrink-0 bg-[#111] overflow-hidden aspect-[4/5] sm:aspect-auto" style={{ minHeight: '160px' }}>
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width:640px) 100vw,160px"
                    />
                  </div>
                  <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between gap-3">
                    <div>
                      <span className="text-[9px] font-sans uppercase tracking-[0.35em] text-[#ffb91d] block mb-1">
                        {product.collection === 'mists' ? 'Hair & Body Mist' : product.collection === 'attars' ? 'Attar Oil' : 'Luxury Perfume'} · {product.price}
                      </span>
                      <h3 className="text-lg sm:text-xl uppercase tracking-wider text-white mb-1.5">{product.title}</h3>
                      <p className="text-xs font-sans text-white/55 leading-relaxed mb-2.5">{product.description}</p>
                      <p className="text-[10px] font-sans text-white/40">
                        <span className="text-[#ffb91d]/70 uppercase tracking-wider text-[9px]">Notes — </span>
                        {product.notes}
                      </p>
                      {product.layersWith && (
                        <p className="text-[10px] font-sans text-white/40 mt-1">
                          <span className="text-[#ffb91d]/70 uppercase tracking-wider text-[9px]">Layers well with — </span>
                          {product.layersWith}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 flex-wrap pt-2">
                      <Link
                        href={`/collections/${product.collection}/products/${product.handle}`}
                        className="px-5 py-2.5 bg-[#ffb91d] text-black text-[10px] font-sans uppercase tracking-[0.2em] font-semibold hover:bg-[#e5a61a] transition-colors"
                      >
                        Shop Now
                      </Link>
                      <Link
                        href={`/collections/${product.collection}`}
                        className="px-5 py-2.5 border border-white/20 text-white text-[10px] font-sans uppercase tracking-[0.2em] hover:border-[#ffb91d]/50 transition-colors"
                      >
                        View Collection
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Layering Section */}
          <div className="border border-[#ffb91d]/20 p-6 sm:p-8 text-center mb-8" style={{ background: 'rgba(255,185,29,0.04)' }}>
            <p className="text-[9px] font-sans uppercase tracking-[0.35em] text-[#ffb91d] mb-1.5">The Art of Layering</p>
            <h4 className="text-lg sm:text-xl uppercase tracking-wider text-white mb-2">Create Your Signature Stack</h4>
            <p className="text-xs font-sans text-white/45 leading-relaxed mb-5 max-w-sm mx-auto">
              Each Oud Nomad creation is crafted to layer harmoniously. Pair your selection to sculpt a unique scent trail.
            </p>
            <div className="flex flex-wrap justify-center gap-2.5">
              <Link href="/collections/all" className="px-5 py-2.5 border border-[#ffb91d]/40 text-[#ffb91d] text-[10px] font-sans uppercase tracking-wider hover:bg-[#ffb91d] hover:text-black transition-all">All Fragrances</Link>
              <Link href="/collections/perfumes" className="px-5 py-2.5 border border-white/15 text-white/60 text-[10px] font-sans uppercase tracking-wider hover:border-[#ffb91d]/40 hover:text-white transition-all">Perfumes</Link>
              <Link href="/collections/mists" className="px-5 py-2.5 border border-white/15 text-white/60 text-[10px] font-sans uppercase tracking-wider hover:border-[#ffb91d]/40 hover:text-white transition-all">Mists</Link>
            </div>
          </div>

          {/* Retake & WhatsApp Concierge */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleRestart}
              className="text-[10px] font-sans uppercase tracking-[0.22em] text-white/35 hover:text-white transition-colors border border-white/10 px-6 py-2.5 hover:border-white/25"
            >
              ← Retake Quiz
            </button>
            <a
              href="https://wa.me/971585719731?text=Hello%2C+I+took+the+Fragrance+Finder+quiz+and+would+love+help+choosing+my+signature+scent."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-2.5 bg-[#25D366] text-white text-[10px] font-sans uppercase tracking-[0.2em] font-semibold hover:bg-[#20bd5a] transition-colors"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12.031 0C5.396 0 .02 5.37.02 12.006c0 2.12.553 4.19 1.604 6.014L0 24l6.143-1.611A11.97 11.97 0 0012.03 24c6.634 0 12.01-5.37 12.01-12.006C24.04 5.37 18.665 0 12.031 0zm6.98 16.945c-.29.815-1.442 1.492-2.38 1.693-.64.137-1.474.246-4.288-.916-3.597-1.487-5.912-5.148-6.091-5.387-.18-.239-1.46-1.944-1.46-3.708 0-1.764.922-2.632 1.25-2.986.327-.354.714-.443.952-.443.238 0 .476.002.684.012.22.01.517-.084.81.619.3.703 1.026 2.508 1.116 2.69.09.18.15.39.03.626-.12.238-.18.388-.358.598-.18.21-.378.47-.54.631-.18.18-.368.376-.158.736.21.36.936 1.545 2.01 2.502 1.382 1.233 2.548 1.616 2.908 1.796.36.18.57.15.78-.09.21-.24.9-1.05 1.14-1.41.24-.36.48-.3.81-.18.33.12 2.096.99 2.456 1.17.36.18.6.27.69.42.09.15.09.87-.2 1.685z" /></svg>
              Chat with Our Concierge
            </a>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────
          STYLES & ANIMATIONS (Dark Shade Speech Bubbles & Staggered Transitions)
      ───────────────────────────────────────────────────────── */}
      <style>{`
        @keyframes ffIn  { from { opacity:0; transform:translateY(14px) } to { opacity:1; transform:translateY(0) } }
        @keyframes ffOut { from { opacity:1; transform:translateY(0) }  to { opacity:0; transform:translateY(-10px) } }
        @keyframes floatA { 0%,100% { transform:translateY(0) rotate(-1deg) } 50% { transform:translateY(-18px) rotate(1deg) } }
        @keyframes floatB { 0%,100% { transform:translateY(0) rotate(1.5deg) } 50% { transform:translateY(-12px) rotate(-1deg) } }

        /* Staggered Slide-Up from Down to Up */
        @keyframes slideUpMsg {
          0% {
            opacity: 0;
            transform: translateY(45px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .chat-avatar-animate {
          animation: slideUpMsg 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
        }

        .chat-msg-1 {
          animation: slideUpMsg 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both;
        }

        .chat-msg-2 {
          animation: slideUpMsg 0.85s cubic-bezier(0.16, 1, 0.3, 1) 1.2s both;
        }

        .chat-msg-3 {
          animation: slideUpMsg 0.85s cubic-bezier(0.16, 1, 0.3, 1) 1.9s both;
        }

        .chat-sig {
          animation: slideUpMsg 0.85s cubic-bezier(0.16, 1, 0.3, 1) 2.5s both;
        }

        .chat-answers {
          animation: slideUpMsg 0.85s cubic-bezier(0.16, 1, 0.3, 1) 3.1s both;
        }

        /* Speech bubble left tail (Dark message boxes) */
        .chat-msg:before {
          content: "";
          position: absolute;
          top: 0;
          right: 100%;
          width: 0;
          height: 0;
          border-top: 0 solid transparent;
          border-bottom: 10px solid transparent;
          border-right: 10px solid #141414;
          z-index: 2;
        }

        .chat-msg:after {
          content: "";
          position: absolute;
          top: -1px;
          right: calc(100% + 1px);
          width: 0;
          height: 0;
          border-top: 0 solid transparent;
          border-bottom: 11px solid transparent;
          border-right: 11px solid rgba(255, 185, 29, 0.35);
          z-index: 1;
        }

        /* Speech bubble right tail (Dark answer boxes) */
        .chat-answer-bubble {
          position: relative;
        }

        .chat-answer-bubble:after {
          content: "";
          position: absolute;
          top: -1px;
          left: 100%;
          width: 0;
          height: 0;
          border-top: 11px solid #181614;
          border-right: 11px solid transparent;
          border-bottom: 0 solid transparent;
          border-left: 0 solid transparent;
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SUB-COMPONENTS (Balanced StepHeader matching Begin Quiz scale)
───────────────────────────────────────────────────────────── */
function StepHeader({
  stepNum,
  totalSteps,
  progress,
  question,
  sub,
}: {
  stepNum: number;
  totalSteps: number;
  progress: number;
  question: string;
  sub: string;
}) {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[9px] sm:text-[10px] font-sans uppercase tracking-[0.3em] text-white/35">Step {stepNum} of {totalSteps}</span>
        <span className="text-[9px] sm:text-[10px] font-sans uppercase tracking-[0.25em] text-[#ffb91d]">{progress}% Complete</span>
      </div>
      <div className="h-px bg-white/10 overflow-hidden mb-5">
        <div className="h-full bg-[#ffb91d] transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
      </div>
      <div className="text-center space-y-1.5">
        <h2 className="text-lg sm:text-[1.4rem] leading-snug uppercase tracking-[0.05em] text-white max-w-2xl mx-auto">{question}</h2>
        <p className="text-[10px] sm:text-[11px] font-sans text-white/35 uppercase tracking-[0.25em]">{sub}</p>
      </div>
    </div>
  );
}
