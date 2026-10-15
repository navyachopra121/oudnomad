import { Module } from '@nestjs/common';
import { ShippingService } from './shipping.service.js';
import { ShippingController } from './shipping.controller.js';
import { DhlClient } from './dhl.client.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { KafkaModule } from '../kafka/kafka.module.js';

@Module({
  imports: [PrismaModule, KafkaModule],
  providers: [DhlClient, ShippingService],
  controllers: [ShippingController],
  exports: [ShippingService],
})
export class ShippingModule {}
