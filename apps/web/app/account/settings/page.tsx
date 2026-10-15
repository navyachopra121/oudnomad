'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import SiteHeader from '../../components/header/SiteHeader';
import Container from '../../components/Container';
import { useAuth } from '../../components/auth/AuthContext';
import { StoreApi } from '../../store-api';

export default function ProfileSettingsPage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (user) {
        const updated = { ...user, name, phone };
        try {
          localStorage.setItem('oudnomad_auth_user', JSON.stringify(updated));
        } catch (_) {}

        try {
          await StoreApi.updateProfile({ name, phone });
        } catch (_) {}
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-serif">
      <SiteHeader />

      <main className="flex-1 w-full py-8 sm:py-12">
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
                  placeholder="Your Full Name"
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
                  readOnly
                  disabled
                  value={email}
                  className="w-full bg-surface-muted/70 border border-border px-3.5 py-2.5 text-muted cursor-not-allowed outline-none"
                />
                <span className="text-[10px] text-muted">Email address is permanently linked to your collector account.</span>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase tracking-wider text-muted font-semibold">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+971 50 123 4567"
                  className="w-full bg-ivory border border-border px-3.5 py-2.5 text-espresso outline-none focus:border-antique-gold"
                />
              </div>

              <div className="pt-4 flex items-center justify-between">
                <Link href="/account" className="text-xs uppercase tracking-wider text-muted hover:text-espresso">
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-aged-gold hover:bg-antique-gold text-accent-on-fill text-xs uppercase tracking-[0.2em] font-medium transition-colors shadow-sm disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>
        </Container>
      </main>
    </div>
  );
}
