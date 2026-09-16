'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../use-reduced-motion';

type Props = { className?: string };

/** Hand-drawn manuscript flourish — stroke draws in on reveal, not fade */
export default function IlluminatedSprig({ className = '' }: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const reduceMotion = useReducedMotion();
  const [drawn, setDrawn] = useState(reduceMotion);

  useEffect(() => {
    if (reduceMotion) {
      setDrawn(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduceMotion]);

  return (
    <svg
      ref={ref}
      className={`inline-block w-8 h-5 text-antique-gold ${className}`}
      viewBox="0 0 48 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M2 18 C8 14 12 8 18 10 S28 6 34 12 S42 4 46 8"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        pathLength={1}
        style={{
          strokeDasharray: 1,
          strokeDashoffset: drawn ? 0 : 1,
          transition: reduceMotion ? 'none' : 'stroke-dashoffset 1.2s var(--ease-luxury)',
        }}
      />
      <path
        d="M14 10 C16 6 20 4 24 6"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity={0.6}
        pathLength={1}
        style={{
          strokeDasharray: 1,
          strokeDashoffset: drawn ? 0 : 1,
          transition: reduceMotion ? 'none' : 'stroke-dashoffset 1s var(--ease-luxury) 0.3s',
        }}
      />
    </svg>
  );
}
