'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SiteHeader from '../../../components/header/SiteHeader';
import Container from '../../../components/Container';
import { StoreApi, OrderDetail } from '../../../store-api';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function OrderTrackingDossierPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedTracking, setCopiedTracking] = useState(false);

  useEffect(() => {
    async function loadOrder() {
      setLoading(true);
      try {
        const data = await StoreApi.getOrderById(orderId);
        setOrder(data);
      } catch (err) {
        console.error('Failed to load order dossier:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [orderId]);

  const handleCopyWaybill = () => {
    if (!order) return;
    navigator.clipboard.writeText(order.trackingNumber);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col font-serif">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center font-sans text-xs uppercase tracking-[0.25em] text-muted py-32">
          Retrieving atelier order dossier...
        </main>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col font-serif">
        <SiteHeader />
        <main className="flex-1 flex flex-col items-center justify-center text-center py-32 font-sans space-y-4">
          <p className="text-sm text-muted">The requested order dossier could not be located in our archives.</p>
          <Link href="/account/orders" className="text-xs uppercase tracking-[0.2em] text-antique-gold underline">
            Return to Order History
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-serif">
      <SiteHeader />

      <main className="flex-1 w-full py-8 sm:py-14">
        <Container className="max-w-5xl space-y-10">
          {/* Breadcrumbs */}
          <nav className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.16em] text-muted flex flex-wrap items-center gap-1.5 sm:gap-2 leading-relaxed py-1">
            <Link href="/" className="hover:text-espresso transition-colors shrink-0">Home</Link>
            <span className="opacity-50">/</span>
            <Link href="/account" className="hover:text-espresso transition-colors shrink-0">Account</Link>
            <span className="opacity-50">/</span>
            <Link href="/account/orders" className="hover:text-espresso transition-colors shrink-0">Order History</Link>
            <span className="opacity-50">/</span>
            <span className="text-antique-gold font-medium shrink-0">Dossier {order.orderNumber}</span>
          </nav>

          {/* Dossier Header */}
          <div className="border-b border-border pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <span className="text-[10px] font-sans tracking-[0.28em] uppercase text-antique-gold font-medium block">
                Authenticated Order Dossier
              </span>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-espresso tracking-tight">
                Order <span className="font-sans font-medium">{order.orderNumber}</span>
              </h1>
              <p className="text-xs font-sans text-muted">
                Acquisition recorded on <span className="text-espresso font-medium">{order.date}</span> • Payment verified via {order.paymentMethod}
              </p>
            </div>

            <div className="flex items-center gap-3 font-sans">
              <button
                onClick={handlePrint}
                className="px-4 py-2.5 border border-border text-xs uppercase tracking-wider text-espresso hover:border-antique-gold transition-colors inline-flex items-center gap-2"
              >
                <span>🖨️</span> Print Dossier
              </button>
              <Link
                href="/account/orders"
                className="px-4 py-2.5 border border-antique-gold/60 text-antique-gold hover:bg-aged-gold hover:text-accent-on-fill text-xs uppercase tracking-wider font-medium transition-colors"
              >
                All Orders
              </Link>
            </div>
          </div>

          {/* Status & Courier Waybill Bar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
            {/* Courier Waybill Card */}
            <div className="lg:col-span-1 bg-surface-muted/50 border border-border p-6 space-y-4">
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted font-semibold block">
                Courier Transit Waybill
              </span>
              <div>
                <div className="text-xs text-muted mb-1">{order.carrier}</div>
                <div className="font-mono text-sm sm:text-base font-bold text-espresso tracking-wide flex items-center justify-between">
                  <span>{order.trackingNumber}</span>
                  <button
                    onClick={handleCopyWaybill}
                    className="text-[11px] text-antique-gold hover:text-aged-gold uppercase font-sans tracking-wider ml-2"
                  >
                    {copiedTracking ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-border/80 flex items-center justify-between text-xs">
                <span className="text-muted">Estimated Delivery:</span>
                <span className="font-serif text-espresso font-medium">{order.estimatedDelivery}</span>
              </div>

              <div className="pt-1">
                <span
                  className={`inline-flex px-3 py-1 text-[10px] uppercase font-medium tracking-widest border ${
                    order.status === 'Delivered'
                      ? 'bg-deep-emerald/10 text-deep-emerald border-deep-emerald/30'
                      : 'bg-aged-gold/15 text-antique-gold border-antique-gold/40'
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>

            {/* Logistics Timeline */}
            <div className="lg:col-span-2 bg-ivory border border-border p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted font-semibold">
                  Atelier Fulfillment & Journey
                </span>
                <span className="text-[11px] text-antique-gold font-medium">Live Courier Link</span>
              </div>

              {/* Progress Flow */}
              <div className="relative border-l-2 border-antique-gold/30 ml-3 pl-6 space-y-6">
                {order.timeline.map((step, idx) => (
                  <div key={idx} className="relative group">
                    {/* Step Dot */}
                    <div
                      className={`absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full border-2 transition-colors ${
                        step.completed
                          ? 'bg-aged-gold border-ivory ring-2 ring-antique-gold/50'
                          : 'bg-surface-muted border-muted/50'
                      }`}
                    />
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-xs uppercase tracking-wider font-semibold ${step.completed ? 'text-espresso' : 'text-muted'}`}>
                          {step.title}
                        </h4>
                        <span className="text-[10px] text-muted font-mono">{step.date}</span>
                      </div>
                      <p className="text-xs text-muted/90 leading-relaxed font-sans">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Acquired Flacons Table */}
          <div className="bg-surface-muted/30 border border-border overflow-hidden">
            <div className="p-4 sm:p-6 bg-surface-muted/60 border-b border-border flex items-center justify-between">
              <h2 className="font-display text-lg text-espresso tracking-wide">
                Acquired Flacons & Concentrations
              </h2>
              <span className="text-xs font-sans text-muted">
                {order.items.length} {order.items.length === 1 ? 'Flacon' : 'Flacons'}
              </span>
            </div>

            <div className="divide-y divide-border">
              {order.items.map((item) => (
                <div key={item.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 font-sans">
                  <div className="flex items-center gap-5">
                    <div className="w-20 h-24 relative bg-espresso/5 border border-border shrink-0 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Link
                        href={`/products/${item.slug}`}
                        className="font-serif text-lg text-espresso hover:text-antique-gold transition-colors font-medium block"
                      >
                        {item.productName}
                      </Link>
                      <p className="text-xs text-muted font-sans">{item.variantSize}</p>
                      <p className="text-xs text-muted font-sans">Quantity: {item.quantity}</p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-border">
                    <div className="font-serif text-lg text-antique-gold font-medium">
                      ${item.price * item.quantity}.00 USD
                    </div>
                    <Link
                      href={`/products/${item.slug}#reviews`}
                      className="text-[10px] uppercase tracking-[0.2em] font-medium text-antique-gold hover:text-aged-gold underline underline-offset-4 transition-colors"
                    >
                      ★ Review This Fragrance
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Grid: Shipping Destination & Financial Dossier */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
            {/* Delivery Destination */}
            <div className="bg-ivory border border-border p-6 sm:p-8 space-y-4">
              <span className="text-[10px] uppercase tracking-[0.24em] text-antique-gold font-semibold block">
                Shipping Destination
              </span>
              <div className="space-y-1 text-xs text-espresso">
                <p className="font-serif text-sm font-semibold">{order.shippingAddress.name}</p>
                <p className="text-muted">{order.shippingAddress.line1}</p>
                <p className="text-muted">{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                <p className="text-muted">{order.shippingAddress.country}</p>
                {order.shippingAddress.phone && (
                  <p className="text-muted pt-2">Contact: {order.shippingAddress.phone}</p>
                )}
              </div>
            </div>

            {/* Financial Breakdown */}
            <div className="bg-ivory border border-border p-6 sm:p-8 space-y-4">
              <span className="text-[10px] uppercase tracking-[0.24em] text-antique-gold font-semibold block">
                Acquisition Summary
              </span>
              <div className="space-y-3 text-xs border-b border-border pb-4">
                <div className="flex justify-between text-muted">
                  <span>Flacon Subtotal</span>
                  <span className="font-mono text-espresso">${order.subtotal}.00 USD</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Courier Delivery ({order.carrier.includes('DHL') ? 'DHL Express' : 'FedEx Priority'})</span>
                  <span className="text-deep-emerald font-medium uppercase text-[11px]">
                    {order.shipping === 0 ? 'Complimentary' : `$${order.shipping}.00 USD`}
                  </span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Regional Duties & Taxes</span>
                  <span className="font-mono text-espresso">${order.tax}.00 USD</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline pt-1">
                <span className="font-display text-base text-espresso">Total Settlement</span>
                <span className="font-serif text-2xl text-antique-gold font-medium">
                  ${order.total}.00 USD
                </span>
              </div>
              <p className="text-[10px] text-muted tracking-wider">
                All duties prepaid. Securely authenticated and archived.
              </p>
            </div>
          </div>

          {/* Concierge Assistance Footer */}
          <div className="p-6 bg-surface-muted/40 border border-border text-center space-y-2 font-sans">
            <p className="text-xs text-espresso">
              Questions regarding bespoke batch provenance or courier schedule?
            </p>
            <p className="text-xs text-muted">
              Our atelier concierge is at your service 24/7 at{' '}
              <a href="mailto:concierge@oudnomad.com" className="text-antique-gold underline underline-offset-2">
                concierge@oudnomad.com
              </a>
            </p>
          </div>
        </Container>
      </main>
    </div>
  );
}
