'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import { StoreApi } from '../../store-api';
import { IconChevronDown } from './icons';

type CategoryNode = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  children: CategoryNode[];
};

const FALLBACK_COLLECTIONS: CategoryNode[] = [
  {
    id: 'attars',
    name: 'Pure Attars',
    slug: 'attars',
    description: 'Oil-based concentrates distilled in the old manner.',
    children: [],
  },
  {
    id: 'oud',
    name: 'Oud & Mukhallat',
    slug: 'oud',
    description: 'Rare oud oils and layered mukhallat compositions.',
    children: [],
  },
  {
    id: 'bakhoor',
    name: 'Bakhoor & Incense',
    slug: 'bakhoor',
    description: 'Slow-burning resins for the atelier and home.',
    children: [],
  },
];

type Props = {
  compact: boolean;
  reduceMotion: boolean;
};

export default function CollectionsMegaMenu({ compact, reduceMotion }: Props) {
  const menuId = useId();
  const panelId = `${menuId}-panel`;
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryNode[]>(FALLBACK_COLLECTIONS);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    StoreApi.getCategories()
      .then((tree) => {
        if (!cancelled && tree.length > 0) {
          setCategories(tree as CategoryNode[]);
        }
      })
      .catch(() => {
        /* keep fallback for client preview */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onPointer = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onPointer);
    };
  }, [open]);

  const transitionMs = reduceMotion ? 0 : 320;

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        className="nav-link inline-flex items-center gap-1 text-[11px] sm:text-xs uppercase tracking-[0.22em] font-medium"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        Collections
        <IconChevronDown
          className={`w-3.5 h-3.5 text-antique-gold transition-transform ${open ? 'rotate-180' : ''}`}
          style={{ transitionDuration: reduceMotion ? '0ms' : '400ms' }}
        />
      </button>

      <div
        id={panelId}
        role="region"
        aria-label="Collections"
        className="absolute left-0 top-full pt-4 z-50"
        hidden={!open}
      >
        <div
          className="min-w-[min(100vw-2rem,42rem)] border border-border bg-ivory shadow-[0_24px_60px_-20px_rgba(28,20,15,0.18)] overflow-hidden origin-top"
          style={{
            opacity: open ? 1 : 0,
            transform: open ? 'scaleY(1)' : 'scaleY(0.96)',
            pointerEvents: open ? 'auto' : 'none',
            transition: reduceMotion
              ? 'none'
              : `opacity ${transitionMs}ms var(--ease-luxury), transform ${transitionMs}ms var(--ease-luxury)`,
          }}
        >
          <div className="header-damask-edge" aria-hidden />
          <div className={`grid gap-0 sm:grid-cols-2 lg:grid-cols-3 ${compact ? 'p-4' : 'p-6'}`}>
            {categories.map((cat) => (
              <div key={cat.id} className="border-b sm:border-b-0 sm:border-r border-border/80 last:border-0 p-4 sm:p-5">
                <Link
                  href={`/collections/${encodeURIComponent(cat.slug)}`}
                  className="font-display text-lg text-espresso hover:text-antique-gold transition-colors duration-[400ms]"
                  onClick={() => setOpen(false)}
                >
                  {cat.name}
                </Link>
                {cat.description ? (
                  <p className="mt-2 text-xs text-muted leading-relaxed line-clamp-3">{cat.description}</p>
                ) : null}
                {cat.children.length > 0 ? (
                  <ul className="mt-3 space-y-1.5">
                    {cat.children.map((child) => (
                      <li key={child.id}>
                        <Link
                          href={`/collections/${encodeURIComponent(child.slug)}`}
                          className="text-xs text-muted hover:text-antique-gold transition-colors duration-[400ms]"
                          onClick={() => setOpen(false)}
                        >
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
          <div className="border-t border-border px-5 py-3 bg-surface-muted/60 flex items-center justify-between">
            <Link
              href="/collections"
              className="text-xs uppercase tracking-[0.18em] text-antique-gold hover:text-mahogany transition-colors duration-[400ms]"
              onClick={() => setOpen(false)}
            >
              View full catalog →
            </Link>
            <Link
              href="/reviews"
              className="text-xs uppercase tracking-[0.18em] text-muted hover:text-antique-gold transition-colors duration-[400ms]"
              onClick={() => setOpen(false)}
            >
              Collector Reviews →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
