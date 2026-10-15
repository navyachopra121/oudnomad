'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SiteHeader from '../components/header/SiteHeader';
import Container from '../components/Container';
import { useAuth } from '../components/auth/AuthContext';
import { StoreApi } from '../store-api';

interface AccountOrder {
  id: string;
  orderNumber: string;
  date: string;
  items: string;
  total: number;
  currency?: string;
  status: string;
  carrier?: string;
  trackingNumber?: string;
}

export default function AccountDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const [orders, setOrders] = useState<AccountOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;

    async function loadOrders() {
      setLoadingOrders(true);
      try {
        const localOrders: AccountOrder[] = JSON.parse(
          localStorage.getItem('oudnomad_placed_orders') || '[]'
        );

        let remoteOrders: AccountOrder[] = [];
        try {
          const res = await StoreApi.getOrders();
          if (Array.isArray(res)) {
            remoteOrders = res.map((o: any) => ({
              id: o.id || o.orderNumber,
              orderNumber: o.orderNumber || o.id,
              date: o.date || (o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'),
              items: Array.isArray(o.items)
                ? o.items.map((i: any) => `${i.productName || i.name} (${i.variantSize || i.size || '50ml'}) × ${i.quantity || 1}`).join(', ')
                : (typeof o.items === 'string' ? o.items : 'Artisanal Flacon'),
              total: o.total || 0,
              currency: o.currency || 'AED',
              status: o.status || 'Processing',
              carrier: o.carrier || 'DHL Express Worldwide Courier',
              trackingNumber: o.trackingNumber,
            }));
          }
        } catch (_) {
          // Backend offline or empty
        }

        // Merge orders avoiding duplicates by orderNumber
        const merged: AccountOrder[] = [...localOrders];
        for (const r of remoteOrders) {
          if (!merged.some((m) => m.orderNumber === r.orderNumber)) {
            merged.push(r);
          }
        }
        setOrders(merged);
      } catch (err) {
        console.error('Failed to load user orders:', err);
      } finally {
        setLoadingOrders(false);
      }
    }

    loadOrders();
  }, [isAuthenticated]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col font-serif">
        <SiteHeader />
        <main className="flex-1 w-full py-16 sm:py-24 flex items-center justify-center">
          <Container className="max-w-md w-full text-center font-sans space-y-6">
            <div className="p-8 sm:p-10 border border-border bg-surface-muted/50 space-y-6 shadow-sm">
              <span className="text-[10px] font-sans tracking-[0.28em] uppercase text-antique-gold font-medium">
                Collector Sanctuary
              </span>
              <h1 className="font-display text-3xl text-espresso">Portal Authentication</h1>
              <p className="text-xs text-muted leading-relaxed">
                Please sign in to access your bespoke vault, order history, and saved private reserves.
              </p>
              <div className="flex flex-col gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="w-full py-3 bg-antique-gold text-white text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#c99516] transition-colors"
                >
                  Sign In to Sanctuary
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal('register')}
                  className="w-full py-3 border border-border text-espresso text-xs font-semibold uppercase tracking-[0.2em] hover:border-antique-gold transition-colors"
                >
                  Create New Account
                </button>
              </div>
            </div>
          </Container>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-serif">
      <SiteHeader />

      <main className="flex-1 w-full py-8 sm:py-12">
        <Container className="space-y-12">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-border pb-8">
            <div className="space-y-2">
              <span className="text-[10px] font-sans tracking-[0.28em] uppercase text-antique-gold font-medium">
                Collector Sanctuary Hub
              </span>
              <h1 className="font-display text-3xl sm:text-5xl font-normal text-espresso tracking-tight">
                Welcome back, {user.name}
              </h1>
              <p className="text-xs text-muted font-sans">
                {user.email} {user.phone ? `• ${user.phone}` : ''}
              </p>
            </div>

            <button
              onClick={() => {
                logout();
                router.push('/');
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
              <p className="text-[11px] text-muted">Update personal information, phone number, and password.</p>
            </Link>
          </div>

          {/* Recent Order Activity Overview */}
          <div className="space-y-6 font-sans">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="font-display text-2xl text-espresso">Recent Acquisition Activity</h2>
              {orders.length > 0 && (
                <Link href="/account/orders" className="text-xs uppercase tracking-widest text-antique-gold hover:underline">
                  View All Orders →
                </Link>
              )}
            </div>

            {loadingOrders ? (
              <div className="p-8 text-center border border-border bg-surface-muted/30 text-xs text-muted">
                Loading acquisition records...
              </div>
            ) : orders.length === 0 ? (
              <div className="p-10 sm:p-14 text-center border border-border bg-surface-muted/20 space-y-4">
                <div className="text-3xl text-antique-gold opacity-80">🏺</div>
                <h3 className="font-display text-xl text-espresso">No Orders Placed Yet</h3>
                <p className="text-xs text-muted max-w-md mx-auto leading-relaxed">
                  You haven&apos;t placed any orders yet. Once you acquire flacons, your orders, invoice details, and white-glove courier tracking will appear here.
                </p>
                <div className="pt-2">
                  <Link
                    href="/collections"
                    className="inline-block px-6 py-2.5 bg-antique-gold text-white text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#c99516] transition-colors"
                  >
                    Explore Fragrance Catalog →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="border border-border bg-surface-muted/30 divide-y divide-border text-xs">
                {orders.slice(0, 3).map((order) => (
                  <div
                    key={order.id}
                    className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-3 font-mono text-[11px]">
                        <span className="font-semibold text-espresso">Order #{order.orderNumber}</span>
                        <span className="text-muted">• {order.date}</span>
                        <span className="px-2 py-0.5 bg-deep-emerald/10 text-deep-emerald border border-deep-emerald/20 text-[10px] font-sans uppercase font-medium">
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm font-serif text-espresso">{order.items}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-serif text-base text-antique-gold font-medium">
                        {order.currency || 'AED'} {order.total.toLocaleString()}
                      </span>
                      <Link
                        href="/account/orders"
                        className="block text-[10px] text-muted hover:text-espresso underline mt-0.5"
                      >
                        Track Shipment
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Container>
      </main>
    </div>
  );
}
