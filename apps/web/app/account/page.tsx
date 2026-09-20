'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SiteHeader from '../components/header/SiteHeader';
import Container from '../components/Container';
import { useAuth } from '../components/auth/AuthContext';

export default function AccountDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, setDemoUser } = useAuth();

  useEffect(() => {
    // If not authenticated, auto-load demo VIP profile for immediate preview
    if (!isAuthenticated) {
      setDemoUser();
    }
  }, [isAuthenticated, setDemoUser]);

  const activeUser = user || {
    name: 'Tariq Al-Mansoor',
    email: 'collector@oudnomad.com',
    phone: '+971 50 888 1234',
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-serif">
      <SiteHeader />

      <main className="flex-1 w-full py-6 sm:py-2">
        <Container className="space-y-12">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-border pb-8">
            <div className="space-y-2">
              <span className="text-[10px] font-sans tracking-[0.28em] uppercase text-antique-gold font-medium">
                Collector Sanctuary Hub
              </span>
              <h1 className="font-display text-3xl sm:text-5xl font-normal text-espresso tracking-tight">
                Welcome back, {activeUser.name}
              </h1>
              <p className="text-xs text-muted font-sans">{activeUser.email} • Tier: Royal Collector</p>
            </div>

            <button
              onClick={() => {
                logout();
                router.push('/account/login');
              }}
              className="px-5 py-2.5 border border-border text-muted hover:text-espresso hover:border-antique-gold text-xs uppercase tracking-[0.2em] font-sans transition-colors"
            >
              Sign Out
            </button>
          </div>

          {/* Quick Navigation Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-sans text-xs">
            <Link
              href="/account/orders"
              className="p-5 border border-border bg-surface-muted/50 hover:border-antique-gold transition-all space-y-2 group"
            >
              <div className="text-xl text-antique-gold">📦</div>
              <h3 className="font-display text-base text-espresso group-hover:text-antique-gold transition-colors">
                Order History & Tracking
              </h3>
              <p className="text-[11px] text-muted">View past flacon acquisitions and live courier status.</p>
            </Link>

            <Link
              href="/account/addresses"
              className="p-5 border border-border bg-surface-muted/50 hover:border-antique-gold transition-all space-y-2 group"
            >
              <div className="text-xl text-antique-gold">📍</div>
              <h3 className="font-display text-base text-espresso group-hover:text-antique-gold transition-colors">
                Address Book
              </h3>
              <p className="text-[11px] text-muted">Manage shipping destinations and default delivery addresses.</p>
            </Link>

            <Link
              href="/account/wishlist"
              className="p-5 border border-border bg-surface-muted/50 hover:border-antique-gold transition-all space-y-2 group"
            >
              <div className="text-xl text-antique-gold">❤️</div>
              <h3 className="font-display text-base text-espresso group-hover:text-antique-gold transition-colors">
                Saved Wishlist
              </h3>
              <p className="text-[11px] text-muted">Curated flacons and extraits saved for future releases.</p>
            </Link>

            <Link
              href="/account/settings"
              className="p-5 border border-border bg-surface-muted/50 hover:border-antique-gold transition-all space-y-2 group"
            >
              <div className="text-xl text-antique-gold">⚙️</div>
              <h3 className="font-display text-base text-espresso group-hover:text-antique-gold transition-colors">
                Profile Settings
              </h3>
              <p className="text-[11px] text-muted">Update personal information, phone number, and security.</p>
            </Link>
          </div>

          {/* Recent Order Activity Overview */}
          <div className="space-y-6 font-sans">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="font-display text-2xl text-espresso">Recent Acquisition Activity</h2>
              <Link href="/account/orders" className="text-xs uppercase tracking-widest text-antique-gold hover:underline">
                View All Orders →
              </Link>
            </div>

            <div className="border border-border bg-surface-muted/30 divide-y divide-border text-xs">
              <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <span className="font-semibold text-espresso">Order #OUD-99821</span>
                    <span className="text-muted">• Sept 14, 2026</span>
                    <span className="px-2 py-0.5 bg-deep-emerald/10 text-deep-emerald border border-deep-emerald/20 text-[10px] font-sans uppercase font-medium">
                      In Transit via Courier
                    </span>
                  </div>
                  <p className="text-sm font-serif text-espresso">Malaki Extrait No. 1 (50ml Spray Flacon)</p>
                </div>
                <div className="text-right">
                  <span className="font-serif text-base text-antique-gold font-medium">$450.00 USD</span>
                  <Link href="/account/orders" className="block text-[10px] text-muted hover:text-espresso underline mt-0.5">
                    Track Shipment
                  </Link>
                </div>
              </div>

              <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <span className="font-semibold text-espresso">Order #OUD-98104</span>
                    <span className="text-muted">• Aug 28, 2026</span>
                    <span className="px-2 py-0.5 bg-surface-muted text-muted border border-border text-[10px] font-sans uppercase font-medium">
                      Delivered
                    </span>
                  </div>
                  <p className="text-sm font-serif text-espresso">Noor Pure Attar (3ml Crystal Dipstick Tola)</p>
                </div>
                <div className="text-right">
                  <span className="font-serif text-base text-antique-gold font-medium">$280.00 USD</span>
                  <Link href="/products/noor-pure-attar" className="block text-[10px] text-muted hover:text-espresso underline mt-0.5">
                    Re-order Flacon
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
