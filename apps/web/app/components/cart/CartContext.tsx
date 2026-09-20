'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { StoreApi } from '../../store-api';

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  size: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
  subtotal: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'oudnomad_cart_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (err) {
      console.error('Failed to parse saved cart:', err);
    }

    // Attempt to sync with backend if online
    StoreApi.getCart()
      .then((res) => {
        if (res && Array.isArray(res.items) && res.items.length > 0) {
          // Process backend items
        }
      })
      .catch(() => {
        /* fallback to local state */
      });
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.error('Failed to save cart state:', err);
    }
  }, [items, mounted]);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const addItem = (newItem: Omit<CartItem, 'id'>) => {
    setItems((prev) => {
      const existingIdx = prev.findIndex((item) => item.variantId === newItem.variantId);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += newItem.quantity;
        return updated;
      }
      return [...prev, { ...newItem, id: `${newItem.variantId}-${Date.now()}` }];
    });
    setIsDrawerOpen(true);

    // Sync with NestJS backend asynchronously
    StoreApi.addCartItem(newItem.variantId, newItem.quantity).catch(() => {});
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(variantId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.variantId === variantId ? { ...item, quantity } : item))
    );
    StoreApi.updateCartItem(variantId, quantity).catch(() => {});
  };

  const removeItem = (variantId: string) => {
    setItems((prev) => prev.filter((item) => item.variantId !== variantId));
    StoreApi.removeCartItem(variantId).catch(() => {});
  };

  const clearCart = () => {
    setItems([]);
    StoreApi.clearCart().catch(() => {});
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        subtotal,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
