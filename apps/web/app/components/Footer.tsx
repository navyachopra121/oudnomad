'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import Container from './Container';
import { useCurrency } from './concierge/CurrencyContext';

const QUICK_LINKS = [
  { label: 'CATALOGUE', href: '/collections' },
  { label: 'GCC SHIPPING', href: '/collections' },
  { label: 'MY ACCOUNT', href: '/account' },
  { label: 'ABOUT US', href: '/about' },
  { label: 'PRIVACY POLICY', href: '/legal/privacy' },
  { label: 'SHIPPING & RETURNS', href: '/legal/shipping' },
  { label: 'TERMS OF SERVICE', href: '/legal/terms' },
];

export default function Footer() {
  const { currency, setIsModalOpen } = useCurrency();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#000000] text-white border-t border-[#d89527]/30 mt-auto font-sans">
      <Container className="py-14 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
          {/* Col 1: Brand Logo & About Oud Nomad */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logo.png"
                alt="Oud Nomad Dubai"
                width={180}
                height={60}
                className="object-contain max-h-16 w-auto"
                style={{ filter: 'brightness(0) saturate(100%) invert(62%) sepia(68%) saturate(450%) hue-rotate(3deg) brightness(95%) contrast(96%)' }}
              />
            </Link>
            <h3 className="font-sans text-[11px] uppercase tracking-[0.24em] text-[#d89527] font-semibold mb-3">
              ABOUT OUD NOMAD
            </h3>
            <p className="text-xs leading-relaxed text-white/80 font-normal">
              Oud Nomad Dubai offers artisanal luxury oriental perfumes, aged pure attars, and bespoke bakhoor incense crafted with rare ingredients for connoisseurs worldwide.
            </p>
          </div>

          {/* Col 2: Customer Care & Express Shipping */}
          <div>
            <h3 className="font-sans text-[11px] uppercase tracking-[0.24em] text-[#d89527] font-semibold mb-4">
              CUSTOMER CARE
            </h3>
            <div className="text-xs leading-relaxed text-white/80 space-y-2">
              <p>Email: <a href="mailto:hello.oudnomaddubai@gmail.com" className="hover:text-[#d89527] transition-colors">hello.oudnomaddubai@gmail.com</a></p>
              <p>Phone: <a href="tel:+97140000000" className="hover:text-[#d89527] transition-colors">+971 4 000 0000</a></p>
              <p className="pt-1 text-[#d89527]">Express Delivery: UAE, Saudi Arabia, Qatar, Kuwait, Oman & Bahrain</p>
            </div>
          </div>

          {/* Col 3: Quick Links */}
          <div>
            <h3 className="font-sans text-[11px] uppercase tracking-[0.24em] text-[#d89527] font-semibold mb-4">
              QUICK LINKS
            </h3>
            <ul className="space-y-2 text-xs font-medium tracking-[0.14em]">
              {QUICK_LINKS.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-white/80 hover:text-[#d89527] transition-colors uppercase"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Newsletter & Social */}
          <div>
            <h3 className="font-sans text-[11px] uppercase tracking-[0.24em] text-[#d89527] font-semibold mb-4">
              GET NOTIFIED ABOUT NEW PRODUCTS
            </h3>
            {subscribed ? (
              <p className="text-xs text-[#d89527] font-medium">Thank you for joining our inner circle.</p>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative border-b border-white/40 focus-within:border-[#d89527] transition-colors">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ENTER YOUR EMAIL"
                    className="w-full bg-transparent py-2 text-xs text-white placeholder:text-white/40 uppercase tracking-wider focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-[#d89527] hover:text-white transition-colors"
                    aria-label="Subscribe"
                  >
                    ➔
                  </button>
                </div>
              </form>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-3 text-[11px] tracking-wider text-[#d89527] font-semibold uppercase">
              <a
                href="https://www.instagram.com/oudnomaddubai?stkn=NWtkMGc4ZmFvc3pv&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                INSTAGRAM
              </a>
              <span>·</span>
              <a
                href="https://x.com/oudnomad?s=11"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                X / TWITTER
              </a>
              <span>·</span>
              <a
                href="https://www.linkedin.com/posts/oud-nomad_oudnomad-luxuryfragrance-activity-7508052849604435968-vmRv?utm_source=share&utm_medium=member_ios&rcm=ACoAAEW4eq0Bm-115qea9ir7xuPfrWztpoN0l_4"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                LINKEDIN
              </a>
              <span>·</span>
              <a
                href="https://pin.it/7xTiv852Y"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                PINTEREST
              </a>
            </div>
          </div>
        </div>
      </Container>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-white/10 py-6 text-center text-[11px] text-white/50 tracking-wider">
        <Container className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>&copy; {new Date().getFullYear()} Oud Nomad Private Limited. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase tracking-wider text-[#d89527] border border-[#d89527]/30 rounded-xs hover:text-white transition-colors"
            >
              <span>{currency.flag}</span>
              <span>{currency.code} ({currency.symbol})</span>
            </button>
          </div>
        </Container>
      </div>
    </footer>
  );
}
