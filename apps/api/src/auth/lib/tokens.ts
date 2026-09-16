import { createHash, randomBytes } from 'crypto';

/**
 * Generate a cryptographically random 64-char hex opaque token.
 * Used for refresh tokens, email-verification tokens, and password-reset tokens.
 * NEVER store the raw value — always store hashToken(raw) in the DB.
 */
export const generateOpaqueToken = (): string =>
  randomBytes(32).toString('hex');

/**
 * SHA-256 hash of an opaque token for safe DB storage.
 * SHA-256 is appropriate here: these tokens are high-entropy random values,
 * not passwords, so a fast hash is fine and argon2 overhead is unnecessary.
 */
export const hashToken = (token: string): string =>
  createHash('sha256').update(token).digest('hex');
