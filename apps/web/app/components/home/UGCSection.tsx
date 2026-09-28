'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

/* ------------------------------------------------------------------ */
/*  Data — replace src values with actual UGC reel paths               */
/* ------------------------------------------------------------------ */
const REELS = [
  {
    id: 0,
    src: '/banner.mp4',
    label: 'MAJESTY EXTRAIT',
    title: 'SILLAGE THAT SPEAKS',
    bullets: [
      'Lasts 12+ hours on skin',
      'French-grade Extrait concentration',
      'Aged Cambodian Oud base',
      'Unisex oriental accord',
    ],
  },
  {
    id: 1,
    src: '/banner.mp4',
    label: 'AMBER ROYALE',
    title: 'WARMTH IN EVERY DROP',
    bullets: [
      'Rich amber & vanilla heart',
      'Golden resin dry-down',
      'Ideal for evening wear',
      'Long-lasting projection',
    ],
  },
  {
    id: 2,
    src: '/banner.mp4',
    label: 'ROYAL OUD',
    title: 'THE KING OF ATTARS',
    bullets: [
      'Pure Hindi Oud distillate',
      'Zero synthetic fillers',
      'Aged 5+ years in oak',
      'Collectors limited batch',
    ],
  },
  {
    id: 3,
    src: '/banner.mp4',
    label: 'VINTAGE ATTAR',
    title: 'HISTORY IN A BOTTLE',
    bullets: [
      'Traditional deg-bhapka process',
      'Rose & oud harmony',
      'Alcohol-free pure attar',
      'Skin-safe heritage formula',
    ],
  },
  {
    id: 4,
    src: '/banner.mp4',
    label: 'IMPERIAL RESIN',
    title: 'RESINOUS GRANDEUR',
    bullets: [
      'Beeswax & labdanum accord',
      'Incense smoke finish',
      'Unmatched depth & richness',
      'Signature Oud Nomad DNA',
    ],
  },
];

const TOTAL = REELS.length;

