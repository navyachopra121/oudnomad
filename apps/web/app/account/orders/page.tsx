'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import SiteHeader from '../../components/header/SiteHeader';
import Container from '../../components/Container';

interface OrderItem {
  id: string;
  orderNumber: string;
  date: string;
  items: string;
  total: number;
  status: 'In Transit' | 'Processing' | 'Delivered';
  carrier: string;
  trackingNumber: string;
}

const SAMPLE_ORDERS: OrderItem[] = [
  {
    id: 'ord-101',
    orderNumber: 'OUD-99821',
    date: 'Sept 14, 2026',
    items: 'Malaki Extrait No. 1 (50ml Spray Flacon)',
    total: 450,
    status: 'In Transit',
    carrier: 'DHL Express Worldwide Courier',
    trackingNumber: 'DHL-UAE-982173',
  },
  {
    id: 'ord-102',
    orderNumber: 'OUD-98104',
    date: 'Aug 28, 2026',
    items: 'Noor Pure Attar (3ml Crystal Dipstick Tola)',
    total: 280,
    status: 'Delivered',
    carrier: 'FedEx Priority International',
    trackingNumber: 'FDX-88219482',
  },
  {
    id: 'ord-103',
    orderNumber: 'OUD-97210',
    date: 'Jul 12, 2026',
    items: 'Royal Cambodi Reserve (3ml Collector Bottle)',
    total: 620,
    status: 'Delivered',
    carrier: 'DHL Express Worldwide Courier',
    trackingNumber: 'DHL-UAE-119284',
  },
];

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-serif">
      <SiteHeader />

      <main className="flex-1 w-full py-6 sm:py-2">
        <Container className="space-y-10">
          {/* Breadcrumbs */}
          <nav className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.14em] sm:tracking-[0.2em] text-muted flex flex-wrap items-center gap-1.5 sm:gap-2 leading-relaxed py-1">
            <Link href="/" className="hover:text-espresso transition-colors shrink-0">Home</Link>
            <span className="opacity-50">/</span>
            <Link href="/account" className="hover:text-espresso transition-colors shrink-0">Account</Link>
            <span className="opacity-50">/</span>
            <span className="text-antique-gold font-medium shrink-0">Order History</span>
          </nav>

          <div className="border-b border-border pb-6 space-y-2">
            <span className="text-[10px] font-sans tracking-[0.28em] uppercase text-antique-gold font-medium">
              Acquisition History
            </span>
            <h1 className="font-display text-3xl sm:text-4xl text-espresso tracking-tight">
              Orders & Courier Tracking
            </h1>
          </div>

          <div className="space-y-4 font-sans text-xs">
            {SAMPLE_ORDERS.map((order) => (
              <div
                key={order.id}
                className="p-6 border border-border bg-surface-muted/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all hover:border-antique-gold/40"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <span className="font-bold text-espresso text-sm">{order.orderNumber}</span>
                    <span className="text-muted">• {order.date}</span>
                    <span
                      className={`px-2.5 py-0.5 text-[10px] uppercase font-sans font-medium border ${order.status === 'In Transit'
                        ? 'bg-deep-emerald/10 text-deep-emerald border-deep-emerald/30'
                        : 'bg-surface-muted text-muted border-border'
                        }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <p className="font-serif text-base text-espresso">{order.items}</p>
                  <p className="text-[11px] text-muted">Carrier: {order.carrier} (Waybill #{order.trackingNumber})</p>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-border">
                  <span className="font-serif text-lg text-antique-gold font-medium mr-2">
                    ${order.total}.00 USD
                  </span>

                  <Link
                    href={`/account/orders/${order.orderNumber}`}
                    className="px-4 py-2 bg-aged-gold hover:bg-antique-gold text-accent-on-fill text-[10px] uppercase tracking-wider font-medium transition-colors shadow-sm"
                  >
                    Track Dossier →
                  </Link>

                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="px-3 py-2 border border-border text-espresso hover:border-antique-gold text-[10px] uppercase tracking-wider font-medium transition-colors"
                  >
                    Quick View
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Details Modal */}
          {selectedOrder && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/60 backdrop-blur-sm font-sans">
              <div className="bg-ivory border border-border p-8 max-w-lg w-full shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-antique-gold font-medium">
                      Order Dossier
                    </span>
                    <h3 className="font-display text-xl text-espresso">{selectedOrder.orderNumber}</h3>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="text-muted hover:text-espresso">
                    ✕
                  </button>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="p-4 bg-surface-muted/60 border border-border space-y-2">
                    <p className="text-[10px] uppercase tracking-wider text-muted font-semibold">Delivery Status</p>
                    <p className="font-serif text-sm text-espresso font-medium">{selectedOrder.status}</p>
                    <p className="text-muted">{selectedOrder.carrier}</p>
                    <p className="font-mono text-antique-gold font-medium">Waybill: {selectedOrder.trackingNumber}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-wider text-muted font-semibold">Acquired Flacon</p>
                    <div className="flex justify-between font-serif text-sm">
                      <span>{selectedOrder.items}</span>
                      <span className="font-mono text-antique-gold">${selectedOrder.total}.00 USD</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border flex justify-between items-center text-xs">
                    <span className="text-muted">Payment Status: Paid via Stripe</span>
                    <span className="font-serif text-base text-espresso font-medium">Total: ${selectedOrder.total}.00 USD</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-border/80 flex items-center justify-between">
                  <Link
                    href={`/account/orders/${selectedOrder.orderNumber}`}
                    className="text-xs uppercase tracking-wider text-antique-gold hover:text-aged-gold font-medium underline underline-offset-4"
                  >
                    Open Dedicated Tracking Page →
                  </Link>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="px-5 py-2 bg-aged-gold text-accent-on-fill text-xs uppercase tracking-wider font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </Container>
      </main>
    </div>
  );
}
