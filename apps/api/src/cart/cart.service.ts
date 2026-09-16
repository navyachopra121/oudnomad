import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CartRedisRepository, CartLineItem } from './cart-redis.repository.js';
import { CartDbRepository } from './cart-db.repository.js';

export interface CartIdentity {
  userId?: string;
  sessionId?: string;
}

export interface CartResponseItem {
  variantId: string;
  productName: string;
  productSlug: string;
  size: string | null;
  color: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface CartResponse {
  items: CartResponseItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
}

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redisRepo: CartRedisRepository,
    private readonly dbRepo: CartDbRepository,
  ) {}

  /** Get raw line items based on identity branching (Postgres if userId, else Redis) */
  private async getRawItems(identity: CartIdentity): Promise<CartLineItem[]> {
    if (identity.userId) {
      return this.dbRepo.getUserCartItems(identity.userId);
    }
    if (identity.sessionId) {
      return this.redisRepo.getGuestCart(identity.sessionId);
    }
    return [];
  }

  /** Write raw line items based on identity branching */
  private async setRawItems(identity: CartIdentity, items: CartLineItem[]): Promise<void> {
    if (identity.userId) {
      await this.dbRepo.setUserCartItems(identity.userId, items);
    } else if (identity.sessionId) {
      await this.redisRepo.setGuestCart(identity.sessionId, items);
    }
  }

  /**
   * Return normalized cart response with live price calculations from ProductVariant.
   */
  async getCart(identity: CartIdentity): Promise<CartResponse> {
    const rawItems = await this.getRawItems(identity);
    return this.buildNormalizedResponse(rawItems);
  }

  /**
   * Add item to cart with soft stock validation.
   */
  async addItem(identity: CartIdentity, variantId: string, quantity: number): Promise<CartResponse> {
    const variant = await this.prisma.productVariant.findFirst({
      where: { id: variantId, deletedAt: null },
    });
    if (!variant) throw new NotFoundException('Product variant not found');

    const rawItems = await this.getRawItems(identity);
    const existing = rawItems.find((i) => i.variantId === variantId);
    const newQty = (existing?.quantity ?? 0) + quantity;

    if (newQty > variant.stock) {
      throw new BadRequestException(
        `Requested quantity (${newQty}) exceeds available stock (${variant.stock})`,
      );
    }

    if (existing) {
      existing.quantity = newQty;
    } else {
      rawItems.push({ variantId, quantity: newQty });
    }

    await this.setRawItems(identity, rawItems);
    return this.buildNormalizedResponse(rawItems);
  }

  /**
   * Update item quantity (quantity 0 removes item).
   */
  async updateItem(identity: CartIdentity, variantId: string, quantity: number): Promise<CartResponse> {
    if (quantity <= 0) {
      return this.removeItem(identity, variantId);
    }

    const variant = await this.prisma.productVariant.findFirst({
      where: { id: variantId, deletedAt: null },
    });
    if (!variant) throw new NotFoundException('Product variant not found');

    if (quantity > variant.stock) {
      throw new BadRequestException(
        `Requested quantity (${quantity}) exceeds available stock (${variant.stock})`,
      );
    }

    let rawItems = await this.getRawItems(identity);
    const existing = rawItems.find((i) => i.variantId === variantId);

    if (existing) {
      existing.quantity = quantity;
    } else {
      rawItems.push({ variantId, quantity });
    }

    await this.setRawItems(identity, rawItems);
    return this.buildNormalizedResponse(rawItems);
  }

  /**
   * Remove item from cart.
   */
  async removeItem(identity: CartIdentity, variantId: string): Promise<CartResponse> {
    let rawItems = await this.getRawItems(identity);
    rawItems = rawItems.filter((i) => i.variantId !== variantId);

    await this.setRawItems(identity, rawItems);
    return this.buildNormalizedResponse(rawItems);
  }

  /**
   * Clear entire cart.
   */
  async clearCart(identity: CartIdentity): Promise<CartResponse> {
    if (identity.userId) {
      await this.dbRepo.clearUserCart(identity.userId);
    } else if (identity.sessionId) {
      await this.redisRepo.clearGuestCart(identity.sessionId);
    }
    return this.buildNormalizedResponse([]);
  }

  /**
   * Merge guest Redis cart into user's Postgres cart upon login.
   * Caps merged quantity at current variant.stock, skips deleted variants.
   */
  async mergeGuestCartIntoUserCart(userId: string, sessionId: string | undefined): Promise<void> {
    if (!sessionId) return;

    const guestItems = await this.redisRepo.getGuestCart(sessionId);
    if (guestItems.length === 0) {
      await this.redisRepo.clearGuestCart(sessionId);
      return;
    }

    const userItems = await this.dbRepo.getUserCartItems(userId);
    const itemMap = new Map<string, number>();

    userItems.forEach((i) => itemMap.set(i.variantId, i.quantity));

    for (const gItem of guestItems) {
      const variant = await this.prisma.productVariant.findFirst({
        where: { id: gItem.variantId, deletedAt: null },
      });
      // Skip deleted or missing variants
      if (!variant) continue;

      const currentQty = itemMap.get(gItem.variantId) ?? 0;
      const mergedQty = Math.min(currentQty + gItem.quantity, variant.stock);
      itemMap.set(gItem.variantId, mergedQty);
    }

    const mergedItems: CartLineItem[] = Array.from(itemMap.entries()).map(([variantId, quantity]) => ({
      variantId,
      quantity,
    }));

    await this.dbRepo.setUserCartItems(userId, mergedItems);
    await this.redisRepo.clearGuestCart(sessionId);

    this.logger.log(`Merged guest cart for session ${sessionId} into user ${userId}`);
  }

  // ---------------------------------------------------------------------------
  // RESPONSE NORMALIZATION HELPER
  // ---------------------------------------------------------------------------

  private async buildNormalizedResponse(rawItems: CartLineItem[]): Promise<CartResponse> {
    if (rawItems.length === 0) {
      return {
        items: [],
        subtotal: 0,
        taxAmount: 0,
        discountAmount: 0,
        total: 0,
      };
    }

    const variantIds = rawItems.map((i) => i.variantId);
    const variants = await this.prisma.productVariant.findMany({
      where: { id: { in: variantIds }, deletedAt: null },
      include: {
        product: { select: { name: true, slug: true } },
      },
    });

    const variantMap = new Map(variants.map((v) => [v.id, v]));

    const responseItems: CartResponseItem[] = [];
    let subtotal = 0;

    for (const item of rawItems) {
      const variant = variantMap.get(item.variantId);
      if (!variant) continue; // Variant deleted since added — filter out

      const unitPrice = Number(variant.price);
      const lineTotal = Number((unitPrice * item.quantity).toFixed(2));
      subtotal += lineTotal;

      responseItems.push({
        variantId: variant.id,
        productName: variant.product.name,
        productSlug: variant.product.slug,
        size: variant.size,
        color: variant.color,
        unitPrice,
        quantity: item.quantity,
        lineTotal,
      });
    }

    subtotal = Number(subtotal.toFixed(2));
    const taxAmount = 0; // Reserved for Phase 6/7
    const discountAmount = 0; // Reserved for Phase 6/7
    const total = Number((subtotal + taxAmount - discountAmount).toFixed(2));

    return {
      items: responseItems,
      subtotal,
      taxAmount,
      discountAmount,
      total,
    };
  }
}
