import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { NotificationsAdminService } from './notifications-admin.service.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { UserRole } from '@prisma/client';

@Controller('api/admin/notifications')
@Roles(UserRole.ADMIN)
@UseGuards(RolesGuard)
export class NotificationsAdminController {
  constructor(private readonly service: NotificationsAdminService) {}

  /**
   * GET /api/admin/notifications/failed
   * List all FAILED or DEAD_LETTERED notifications for ops review.
   * Supports pagination and optional type filter.
   */
  @Get('failed')
  async getFailedNotifications(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('type') type?: string,
  ) {
    return this.service.getFailedNotifications({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 50,
      type,
    });
  }
}
