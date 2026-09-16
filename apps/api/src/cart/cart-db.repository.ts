import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CartLineItem } from './cart-redis.repository.js';

@Injectable()
export class CartDbRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get or create a Cart for an authenticated user.
   */
  async getOrCreateUserCart(userId: string) {
    let cart = await this.prisma.cart.findFirst({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      // Find or default region
      const region = await this.prisma.region.findFirst();
      const regionId = region?.id ?? 'default-region';
      const currencyCode = region?.currencyCode ?? 'USD';

      cart = await this.prisma.cart.create({
        data: {
          userId,
          regionId,
          currencyCode,
        },
        include: { items: true },
      });
    }

    return cart;
  }

  async getUserCartItems(userId: string): Promise<CartLineItem[]> {
    const cart = await this.prisma.cart.findFirst({
      where: { userId },
      include: { items: true },
    });

    if (!cart) return [];

    return cart.items.map((i) => ({
      variantId: i.variantId,
      quantity: i.quantity,
    }));
  }

  async setUserCartItems(userId: string, items: CartLineItem[]): Promise<void> {
    const cart = await this.getOrCreateUserCart(userId);

    await this.prisma.$transaction(async (tx) => {
      // Delete existing items
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      // Create new items
      for (const item of items) {
        await tx.cartItem.create({
          data: {
            cartId: cart.id,
            variantId: item.variantId,
            quantity: item.quantity,
            priceSnapshotMinor: 0, // Placeholder per Phase 4 (live price used)
          },
        });
      }
    });
  }

  async clearUserCart(userId: string): Promise<void> {
    const cart = await this.prisma.cart.findFirst({ where: { userId } });
    if (cart) {
      await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
  }
}
