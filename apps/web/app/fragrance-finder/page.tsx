'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import SiteHeader from '../components/header/SiteHeader';

const QUIZ_STEPS = [
  {
    id: 'gender',
    question: 'Who are you shopping for?',
    subtitle: 'Choose your primary preference',
    options: [
      { id: 'myself-woman', label: 'Myself — Woman', emoji: '👩' },
      { id: 'myself-man', label: 'Myself — Man', emoji: '👨' },
      { id: 'myself-unisex', label: 'Myself — Any', emoji: '🌟' },
      { id: 'gift', label: 'A Gift', emoji: '🎁' },
    ],
  },
  {
    id: 'mood',
    question: 'What mood are you seeking?',
    subtitle: 'Pick the feeling you want to carry with you',
    options: [
      { id: 'sensual', label: 'Sensual & Intimate', emoji: '🔥' },
      { id: 'fresh', label: 'Fresh & Clean', emoji: '🌿' },
      { id: 'bold', label: 'Bold & Powerful', emoji: '⚡' },
      { id: 'romantic', label: 'Romantic & Dreamy', emoji: '🌹' },
    ],
  },
  {
    id: 'occasion',
    question: 'When will you wear this fragrance?',
    subtitle: 'Select your primary occasion',
    options: [
      { id: 'evening', label: 'Evening & Night Out', emoji: '🌙' },
      { id: 'daily', label: 'Daily Wear', emoji: '☀️' },
      { id: 'office', label: 'Work & Business', emoji: '💼' },
      { id: 'special', label: 'Special Occasions', emoji: '✨' },
    ],
  },
  {
    id: 'notes',
    question: 'Which note family calls to you?',
    subtitle: 'Choose the scent family that most appeals to you',
    options: [
      { id: 'oud-woody', label: 'Oud & Woody', emoji: '🌲' },
      { id: 'floral-rose', label: 'Floral & Rose', emoji: '🌸' },
      { id: 'amber-oriental', label: 'Amber & Oriental', emoji: '🏺' },
      { id: 'coffee-spice', label: 'Coffee & Spice', emoji: '☕' },
    ],
  },
  {
    id: 'intensity',
    question: 'How intense do you want your sillage?',
    subtitle: 'Your preferred projection and longevity',
    options: [
      { id: 'subtle', label: 'Subtle — Close to skin', emoji: '🕊️' },
      { id: 'moderate', label: 'Moderate — Personal cloud', emoji: '💫' },
      { id: 'intense', label: 'Intense — Leave a trail', emoji: '🌪️' },
      { id: 'extravagant', label: 'Extravagant — Fill a room', emoji: '🔱' },
    ],
  },
];

interface Product {
  title: string;
  handle: string;
  collection: string;
  image: string;
  description: string;
  notes: string;
  mood: string[];
  occasion: string[];
  noteFamily: string[];
  intensity: string[];
  price: string;
}

