'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../use-reduced-motion';

type Props = { surface?: 'ivory' | 'obsidian' };

/** Wax-seal divider — presses in with slight overshoot at room transitions */
export default function WaxSealMedallion({ surface = 'ivory' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [pressed, setPressed] = useState(reduceMotion);

  useEffect(() => {
    if (reduceMotion) {
      setPressed(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPressed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduceMotion]);

  const bg = surface === 'obsidian' ? 'bg-obsidian' : 'bg-ivory';

  return (
    <div ref={ref} className="relative flex justify-center py-2" aria-hidden>
      <div
        className={`w-10 h-10 rounded-full border border-antique-gold/50 flex items-center justify-center ${bg} shadow-[0_2px_8px_rgba(28,20,15,0.12)]`}
        style={{
          transform: pressed ? 'scale(1)' : 'scale(0)',
          transition: reduceMotion
            ? 'none'
            : 'transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-antique-gold" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1" />
          <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
        </svg>
      </div>
    </div>
  );
}
