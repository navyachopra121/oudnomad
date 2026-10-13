/**
 * cart-logic.test.ts
 *
 * Tests the pure cart calculation logic extracted from CartContext.
 * These functions are the "money logic" — bugs here = wrong charges.
 */

import { describe, it, expect } from 'vitest';
import type { CartItem } from '../app/components/cart/CartContext';

// ─── Pure functions mirroring CartContext logic ───────────────────────────────
// We test the logic independently so tests are fast and don't need React.

function calcSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function calcTotalItems(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

function addItem(items: CartItem[], newItem: Omit<CartItem, 'id'>): CartItem[] {
  const existingIdx = items.findIndex((item) => item.variantId === newItem.variantId);
  if (existingIdx > -1) {
    const updated = [...items];
    updated[existingIdx] = {
      ...updated[existingIdx],
      quantity: updated[existingIdx].quantity + newItem.quantity,
    };
    return updated;
  }
  return [...items, { ...newItem, id: `${newItem.variantId}-test` }];
}

function updateQuantity(items: CartItem[], variantId: string, quantity: number): CartItem[] {
  if (quantity <= 0) return items.filter((item) => item.variantId !== variantId);
  return items.map((item) => (item.variantId === variantId ? { ...item, quantity } : item));
}

function removeItem(items: CartItem[], variantId: string): CartItem[] {
  return items.filter((item) => item.variantId !== variantId);
}

// ─── Test Fixtures ────────────────────────────────────────────────────────────

const makeCedre = (quantity = 1): Omit<CartItem, 'id'> => ({
  productId: 'prod-cedre',
  variantId: 'prod-cedre-std',
  name: 'Cèdre',
  slug: 'cedre',
  image: '/cedre.jpg',
  price: 495,
  size: '100ml',
  quantity,
});

const makeMalaki = (quantity = 1): Omit<CartItem, 'id'> => ({
  productId: 'prod-malaki',
  variantId: 'prod-malaki-std',
  name: 'Malaki Extrait No. 1',
  slug: 'malaki-extrait',
  image: '/malaki.jpg',
  price: 850,
  size: '50ml',
  quantity,
});

// ─── Subtotal Tests ───────────────────────────────────────────────────────────

describe('calcSubtotal', () => {
  it('returns 0 for an empty cart', () => {
    expect(calcSubtotal([])).toBe(0);
  });

  it('calculates correctly for a single item', () => {
    const items = addItem([], makeCedre(1)) as CartItem[];
    expect(calcSubtotal(items)).toBe(495);
  });

  it('calculates correctly for multiple quantities of the same item', () => {
    const items = addItem([], makeCedre(3)) as CartItem[];
    expect(calcSubtotal(items)).toBe(495 * 3); // 1485
  });

  it('calculates correctly for two different items', () => {
    let items = addItem([], makeCedre(1)) as CartItem[];
    items = addItem(items, makeMalaki(1)) as CartItem[];
    expect(calcSubtotal(items)).toBe(495 + 850); // 1345
  });

  it('calculates correctly for mixed quantities', () => {
    let items = addItem([], makeCedre(2)) as CartItem[];
    items = addItem(items, makeMalaki(3)) as CartItem[];
    expect(calcSubtotal(items)).toBe(495 * 2 + 850 * 3); // 3540
  });

  it('handles large order correctly (no floating point drift)', () => {
    const items = addItem([], makeCedre(100)) as CartItem[];
    expect(calcSubtotal(items)).toBe(49500);
  });
});

// ─── Total Items Tests ────────────────────────────────────────────────────────

describe('calcTotalItems', () => {
  it('returns 0 for empty cart', () => {
    expect(calcTotalItems([])).toBe(0);
  });

  it('counts items correctly', () => {
    let items = addItem([], makeCedre(2)) as CartItem[];
    items = addItem(items, makeMalaki(3)) as CartItem[];
    expect(calcTotalItems(items)).toBe(5);
  });
});

// ─── addItem Tests ────────────────────────────────────────────────────────────

describe('addItem', () => {
  it('adds a new item to an empty cart', () => {
    const items = addItem([], makeCedre());
    expect(items).toHaveLength(1);
    expect(items[0].name).toBe('Cèdre');
    expect(items[0].quantity).toBe(1);
  });

  it('increments quantity when the same variant is added again', () => {
    let items = addItem([], makeCedre(1));
    items = addItem(items, makeCedre(1));
    expect(items).toHaveLength(1); // still 1 line item
    expect(items[0].quantity).toBe(2); // quantity stacked
  });

  it('adds as a separate line item for a different variant', () => {
    let items = addItem([], makeCedre());
    items = addItem(items, makeMalaki());
    expect(items).toHaveLength(2);
  });

  it('stacks quantity correctly when adding 3 then 2 of the same', () => {
    let items = addItem([], makeCedre(3));
    items = addItem(items, makeCedre(2));
    expect(items[0].quantity).toBe(5);
    expect(calcSubtotal(items as CartItem[])).toBe(495 * 5);
  });
});

// ─── updateQuantity Tests ─────────────────────────────────────────────────────

describe('updateQuantity', () => {
  it('updates the quantity of a specific item', () => {
    let items = addItem([], makeCedre(1)) as CartItem[];
    items = updateQuantity(items, 'prod-cedre-std', 4);
    expect(items[0].quantity).toBe(4);
    expect(calcSubtotal(items)).toBe(495 * 4);
  });

  it('removes item when quantity is set to 0', () => {
    let items = addItem([], makeCedre(2)) as CartItem[];
    items = updateQuantity(items, 'prod-cedre-std', 0);
    expect(items).toHaveLength(0);
  });

  it('removes item when quantity is negative', () => {
    let items = addItem([], makeCedre(1)) as CartItem[];
    items = updateQuantity(items, 'prod-cedre-std', -1);
    expect(items).toHaveLength(0);
  });

  it('does not affect other items when updating one', () => {
    let items = addItem([], makeCedre(1)) as CartItem[];
    items = addItem(items, makeMalaki(2)) as CartItem[];
    items = updateQuantity(items, 'prod-cedre-std', 5);
    expect(items.find((i) => i.variantId === 'prod-malaki-std')?.quantity).toBe(2);
  });
});

// ─── removeItem Tests ─────────────────────────────────────────────────────────

describe('removeItem', () => {
  it('removes the correct item', () => {
    let items = addItem([], makeCedre()) as CartItem[];
    items = addItem(items, makeMalaki()) as CartItem[];
    items = removeItem(items, 'prod-cedre-std');
    expect(items).toHaveLength(1);
    expect(items[0].name).toBe('Malaki Extrait No. 1');
  });

  it('does nothing if variant does not exist', () => {
    const items = addItem([], makeCedre()) as CartItem[];
    const result = removeItem(items, 'non-existent-variant');
    expect(result).toHaveLength(1);
  });

  it('empties the cart when the only item is removed', () => {
    let items = addItem([], makeCedre()) as CartItem[];
    items = removeItem(items, 'prod-cedre-std');
    expect(items).toHaveLength(0);
    expect(calcSubtotal(items)).toBe(0);
  });
});
