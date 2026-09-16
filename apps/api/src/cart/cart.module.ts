import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CartService } from './cart.service.js';
import { CartController } from './cart.controller.js';
import { CartRedisRepository } from './cart-redis.repository.js';
import { CartDbRepository } from './cart-db.repository.js';
import { OptionalJwtAuthGuard } from './guards/optional-auth.guard.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { RedisModule } from '../redis/redis.module.js';

@Module({
  imports: [PrismaModule, RedisModule, JwtModule],
  controllers: [CartController],
  providers: [
    CartService,
    CartRedisRepository,
    CartDbRepository,
    OptionalJwtAuthGuard,
  ],
  exports: [CartService, CartRedisRepository, CartDbRepository],
})
export class CartModule {}
