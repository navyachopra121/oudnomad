'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useReducedMotion } from './use-reduced-motion';

type Props = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
};

export default function Reveal({ children, className = '', delayMs = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(reduceMotion);

  useEffect(() => {
    if (reduceMotion) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduceMotion]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: reduceMotion
          ? 'none'
          : `opacity 700ms var(--ease-luxury) ${delayMs}ms, transform 800ms var(--ease-luxury) ${delayMs}ms`,
      }}
    >
      {children}
    </div>
  );
}
