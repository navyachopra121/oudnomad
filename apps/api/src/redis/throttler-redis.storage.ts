import { Injectable, Inject } from '@nestjs/common';
import type { ThrottlerStorage } from '@nestjs/throttler';
import type { ThrottlerStorageRecord } from '@nestjs/throttler/dist/throttler-storage-record.interface.js';
import type { Redis } from 'ioredis';
import { REDIS_CLIENT } from './redis.provider.js';

@Injectable()
export class RedisThrottlerStorage implements ThrottlerStorage {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async increment(
    key: string,
    ttl: number,
    limit: number,
    blockDuration: number,
    throttlerName: string,
  ): Promise<ThrottlerStorageRecord> {
    const ttlSeconds = Math.ceil(ttl / 1000);
    const redisKey = `throttler:${throttlerName}:${key}`;

    try {
      const totalHits = await this.redis.incr(redisKey);
      if (totalHits === 1) {
        await this.redis.expire(redisKey, ttlSeconds);
      }

      const pttl = await this.redis.pttl(redisKey);
      const timeToExpire = pttl > 0 ? Math.ceil(pttl / 1000) : ttlSeconds;
      const isBlocked = totalHits > limit;
      const timeToBlockExpire = isBlocked
        ? blockDuration
          ? Math.ceil(blockDuration / 1000)
          : timeToExpire
        : 0;

      return {
        totalHits,
        timeToExpire,
        isBlocked,
        timeToBlockExpire,
      };
    } catch (_err) {
      return {
        totalHits: 1,
        timeToExpire: Math.ceil(ttl / 1000),
        isBlocked: false,
        timeToBlockExpire: 0,
      };
    }
  }
}
