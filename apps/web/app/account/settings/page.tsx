'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import SiteHeader from '../../components/header/SiteHeader';
import Container from '../../components/Container';
import { useAuth } from '../../components/auth/AuthContext';

export default function ProfileSettingsPage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || 'Tariq Al-Mansoor');
  const [email, setEmail] = useState(user?.email || 'collector@oudnomad.com');
  const [phone, setPhone] = useState(user?.phone || '+971 50 888 1234');
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

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
            <span className="text-antique-gold font-medium shrink-0">Profile Settings</span>
          </nav>

          <div className="border-b border-border pb-6 space-y-2">
            <span className="text-[10px] font-sans tracking-[0.28em] uppercase text-antique-gold font-medium">
              Collector Dossier
            </span>
            <h1 className="font-display text-3xl sm:text-4xl text-espresso tracking-tight">Profile Settings</h1>
          </div>

          <div className="max-w-xl font-sans">
            <form onSubmit={handleSubmit} className="bg-surface-muted/50 border border-border p-8 space-y-6 text-xs">
              {saved && (
                <div className="p-3 bg-deep-emerald/10 border border-deep-emerald/30 text-deep-emerald text-xs font-sans">
                  ✓ Profile settings updated successfully.
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase tracking-wider text-muted font-semibold">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-ivory border border-border px-3.5 py-2.5 text-espresso outline-none focus:border-antique-gold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase tracking-wider text-muted font-semibold">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-ivory border border-border px-3.5 py-2.5 text-espresso outline-none focus:border-antique-gold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase tracking-wider text-muted font-semibold">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-ivory border border-border px-3.5 py-2.5 text-espresso outline-none focus:border-antique-gold"
                />
              </div>

              <div className="pt-4 flex items-center justify-between">
                <Link href="/account" className="text-xs uppercase tracking-wider text-muted hover:text-espresso">
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="px-6 py-3 bg-aged-gold hover:bg-antique-gold text-accent-on-fill text-xs uppercase tracking-[0.2em] font-medium transition-colors shadow-sm"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </Container>
      </main>
    </div>
  );
}
