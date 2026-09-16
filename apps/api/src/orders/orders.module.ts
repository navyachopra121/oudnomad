import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service.js';
import { OrdersController } from './orders.controller.js';
import { OrdersAdminController } from './orders.admin.controller.js';
import { OrderExpiryWorkerService } from './queues/order-expiry-worker.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { CartModule } from '../cart/cart.module.js';
import { PaymentsModule } from '../payments/payments.module.js';
import { AuditLogModule } from '../audit-log/audit-log.module.js';

@Module({
  imports: [PrismaModule, CartModule, PaymentsModule, AuditLogModule],
  providers: [OrdersService, OrderExpiryWorkerService],
  controllers: [OrdersController, OrdersAdminController],
  exports: [OrdersService],
})
export class OrdersModule {}
