'use client';

import { useEffect, useRef } from 'react';

/**
 * Horizontal drag-scroll for desktop + touch swipe on mobile.
 *
 * Uses the PointerEvents API which covers both mouse and touch input.
 * `touch-action: pan-y` lets iOS handle vertical scroll naturally while
 * the element itself intercepts horizontal drags.
 */
export function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Allow vertical native scroll on touch; horizontal is handled here.
    el.style.touchAction = 'pan-y';

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const onDown = (e: PointerEvent) => {
      isDown = true;
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
      el.setPointerCapture(e.pointerId);
      if (e.pointerType !== 'touch') el.style.cursor = 'grabbing';
    };

    const onMove = (e: PointerEvent) => {
      if (!isDown) return;
      const x = e.pageX - el.offsetLeft;
      const delta = x - startX;
      // Only suppress default if the user is dragging horizontally
      if (Math.abs(delta) > 4) e.preventDefault();
      el.scrollLeft = scrollLeft - delta;
    };

    const onUp = (e: PointerEvent) => {
      isDown = false;
      if (e.pointerType !== 'touch') el.style.cursor = 'grab';
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
    };

    el.style.cursor = 'grab';
    el.addEventListener('pointerdown', onDown);
    // { passive: false } needed so we can call preventDefault inside onMove
    el.addEventListener('pointermove', onMove, { passive: false });
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);

    return () => {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
    };
  }, []);

  return ref;
}
