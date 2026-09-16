import { Redis } from 'ioredis';
import { Logger } from '@nestjs/common';

export const REDIS_CLIENT = 'REDIS_CLIENT';

export const redisProvider = {
  provide: REDIS_CLIENT,
  useFactory: () => {
    const logger = new Logger('RedisProvider');
    const url = process.env.REDIS_URL ?? 'redis://localhost:6379';
    const client = new Redis(url, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      retryStrategy: (times: number) => {
        if (times > 3) {
          logger.warn('Redis connection failed after 3 attempts — falling back to memory store for dev');
          return null;
        }
        return Math.min(times * 100, 3000);
      },
    });

    client.on('error', (err: Error) => {
      logger.warn(`Redis client error: ${err.message}`);
    });

    client.connect().catch((err: Error) => {
      logger.warn(`Redis connection failed on startup: ${err.message}`);
    });

    return client;
  },
};
