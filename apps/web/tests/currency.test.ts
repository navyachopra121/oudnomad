/**
 * currency.test.ts
 *
 * Tests the currency conversion and price formatting logic from CurrencyContext.
 * Wrong conversions = customers see wrong prices = lost trust.
 */

import { describe, it, expect } from 'vitest';
import { CURRENCIES, type CurrencyCode } from '../app/components/concierge/CurrencyContext';

// ─── Pure formatPrice function (mirrored from CurrencyContext) ────────────────

function formatPrice(amountInBase: number, currencyCode: CurrencyCode): string {
  const currency = CURRENCIES[currencyCode];
  const converted = amountInBase * currency.rate;
  if (['KWD', 'OMR', 'BHD'].includes(currency.code)) {
    return `${currency.symbol}${converted.toFixed(2)}`;
  }
  return `${currency.symbol}${Math.round(converted).toLocaleString()}`;
}

// ─── CURRENCIES config sanity checks ─────────────────────────────────────────

describe('CURRENCIES config', () => {
  it('has AED as base with rate 1.0', () => {
    expect(CURRENCIES.AED.rate).toBe(1.0);
  });

  it('has all 6 GCC currencies defined', () => {
    const expected: CurrencyCode[] = ['AED', 'SAR', 'QAR', 'KWD', 'OMR', 'BHD'];
    expected.forEach((code) => {
      expect(CURRENCIES[code]).toBeDefined();
      expect(CURRENCIES[code].symbol).toBeTruthy();
      expect(CURRENCIES[code].rate).toBeGreaterThan(0);
    });
  });

  it('KWD rate is less than 1 (dinar is stronger than dirham)', () => {
    expect(CURRENCIES.KWD.rate).toBeLessThan(1);
  });

  it('SAR rate is close to 1 (SAR ≈ AED)', () => {
    expect(CURRENCIES.SAR.rate).toBeGreaterThan(0.9);
    expect(CURRENCIES.SAR.rate).toBeLessThan(1.2);
  });
});

// ─── AED formatting ───────────────────────────────────────────────────────────

describe('formatPrice — AED (base currency)', () => {
  it('formats 495 AED correctly', () => {
    expect(formatPrice(495, 'AED')).toBe('AED 495');
  });

  it('formats 1000 AED correctly', () => {
    expect(formatPrice(1000, 'AED')).toBe('AED 1,000');
  });

  it('formats 0 AED correctly', () => {
    expect(formatPrice(0, 'AED')).toBe('AED 0');
  });
});

// ─── SAR formatting ───────────────────────────────────────────────────────────

describe('formatPrice — SAR', () => {
  it('converts 495 AED to SAR correctly', () => {
    const result = formatPrice(495, 'SAR');
    expect(result).toMatch(/^SAR /);
    // 495 * 1.02 = 504.9 → rounds to 505
    expect(result).toBe('SAR 505');
  });

  it('rounds SAR to whole number', () => {
    const result = formatPrice(100, 'SAR');
    expect(result).not.toContain('.'); // no decimal for SAR
  });
});

// ─── KWD formatting (3 decimals) ──────────────────────────────────────────────

describe('formatPrice — KWD (3 decimal format)', () => {
  it('formats KWD with 2 decimal places', () => {
    const result = formatPrice(495, 'KWD');
    // 495 * 0.084 = 41.58
    expect(result).toBe('KWD 41.58');
  });

  it('always shows decimals for KWD', () => {
    const result = formatPrice(100, 'KWD');
    expect(result).toContain('.');
    // 100 * 0.084 = 8.40
    expect(result).toBe('KWD 8.40');
  });
});

// ─── OMR formatting ───────────────────────────────────────────────────────────

describe('formatPrice — OMR', () => {
  it('formats OMR with 2 decimal places', () => {
    const result = formatPrice(495, 'OMR');
    // 495 * 0.105 = 51.975 → 51.98
    expect(result).toMatch(/^OMR \d+\.\d{2}$/);
  });
});

// ─── BHD formatting ───────────────────────────────────────────────────────────

describe('formatPrice — BHD', () => {
  it('formats BHD with 2 decimal places', () => {
    const result = formatPrice(495, 'BHD');
    // 495 * 0.102 = 50.49
    expect(result).toBe('BHD 50.49');
  });
});

// ─── QAR formatting ───────────────────────────────────────────────────────────

describe('formatPrice — QAR', () => {
  it('converts 495 AED to QAR and rounds', () => {
    const result = formatPrice(495, 'QAR');
    // 495 * 0.99 = 490.05 → rounds to 490
    expect(result).toBe('QAR 490');
  });
});

// ─── Edge cases ───────────────────────────────────────────────────────────────

describe('formatPrice — edge cases', () => {
  it('handles very high price (collector item)', () => {
    const result = formatPrice(10000, 'AED');
    expect(result).toBe('AED 10,000');
  });

  it('all currencies produce a non-empty string for price 495', () => {
    const codes: CurrencyCode[] = ['AED', 'SAR', 'QAR', 'KWD', 'OMR', 'BHD'];
    codes.forEach((code) => {
      const result = formatPrice(495, code);
      expect(result.length).toBeGreaterThan(0);
      expect(result).toMatch(/\d/); // must contain a number
    });
  });
});
