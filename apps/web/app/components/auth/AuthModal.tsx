'use client';

import React, { useState } from 'react';
import { useAuth } from './AuthContext';

export default function AuthModal() {
  const { isAuthModalOpen, authModalMode, closeAuthModal, openAuthModal, login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(authModalMode || 'login');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Sync mode when context changes
  React.useEffect(() => {
    if (authModalMode) {
      setMode(authModalMode);
    }
    setError(null);
    setSuccessMsg(null);
  }, [authModalMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      setSuccessMsg('Welcome back to the sanctuary.');
      setTimeout(() => {
        closeAuthModal();
      }, 700);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await register({ name, email, password, phone });
      setSuccessMsg('Account created successfully. Welcome to Oud Nomad.');
      setTimeout(() => {
        closeAuthModal();
      }, 700);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={closeAuthModal} />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-md bg-[#121212] border border-[#ffb91d]/30 text-white rounded-none shadow-2xl p-6 sm:p-8 z-10 font-sans">
        {/* Close Button */}
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors p-2 text-lg leading-none"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-1.5 mb-6">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#ffb91d] font-semibold">
            Oud Nomad Dubai
          </span>
          <h2 className="text-2xl font-serif tracking-tight text-white">
            {mode === 'login' ? 'Collector Sign In' : 'Create Your Account'}
          </h2>
          <p className="text-xs text-white/60">
            {mode === 'login'
              ? 'Access your bespoke vault, tracked orders, and rare allocations.'
              : 'Join the international circle for exclusive flacon reserves.'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 border border-white/10 p-1 mb-6 bg-black/40">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`py-2 text-xs uppercase tracking-wider font-medium transition-all ${
              mode === 'login'
                ? 'bg-[#ffb91d] text-black font-semibold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`py-2 text-xs uppercase tracking-wider font-medium transition-all ${
              mode === 'register'
                ? 'bg-[#ffb91d] text-black font-semibold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-950/60 border border-red-500/50 text-red-200 text-xs rounded-none">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs rounded-none">
            {successMsg}
          </div>
        )}

        {/* Form */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="block text-[10px] uppercase tracking-wider text-white/70 font-semibold">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="collector@oudnomaddubai.com"
                className="w-full bg-black/60 border border-white/20 px-3.5 py-2.5 text-white placeholder-white/30 outline-none focus:border-[#ffb91d] transition-colors"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-[10px] uppercase tracking-wider text-white/70 font-semibold">
                  Password
                </label>
                <a
                  href="/account/reset-password"
                  className="text-[10px] text-[#ffb91d]/80 hover:text-[#ffb91d] tracking-wider uppercase transition-colors"
                >
                  Forgot?
                </a>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black/60 border border-white/20 px-3.5 py-2.5 text-white placeholder-white/30 outline-none focus:border-[#ffb91d] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-[#ffb91d] text-black font-semibold uppercase tracking-[0.2em] text-xs hover:bg-[#ffc647] transition-all disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
            <div className="space-y-1">
              <label className="block text-[10px] uppercase tracking-wider text-white/70 font-semibold">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tariq Al-Mansoor"
                className="w-full bg-black/60 border border-white/20 px-3.5 py-2.5 text-white placeholder-white/30 outline-none focus:border-[#ffb91d] transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase tracking-wider text-white/70 font-semibold">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="collector@oudnomaddubai.com"
                className="w-full bg-black/60 border border-white/20 px-3.5 py-2.5 text-white placeholder-white/30 outline-none focus:border-[#ffb91d] transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase tracking-wider text-white/70 font-semibold">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+971 50 123 4567"
                className="w-full bg-black/60 border border-white/20 px-3.5 py-2.5 text-white placeholder-white/30 outline-none focus:border-[#ffb91d] transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase tracking-wider text-white/70 font-semibold">
                Password
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full bg-black/60 border border-white/20 px-3.5 py-2.5 text-white placeholder-white/30 outline-none focus:border-[#ffb91d] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-[#ffb91d] text-black font-semibold uppercase tracking-[0.2em] text-xs hover:bg-[#ffc647] transition-all disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
