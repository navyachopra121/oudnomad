import * as argon2 from 'argon2';

/**
 * Hash a plaintext password using argon2id (OWASP 2026 baseline).
 * memoryCost: 19456 KB (~19 MB), timeCost: 2, parallelism: 1.
 * Targets ~250-500ms per hash on production hardware — tune if needed.
 *
 * NEVER log the plaintext password or the resulting hash.
 */
export const hashPassword = (plain: string): Promise<string> =>
  argon2.hash(plain, {
    type: argon2.argon2id,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  });

/**
 * Verify a plaintext password against a stored argon2 hash.
 * Returns true if it matches, false otherwise.
 */
export const verifyPassword = (hash: string, plain: string): Promise<boolean> =>
  argon2.verify(hash, plain);
