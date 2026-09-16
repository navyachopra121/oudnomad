import { Injectable, Inject, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS_CLIENT } from '../redis/redis.provider.js';
import { ConfigService } from '@nestjs/config';

export interface CartLineItem {
  variantId: string;
  quantity: number;
}

@Injectable()
export class CartRedisRepository {
  private readonly logger = new Logger(CartRedisRepository.name);
  private readonly ttlSeconds: number;
  private readonly memoryFallback = new Map<string, CartLineItem[]>();

  constructor(
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    private readonly config: ConfigService,
  ) {
    const days = Number(this.config.get<string>('GUEST_CART_TTL_DAYS') ?? 30);
    this.ttlSeconds = days * 24 * 60 * 60;
  }

  private getKey(sessionId: string): string {
    return `cart:guest:${sessionId}`;
  }

  async getGuestCart(sessionId: string): Promise<CartLineItem[]> {
    try {
      if (this.redis.status === 'ready') {
        const raw = await this.redis.get(this.getKey(sessionId));
        if (!raw) return [];
        await this.redis.expire(this.getKey(sessionId), this.ttlSeconds).catch(() => {});
        return JSON.parse(raw) as CartLineItem[];
      }
    } catch (err: any) {
      this.logger.warn(`Redis get error: ${err.message}. Using memory fallback.`);
    }
    return this.memoryFallback.get(sessionId) ?? [];
  }

  async setGuestCart(sessionId: string, items: CartLineItem[]): Promise<void> {
    try {
      if (this.redis.status === 'ready') {
        const key = this.getKey(sessionId);
        if (items.length === 0) {
          await this.redis.del(key);
        } else {
          await this.redis.set(key, JSON.stringify(items), 'EX', this.ttlSeconds);
        }
        return;
      }
    } catch (err: any) {
      this.logger.warn(`Redis set error: ${err.message}. Using memory fallback.`);
    }

    if (items.length === 0) {
      this.memoryFallback.delete(sessionId);
    } else {
      this.memoryFallback.set(sessionId, items);
    }
  }

  async clearGuestCart(sessionId: string): Promise<void> {
    try {
      if (this.redis.status === 'ready') {
        await this.redis.del(this.getKey(sessionId));
      }
    } catch (_err) {}
    this.memoryFallback.delete(sessionId);
  }
}
