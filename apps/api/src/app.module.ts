import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { HealthModule } from './health/health.module.js';
import { VerifyModule } from './verify/verify.module.js';

@Module({
  imports: [
    // Load .env variables globally — all modules can inject ConfigService
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    // Global Prisma client — available in all modules without re-importing
    PrismaModule,
    // Feature modules
    HealthModule,
    VerifyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

