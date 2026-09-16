'use client';

/**
 * BannerSection
 * -------------
 * Full-bleed promotional banner meant to sit ABOVE the HeroSection.
 * Built to match HeroSection's design system 1:1 (Container, SectionImage,
 * useReducedMotion, font-display, ivory/espresso/antique-gold palette).
 *
 * Media rules (as requested):
 *  - media.type === 'video'        -> video renders, autoplay + muted + loop
 *  - media.type === 'image', 1 img -> single static image, NO slider UI
 *  - media.type === 'image', 2+    -> auto-playing slider (dots + arrows,
 *                                      pauses on hover, swipeable on touch)
 *
 * Mobile-first: base height/typography is set for small screens first,
 * then scaled up through sm: / md: / lg: breakpoints.
 *
 * ---------------------------------------------------------------------
 * USAGE EXAMPLES — pulling real images straight from data.tsx
 * ---------------------------------------------------------------------
 * `GALLERY_ITEMS[i].image` is already shaped as `{ src, alt }`, which is
 * exactly the `BannerImageSlide` shape this component expects — no mapping
 * needed for a single image, and a one-line `.map()` for the slider.
 *
 * // Single image, no slider — uses ONE image from data.tsx
 * import { GALLERY_ITEMS } from './data'; // adjust path to wherever data.tsx lives
 *
 * <BannerSection
 *   media={{ type: 'image', images: [GALLERY_ITEMS[0].image] }}
 *   eyebrow="Limited Time"
 *   heading="The Oud Edit"
 *   subheading="Rare distillations, released for one week only."
 *   ctaText="Shop the Edit"
 *   ctaHref="/collections/oud-edit"
 * />
 *
 * // Multiple images -> auto slider — uses ALL images from data.tsx
 * import { GALLERY_ITEMS } from './data';
 *
 * <BannerSection
 *   media={{
 *     type: 'image',
 *     images: GALLERY_ITEMS.map((item) => item.image),
 *   }}
 *   heading="Winter Arrivals"
 * />
 *
 * // Video banner (data.tsx has no video entries yet — keep using a real file)
 * <BannerSection
 *   media={{ type: 'video', src: '/banner/reel.mp4', poster: '/banner/reel-poster.jpg' }}
 *   heading="Crafted in Small Batches"
 * />
 *
 * Then in your page (e.g. app/(site)/page.tsx):
 *   <BannerSection media={...} />
 *   <HeroSection />
 * ---------------------------------------------------------------------
 */

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import Container from '../Container';
import SectionImage from './SectionImage';
import { useReducedMotion } from './use-reduced-motion';

export interface BannerImageSlide {
    src: string;
    alt: string;
}

export type BannerMedia =
    | { type: 'video'; src: string; poster?: string }
    | { type: 'image'; images: BannerImageSlide[] };

export interface BannerSectionProps {
    media: BannerMedia;
    eyebrow?: string;
    heading?: string;
    subheading?: string;
    ctaText?: string;
    ctaHref?: string;
    /** Autoplay interval for the image slider, in ms. Defaults to 5500. */
    autoSlideInterval?: number;
}

