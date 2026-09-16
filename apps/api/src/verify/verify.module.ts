import { Module } from '@nestjs/common';
import { VerifyController } from './verify.controller.js';
import { VerifyService } from './verify.service.js';
import { StorageModule } from '../storage/storage.module.js';

@Module({
  imports: [StorageModule],
  controllers: [VerifyController],
  providers: [VerifyService],
})
export class VerifyModule {}
