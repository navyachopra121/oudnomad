'use client';

import { useEffect, useRef, useState } from 'react';

export type HeaderScrollState = {
  announcementVisible: boolean;
  navVisible: boolean;
  compact: boolean;
  reduceMotion: boolean;
};

const SCROLL_DELTA = 8;
const COMPACT_AT = 48;

export function useHeaderScroll(): HeaderScrollState {
  const [announcementVisible, setAnnouncementVisible] = useState(true);
  const [navVisible, setNavVisible] = useState(true);
  const [compact, setCompact] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = () => setReduceMotion(motionQuery.matches);
    syncMotion();
    motionQuery.addEventListener('change', syncMotion);

    lastY.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;

      setCompact(y > COMPACT_AT);

      if (motionQuery.matches) {
        setAnnouncementVisible(true);
        setNavVisible(true);
        lastY.current = y;
        return;
      }

      if (y <= 4) {
        setAnnouncementVisible(true);
        setNavVisible(true);
      } else {
        if (delta > SCROLL_DELTA) {
          setAnnouncementVisible(false);
          setNavVisible(false);
        } else if (delta < -SCROLL_DELTA) {
          setNavVisible(true);
          if (y < 120) {
            setAnnouncementVisible(true);
          }
        }
      }

      lastY.current = y;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      motionQuery.removeEventListener('change', syncMotion);
    };
  }, []);

  return { announcementVisible, navVisible, compact, reduceMotion };
}
