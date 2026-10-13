// Global test setup
import { vi } from 'vitest';

// Mock localStorage (happy-dom provides it but let's make it robust)
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

// Suppress console.error in tests (cart sync errors are expected)
vi.spyOn(console, 'error').mockImplementation(() => {});
