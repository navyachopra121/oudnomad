import {
  Injectable,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';

export interface HealthStatus {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
  services: {
    database: 'up' | 'down';
    redis: 'up' | 'down';
  };
  errors?: Record<string, string>;
}

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);
  private redis: Redis;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    const redisUrl = this.config.get<string>('REDIS_URL', 'redis://localhost:6379');
    this.redis = new Redis(redisUrl, { lazyConnect: true, maxRetriesPerRequest: 1 });
  }

  async check(): Promise<HealthStatus> {
    const errors: Record<string, string> = {};

    // Check database (Supabase/PostgreSQL)
    let dbStatus: 'up' | 'down' = 'down';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      dbStatus = 'up';
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`Database health check failed: ${message}`);
      errors['database'] = message;
    }

    // Check Redis
    let redisStatus: 'up' | 'down' = 'down';
    try {
      await this.redis.connect().catch(() => {}); // no-op if already connected
      const pong = await this.redis.ping();
      if (pong === 'PONG') redisStatus = 'up';
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`Redis health check failed: ${message}`);
      errors['redis'] = message;
    }

    const allHealthy = dbStatus === 'up' && redisStatus === 'up';

    const result: HealthStatus = {
      status: allHealthy ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        database: dbStatus,
        redis: redisStatus,
      },
    };

    if (Object.keys(errors).length > 0) {
      result.errors = errors;
    }

    if (!allHealthy) {
      throw new HttpException(result, HttpStatus.SERVICE_UNAVAILABLE);
    }

    return result;
  }
}
