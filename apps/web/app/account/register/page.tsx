'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SiteHeader from '../../components/header/SiteHeader';
import Container from '../../components/Container';
import { useAuth } from '../../components/auth/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await register({ name, email, password, phone });
      router.push('/account');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-serif">
      <SiteHeader />

      <main className="flex-1 w-full py-12 sm:py-20 flex items-center justify-center">
        <Container className="max-w-md w-full font-sans">
          <div className="bg-surface-muted/60 border border-border p-8 sm:p-10 shadow-sm space-y-8">
            <div className="text-center space-y-2">
              <span className="text-[10px] font-sans tracking-[0.28em] uppercase text-antique-gold font-medium">
                Collector Membership
              </span>
              <h1 className="font-display text-3xl text-espresso">Create Account</h1>
              <p className="text-xs text-muted">Join our international sanctuary for exclusive flacon releases.</p>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-700 text-xs font-sans">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase tracking-wider text-muted font-semibold">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tariq Al-Mansoor"
                  className="w-full bg-ivory border border-border px-3.5 py-2.5 text-espresso outline-none focus:border-antique-gold transition-colors"
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
                  placeholder="collector@example.com"
                  className="w-full bg-ivory border border-border px-3.5 py-2.5 text-espresso outline-none focus:border-antique-gold transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase tracking-wider text-muted font-semibold">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+971 50 123 4567"
                  className="w-full bg-ivory border border-border px-3.5 py-2.5 text-espresso outline-none focus:border-antique-gold transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase tracking-wider text-muted font-semibold">
                  Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full bg-ivory border border-border px-3.5 py-2.5 text-espresso outline-none focus:border-antique-gold transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-aged-gold hover:bg-antique-gold text-accent-on-fill font-medium text-xs uppercase tracking-[0.22em] transition-all shadow-sm mt-2"
              >
                {loading ? 'Creating Account...' : 'Register Collector Account'}
              </button>
            </form>

            <p className="text-center text-xs text-muted pt-2">
              Already a member?{' '}
              <Link href="/account/login" className="text-antique-gold hover:underline font-medium">
                Sign In to Vault
              </Link>
            </p>
          </div>
        </Container>
      </main>
    </div>
  );
}
