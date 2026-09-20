'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'AED' | 'SAR' | 'INR';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rate: number; // multiplier relative to USD
  flag: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', name: 'United States Dollar', rate: 1.0, flag: '🇺🇸' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92, flag: '🇪🇺' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.78, flag: '🇬🇧' },
  AED: { code: 'AED', symbol: 'AED ', name: 'UAE Dirham', rate: 3.67, flag: '🇦🇪' },
  SAR: { code: 'SAR', symbol: 'SAR ', name: 'Saudi Riyal', rate: 3.75, flag: '🇸🇦' },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 83.5, flag: '🇮🇳' },
};

interface CurrencyContextType {
  currency: CurrencyConfig;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (amountInUSD: number) => string;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyConfig>(CURRENCIES.USD);
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

  const formatPrice = (amountInUSD: number): string => {
    const converted = amountInUSD * currency.rate;
    // Format based on currency type
    if (currency.code === 'INR') {
      return `${currency.symbol}${Math.round(converted).toLocaleString('en-IN')}`;
    }
    if (currency.code === 'AED' || currency.code === 'SAR') {
      return `${currency.symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${currency.symbol}${converted.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
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
