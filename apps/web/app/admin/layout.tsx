'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: '📊' },
  { label: 'Products', href: '/admin/products', icon: '🧴' },
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

  useEffect(() => {
    // Client-side authentication check for token / role
    const token = localStorage.getItem('token');
    if (!token) {
      // In dev mode, allow access or check token
      setIsAuthenticated(true);
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role !== 'ADMIN') {
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
    } catch (_) {
      setIsAuthenticated(true);
    }
  }, []);

  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col items-center justify-center p-6">
        <div className="bg-stone-900 border border-red-800/50 p-8 rounded-2xl max-w-md w-full text-center shadow-2xl">
          <div className="text-4xl mb-4">⛔</div>
          <h1 className="text-xl font-bold text-red-400 mb-2">Access Denied</h1>
          <p className="text-sm text-stone-400 mb-6">
            You do not have Administrator permissions required to access the Admin Portal.
          </p>
          <Link
            href="/"
            className="inline-block bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold px-6 py-2.5 rounded-lg text-sm transition-all"
          >
            Return to Storefront
          </Link>
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
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
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

        <div className="p-4 border-t border-stone-800">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold transition-all border border-stone-700/50"
          >
            <span>←</span> Back to Storefront
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-stone-900/60 backdrop-blur-md border-b border-stone-800 px-6 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-sm font-semibold text-stone-300 uppercase tracking-wider">
            {navItems.find((n) => (n.href === '/admin' ? pathname === '/admin' : pathname.startsWith(n.href)))?.label || 'Management Portal'}
          </h2>
          <div className="flex items-center gap-3">
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
