'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { detectGccCountryFromTimezone, COUNTRY_CURRENCY_MAP, GCC_COUNTRIES } from '../../lib/pricing';

export type CurrencyCode = 'AED' | 'SAR' | 'QAR' | 'KWD' | 'OMR' | 'BHD';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rate: number; // multiplier relative to base (AED)
  flag: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  AED: { code: 'AED', symbol: 'AED ', name: 'UAE Dirham',      rate: 1.0,   flag: '🇦🇪' },
  SAR: { code: 'SAR', symbol: 'SAR ', name: 'Saudi Riyal',     rate: 1.02,  flag: '🇸🇦' },
  QAR: { code: 'QAR', symbol: 'QAR ', name: 'Qatari Riyal',   rate: 0.99,  flag: '🇶🇦' },
  KWD: { code: 'KWD', symbol: 'KWD ', name: 'Kuwaiti Dinar',  rate: 0.084, flag: '🇰🇼' },
  OMR: { code: 'OMR', symbol: 'OMR ', name: 'Omani Rial',     rate: 0.105, flag: '🇴🇲' },
  BHD: { code: 'BHD', symbol: 'BHD ', name: 'Bahraini Dinar', rate: 0.102, flag: '🇧🇭' },
};

// GCC country codes (ISO alpha-2)
export const GCC_COUNTRY_CODES = ['AE', 'SA', 'KW', 'QA', 'OM', 'BH'] as const;
export type GccCountryCode = typeof GCC_COUNTRY_CODES[number];

