'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import Container from './Container';
import { useCurrency } from './concierge/CurrencyContext';

// { label: 'STORES & BOUTIQUES', href: '/stores' },


const QUICK_LINKS = [
  { label: 'Catalogue', href: '/collections' },
  { label: 'Fragrance Finder', href: '/fragrance-finder' },
  { label: 'GCC Shipping', href: '/collections' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'My Account', href: '/account' },
  { label: 'About Us', href: '/about' },
  { label: 'Privacy Policy', href: '/legal/privacy' },
  { label: 'Shipping & Returns', href: '/legal/shipping' },
  { label: 'Terms of Service', href: '/legal/terms' },
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
    <footer className="bg-[#000000] text-white mt-auto font-sans">
      <Container className="py-14 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
          {/* Col 1: Brand Logo & About Oud Nomad */}
          <div>
            <div className="mb-4">
              <Link href="/" className="inline-block group" aria-label="Oud Nomad Home">
                <Image
                  src="/oudnomadfinallogo.png"
                  alt="Oud Nomad"
                  width={140}
                  height={138}
                  className="w-24 sm:w-28 h-auto object-contain transition-transform duration-300 group-hover:brightness-110"
                  priority
                />
              </Link>
            </div>
            <h3 className="font-sans text-[11px] uppercase tracking-[0.24em] text-[#ffb91d] font-semibold mb-3">
              ABOUT OUD NOMAD
            </h3>
            <p className="text-xs leading-relaxed text-white font-normal">
              Oud Nomad offers artisanal luxury oriental perfumes and bespoke mists crafted with rare ingredients for connoisseurs worldwide.
            </p>
          </div>

          {/* Col 2: Customer Care & Registered Address */}
          <div>
            <h3 className="font-sans text-[11px] uppercase tracking-[0.24em] text-[#ffb91d] font-semibold mb-4">
              CUSTOMER CARE
            </h3>
            <div className="text-xs leading-relaxed text-white space-y-2 font-normal">
              <p>
                Phone / WhatsApp:{' '}
                <a href="https://wa.me/971585719731" target="_blank" rel="noopener noreferrer" className="hover:text-[#ffb91d] transition-colors underline font-medium">
                  +971 58 571 9731
                </a>
              </p>
              <p>
                Email:{' '}
                <a href="mailto:hello.oudnomaddubai@gmail.com" className="hover:text-[#ffb91d] transition-colors underline">
                  hello.oudnomaddubai@gmail.com
                </a>
              </p>
              <div className="pt-2 text-white/80">
                <p className="text-[10px] uppercase tracking-wider text-[#ffb91d] font-semibold mb-0.5">
                  REGISTERED ADDRESS
                </p>
                <p className="leading-snug text-[11px]">
                  VUET1829, COMPASS BUILDING- AL HULAILA, AL HULAILA INDUSTRIAL ZONE-FZ, RAS AL KHAIMAH, Ras Al Khaimah
                </p>
              </div>
              <p className="pt-1 text-[#ffb91d]">Express Delivery: UAE, Saudi Arabia, Qatar, Kuwait, Oman & Bahrain</p>
            </div>
          </div>

          {/* Col 3: Quick Links */}
          <div>
            <h3 className="font-sans text-[11px] uppercase tracking-[0.24em] text-[#ffb91d] font-semibold mb-4">
              QUICK LINKS
            </h3>
            <ul className="space-y-2 text-xs font-normal tracking-[0.10em]">
              {QUICK_LINKS.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-white hover:text-[#ffb91d] transition-colors capitalize"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Newsletter & Social */}
          <div>
            <h3 className="font-sans text-[11px] uppercase tracking-[0.24em] text-[#ffb91d] font-semibold mb-4">
              GET NOTIFIED ABOUT NEW PRODUCTS
            </h3>
            {subscribed ? (
              <p className="text-xs text-[#ffb91d] font-medium">Thank you for joining our inner circle.</p>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative border-b border-white/40 focus-within:border-[#ffb91d] transition-colors">
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
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-[#ffb91d] hover:text-white transition-colors font-bold"
                    aria-label="Subscribe"
                  >
                    ➔
                  </button>
                </div>
              </form>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-3 text-[11px] tracking-wider text-[#ffb91d] font-semibold uppercase">
              <a
                href="https://www.facebook.com/share/19qn9GNXqL/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                FACEBOOK
              </a>
              <span>·</span>
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
      <div className="border-t border-white/10 py-6 text-center text-[11px] text-white/70 tracking-wider">
        <Container className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>&copy; {new Date().getFullYear()} Oud Nomad Private Limited. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase tracking-wider text-[#ffb91d] border border-[#ffb91d]/30 rounded-xs hover:text-white transition-colors"
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