/* ------------------------------------------------------------------ */
/*  Main Component                                                      */
/* ------------------------------------------------------------------ */
export default function UGCSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bigVideoRef = useRef<HTMLVideoElement>(null);

  const activeReel  = REELS[activeIdx];
  const preview1    = REELS[(activeIdx + 1) % TOTAL];
  const preview2    = REELS[(activeIdx + 2) % TOTAL];

  /* ── auto-advance every 6 seconds ── */
  const startTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % TOTAL);
    }, 6000);
  }, []);

  useEffect(() => {
    startTimer();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startTimer]);

  /* ── restart featured video on change ── */
  useEffect(() => {
    const vid = bigVideoRef.current;
    if (!vid) return;
    vid.load();
    vid.play().catch(() => {});
  }, [activeIdx]);

  /* ── manual select ── */
  const handleSelect = (idx: number) => {
    setActiveIdx(idx);
    startTimer(); // reset auto-advance timer
  };

  /* ── progress dots ── */
  const dots = REELS.map((_, i) => (
    <button
      key={i}
      onClick={() => handleSelect(i)}
      aria-label={`Go to reel ${i + 1}`}
      className={`h-[2px] transition-all duration-300 ${
        i === activeIdx
          ? 'w-6 bg-[#ffb91d]'
          : 'w-2 bg-white/25 hover:bg-white/50'
      }`}
    />
  ));

  return (
    <section
      id="ugc-reels"
      className="py-14 sm:py-20 bg-[#000000] border-t border-[#ffb91d]/15 overflow-hidden"
    >
      {/* Heading */}
      <div className="text-center mb-10 px-4">
        <h2 className="font-sans text-[13px] sm:text-[14px] text-[#ffb91d] font-normal uppercase tracking-[0.3em] mb-1">
          AS SEEN ON REELS
        </h2>
        <p className="text-[10px] text-white/35 font-normal tracking-[0.12em] uppercase">
          Real people. Real reactions.
        </p>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          DESKTOP LAYOUT  (lg+)
          [Text 22%] [BIG video 34%] [Small video 20%] [Small video 20%]
          ═══════════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex items-stretch gap-4 max-w-[1300px] mx-auto px-8">

        {/* ── Text panel (left) ── */}
        <div className="w-[22%] flex flex-col justify-center pr-4 py-4 min-w-0 flex-shrink-0">
          <div key={activeReel.id} className="animate-fadeIn">
            {/* Title */}
            <h3
              className="text-white font-bold text-[18px] sm:text-[20px] leading-[1.25] mb-5 uppercase italic"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              {activeReel.title}
            </h3>
            {/* Bullets */}
            <ul className="space-y-2.5">
              {activeReel.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-[5px] flex-shrink-0 w-1 h-1 rounded-full bg-[#ffb91d]" />
                  <span className="text-[11px] text-white/70 font-normal leading-[1.6] tracking-[0.04em]">
                    {b}
                  </span>
                </li>
              ))}
            </ul>
            {/* Source note */}
            <p className="mt-6 text-[9px] text-white/25 font-normal tracking-[0.06em] italic">
              *Based on independent user reviews. Results may vary.
            </p>
          </div>
        </div>

        {/* ── BIG active video (center-left) ── */}
        <div className="w-[34%] flex-shrink-0 relative">
          <div className="relative w-full aspect-[9/16] overflow-hidden border border-[#ffb91d]/30 shadow-2xl shadow-black">
            <video
              ref={bigVideoRef}
              key={`big-${activeReel.id}`}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src={activeReel.src} type="video/mp4" />
            </video>
            {/* Gold top-left accent bar */}
            <div className="absolute top-0 left-0 w-0.5 h-12 bg-[#ffb91d]" />
            {/* Bottom label */}
            <div className="absolute bottom-0 inset-x-0 px-4 py-3 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#ffb91d] font-normal">
                {activeReel.label}
              </p>
            </div>
          </div>
          {/* Progress dots */}
          <div className="flex items-center gap-2 justify-center mt-3">
            {dots}
          </div>
        </div>

        {/* ── Small preview 1 ── */}
        <div
          className="w-[20%] flex-shrink-0 relative cursor-pointer group"
          onClick={() => handleSelect((activeIdx + 1) % TOTAL)}
        >
          <div className="relative w-full aspect-[9/16] overflow-hidden border border-white/10 group-hover:border-[#ffb91d]/50 transition-colors">
            <video
              key={`p1-${preview1.id}`}
              muted
              loop
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src={preview1.src} type="video/mp4" />
            </video>
            {/* Dark overlay — lifts on hover */}
            <div className="absolute inset-0 bg-black/45 group-hover:bg-black/20 transition-all duration-300" />
            {/* Label */}
            <div className="absolute bottom-0 inset-x-0 px-3 py-2 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-[9px] uppercase tracking-[0.15em] text-white/60 group-hover:text-[#ffb91d] transition-colors font-normal">
                {preview1.label}
              </p>
            </div>
            {/* Play hint */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="w-10 h-10 rounded-full border border-[#ffb91d]/60 flex items-center justify-center bg-black/40">
                <svg className="w-4 h-4 fill-[#ffb91d] ml-0.5" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* ── Small preview 2 ── */}
        <div
          className="w-[20%] flex-shrink-0 relative cursor-pointer group"
          onClick={() => handleSelect((activeIdx + 2) % TOTAL)}
        >
          <div className="relative w-full aspect-[9/16] overflow-hidden border border-white/10 group-hover:border-[#ffb91d]/50 transition-colors">
            <video
              key={`p2-${preview2.id}`}
              muted
              loop
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src={preview2.src} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/45 group-hover:bg-black/20 transition-all duration-300" />
            <div className="absolute bottom-0 inset-x-0 px-3 py-2 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-[9px] uppercase tracking-[0.15em] text-white/60 group-hover:text-[#ffb91d] transition-colors font-normal">
                {preview2.label}
              </p>
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="w-10 h-10 rounded-full border border-[#ffb91d]/60 flex items-center justify-center bg-black/40">
                <svg className="w-4 h-4 fill-[#ffb91d] ml-0.5" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          MOBILE LAYOUT
          Featured video (full-width portrait) + text below + dot nav
          ═══════════════════════════════════════════════════════════ */}
      <div className="lg:hidden flex flex-col gap-5 px-4">

        {/* Featured video */}
        <div className="relative w-full max-w-[300px] mx-auto aspect-[9/16] overflow-hidden border border-[#ffb91d]/25">
          <video
            key={`mob-${activeReel.id}`}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={activeReel.src} type="video/mp4" />
          </video>
          <div className="absolute top-0 left-0 w-0.5 h-10 bg-[#ffb91d]" />
          <div className="absolute bottom-0 inset-x-0 px-3 py-2.5 bg-gradient-to-t from-black/80 to-transparent">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#ffb91d] font-normal">
              {activeReel.label}
            </p>
          </div>
        </div>

        {/* Dot nav */}
        <div className="flex items-center gap-2 justify-center">{dots}</div>

        {/* Text */}
        <div key={`mt-${activeReel.id}`} className="animate-fadeIn text-center px-2">
          <h3 className="text-white font-bold text-[16px] italic uppercase mb-3"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}>
            {activeReel.title}
          </h3>
          <ul className="space-y-1.5 text-left max-w-xs mx-auto">
            {activeReel.bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-[6px] flex-shrink-0 w-1 h-1 rounded-full bg-[#ffb91d]" />
                <span className="text-[11px] text-white/65 font-normal leading-[1.6]">{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Thumb row */}
        <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {REELS.map((r, i) => (
            <button
              key={r.id}
              onClick={() => handleSelect(i)}
              className={`relative flex-shrink-0 w-[90px] aspect-[9/16] overflow-hidden border-2 transition-all duration-300 ${
                i === activeIdx
                  ? 'border-[#ffb91d]'
                  : 'border-white/10 opacity-60'
              }`}
            >
              <video
                src={r.src}
                muted
                loop
                playsInline
                preload="metadata"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className={`absolute inset-0 ${i === activeIdx ? 'bg-black/5' : 'bg-black/40'}`} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
