'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type CurrencyCode = 'INR' | 'AED' | 'SAR' | 'QAR' | 'KWD' | 'OMR' | 'BHD' | 'USD';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rate: number; // multiplier relative to base (INR)
  flag: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  INR: { code: 'INR', symbol: '₹ ', name: 'Indian Rupee', rate: 1.0, flag: '🇮🇳' },
  AED: { code: 'AED', symbol: 'AED ', name: 'UAE Dirham', rate: 0.044, flag: '🇦🇪' },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', rate: 0.012, flag: '🇺🇸' },
  SAR: { code: 'SAR', symbol: 'SAR ', name: 'Saudi Riyal', rate: 0.045, flag: '🇸🇦' },
  QAR: { code: 'QAR', symbol: 'QAR ', name: 'Qatari Riyal', rate: 0.044, flag: '🇶🇦' },
  KWD: { code: 'KWD', symbol: 'KWD ', name: 'Kuwaiti Dinar', rate: 0.0037, flag: '🇰🇼' },
  OMR: { code: 'OMR', symbol: 'OMR ', name: 'Omani Rial', rate: 0.0046, flag: '🇴🇲' },
  BHD: { code: 'BHD', symbol: 'BHD ', name: 'Bahraini Dinar', rate: 0.0045, flag: '🇧🇭' },
};

interface CurrencyContextType {
  currency: CurrencyConfig;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (amountInBase: number) => string;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyConfig>(CURRENCIES.AED);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('oudnomad_currency') as CurrencyCode | null;
    if (saved && CURRENCIES[saved]) {
      setCurrencyState(CURRENCIES[saved]);
    }
  }, []);

  const setCurrency = (code: CurrencyCode) => {
    if (CURRENCIES[code]) {
      setCurrencyState(CURRENCIES[code]);
      localStorage.setItem('oudnomad_currency', code);
    }
  };

  const formatPrice = (amountInBase: number): string => {
    const converted = amountInBase * currency.rate;
    if (currency.code === 'INR') {
      return `₹ ${Math.round(converted).toLocaleString('en-IN')}.00`;
    }
    if (['AED', 'SAR', 'QAR'].includes(currency.code)) {
      return `${currency.symbol}${Math.round(converted).toLocaleString()}`;
    }
    if (['KWD', 'OMR', 'BHD'].includes(currency.code)) {
      return `${currency.symbol}${converted.toFixed(2)}`;
    }
    return `${currency.symbol}${converted.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        formatPrice,
        isModalOpen,
        setIsModalOpen,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    // Return fallback for non-provider contexts or server rendering
    return {
      currency: CURRENCIES.USD,
      setCurrency: () => {},
      formatPrice: (amount: number) => `$${amount.toLocaleString()}`,
      isModalOpen: false,
      setIsModalOpen: () => {},
    };
  }
  return context;
}
