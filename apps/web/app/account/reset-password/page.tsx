'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import SiteHeader from '../../components/header/SiteHeader';
import Container from '../../components/Container';
import { StoreApi } from '../../store-api';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await StoreApi.forgotPassword(email);
    } catch (_) {
      /* simulation */
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-serif">
      <SiteHeader />

      <main className="flex-1 w-full py-12 sm:py-20 flex items-center justify-center">
        <Container className="max-w-md w-full font-sans">
          <div className="bg-surface-muted/60 border border-border p-8 sm:p-10 shadow-sm space-y-6">
            <div className="text-center space-y-2">
              <span className="text-[10px] font-sans tracking-[0.28em] uppercase text-antique-gold font-medium">
                Security Recovery
              </span>
              <h1 className="font-display text-3xl text-espresso">Reset Password</h1>
              <p className="text-xs text-muted">Enter your registered email to receive a secure recovery link.</p>
            </div>

            {submitted ? (
              <div className="p-4 bg-deep-emerald/10 border border-deep-emerald/30 text-deep-emerald text-xs space-y-2 font-sans rounded-none text-center">
                <p className="font-medium text-sm">Recovery Link Sent</p>
                <p className="text-[11px]">
                  If an account is associated with <strong>{email}</strong>, password reset instructions have been dispatched.
                </p>
                <Link href="/account/login" className="inline-block pt-2 text-antique-gold hover:underline uppercase text-[10px] tracking-wider font-semibold">
                  ← Return to Sign In
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase tracking-wider text-muted font-semibold">
                    Registered Email
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-aged-gold hover:bg-antique-gold text-accent-on-fill font-medium text-xs uppercase tracking-[0.22em] transition-all shadow-sm"
                >
                  {loading ? 'Sending Recovery Link...' : 'Dispatch Reset Link'}
                </button>
              </form>
            )}

            <p className="text-center text-xs text-muted">
              Remember your credentials?{' '}
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
