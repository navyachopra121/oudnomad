import { Module, Global } from '@nestjs/common';
import { redisProvider, REDIS_CLIENT } from './redis.provider.js';
import { RedisCacheService } from './redis-cache.service.js';
import { RedisThrottlerStorage } from './throttler-redis.storage.js';

@Global()
@Module({
  providers: [redisProvider, RedisCacheService, RedisThrottlerStorage],
  exports: [REDIS_CLIENT, RedisCacheService, RedisThrottlerStorage],
})
export class RedisModule {}
