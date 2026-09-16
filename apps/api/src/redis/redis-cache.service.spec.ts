import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RedisCacheService } from './redis-cache.service.js';

describe('RedisCacheService', () => {
  let service: RedisCacheService;
  let redisMock: any;

  beforeEach(() => {
    redisMock = {
      get: vi.fn(),
      set: vi.fn(),
      del: vi.fn(),
      keys: vi.fn(),
    };

    service = new RedisCacheService(redisMock as any);
  });

  it('should return null on cache miss', async () => {
    redisMock.get.mockResolvedValue(null);

    const result = await service.get('non-existent');
    expect(result).toBeNull();
  });

  it('should return parsed JSON object on cache hit', async () => {
    const data = { id: 'p-1', name: 'Royal Oud' };
    redisMock.get.mockResolvedValue(JSON.stringify(data));

    const result = await service.get('product:p-1');
    expect(result).toEqual(data);
  });

  it('should set key with EX expiration in seconds', async () => {
    await service.set('product:p-1', { id: 'p-1' }, 300);

    expect(redisMock.set).toHaveBeenCalledWith(
      'product:p-1',
      JSON.stringify({ id: 'p-1' }),
      'EX',
      300,
    );
  });

  it('should delete keys by pattern', async () => {
    redisMock.keys.mockResolvedValue(['product:slug:oud-1', 'product:slug:oud-2']);

    await service.delByPattern('product:slug:*');

    expect(redisMock.del).toHaveBeenCalledWith('product:slug:oud-1', 'product:slug:oud-2');
  });

  it('should handle redis errors gracefully without throwing', async () => {
    redisMock.get.mockRejectedValue(new Error('Redis connection lost'));

    const result = await service.get('product:p-1');
    expect(result).toBeNull();
  });
});
