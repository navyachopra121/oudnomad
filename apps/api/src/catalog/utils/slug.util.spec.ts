import { describe, it, expect } from 'vitest';
import { slugify, generateUniqueSlug } from './slug.util.js';

describe('Slug Utility', () => {
  it('should format base names into url slugs properly', () => {
    expect(slugify(' Royal Oud Extrait de Parfum ')).toBe('royal-oud-extrait-de-parfum');
    expect(slugify('Attar #1 & Rose!')).toBe('attar-1-rose');
  });

  it('should return base slug if not existing', async () => {
    const slug = await generateUniqueSlug('Rose Oud', async () => false);
    expect(slug).toBe('rose-oud');
  });

  it('should append numeric suffix if base slug exists', async () => {
    const existing = new Set(['rose-oud']);
    const slug = await generateUniqueSlug('Rose Oud', async (candidate) => existing.has(candidate));
    expect(slug).toMatch(/^rose-oud-\d{4}$/);
  });
});
