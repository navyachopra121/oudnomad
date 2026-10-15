import { Module } from '@nestjs/common';
import { MailService } from './mail.service.js';
import { ContactController } from './contact.controller.js';

@Module({
  controllers: [ContactController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