interface CurrencyContextType {
  currency: CurrencyConfig;
  countryCode: GccCountryCode;     // Currently selected GCC delivery country
  isGccVisitor: boolean;           // false when IP/timezone detected as outside GCC
  hasStoredPreference: boolean;    // true once user explicitly chose a country
  setCurrency: (code: CurrencyCode) => void;
  setCountry: (countryCode: GccCountryCode) => void;
  formatPrice: (amountInBase: number, regionalPrices?: Record<string, number | undefined>) => string;
  resolvePrice: (amountInBase: number, regionalPrices?: Record<string, number | undefined>) => number;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  showGccBanner: boolean;          // true when international visitor, no stored preference
  dismissGccBanner: () => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyConfig>(CURRENCIES.AED);
  const [countryCode, setCountryCodeState] = useState<GccCountryCode>('AE');
  const [isGccVisitor, setIsGccVisitor] = useState(true);
  const [hasStoredPreference, setHasStoredPreference] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showGccBanner, setShowGccBanner] = useState(false);

  useEffect(() => {
    // 1. Restore saved preference first
    const savedCountry = localStorage.getItem('oudnomad_country') as GccCountryCode | null;
    const savedCurrency = localStorage.getItem('oudnomad_currency') as CurrencyCode | null;
    const bannerDismissed = localStorage.getItem('oudnomad_banner_dismissed') === 'true';

    if (savedCountry && GCC_COUNTRY_CODES.includes(savedCountry) && savedCurrency && CURRENCIES[savedCurrency]) {
      setCountryCodeState(savedCountry);
      setCurrencyState(CURRENCIES[savedCurrency]);
      setHasStoredPreference(true);
      setIsGccVisitor(true);
      return;
    }

    // 2. Auto-detect via timezone
    const detected = detectGccCountryFromTimezone();
    if (detected && GCC_COUNTRY_CODES.includes(detected as GccCountryCode)) {
      const detectedCountry = detected as GccCountryCode;
      const detectedCurrency = COUNTRY_CURRENCY_MAP[detectedCountry] as CurrencyCode;
      setCountryCodeState(detectedCountry);
      setCurrencyState(CURRENCIES[detectedCurrency]);
      setIsGccVisitor(true);
      setHasStoredPreference(false);
    } else {
      // Outside GCC — default to UAE/AED, show banner
      setCountryCodeState('AE');
      setCurrencyState(CURRENCIES.AED);
      setIsGccVisitor(false);
      if (!bannerDismissed) {
        setShowGccBanner(true);
      }
    }
  }, []);

  const setCountry = (code: GccCountryCode) => {
    if (!GCC_COUNTRY_CODES.includes(code)) return;
    const mappedCurrency = COUNTRY_CURRENCY_MAP[code] as CurrencyCode;
    setCountryCodeState(code);
    setCurrencyState(CURRENCIES[mappedCurrency]);
    setHasStoredPreference(true);
    setIsGccVisitor(true);
    setShowGccBanner(false);
    localStorage.setItem('oudnomad_country', code);
    localStorage.setItem('oudnomad_currency', mappedCurrency);
  };

  const setCurrency = (code: CurrencyCode) => {
    if (CURRENCIES[code]) {
      setCurrencyState(CURRENCIES[code]);
      // Also sync country to match currency
      const matchedCountry = GCC_COUNTRIES.find((c) => c.currency === code);
      if (matchedCountry) {
        setCountryCodeState(matchedCountry.code as GccCountryCode);
        localStorage.setItem('oudnomad_country', matchedCountry.code);
      }
      localStorage.setItem('oudnomad_currency', code);
    }
  };

  const dismissGccBanner = () => {
    setShowGccBanner(false);
    localStorage.setItem('oudnomad_banner_dismissed', 'true');
  };

  const resolvePrice = (
    amountInBase: number,
    regionalPrices?: Record<string, number | undefined>
  ): number => {
    if (
      regionalPrices &&
      regionalPrices[currency.code] !== undefined &&
      Number(regionalPrices[currency.code]) > 0
    ) {
      return Number(regionalPrices[currency.code]);
    }
    const converted = amountInBase * currency.rate;
    if (['KWD', 'OMR', 'BHD'].includes(currency.code)) {
      return Math.round(converted * 100) / 100;
    }
    return Math.round(converted / 5) * 5;
  };

  const formatPrice = (
    amountInBase: number,
    regionalPrices?: Record<string, number | undefined>
  ): string => {
    if (
      regionalPrices &&
      regionalPrices[currency.code] !== undefined &&
      Number(regionalPrices[currency.code]) > 0
    ) {
      const exact = Number(regionalPrices[currency.code]);
      if (['KWD', 'OMR', 'BHD'].includes(currency.code)) {
        return `${currency.symbol}${exact.toFixed(2)}`;
      }
      return `${currency.symbol}${exact.toLocaleString()}`;
    }

    const converted = amountInBase * currency.rate;
    if (['KWD', 'OMR', 'BHD'].includes(currency.code)) {
      return `${currency.symbol}${converted.toFixed(2)}`;
    }
    return `${currency.symbol}${Math.round(converted).toLocaleString()}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        countryCode,
        isGccVisitor,
        hasStoredPreference,
        setCurrency,
        setCountry,
        formatPrice,
        resolvePrice,
        isModalOpen,
        setIsModalOpen,
        showGccBanner,
        dismissGccBanner,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    return {
      currency: CURRENCIES.AED,
      countryCode: 'AE' as GccCountryCode,
      isGccVisitor: true,
      hasStoredPreference: false,
      setCurrency: () => {},
      setCountry: () => {},
      formatPrice: (amount: number, regionalPrices?: Record<string, number | undefined>) => {
        if (regionalPrices && regionalPrices['AED']) return `AED ${regionalPrices['AED']}`;
        return `AED ${amount.toLocaleString()}`;
      },
      resolvePrice: (amount: number, regionalPrices?: Record<string, number | undefined>) => {
        if (regionalPrices && regionalPrices['AED']) return Number(regionalPrices['AED']);
        return amount;
      },
      isModalOpen: false,
      setIsModalOpen: () => {},
      showGccBanner: false,
      dismissGccBanner: () => {},
    };
  }
  return context;
}
