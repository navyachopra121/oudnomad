/**
 * products-data.test.ts
 *
 * Tests the product catalogue data integrity.
 * Catches missing fields, wrong types, or broken slugs before they hit production.
 */

import { describe, it, expect } from 'vitest';
import { OUD_PRODUCTS, OUD_COLLECTIONS } from '../app/lib/products-data';
import { MAPPED_OUD_PRODUCTS } from '../app/store-api';

// ─── OUD_PRODUCTS raw data validation ────────────────────────────────────────

describe('OUD_PRODUCTS — data integrity', () => {
  it('has at least one product defined', () => {
    expect(OUD_PRODUCTS).toBeDefined();
    // MAPPED_OUD_PRODUCTS is what's actually exported
    expect(MAPPED_OUD_PRODUCTS.length).toBeGreaterThan(0);
  });

  it('every product has a slug (handle)', () => {
    MAPPED_OUD_PRODUCTS.forEach((p) => {
      expect(p.slug, `Missing slug on product: ${p.name}`).toBeTruthy();
      expect(p.slug).not.toContain(' '); // slugs must not have spaces
    });
  });

  it('every product has a name', () => {
    MAPPED_OUD_PRODUCTS.forEach((p) => {
      expect(p.name, `Missing name on product id: ${p.id}`).toBeTruthy();
    });
  });

  it('every product has a price greater than 0', () => {
    MAPPED_OUD_PRODUCTS.forEach((p) => {
      expect(p.price, `Price is 0 or missing for: ${p.name}`).toBeGreaterThan(0);
    });
  });

  it('every product has a currency set to AED', () => {
    MAPPED_OUD_PRODUCTS.forEach((p) => {
      expect(p.currency).toBe('AED');
    });
  });

  it('every product has at least one image', () => {
    MAPPED_OUD_PRODUCTS.forEach((p) => {
      expect(p.images, `No images for: ${p.name}`).toBeTruthy();
      expect(p.images.length, `Empty images array for: ${p.name}`).toBeGreaterThan(0);
      expect(p.images[0]).toMatch(/^https?:\/\//); // must be an absolute URL
    });
  });

  it('every product has a description', () => {
    MAPPED_OUD_PRODUCTS.forEach((p) => {
      expect(p.description, `Missing description for: ${p.name}`).toBeTruthy();
      expect(p.description.length).toBeGreaterThan(20);
    });
  });

  it('every product has a category', () => {
    MAPPED_OUD_PRODUCTS.forEach((p) => {
      expect(p.category, `Missing category for: ${p.name}`).toBeTruthy();
    });
  });

  it('all product slugs are unique (no duplicates)', () => {
    const slugs = MAPPED_OUD_PRODUCTS.map((p) => p.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(slugs.length);
  });

  it('all product IDs are unique', () => {
    const ids = MAPPED_OUD_PRODUCTS.map((p) => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('notes arrays are arrays (not undefined)', () => {
    MAPPED_OUD_PRODUCTS.forEach((p) => {
      if (p.notes) {
        expect(Array.isArray(p.notes.top)).toBe(true);
        expect(Array.isArray(p.notes.heart)).toBe(true);
        expect(Array.isArray(p.notes.base)).toBe(true);
      }
    });
  });

  it('rating is between 1 and 5 if present', () => {
    MAPPED_OUD_PRODUCTS.forEach((p) => {
      if (p.rating !== undefined) {
        expect(p.rating).toBeGreaterThanOrEqual(1);
        expect(p.rating).toBeLessThanOrEqual(5);
      }
    });
  });
});

// ─── OUD_COLLECTIONS validation ───────────────────────────────────────────────

describe('OUD_COLLECTIONS — data integrity', () => {
  it('has at least one collection', () => {
    expect(OUD_COLLECTIONS.length).toBeGreaterThan(0);
  });

  it('every collection has a handle, title, and description', () => {
    OUD_COLLECTIONS.forEach((c) => {
      expect(c.handle, `Missing handle`).toBeTruthy();
      expect(c.title, `Missing title for: ${c.handle}`).toBeTruthy();
      expect(c.description, `Missing description for: ${c.handle}`).toBeTruthy();
    });
  });

  it('includes "all" collection', () => {
    const all = OUD_COLLECTIONS.find((c) => c.handle === 'all');
    expect(all).toBeDefined();
  });
});
