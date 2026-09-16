/** Preview imagery — swap for production assets when ready.
 *  Using picsum.photos seeded placeholders here: unlike a guessed Unsplash
 *  photo ID, a seed-based picsum URL can't 404, since it doesn't depend on
 *  a specific photo existing at that ID. Swap each `src` for real photography
 *  as it becomes available. */

const p = (seed: string, w: number, h: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const HOME_IMAGES = {
  hero: {
    src: p('oud-nomad-desert-dusk', 2400, 1350),
    alt: 'Desert dunes at dusk — Arabian landscape',
  },
  heroBottle: {
    src: p('oud-nomad-signature-bottle', 600, 800),
    alt: 'Signature oud perfume bottle',
  },
  heritage: {
    src: p('oud-nomad-heritage-skyline', 1200, 900),
    alt: 'Dubai skyline and heritage architecture',
  },
} as const;

export type HomeImage = { src: string; alt: string };