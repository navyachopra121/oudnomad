import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service.js';
import { ReviewsController } from './reviews.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { SearchModule } from '../search/search.module.js';
import { KafkaModule } from '../kafka/kafka.module.js';

@Module({
  imports: [PrismaModule, SearchModule, KafkaModule],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