const PRODUCTS: Product[] = [
  {
    title: 'Dakhoon',
    handle: 'dakhoon-100ml',
    collection: 'perfumes',
    image: 'https://cdn.shopify.com/s/files/1/0812/5077/9453/files/Dakhoon.jpg?v=1770415101',
    description: 'An opulent fusion of agarwood, rose, saffron and amber — a smoky oriental masterpiece.',
    notes: 'Agarwood, Rose, Vanilla, Saffron, Frankincense, Amber',
    mood: ['sensual', 'romantic', 'bold'],
    occasion: ['evening', 'special'],
    noteFamily: ['oud-woody', 'amber-oriental', 'floral-rose'],
    intensity: ['intense', 'extravagant'],
    price: 'AED 495',
  },
  {
    title: 'Coffee Oud',
    handle: 'coffee-oud-100ml',
    collection: 'perfumes',
    image: 'https://cdn.shopify.com/s/files/1/0812/5077/9453/files/CoffeeOud.jpg?v=1770414703',
    description: 'Bold, addictive, and irresistibly warm — freshly brewed coffee with spicy cardamom and vanilla.',
    notes: 'Coffee, Cardamom, Cinnamon, Caramel, Cedar, Agarwood, Vanilla',
    mood: ['bold', 'sensual'],
    occasion: ['evening', 'daily', 'office'],
    noteFamily: ['coffee-spice', 'amber-oriental', 'oud-woody'],
    intensity: ['moderate', 'intense'],
    price: 'AED 495',
  },
  {
    title: 'The Dark Horse',
    handle: 'the-dark-horse-100ml',
    collection: 'perfumes',
    image: 'https://cdn.shopify.com/s/files/1/0812/5077/9453/files/Dark_Horse.png?v=1770388755',
    description: 'Enigmatic and powerful — bergamot and leather oud with neroli heart and sandalwood depth.',
    notes: 'Lemon, Bergamot, Leather Oud, Neroli, Freesia, Sandalwood, Musk',
    mood: ['bold', 'fresh'],
    occasion: ['office', 'evening', 'special'],
    noteFamily: ['oud-woody', 'amber-oriental'],
    intensity: ['intense', 'extravagant'],
    price: 'AED 495',
  },
  {
    title: 'Royal Oud',
    handle: 'royal-oud-attar',
    collection: 'all',
    image: 'https://cdn.shopify.com/s/files/1/0812/5077/9453/files/Artboard_1_copy_3_3adc834e-2708-444e-a224-0d3149cc0981.png?v=1764672655',
    description: 'Pure solitary wild oud — 48-hour longevity, oil-based luxury for the true connoisseur.',
    notes: 'Jasmine, Taif Rose, Aged Wild Oud, White Musk, Madagascar Vanilla',
    mood: ['romantic', 'sensual'],
    occasion: ['special', 'evening'],
    noteFamily: ['oud-woody', 'floral-rose'],
    intensity: ['intense', 'extravagant'],
    price: 'AED 495',
  },
  {
    title: 'Nomad Mist — Bloom',
    handle: 'mist-bloom',
    collection: 'mists',
    image: 'https://cdn.shopify.com/s/files/1/0812/5077/9453/files/Artboard_1_copy_3_3adc834e-2708-444e-a224-0d3149cc0981.png?v=1764672655',
    description: 'Delicate florals kissed with white musk — a weightless mist for everyday radiance.',
    notes: 'Rose, Peony, White Musk, Light Amber, Bergamot',
    mood: ['fresh', 'romantic'],
    occasion: ['daily', 'office'],
    noteFamily: ['floral-rose'],
    intensity: ['subtle', 'moderate'],
    price: 'AED 270',
  },
  {
    title: 'Nomad Mist — Velvet Oud',
    handle: 'mist-velvet-oud',
    collection: 'mists',
    image: 'https://cdn.shopify.com/s/files/1/0812/5077/9453/files/Artboard_1_copy_3_3adc834e-2708-444e-a224-0d3149cc0981.png?v=1764672655',
    description: 'Warm oud and amber in a light mist — everyday oriental luxury, effortlessly wearable.',
    notes: 'Oud, Amber, Sandalwood, Vanilla, Soft Musk',
    mood: ['sensual', 'romantic'],
    occasion: ['daily', 'office', 'evening'],
    noteFamily: ['oud-woody', 'amber-oriental'],
    intensity: ['subtle', 'moderate'],
    price: 'AED 270',
  },
];

function scoreProducts(answers: Record<string, string>): Product[] {
  const scored = PRODUCTS.map((p) => {
    let s = 0;
    if (answers.mood && p.mood.includes(answers.mood)) s += 3;
    if (answers.occasion && p.occasion.includes(answers.occasion)) s += 2;
    if (answers.notes && p.noteFamily.includes(answers.notes)) s += 3;
    if (answers.intensity && p.intensity.includes(answers.intensity)) s += 2;
    return { p, s };
  });
  scored.sort((a, b) => b.s - a.s);
  const top = scored.filter((x) => x.s > 0).slice(0, 3);
  if (top.length === 0) return [PRODUCTS[0], PRODUCTS[1], PRODUCTS[4]];
  return top.map((x) => x.p);
}

