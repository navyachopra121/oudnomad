import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RedisThrottlerStorage } from './throttler-redis.storage.js';

describe('RedisThrottlerStorage', () => {
  let storage: RedisThrottlerStorage;
  let redisMock: any;

  beforeEach(() => {
    redisMock = {
      incr: vi.fn(),
      expire: vi.fn(),
      pttl: vi.fn(),
    };

    storage = new RedisThrottlerStorage(redisMock as any);
  });

  it('should set EXPIRE on first request and return hit record', async () => {
    redisMock.incr.mockResolvedValue(1);
    redisMock.pttl.mockResolvedValue(60000);

    const record = await storage.increment('ip-123', 60000, 5, 0, 'default');

    expect(redisMock.incr).toHaveBeenCalledWith('throttler:default:ip-123');
    expect(redisMock.expire).toHaveBeenCalledWith('throttler:default:ip-123', 60);
    expect(record.totalHits).toBe(1);
    expect(record.isBlocked).toBe(false);
  });

  it('should flag isBlocked = true when hits exceed limit', async () => {
    redisMock.incr.mockResolvedValue(6);
    redisMock.pttl.mockResolvedValue(45000);

    const record = await storage.increment('ip-123', 60000, 5, 0, 'default');

    expect(record.totalHits).toBe(6);
    expect(record.isBlocked).toBe(true);
    expect(record.timeToExpire).toBe(45);
  });

  it('should handle Redis errors gracefully', async () => {
    redisMock.incr.mockRejectedValue(new Error('Redis offline'));

    const record = await storage.increment('ip-123', 60000, 5, 0, 'default');

    expect(record.totalHits).toBe(1);
    expect(record.isBlocked).toBe(false);
  });
});
