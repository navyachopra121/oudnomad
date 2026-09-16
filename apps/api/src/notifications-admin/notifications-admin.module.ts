import { Module } from '@nestjs/common';
import { NotificationsAdminService } from './notifications-admin.service.js';
import { NotificationsAdminController } from './notifications-admin.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [NotificationsAdminController],
  providers: [NotificationsAdminService],
})
export class NotificationsAdminModule {}
