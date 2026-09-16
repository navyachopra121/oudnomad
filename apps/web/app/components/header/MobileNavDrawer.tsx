'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { IconClose } from './icons';

type CategoryNode = {
  id: string;
  name: string;
  slug: string;
  children: CategoryNode[];
};

type Props = {
  open: boolean;
  onClose: () => void;
  categories: CategoryNode[];
  reduceMotion: boolean;
};

export default function MobileNavDrawer({ open, onClose, categories, reduceMotion }: Props) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  const slide = reduceMotion ? 'none' : 'transform 550ms var(--ease-luxury)';

  return (
    <>
      <div
        className="fixed inset-0 z-[60] bg-obsidian/40 lg:hidden"
        style={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: reduceMotion ? 'none' : 'opacity 400ms var(--ease-luxury)',
        }}
        aria-hidden={!open}
        onClick={onClose}
      />
      <aside
        id="mobile-nav-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className="fixed inset-y-0 left-0 z-[70] w-[min(100vw-3rem,22rem)] bg-ivory border-r border-border shadow-2xl lg:hidden flex flex-col"
        style={{
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: slide,
        }}
        hidden={!open}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <span className="font-display text-xl tracking-[0.12em]">Menu</span>
          <button
            type="button"
            className="min-w-[44px] min-h-[44px] -mr-2 flex items-center justify-center text-antique-gold hover:text-espresso active:text-espresso transition-colors duration-[400ms]"
            aria-label="Close menu"
            onClick={onClose}
          >
            <IconClose className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-muted mb-3">Collections</p>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/search?category=${encodeURIComponent(cat.slug)}`}
                    className="font-display text-lg text-espresso hover:text-antique-gold active:text-antique-gold block py-2.5"
                    onClick={onClose}
                  >
                    {cat.name}
                  </Link>
                  {cat.children.length > 0 ? (
                    <ul className="pl-3 mt-1 space-y-1 border-l border-border">
                      {cat.children.map((child) => (
                        <li key={child.id}>
                          <Link
                            href={`/search?category=${encodeURIComponent(child.slug)}`}
                            className="text-sm text-muted hover:text-antique-gold active:text-antique-gold block py-2"
                            onClick={onClose}
                          >
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3 pt-4 border-t border-border">
            <Link href="/search" className="nav-link block text-xs uppercase tracking-[0.2em] py-2" onClick={onClose}>
              Search catalog
            </Link>
            <Link href="/#heritage" className="nav-link block text-xs uppercase tracking-[0.2em] py-2" onClick={onClose}>
              Our story
            </Link>
            <Link
              href="/account/wishlist"
              className="nav-link block text-xs uppercase tracking-[0.2em] py-2"
              onClick={onClose}
            >
              Wishlist
            </Link>
          </div>
        </nav>

        <div className="px-5 py-4 border-t border-border bg-surface-muted/50">
          <p className="font-arabic text-sm text-muted text-center" dir="rtl" lang="ar">
            عود نوماد — دار عطور
          </p>
        </div>
      </aside>
    </>
  );
}
