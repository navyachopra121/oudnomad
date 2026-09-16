'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../use-reduced-motion';

type Props = {
  wrapRef: React.RefObject<HTMLElement | null>;
  startRef: React.RefObject<HTMLElement | null>;
  endRef: React.RefObject<HTMLElement | null>;
};

/**
 * Gold smoke curl driven by scroll — threads Philosophy to Testimonials.
 * GSAP ScrollTrigger scrub; retracts when scrolling back up.
 */
export default function SmokeThread({ wrapRef, startRef, endRef }: Props) {
  const pathRef = useRef<SVGPathElement>(null);
  const reduceMotion = useReducedMotion();
  const [geom, setGeom] = useState({ top: 0, height: 0 });

  useEffect(() => {
    const measure = () => {
      const wrap = wrapRef.current;
      const start = startRef.current;
      const end = endRef.current;
      if (!wrap || !start || !end) return;
      const wrapTop = wrap.getBoundingClientRect().top + window.scrollY;
      const startY = start.getBoundingClientRect().top + window.scrollY - wrapTop;
      const endY = end.getBoundingClientRect().bottom + window.scrollY - wrapTop;
      setGeom({ top: startY, height: Math.max(endY - startY, 400) });
    };

    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, { passive: true });
    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);
    if (startRef.current) ro.observe(startRef.current);
    if (endRef.current) ro.observe(endRef.current);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure);
      ro.disconnect();
    };
  }, [wrapRef, startRef, endRef]);

  useEffect(() => {
    if (reduceMotion || geom.height === 0) return;

    let ctx: { revert: () => void } | undefined;

    const init = async () => {
      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const path = pathRef.current;
      const start = startRef.current;
      const end = endRef.current;
      if (!path || !start || !end) return;

      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

      ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: start,
          endTrigger: end,
          start: 'top 70%',
          end: 'bottom 30%',
          scrub: true,
          onUpdate: (self) => {
            path.style.strokeDashoffset = String(length * (1 - self.progress));
          },
        });
      });
    };

    init();
    return () => ctx?.revert();
  }, [startRef, endRef, reduceMotion, geom.height]);

  if (reduceMotion || geom.height === 0) return null;

  const h = geom.height;
  const pathD = `M24 0 C20 ${h * 0.15} 28 ${h * 0.3} 18 ${h * 0.45} S22 ${h * 0.6} 16 ${h * 0.75} S26 ${h * 0.88} 24 ${h}`;

  return (
    <div
      className="pointer-events-none absolute right-3 md:right-6 lg:right-10 w-12 hidden md:block"
      style={{ top: geom.top, height: h }}
      aria-hidden
    >
      <svg width="48" height={h} viewBox={`0 0 48 ${h}`} className="overflow-visible">
        <path
          ref={pathRef}
          d={pathD}
          fill="none"
          stroke="var(--antique-gold)"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.35"
        />
      </svg>
    </div>
  );
}
