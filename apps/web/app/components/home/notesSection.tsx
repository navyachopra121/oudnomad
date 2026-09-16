"use client";

import { Imprima } from "next/font/google";
/**
 * NotesSection — "Shop by notes" horizontal carousel.
 *
 * Native scroll + CSS scroll-snap rather than a JS transform track, so touch
 * flicks, trackpad swipes, and keyboard focus all move it the way people
 * expect. The arrows just call scrollBy — they're a convenience on top of a
 * control that already works without them.
 *
 * Tokens (add to ritual-tokens.css, or leave them — every value has a
 * fallback so this renders correctly standalone):
 *
 *   --notes-bg:     var(--ivory, #f8f3e9);   page ground
 *   --notes-card:   #f6efe0;                 slightly warmer than the ground
 *   --notes-text:   var(--espresso, #1c140f);
 *   --notes-muted:  #6f6156;                 descriptor line
 *   --notes-accent: var(--antique-gold, #96730c);
 */

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
/* ------------------------------------------------------------------ types */

export type Note = {
  name: string;
  /** Three-word character line, e.g. "Deep. Warm. Refined." */
  descriptor: string;
  /** "/notes/oud.jpg" from public/, or an imported StaticImageData. */
  image: string | StaticImageData;
  alt: string;
  href: string;
};

export type NotesSectionProps = {
  title?: string;
  notes?: Note[];
  className?: string;
};

/* --------------------------------------------------------------- defaults */

const DEFAULT_NOTES: Note[] = [
  {
    name: "Oud",
    descriptor: "Deep. Warm. Refined.",
    image: "/woody.avif",
    alt: "Split agarwood chips, dark with resin",
    href: "/notes/oud",
  },
  {
    name: "Floral",
    descriptor: "Elegant. Soft. Romantic.",
    image: "/amber.avif",
    alt: "White gardenia blossom with glossy green leaves",
    href: "/notes/floral",
  },
  {
    name: "Fruity",
    descriptor: "Juicy. Vibrant. Playful.",
    image: "/floral.avif",
    alt: "Halved grapefruit, orange and lemon",
    href: "/notes/fruity",
  },
  {
    name: "Musk",
    descriptor: "Delicate. Creamy. Sensual.",
    image: "/tobacoo.avif",
    alt: "Open white camellia flower with golden stamens",
    href: "/notes/musk",
  },
  {
    name: "Spice",
    descriptor: "Sharp. Golden. Alive.",
    image: "/vanilla.avif",
    alt: "Cinnamon bark, cardamom pods and saffron threads",
    href: "/notes/spice",
  },
  {
    name: "Amber",
    descriptor: "Resinous. Slow. Enveloping.",
    image: "/amber.avif",
    alt: "Raw amber resin catching warm light",
    href: "/notes/amber",
  },
];

/* --------------------------------------------------------------- carousel */

function Arrow({
  direction,
  onClick,
  disabled,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
}) {
  const isNext = direction === "next";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isNext ? "Show more notes" : "Show previous notes"}
      // Sits on the vertical center of the image, not of the whole card —
      // the caption below the image is ~3rem, so pull up by half of that.
      className={`absolute top-1/2 z-10 hidden h-11 w-11 -translate-y-[calc(50%+1.5rem)] items-center justify-center rounded-full bg-[var(--notes-bg,#f8f3e9)] text-[var(--notes-text,#1c140f)] shadow-[0_2px_16px_rgba(28,20,15,0.14)] transition disabled:pointer-events-none disabled:opacity-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--notes-accent,#96730c)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--notes-bg,#f8f3e9)] md:flex ${isNext ? "right-2 lg:-right-5" : "left-2 lg:-left-5"
        }`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={`h-5 w-5 ${isNext ? "" : "rotate-180"}`}
      >
        <path d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}

export default function NotesSection({
  title = "Shop by notes",
  notes = DEFAULT_NOTES,
  className = "",
}: NotesSectionProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setAtStart(el.scrollLeft <= 1);
    // max <= 1 means everything fits, so both arrows stay hidden.
    setAtEnd(el.scrollLeft >= max - 1);
  }, []);

  useEffect(() => {
    sync();
    const el = trackRef.current;
    if (!el) return;
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    return () => observer.disconnect();
  }, [sync, notes.length]);

  const scrollByCard = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(el).columnGap || "0") || 0;
    const step = card ? card.offsetWidth + gap : el.clientWidth * 0.8;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: step * direction, behavior: reduce ? "auto" : "smooth" });
  };

  const headingId = "notes-section-heading";

  return (
    <section
      aria-labelledby={headingId}
      className={`bg-[var(--notes-bg,#f8f3e9)] py-10 md:py-20 px-2 md:px-0 ${className}`}
    >
      <div className="mx-auto w-full max-w-[1400px] px-2 md:px-4 lg:px-6">
        <h2
          id={headingId}
          className="font-serif text-[26px] capitalize leading-none tracking-[0.06em] text-[var(--notes-text,#1c140f)] md:text-[32px]"
        >
          {title}
        </h2>

        <div className="relative mt-7 md:mt-10">
          <ul
            ref={trackRef}
            onScroll={sync}
            // tabIndex makes the overflow region reachable so keyboard users
            // can arrow through it; Firefox/Chrome both need it on the
            // scroller itself, not the section.
            tabIndex={0}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-1 md:gap-6 [-ms-overflow-style:none] [scrollbar-width:none] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--notes-accent,#96730c)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--notes-bg,#f8f3e9)] [&::-webkit-scrollbar]:hidden"
          >
            {notes.map((note) => (
              <li
                key={note.name}
                // 1.25 cards on phones so the cut edge signals "this scrolls",
                // stepping to a clean 4-up on desktop.
                className="w-[74%] shrink-0 snap-start sm:w-[46%] md:w-[calc((100%-3rem)/2.5)] lg:w-[calc((100%-4.5rem)/4)]"
              >
                <Link
                  href={note.href}
                  className="group block focus-visible:outline-none"
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-[var(--notes-card,#f6efe0)] transition group-focus-visible:ring-2 group-focus-visible:ring-[var(--notes-accent,#96730c)] group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-[var(--notes-bg,#f8f3e9)]">
                    <Image
                      src={note.image}
                      alt={note.alt}
                      fill
                      sizes="(max-width: 640px) 74vw, (max-width: 1024px) 40vw, 320px"
                      className="object-contain p-6 transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100 md:p-10"
                    />
                  </div>
                  <h3 className="mt-3 font-sans text-[15px] text-[var(--notes-text,#1c140f)]">
                    {note.name}
                  </h3>
                  <p className="mt-0.5 font-sans text-[14px] text-[var(--notes-muted,#6f6156)]">
                    {note.descriptor}
                  </p>
                </Link>
              </li>
            ))}
          </ul>

          <Arrow
            direction="prev"
            onClick={() => scrollByCard(-1)}
            disabled={atStart}
          />
          <Arrow
            direction="next"
            onClick={() => scrollByCard(1)}
            disabled={atEnd}
          />
        </div>
      </div>
    </section>
  );
}
