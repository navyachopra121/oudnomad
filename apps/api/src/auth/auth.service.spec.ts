import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from './lib/password.js';
import { generateOpaqueToken, hashToken } from './lib/tokens.js';

describe('Auth Helpers', () => {
  describe('Argon2 Hashing', () => {
    it('should hash a password and verify it correctly', async () => {
      const password = 'SuperSecretPassword123!';
      const hash = await hashPassword(password);

      expect(hash).toContain('$argon2id$');

      const isValid = await verifyPassword(hash, password);
      expect(isValid).toBe(true);

      const isInvalid = await verifyPassword(hash, 'WrongPassword!');
      expect(isInvalid).toBe(false);
    });
  });

  describe('Opaque Tokens & SHA256 Hashing', () => {
    it('should generate a 64-character hex token and compute stable SHA-256 hash', () => {
      const token1 = generateOpaqueToken();
      const token2 = generateOpaqueToken();

      expect(token1).toHaveLength(64);
      expect(token2).toHaveLength(64);
      expect(token1).not.toBe(token2);

      const hash1 = hashToken(token1);
      const hash2 = hashToken(token1);

      expect(hash1).toHaveLength(64); // SHA-256 hex output is 64 chars
      expect(hash1).toBe(hash2); // Deterministic
    });
  });
});
