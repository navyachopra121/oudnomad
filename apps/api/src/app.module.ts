import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { HealthModule } from './health/health.module.js';
import { VerifyModule } from './verify/verify.module.js';
import { StorageModule } from './storage/storage.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { AddressesModule } from './addresses/addresses.module.js';
import { MailModule } from './mail/mail.module.js';
import { CatalogModule } from './catalog/catalog.module.js';
import { CartModule } from './cart/cart.module.js';
import { RedisModule } from './redis/redis.module.js';
import { OrdersModule } from './orders/orders.module.js';
import { PaymentsModule } from './payments/payments.module.js';
import { RefundsModule } from './refunds/refunds.module.js';
import { AuditLogModule } from './audit-log/audit-log.module.js';
import { InventoryModule } from './inventory/inventory.module.js';
import { DashboardModule } from './dashboard/dashboard.module.js';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard.js';
import { RolesGuard } from './auth/guards/roles.guard.js';
import { KafkaModule } from './kafka/kafka.module.js';
import { NotificationsAdminModule } from './notifications-admin/notifications-admin.module.js';
import { SearchModule } from './search/search.module.js';
import { ReviewsModule } from './reviews/reviews.module.js';
import { RecommendationsModule } from './recommendations/recommendations.module.js';
import { WishlistModule } from './wishlist/wishlist.module.js';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { RedisThrottlerStorage } from './redis/throttler-redis.storage.js';

@Module({
  imports: [
    // Load .env variables globally
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    ThrottlerModule.forRootAsync({
      imports: [RedisModule],
      inject: [RedisThrottlerStorage],
      useFactory: (storage: RedisThrottlerStorage) => ({
        throttlers: [{ ttl: 60000, limit: 100 }],
        storage,
      }),
    }),
    // Core infrastructure
    PrismaModule,
    MailModule,
    StorageModule,
    RedisModule,
    KafkaModule,
    SearchModule,
    ReviewsModule,
    RecommendationsModule,
    WishlistModule,
    // Feature modules
    AuthModule,
    UsersModule,
    AddressesModule,
    CatalogModule,
    CartModule,
    OrdersModule,
    PaymentsModule,
    RefundsModule,
    AuditLogModule,
    InventoryModule,
    DashboardModule,
    HealthModule,
    VerifyModule,
    NotificationsAdminModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Global guards — rate limiting, JWT auth, and role guards
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