export default function BannerSection({
    media,
    eyebrow,
    heading,
    subheading,
    ctaText,
    ctaHref = '/search',
    autoSlideInterval = 5500,
}: BannerSectionProps) {
    const reduceMotion = useReducedMotion();
    const [current, setCurrent] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const touchStartX = useRef<number | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const isImage = media.type === 'image';
    const images = isImage ? media.images : [];
    const isSlider = isImage && images.length > 1;

    const goTo = useCallback(
        (index: number) => {
            if (!images.length) return;
            setCurrent((index + images.length) % images.length);
        },
        [images.length]
    );

    const goNext = useCallback(() => goTo(current + 1), [current, goTo]);
    const goPrev = useCallback(() => goTo(current - 1), [current, goTo]);

    // Auto-advance the slider (only when there's more than one image)
    useEffect(() => {
        if (!isSlider || reduceMotion || isPaused) return;
        const id = window.setInterval(() => {
            setCurrent((prev) => (prev + 1) % images.length);
        }, autoSlideInterval);
        return () => window.clearInterval(id);
    }, [isSlider, reduceMotion, isPaused, images.length, autoSlideInterval]);

    // Respect prefers-reduced-motion for video: pause + show controls instead
    // of forcing autoplay motion on people who've asked for less of it.
    useEffect(() => {
        if (media.type !== 'video' || !videoRef.current) return;
        if (reduceMotion) {
            videoRef.current.pause();
        } else {
            videoRef.current.play().catch(() => {
                /* autoplay can be blocked by the browser; controls remain available */
            });
        }
    }, [media, reduceMotion]);

    const onTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const onTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return;
        const deltaX = e.changedTouches[0].clientX - touchStartX.current;
        const threshold = 40;
        if (deltaX > threshold) goPrev();
        else if (deltaX < -threshold) goNext();
        touchStartX.current = null;
    };

    if (media.type === 'image' && images.length === 0) return null;

    return (
        <section
            className="relative w-full h-[52svh] sm:h-[62svh] md:h-[76svh] lg:h-[88svh] overflow-hidden bg-espresso text-ivory"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={isSlider ? onTouchStart : undefined}
            onTouchEnd={isSlider ? onTouchEnd : undefined}
            aria-roledescription={isSlider ? 'carousel' : undefined}
            aria-label={isSlider ? 'Promotional banner slider' : undefined}
        >
            {/* Media layer */}
            <div className="absolute inset-0">
                {media.type === 'video' ? (
                    <video
                        ref={videoRef}
                        className="absolute inset-0 h-full w-full object-cover"
                        src={media.src}
                        poster={media.poster}
                        autoPlay={!reduceMotion}
                        muted
                        loop
                        playsInline
                        controls={reduceMotion}
                    />
                ) : (
                    images.map((img, i) => (
                        <div
                            key={img.src}
                            className="absolute inset-0 transition-opacity duration-1000"
                            style={{
                                opacity: i === current ? 1 : 0,
                                transitionTimingFunction: 'var(--ease-luxury, ease)',
                            }}
                            aria-hidden={i !== current}
                        >
                            <SectionImage
                                src={img.src}
                                alt={img.alt}
                                priority={i === 0}
                                sizes="100vw"
                                className="object-cover object-center"
                            />
                        </div>
                    ))
                )}

                {/* Gradient overlay for text legibility over image/video */}
                <div
                    className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-espresso/25 to-transparent"
                    aria-hidden
                />
            </div>

            {/* Text / CTA overlay */}
            {(eyebrow || heading || subheading || ctaText) && (
                <Container className="relative z-10 h-full flex items-end pb-8 sm:pb-12 md:pb-16">
                    <div className="max-w-xl">
                        {eyebrow && (
                            <div className="flex items-center gap-3 mb-3">
                                <span className="h-[1px] w-8 bg-antique-gold/70" />
                                <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-antique-gold font-medium">
                                    {eyebrow}
                                </p>
                            </div>
                        )}
                        {heading && (
                            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-fluid-hero leading-[1.1] font-normal text-ivory">
                                {heading}
                            </h2>
                        )}
                        {subheading && (
                            <p className="mt-3 text-sm sm:text-base text-ivory/85 font-light max-w-md">
                                {subheading}
                            </p>
                        )}
                        {ctaText && (
                            <div className="mt-6">
                                <Link
                                    href={ctaHref}
                                    className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-[11px] uppercase tracking-[0.24em] font-medium bg-aged-gold text-accent-on-fill hover:opacity-90 active:opacity-90 transition-opacity duration-500 shadow-sm"
                                >
                                    {ctaText}
                                </Link>
                            </div>
                        )}
                    </div>
                </Container>
            )}

            {/* Slider controls — only rendered when there's more than one image */}
            {isSlider && (
                <>
                    <button
                        type="button"
                        onClick={goPrev}
                        aria-label="Previous slide"
                        className="hidden sm:flex absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-10 h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full bg-ivory/15 text-ivory backdrop-blur-sm hover:bg-ivory/25 transition-colors"
                    >
                        <span aria-hidden>‹</span>
                    </button>
                    <button
                        type="button"
                        onClick={goNext}
                        aria-label="Next slide"
                        className="hidden sm:flex absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-10 h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full bg-ivory/15 text-ivory backdrop-blur-sm hover:bg-ivory/25 transition-colors"
                    >
                        <span aria-hidden>›</span>
                    </button>

                    {/* Dots — always visible, primary nav control on mobile (swipe also works) */}
                    <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
                        {images.map((img, i) => (
                            <button
                                key={img.src}
                                type="button"
                                onClick={() => goTo(i)}
                                aria-label={`Go to slide ${i + 1}`}
                                aria-current={i === current}
                                className={`h-1.5 rounded-full transition-all duration-500 ${i === current ? 'w-6 bg-antique-gold' : 'w-1.5 bg-ivory/50 hover:bg-ivory/80'
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}