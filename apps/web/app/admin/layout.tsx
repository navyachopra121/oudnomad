'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AdminApi } from './admin-api';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: '📊' },
  { label: 'Products', href: '/admin/products', icon: '🧴' },
  { label: 'Collections', href: '/admin/collections', icon: '🗂️' },
  { label: 'Orders', href: '/admin/orders', icon: '📦' },
  { label: 'Inventory', href: '/admin/inventory', icon: '🏬' },
  { label: 'Users', href: '/admin/users', icon: '👥' },
  { label: 'Reviews', href: '/admin/reviews', icon: '⭐' },
  { label: 'Audit Logs', href: '/admin/audit-logs', icon: '📜' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminUser, setAdminUser] = useState<{ email?: string; role?: string } | null>(null);

  // Login form state for unauthenticated access
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  const checkAuth = () => {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('token') || localStorage.getItem('oudnomad_auth_token')
        : null;

    if (!token) {
      setIsAuthenticated(false);
      setAdminUser(null);
      return;
    }

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        setIsAuthenticated(false);
        return;
      }
      const payload = JSON.parse(atob(parts[1]));

      // Check token expiry
      if (payload.exp && Date.now() / 1000 > payload.exp) {
        localStorage.removeItem('token');
        localStorage.removeItem('oudnomad_auth_token');
        setIsAuthenticated(false);
        setAdminUser(null);
        return;
      }

      if (payload.role !== 'ADMIN') {
        setIsAuthenticated(false);
        setAdminUser({ email: payload.email, role: payload.role });
      } else {
        setIsAuthenticated(true);
        setAdminUser({ email: payload.email, role: payload.role });
      }
    } catch (_) {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError(null);
    try {
      const res = await AdminApi.login({ email: loginEmail, password: loginPassword });
      const token = res.accessToken || res.token;
      if (!token) {
        throw new Error('No access token returned from server');
      }

      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role !== 'ADMIN') {
        throw new Error('This account does not have Administrator privileges');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('oudnomad_auth_token', token);
      setAdminUser({ email: payload.email, role: payload.role });
      setIsAuthenticated(true);
    } catch (err: any) {
      if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
        setLoginError('Cannot reach the API server at http://localhost:3001. Please make sure the backend API is running.');
      } else {
        setLoginError(err.message || 'Authentication failed. Please check credentials.');
      }
    } finally {
      setLoggingIn(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('oudnomad_auth_token');
    setIsAuthenticated(false);
    setAdminUser(null);
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-amber-500 border-t-transparent"></div>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col items-center justify-center p-6">
        <div className="bg-stone-900 border border-stone-800 p-8 rounded-2xl max-w-md w-full shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-stone-950 font-bold text-2xl mx-auto mb-3 shadow-lg">
              O
            </div>
            <h1 className="text-xl font-bold text-stone-100 tracking-wide">OUD NOMAD ATELIER</h1>
            <p className="text-xs text-amber-500 font-semibold tracking-wider uppercase mt-1">
              Production Admin Portal
            </p>
          </div>

          {loginError && (
            <div className="p-3 mb-4 bg-red-950/60 border border-red-800 text-red-300 text-xs rounded-lg">
              {loginError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1">
                Admin Email
              </label>
              <input
                required
                type="email"
                autoComplete="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Enter Your Email Or Phon
                
                e"
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-sm text-stone-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                required
                type="password"
                autoComplete="current-password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-sm text-stone-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold py-2.5 rounded-lg text-sm transition-all shadow-md disabled:opacity-50"
            >
              {loggingIn ? 'Authenticating...' : 'Sign In to Admin Portal'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-stone-800 text-center">
            <Link
              href="/"
              className="text-xs text-stone-400 hover:text-stone-200 transition-colors"
            >
              ← Return to Public Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-stone-900 border-r border-stone-800 flex flex-col shrink-0">
        <div className="p-6 border-b border-stone-800 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-stone-950 font-bold text-lg shadow-md">
              O
            </div>
            <div>
              <div className="font-bold text-stone-100 tracking-wide text-sm">OUD NOMAD</div>
              <div className="text-[10px] text-amber-500 font-semibold tracking-wider uppercase">
                Admin Panel
              </div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'text-stone-400 hover:bg-stone-800/60 hover:text-stone-200'
                  }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-stone-800 space-y-2">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold transition-all border border-stone-700/50"
          >
            <span>←</span> Back to Storefront
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center justify-center gap-2 w-full py-2 px-4 rounded-lg text-red-400 hover:bg-red-950/40 text-xs font-medium transition-all border border-red-900/30"
          >
            <span>🚪</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-stone-900/60 backdrop-blur-md border-b border-stone-800 px-6 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-sm font-semibold text-stone-300 uppercase tracking-wider">
            {navItems.find((n) => (n.href === '/admin' ? pathname === '/admin' : pathname.startsWith(n.href)))?.label || 'Management Portal'}
          </h2>
          <div className="flex items-center gap-4">
            {adminUser?.email && (
              <span className="text-xs text-stone-400 font-mono hidden sm:inline">
                {adminUser.email}
              </span>
            )}
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
              Live Gateway Active
            </span>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

