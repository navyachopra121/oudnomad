'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SiteHeader from '../../components/header/SiteHeader';
import Container from '../../components/Container';
import { useAuth } from '../../components/auth/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, setDemoUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      router.push('/account');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = () => {
    setDemoUser();
    router.push('/account');
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-serif">
      <SiteHeader />

      <main className="flex-1 w-full py-12 sm:py-20 flex items-center justify-center">
        <Container className="max-w-md w-full font-sans">
          <div className="bg-surface-muted/60 border border-border p-8 sm:p-10 shadow-sm space-y-8">
            <div className="text-center space-y-2">
              <span className="text-[10px] font-sans tracking-[0.28em] uppercase text-antique-gold font-medium">
                Collector Sanctuary
              </span>
              <h1 className="font-display text-3xl text-espresso">Customer Sign In</h1>
              <p className="text-xs text-muted">Access your bespoke archives, order history, and vault preferences.</p>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-700 text-xs font-sans">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase tracking-wider text-muted font-semibold">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="collector@example.com"
                  className="w-full bg-ivory border border-border px-3.5 py-2.5 text-espresso outline-none focus:border-antique-gold transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] uppercase tracking-wider text-muted font-semibold">
                    Password
                  </label>
                  <Link href="/account/reset-password" className="text-[10px] text-antique-gold hover:underline">
                    Forgot Password?
                  </Link>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-ivory border border-border px-3.5 py-2.5 text-espresso outline-none focus:border-antique-gold transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-aged-gold hover:bg-antique-gold text-accent-on-fill font-medium text-xs uppercase tracking-[0.22em] transition-all shadow-sm"
              >
                {loading ? 'Authenticating...' : 'Sign In to Vault'}
              </button>
            </form>

            <div className="relative pt-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest text-muted">
                <span className="bg-surface-muted/60 px-3">Instant Preview</span>
              </div>
            </div>

            <button
              onClick={handleDemoSignIn}
              type="button"
              className="w-full py-2.5 border border-antique-gold/60 text-antique-gold hover:bg-aged-gold hover:text-accent-on-fill font-medium text-[10px] uppercase tracking-[0.2em] transition-colors"
            >
              Sign In as VIP Collector (Demo)
            </button>

            <p className="text-center text-xs text-muted pt-2">
              New to OudNomad?{' '}
              <Link href="/account/register" className="text-antique-gold hover:underline font-medium">
                Create Collector Account
              </Link>
            </p>
          </div>
        </Container>
      </main>
    </div>
  );
}
