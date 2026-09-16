'use client';

import { useEffect, useRef, useState } from 'react';
import Container from '../Container';
import IlluminatedSprig from './motifs/IlluminatedSprig';
import Reveal from './Reveal';
import { useReducedMotion } from './use-reduced-motion';

const STAGES = [
  {
    title: 'First',
    body: 'Bright top notes greet you: saffron, citrus, spice.',
  },
  {
    title: 'Then',
    body: 'The heart emerges: rose, oud, resin.',
  },
  {
    title: 'Finally',
    body: 'The base settles in for hours: amber, musk, sandalwood.',
  },
];

export default function RitualSection() {
  const reduceMotion = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [isMd, setIsMd] = useState(false);

  // Detect md+ for scroll-scrub — only engage on tablets and above
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    setIsMd(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMd(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Scroll-scrub only at md+ and when motion is allowed
  useEffect(() => {
    if (reduceMotion || !isMd) return;

    let ctx: { revert: () => void } | undefined;

    const init = async () => {
      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const el = wrapRef.current;
      if (!el) return;

      ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
          onUpdate: (self) => {
            const p = self.progress;
            if (p < 0.34) setActive(0);
            else if (p < 0.67) setActive(1);
            else setActive(2);
          },
        });
      });
    };

    init();
    return () => ctx?.revert();
  }, [reduceMotion, isMd]);

  // On mobile (< md): simple stacked layout, no sticky scroll-scrub
  const useSimpleLayout = reduceMotion || !isMd;

  const smokePanel = (
    <div className="relative aspect-square max-w-xs mx-auto w-full ritual-smoke-panel border border-border md:max-w-md">
      <svg className="absolute inset-0 w-full h-full p-8 text-antique-gold/40" viewBox="0 0 200 200" aria-hidden>
        <path
          d="M100 170 C70 140 55 110 60 85 C65 60 85 45 100 30 C115 45 135 60 140 85 C145 110 130 140 100 170Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
        />
        <path
          d="M100 55 C92 75 88 95 92 115 M100 50 C108 72 112 98 106 120 M100 48 C100 70 98 92 101 118"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.6"
          className="ritual-smoke-path"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-24 h-24 rounded-full border border-deep-emerald/40 flex items-center justify-center transition-transform duration-[700ms]"
          style={{
            transform: useSimpleLayout ? undefined : `scale(${1 + active * 0.08})`,
          }}
        >
          <span className="font-display text-4xl text-deep-emerald">{active + 1}</span>
        </div>
      </div>
    </div>
  );

  if (useSimpleLayout) {
    // Mobile / reduced-motion: simple vertical layout, no sticky pinning
    return (
      <div className="bg-ivory" style={{ paddingBlock: 'var(--section-py)' }}>
        <Container>
          <Reveal>
            <div className="flex items-center gap-3 mb-4">
              <IlluminatedSprig />
              <p className="text-[10px] uppercase tracking-[0.32em] text-antique-gold">The ritual</p>
            </div>
            <h2 className="font-display text-fluid-h2 leading-tight text-espresso max-w-md">
              A scent that unfolds, not a scent that shouts.
            </h2>
            <div className="mt-10 space-y-6">
              {STAGES.map((stage, i) => (
                <div
                  key={stage.title}
                  className="border-l pl-5"
                  style={{ borderColor: i === 0 ? 'var(--antique-gold)' : 'var(--border)' }}
                >
                  <p className="text-xs uppercase tracking-[0.22em] text-muted mb-1">{stage.title}</p>
                  <p className="text-sm md:text-base text-espresso leading-relaxed">{stage.body}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <div className="mt-14">{smokePanel}</div>
        </Container>
      </div>
    );
  }

  // Desktop: scroll-scrubbed sticky panel at md+
  return (
    <div ref={wrapRef} className="relative bg-ivory" style={{ height: '220vh' }}>
      <section className="sticky top-0 min-h-svh flex items-center px-0" style={{ paddingBlock: 0 }}>
        <Container className="w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <Reveal>
              <div className="flex items-center gap-3 mb-4">
                <IlluminatedSprig />
                <p className="text-[10px] uppercase tracking-[0.32em] text-antique-gold">The ritual</p>
              </div>
              <h2 className="font-display text-fluid-h2 leading-tight text-espresso max-w-md">
                A scent that unfolds, not a scent that shouts.
              </h2>
              <div className="mt-10 space-y-6">
                {STAGES.map((stage, i) => (
                  <div
                    key={stage.title}
                    className="border-l pl-5 transition-colors duration-[500ms]"
                    style={{
                      borderColor: active === i ? 'var(--antique-gold)' : 'var(--border)',
                      opacity: active === i ? 1 : 0.45,
                    }}
                  >
                    <p className="text-xs uppercase tracking-[0.22em] text-muted mb-1">{stage.title}</p>
                    <p className="text-sm md:text-base text-espresso leading-relaxed">{stage.body}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            {smokePanel}
          </div>
        </Container>
      </section>
    </div>
  );
}
