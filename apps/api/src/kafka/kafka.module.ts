import { Module, Global } from '@nestjs/common';
import { KafkaProducerService } from './kafka-producer.service.js';

/**
 * Global module so KafkaProducerService can be injected anywhere
 * without needing to import KafkaModule in every feature module.
 */
@Global()
@Module({
  providers: [KafkaProducerService],
  exports: [KafkaProducerService],
})
export class KafkaModule {}