export default function FragranceFinderPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Product[] | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [animating, setAnimating] = useState(false);

  const totalSteps = QUIZ_STEPS.length;
  const isIntro = currentStep === 0;
  const isResults = results !== null;
  const quizStep = currentStep > 0 ? QUIZ_STEPS[currentStep - 1] : null;
  const progress = currentStep > 0 ? (currentStep / totalSteps) * 100 : 0;

  function handleOptionSelect(optionId: string) {
    setSelectedOption(optionId);
  }

  function handleNext() {
    if (!quizStep || !selectedOption) return;
    setAnimating(true);
    const newAnswers = { ...answers, [quizStep.id]: selectedOption };
    setAnswers(newAnswers);
    setTimeout(() => {
      setSelectedOption(null);
      if (currentStep >= totalSteps) {
        setResults(scoreProducts(newAnswers));
      } else {
        setCurrentStep((s) => s + 1);
      }
      setAnimating(false);
    }, 320);
  }

  function handleBack() {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
      setSelectedOption(null);
    } else {
      setCurrentStep(0);
      setSelectedOption(null);
      setAnswers({});
    }
  }

  function handleRestart() {
    setCurrentStep(0);
    setAnswers({});
    setSelectedOption(null);
    setResults(null);
  }

  return (
    <div className="min-h-screen bg-[#070707] text-white font-sans">
      <SiteHeader transparentMode={false} />
      <main className="pb-20">
        <section className="relative overflow-hidden bg-[#070707] border-b border-[#ffb91d]/20">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,185,29,0.10)_0%,transparent_65%)]" />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
            <span className="inline-block text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.4em] text-[#ffb91d] mb-4">
              Oud Nomad Dubai · Exclusive
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif uppercase tracking-[0.08em] text-white mb-4 leading-tight">
              Find Your<br /><span className="text-[#ffb91d]">Signature Scent</span>
            </h1>
            <p className="text-sm sm:text-base text-white/60 max-w-xl mx-auto leading-relaxed">
              Answer five questions and our fragrance concierge will reveal the perfect Oud Nomad creation crafted for your soul.
            </p>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          {isIntro && !isResults && (
            <div className="text-center space-y-10" style={{animation:'fadeIn 0.45s ease both'}}>
              <div className="space-y-5">
                <div className="w-20 h-20 mx-auto rounded-full bg-[#ffb91d]/10 border border-[#ffb91d]/30 flex items-center justify-center text-4xl">🧭</div>
                <h2 className="text-2xl sm:text-3xl font-serif text-white uppercase tracking-widest">Your Fragrance Journey Begins</h2>
                <p className="text-sm text-white/60 max-w-md mx-auto leading-relaxed">In just 5 steps, discover the Oud Nomad fragrance that is uniquely yours. No two olfactory journeys are the same.</p>
              </div>
              <div className="flex flex-wrap justify-center gap-3 text-[11px] uppercase tracking-wider text-white/50">
                <span className="px-3 py-1.5 border border-white/10 rounded-sm">5 Questions</span>
                <span className="px-3 py-1.5 border border-white/10 rounded-sm">Personalised</span>
                <span className="px-3 py-1.5 border border-white/10 rounded-sm">Expert Curation</span>
              </div>
              <button onClick={() => setCurrentStep(1)} className="inline-block px-10 py-4 bg-[#ffb91d] text-black text-[11px] uppercase tracking-[0.25em] font-semibold hover:bg-[#e5a61a] transition-all duration-200">
                Begin the Quiz →
              </button>
            </div>
          )}

          {!isIntro && !isResults && quizStep && (
            <div style={{opacity: animating ? 0 : 1, transition:'opacity 0.3s ease'}}>
              <div className="mb-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-mono">Step {currentStep} of {totalSteps}</span>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#ffb91d] font-mono">{Math.round(progress)}% Complete</span>
                </div>
                <div className="h-0.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[#ffb91d] transition-all duration-500 ease-out" style={{width:`${progress}%`}} />
                </div>
              </div>

              <div className="text-center mb-8 space-y-2">
                <h2 className="text-xl sm:text-2xl font-serif text-white uppercase tracking-wider">{quizStep.question}</h2>
                <p className="text-xs text-white/40 tracking-wider font-mono">{quizStep.subtitle}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-10">
                {quizStep.options.map((option) => {
                  const isSelected = selectedOption === option.id;
                  return (
                    <button key={option.id} onClick={() => handleOptionSelect(option.id)}
                      className={`group relative flex flex-col items-center justify-center gap-3 p-6 sm:p-8 border transition-all duration-200 cursor-pointer text-center ${isSelected ? 'border-[#ffb91d] bg-[#ffb91d]/10' : 'border-white/10 bg-[#0e0e0e] hover:border-[#ffb91d]/50 hover:bg-white/5'}`}>
                      {isSelected && (
                        <span className="absolute top-3 right-3 w-5 h-5 bg-[#ffb91d] text-black rounded-full flex items-center justify-center text-[10px] font-bold">✓</span>
                      )}
                      <span className="text-3xl sm:text-4xl">{option.emoji}</span>
                      <span className={`text-[11px] sm:text-xs uppercase tracking-[0.18em] font-medium transition-colors ${isSelected ? 'text-[#ffb91d]' : 'text-white/80 group-hover:text-white'}`}>{option.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between gap-4">
                <button onClick={handleBack} className="text-[11px] uppercase tracking-wider text-white/40 hover:text-white transition-colors font-mono flex items-center gap-2">← Back</button>
                <button onClick={handleNext} disabled={!selectedOption}
                  className={`px-8 py-3.5 text-[11px] uppercase tracking-[0.22em] font-semibold transition-all duration-200 ${selectedOption ? 'bg-[#ffb91d] text-black hover:bg-[#e5a61a]' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}>
                  {currentStep === totalSteps ? 'Reveal My Scent →' : 'Next →'}
                </button>
              </div>
            </div>
          )}

          {isResults && results && (
            <div style={{animation:'fadeIn 0.45s ease both'}} className="space-y-12">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#ffb91d]/20 border border-[#ffb91d]/40 flex items-center justify-center text-3xl">✨</div>
                <h2 className="text-2xl sm:text-3xl font-serif text-white uppercase tracking-wider">Your Signature Scents</h2>
                <p className="text-sm text-white/50 max-w-md mx-auto leading-relaxed">Based on your unique olfactory profile, our concierge has curated these exceptional Oud Nomad creations for you.</p>
              </div>

              <div className="space-y-6">
                {results.map((product, index) => (
                  <div key={product.handle} className={`group relative border transition-all duration-300 hover:border-[#ffb91d]/40 overflow-hidden ${index === 0 ? 'border-[#ffb91d]/50 bg-[#ffb91d]/5' : 'border-white/10 bg-[#0e0e0e]'}`}>
                    {index === 0 && (
                      <div className="absolute top-4 right-4 z-10">
                        <span className="text-[9px] uppercase tracking-[0.25em] bg-[#ffb91d] text-black font-bold px-2.5 py-1">★ Top Match</span>
                      </div>
                    )}
                    <div className="flex gap-0">
                      <div className="relative w-32 sm:w-44 shrink-0 bg-[#111] overflow-hidden" style={{minHeight:'160px'}}>
                        <Image src={product.image} alt={product.title} fill className="object-cover object-center group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 128px, 176px" />
                      </div>
                      <div className="flex-1 p-5 sm:p-7 flex flex-col justify-between gap-4">
                        <div>
                          <span className="text-[9px] uppercase tracking-[0.35em] text-[#ffb91d] font-mono block mb-1">
                            {product.collection === 'mists' ? 'Hair & Body Mist' : 'Luxury Perfume'} · {product.price}
                          </span>
                          <h3 className="text-lg sm:text-xl font-serif text-white uppercase tracking-wider mb-2">{product.title}</h3>
                          <p className="text-xs text-white/60 leading-relaxed mb-3">{product.description}</p>
                          <p className="text-[10px] text-white/40 font-mono"><span className="text-[#ffb91d]/60">Notes: </span>{product.notes}</p>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <Link href={`/collections/${product.collection}/products/${product.handle}`} className="px-5 py-2.5 bg-[#ffb91d] text-black text-[10px] uppercase tracking-[0.2em] font-semibold hover:bg-[#e5a61a] transition-colors">Shop Now</Link>
                          <Link href={`/collections/${product.collection}`} className="px-5 py-2.5 border border-white/20 text-white text-[10px] uppercase tracking-[0.2em] hover:border-[#ffb91d]/50 transition-colors">View Collection</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border border-[#ffb91d]/20 bg-[#ffb91d]/5 p-6 sm:p-8 text-center space-y-4">
                <p className="text-xs uppercase tracking-[0.25em] text-[#ffb91d] font-mono">Want to explore more?</p>
                <p className="text-sm text-white/60">Browse our full catalogue of luxury oriental perfumes and hair &amp; body mists.</p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Link href="/collections/all" className="px-6 py-3 border border-[#ffb91d]/40 text-[#ffb91d] text-[11px] uppercase tracking-wider hover:bg-[#ffb91d] hover:text-black transition-all duration-200">All Fragrances</Link>
                  <Link href="/collections/perfumes" className="px-6 py-3 border border-white/20 text-white/70 text-[11px] uppercase tracking-wider hover:border-[#ffb91d]/50 hover:text-white transition-all duration-200">Perfumes</Link>
                  <Link href="/collections/mists" className="px-6 py-3 border border-white/20 text-white/70 text-[11px] uppercase tracking-wider hover:border-[#ffb91d]/50 hover:text-white transition-all duration-200">Hair &amp; Body Mists</Link>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button onClick={handleRestart} className="text-[11px] uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors font-mono border border-white/10 px-6 py-3 hover:border-white/30">← Retake Quiz</button>
                <a href="https://wa.me/971585719731?text=Hello%2C%20I%20took%20the%20Fragrance%20Finder%20quiz%20on%20Oud%20Nomad%20and%20would%20like%20help%20choosing%20my%20signature%20scent." target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white text-[11px] uppercase tracking-[0.2em] font-semibold hover:bg-[#20bd5a] transition-colors">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.031 0C5.396 0 .02 5.37.02 12.006c0 2.12.553 4.19 1.604 6.014L0 24l6.143-1.611A11.97 11.97 0 0012.03 24c6.634 0 12.01-5.37 12.01-12.006C24.04 5.37 18.665 0 12.031 0zm6.98 16.945c-.29.815-1.442 1.492-2.38 1.693-.64.137-1.474.246-4.288-.916-3.597-1.487-5.912-5.148-6.091-5.387-.18-.239-1.46-1.944-1.46-3.708 0-1.764.922-2.632 1.25-2.986.327-.354.714-.443.952-.443.238 0 .476.002.684.012.22.01.517-.084.81.619.3.703 1.026 2.508 1.116 2.69.09.18.15.39.03.626-.12.238-.18.388-.358.598-.18.21-.378.47-.54.631-.18.18-.368.376-.158.736.21.36.936 1.545 2.01 2.502 1.382 1.233 2.548 1.616 2.908 1.796.36.18.57.15.78-.09.21-.24.9-1.05 1.14-1.41.24-.36.48-.3.81-.18.33.12 2.096.99 2.456 1.17.36.18.6.27.69.42.09.15.09.87-.2 1.685z" /></svg>
                  Chat with Our Concierge
                </a>
              </div>
            </div>
          )}
        </section>
      </main>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}
