import Link from 'next/link';
import Container from './Container';

const SHOP_LINKS = [
  { label: 'All fragrances', href: '/search' },
  { label: 'Collections', href: '/search' },
  { label: 'Wishlist', href: '/account/wishlist' },
];

const CARE_LINKS = [
  { label: 'Store locator', href: '/stores' },
  { label: 'Track order', href: '/track-order' },
  { label: 'Contact', href: 'mailto:support@oudnomad.com' },
];

const LEGAL_LINKS = [
  { label: 'Privacy', href: '/legal/privacy' },
  { label: 'Terms', href: '/legal/terms' },
  { label: 'Refunds', href: '/legal/refund-policy' },
];

export default function Footer() {
  return (
    <footer className="bg-obsidian text-ivory/75 mt-auto border-t border-antique-gold/35">
      <div className="header-damask-edge opacity-60" aria-hidden />

      <Container className="py-16 md:py-20">
        {/* Collapses to 1-col below md, 2-col at md, 4-col at lg */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1">
            <p className="font-display text-2xl tracking-[0.2em] text-ivory">OUD NOMAD</p>
            <p className="font-arabic text-sm text-ivory/60 mt-2" dir="rtl" lang="ar">
              دار عطور عربية
            </p>
            <p className="mt-5 text-sm leading-relaxed text-ivory/65 max-w-xs">
              Artisanal oud, attars, and mukhallat — composed in Dubai for those who enter expecting another world.
            </p>
            <p className="mt-6 text-xs uppercase tracking-[0.18em] text-champagne-sand/80">
              Visit us in Dubai → <Link href="/stores" className="underline-offset-4 hover:underline active:underline">Store locator</Link>
            </p>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.22em] text-champagne-sand mb-4">Shop</h3>
            <ul className="space-y-3 text-sm">
              {SHOP_LINKS.map((l) => (
                <li key={l.href + l.label}>
                  <Link
                    href={l.href}
                    className="block py-1 hover:text-champagne-sand active:text-champagne-sand transition-colors duration-[400ms]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.22em] text-champagne-sand mb-4">Client care</h3>
            <ul className="space-y-3 text-sm">
              {CARE_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="block py-1 hover:text-champagne-sand active:text-champagne-sand transition-colors duration-[400ms]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.22em] text-champagne-sand mb-4">Legal</h3>
            <ul className="space-y-3 text-sm">
              {LEGAL_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="block py-1 hover:text-champagne-sand active:text-champagne-sand transition-colors duration-[400ms]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex gap-4 text-[10px] uppercase tracking-[0.16em] text-ivory/45">
              <span>Visa</span>
              <span>Mastercard</span>
              <span>Apple Pay</span>
            </div>
          </div>
        </div>
      </Container>

      <div className="border-t border-ivory/10">
        <Container className="py-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between text-xs text-ivory/45">
            <p>© {new Date().getFullYear()} Oud Nomad. All rights reserved.</p>
            <p className="text-ivory/40">support@oudnomad.com · grievance@oudnomad.com</p>
          </div>
        </Container>
      </div>
    </footer>
  );
}
