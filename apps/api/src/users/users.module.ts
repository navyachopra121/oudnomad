import { Module } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';
import { UsersAdminController } from './users.admin.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AuditLogModule } from '../audit-log/audit-log.module.js';

@Module({
  imports: [PrismaModule, AuditLogModule],
  controllers: [UsersController, UsersAdminController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
