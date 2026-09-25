'use client';

import Image from 'next/image';
import { FormEvent, useEffect, useState } from 'react';

const POPUP_STORAGE_KEY = 'oudnomad_email_popup_dismissed';
// How many days before showing the popup again after dismiss
const POPUP_COOLDOWN_DAYS = 7;

export default function EmailSignupPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Don't show if already dismissed recently
    try {
      const raw = localStorage.getItem(POPUP_STORAGE_KEY);
      if (raw) {
        const { until } = JSON.parse(raw) as { until: number };
        if (Date.now() < until) return;
      }
    } catch {
      // storage not available — proceed
    }

    // Delay popup so page content loads first
    const timer = setTimeout(() => setVisible(true), 2200);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(
        POPUP_STORAGE_KEY,
        JSON.stringify({ until: Date.now() + POPUP_COOLDOWN_DAYS * 86_400_000 })
      );
    } catch {
      // ignore
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      // Production: send to your newsletter API route
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      });

      if (res.ok) {
        setStatus('success');
        // Close popup after 2.5s on success
        setTimeout(dismiss, 2500);
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg((data as { message?: string }).message ?? 'Something went wrong. Please try again.');
        setStatus('error');
      }
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.');
      setStatus('error');
    }
  };

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm"
        onClick={dismiss}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Get exclusive member offers"
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      >
        <div
          className="relative w-full max-w-[360px] bg-[#0a0a0a] border border-[#d89527]/30 shadow-[0_0_60px_rgba(216,149,39,0.15)] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={dismiss}
            aria-label="Close popup"
            className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center text-white/80 hover:text-[#d89527] transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Headline above image */}
          <div className="px-6 pt-7 pb-4 text-center">
            <p className="font-sans text-sm sm:text-base leading-snug text-white font-light tracking-wide">
              Get access to{' '}
              <span className="text-[#d89527] font-semibold">member only offers</span>{' '}
              and new launches from{' '}
              <span className="font-semibold">Oud Nomad Dubai</span>
            </p>
          </div>

          {/* Product Image */}
          <div className="relative w-full aspect-[4/3] overflow-hidden">
            <Image
              src="/banners.jpg"
              alt="Oud Nomad Dubai luxury fragrances"
              fill
              sizes="360px"
              className="object-cover object-center"
              priority
            />
            {/* Subtle vignette overlay at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60" />
          </div>

          {/* Form Area */}
          <div className="px-5 pb-6 pt-4">
            {status === 'success' ? (
              <div className="text-center py-4">
                <svg className="w-10 h-10 mx-auto mb-3 text-[#d89527]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <p className="text-[#d89527] font-semibold text-sm tracking-wider uppercase">Welcome to the Inner Circle</p>
                <p className="text-white/60 text-xs mt-1">You&apos;ll hear from us soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="flex border border-white/20 focus-within:border-[#d89527] transition-colors mb-3">
                  {/* Email icon */}
                  <span className="flex items-center pl-3 pr-2 text-white/50">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="M2 8l10 6 10-6" />
                    </svg>
                  </span>
                  <input
                    id="popup-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === 'error') setStatus('idle');
                    }}
                    placeholder="Enter Your Email"
                    autoComplete="email"
                    className="flex-1 bg-transparent py-3 pr-3 text-[13px] text-white placeholder:text-white/35 focus:outline-none"
                  />
                </div>

                {status === 'error' && (
                  <p className="text-red-400 text-[11px] mb-3 text-center">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  id="popup-signup-btn"
                  className="w-full py-3.5 bg-[#d89527] hover:bg-[#c58b2b] active:bg-[#b07825] text-black font-bold text-[12px] tracking-[0.28em] uppercase transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      SIGNING UP...
                    </span>
                  ) : (
                    'SIGN UP'
                  )}
                </button>

                <p className="text-white/30 text-[10px] text-center mt-3 tracking-wide">
                  No spam, ever. Unsubscribe anytime.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
