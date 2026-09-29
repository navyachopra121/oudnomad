'use client';

import React from 'react';
import Link from 'next/link';

export interface BrandLogoProps {
  /**
   * Sizing presets:
   * - 'header': Responsive navbar logo (20px mobile -> 26px desktop)
   * - 'mobile-drawer': Mobile drawer header (19px)
   * - 'footer': Footer section header (21px-24px)
   * - 'sm': Compact / card / modal header (15px)
   */
  variant?: 'header' | 'mobile-drawer' | 'footer' | 'sm';
  align?: 'center' | 'left';
  className?: string;
  asLink?: boolean;
  href?: string;
  showDubai?: boolean;
  onClick?: () => void;
}

export default function BrandLogo({
  variant = 'header',
  align = 'center',
  className = '',
  asLink = true,
  href = '/',
  showDubai = true,
  onClick,
}: BrandLogoProps) {
  // Size classes for OUD NOMAD
  const titleSizeMap = {
    header: 'text-[20px] sm:text-[23px] lg:text-[26px]',
    'mobile-drawer': 'text-[19px]',
    footer: 'text-[21px] sm:text-[24px]',
    sm: 'text-[15px]',
  };

  // Size classes for registered symbol ®
  const regSizeMap = {
    header: 'text-[7.5px] sm:text-[8.5px] lg:text-[9.5px]',
    'mobile-drawer': 'text-[7.5px]',
    footer: 'text-[8px] sm:text-[9px]',
    sm: 'text-[6.5px]',
  };

  // Size classes for DUBAI subtitle
  const dubaiSizeMap = {
    header: 'text-[7.5px] sm:text-[8.5px] lg:text-[9px] mt-1 sm:mt-1.5',
    'mobile-drawer': 'text-[8px] mt-1',
    footer: 'text-[8.5px] sm:text-[9px] mt-1 sm:mt-1.5',
    sm: 'text-[6.5px] mt-0.5',
  };

  const isCenter = align === 'center';

  const logoContent = (
    <div
      className={`relative inline-flex flex-col select-none group transition-all duration-300 ${isCenter ? 'items-center justify-center' : 'items-start justify-start'
        } ${className}`}
    >
      {/* ── Main Brand Title: OUD NOMAD® ── */}
      <div className={`flex items-start leading-none ${isCenter ? 'justify-center' : 'justify-start'}`}>
        <span
          className={`font-sans font-semibold uppercase tracking-[0.18em] sm:tracking-[0.2em] leading-none transition-all duration-300 ${titleSizeMap[variant]}`}
          style={{
            background: 'linear-gradient(90deg, #DA9630 0%, #EACD4D 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            // filter: 'drop-shadow(0 0 1px rgba(218, 150, 48, 0.55)) drop-shadow(0 1px 8px rgba(234, 205, 77, 0.35)) drop-shadow(0 0 16px rgba(234, 205, 77, 0.18))',
          }}
        >
          OUD NOMAD
        </span>
        {/* <span
          className={`font-semibold -mt-1 ml-0.5 sm:ml-1 select-none leading-none ${regSizeMap[variant]}`}
          style={{
            color: '#EACD4D',
            filter: 'drop-shadow(0 0 1px rgba(218, 150, 48, 0.55)) drop-shadow(0 1px 4px rgba(234, 205, 77, 0.35))',
          }}
          aria-hidden="true"
        >
          ®
        </span> */}
      </div>

      {/* ── Subtitle: DUBAI ── */}
      {showDubai && (
        <span
          className={`font-sans font-semibold uppercase tracking-[0.45em] sm:tracking-[0.48em] ${isCenter ? 'pl-[0.45em] sm:pl-[0.48em] text-center' : 'text-left'
            } leading-none transition-all duration-300 ${dubaiSizeMap[variant]}`}
          style={{
            background: 'linear-gradient(90deg, #DA9630 0%, #EACD4D 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 1px rgba(218, 150, 48, 0.5)) drop-shadow(0 1px 6px rgba(234, 205, 77, 0.28))',
          }}
        >
          DUBAI
        </span>
      )}
    </div>
  );

  if (asLink) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={`inline-flex flex-col cursor-pointer group hover:brightness-115 active:scale-[0.99] transition-all duration-300 ${isCenter ? 'items-center justify-center' : 'items-start justify-start'
          }`}
        aria-label="Oud Nomad Dubai Home"
      >
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}
