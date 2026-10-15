/**
 * Oud Nomad — GCC Regional Pricing Helper
 *
 * Central pricing resolver used across product cards, PDPs, cart, and checkout.
 * Always resolves to the exact admin-configured price for the selected GCC country,
 * falling back to AED base price × FX rate with luxury rounding.
 */

import { CurrencyCode, CurrencyConfig, CURRENCIES } from '../components/concierge/CurrencyContext';
import { OudProduct, RegionalPricebook } from './products-data';

// ── GCC Country <-> Currency mapping ──────────────────────────────────────────
export const COUNTRY_CURRENCY_MAP: Record<string, CurrencyCode> = {
  AE: 'AED', // United Arab Emirates
  SA: 'SAR', // Saudi Arabia
  KW: 'KWD', // Kuwait
  QA: 'QAR', // Qatar
  OM: 'OMR', // Oman
  BH: 'BHD', // Bahrain
};

// ── GCC Country info ──────────────────────────────────────────────────────────
export interface GccCountry {
  code: string;        // ISO alpha-2: 'AE', 'SA', etc.
  name: string;
  currency: CurrencyCode;
  flag: string;
  dialCode: string;    // telephone dial prefix
  vatNote: string;     // shown in country selector modal
  cities: string[];    // city/emirate list for address dropdown
}

export const GCC_COUNTRIES: GccCountry[] = [
  {
    code: 'AE',
    name: 'United Arab Emirates',
    currency: 'AED',
    flag: '🇦🇪',
    dialCode: '+971',
    vatNote: 'Incl. 5% UAE VAT',
    cities: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'],
  },
  {
    code: 'SA',
    name: 'Saudi Arabia',
    currency: 'SAR',
    flag: '🇸🇦',
    dialCode: '+966',
    vatNote: 'Incl. 15% VAT',
    cities: ['Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam', 'Khobar', 'Tabuk', 'Abha', 'Taif'],
  },
  {
    code: 'KW',
    name: 'Kuwait',
    currency: 'KWD',
    flag: '🇰🇼',
    dialCode: '+965',
    vatNote: 'Tax-Free',
    cities: ['Kuwait City', 'Hawalli', 'Salmiya', 'Farwaniya', 'Ahmadi', 'Jahra'],
  },
  {
    code: 'QA',
    name: 'Qatar',
    currency: 'QAR',
    flag: '🇶🇦',
    dialCode: '+974',
    vatNote: 'Tax-Free',
    cities: ['Doha', 'Al Wakra', 'Al Khor', 'Al Rayyan', 'Lusail', 'Dukhan'],
  },
  {
    code: 'OM',
    name: 'Oman',
    currency: 'OMR',
    flag: '🇴🇲',
    dialCode: '+968',
    vatNote: 'Incl. 5% VAT',
    cities: ['Muscat', 'Salalah', 'Sohar', 'Nizwa', 'Sur', 'Barka'],
  },
  {
    code: 'BH',
    name: 'Bahrain',
    currency: 'BHD',
    flag: '🇧🇭',
    dialCode: '+973',
    vatNote: 'Incl. 10% VAT',
    cities: ['Manama', 'Muharraq', 'Riffa', 'Hamad Town', 'Isa Town', 'Sitra'],
  },
];

export const GCC_COUNTRY_CODES = GCC_COUNTRIES.map((c) => c.code);

/** Look up GCC country by code. Returns undefined if not found. */
export function getGccCountry(code: string): GccCountry | undefined {
  return GCC_COUNTRIES.find((c) => c.code === code);
}

/** Look up GCC country by full name (e.g. "United Arab Emirates"). */
export function getGccCountryByName(name: string): GccCountry | undefined {
  return GCC_COUNTRIES.find((c) => c.name === name);
}

// ── Pricing Resolver ──────────────────────────────────────────────────────────

/**
 * Resolves the price for a product in the given currency.
 *
 * Priority:
 * 1. Admin-configured exact price from `product.regionalPrices[currencyCode]`
 * 2. Fallback: AED base price × currency FX rate → luxury rounding
 *
 * Returns the numeric price in the target currency.
 */
export function resolveProductPrice(
  product: Pick<OudProduct, 'price' | 'regionalPrices'>,
  currencyCode: CurrencyCode,
): number {
  // 1. Prefer admin-set exact price
  const pricebook = product.regionalPrices as RegionalPricebook;
  const exact = pricebook[currencyCode];
  if (exact !== undefined && exact > 0) {
    return exact;
  }

  // 2. Fallback: FX conversion from AED base with luxury rounding
  const cfg: CurrencyConfig = CURRENCIES[currencyCode];
  const converted = product.price * cfg.rate;

  // Luxury rounding: 3-decimal currencies (KWD, OMR, BHD) → 2dp; others → nearest 5
  if (['KWD', 'OMR', 'BHD'].includes(currencyCode)) {
    return Math.round(converted * 100) / 100;
  }
  // Round to nearest 5 for clean price points (e.g. 508 → 510)
  return Math.round(converted / 5) * 5;
}

/**
 * Formats a resolved product price with currency symbol and flag.
 * Never shows a bare number — always explicit code + amount.
 *
 * Examples:
 *   formatProductPrice(product, CURRENCIES.AED) → "AED 495"
 *   formatProductPrice(product, CURRENCIES.KWD) → "KWD 42.00"
 */
export function formatProductPrice(
  product: Pick<OudProduct, 'price' | 'regionalPrices'>,
  currency: CurrencyConfig,
): string {
  const amount = resolveProductPrice(product, currency.code);
  if (['KWD', 'OMR', 'BHD'].includes(currency.code)) {
    return `${currency.symbol}${amount.toFixed(2)}`;
  }
  return `${currency.symbol}${Math.round(amount).toLocaleString()}`;
}

/**
 * Returns a muted approximate USD equivalent string for display alongside
 * GCC prices on the checkout page for international card holders.
 * E.g.: "(~USD 135)"
 */
export function formatUsdEquivalent(amountAed: number): string {
  const usd = amountAed / 3.67; // AED is pegged at ~3.67 per USD
  return `(~USD ${Math.round(usd)})`;
}

// ── Geo-Detection ─────────────────────────────────────────────────────────────

/**
 * Detects the visitor's GCC country from browser timezone.
 * Returns a GCC country code (e.g. 'AE') or null if outside GCC.
 *
 * Used on first visit to auto-select currency and country.
 */
export function detectGccCountryFromTimezone(): string | null {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const tzMap: Record<string, string> = {
      'Asia/Dubai':   'AE',
      'Asia/Riyadh':  'SA',
      'Asia/Kuwait':  'KW',
      'Asia/Qatar':   'QA',
      'Asia/Muscat':  'OM', // Oman shares UTC+4 with UAE but distinct tz
      'Asia/Bahrain': 'BH',
    };
    return tzMap[tz] ?? null;
  } catch {
    return null;
  }
}
