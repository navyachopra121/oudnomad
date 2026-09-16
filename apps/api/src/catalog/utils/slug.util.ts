import { customAlphabet } from 'nanoid';

const suffixGen = customAlphabet('0123456789', 4);

/**
 * Convert a display string into a URL-friendly slug.
 */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Generate a unique slug for a given base string.
 * If base slug already exists, appends a 4-digit nanoid numeric suffix until unique.
 */
export async function generateUniqueSlug(
  base: string,
  exists: (slug: string) => Promise<boolean>,
): Promise<string> {
  const baseSlug = slugify(base);
  if (!(await exists(baseSlug))) return baseSlug;
  let candidate: string;
  do {
    candidate = `${baseSlug}-${suffixGen()}`;
  } while (await exists(candidate));
  return candidate;
}
