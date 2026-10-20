import { Controller, Get, Query } from '@nestjs/common';
import { AuditLogService } from './audit-log.service.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { UserRole } from '@prisma/client';

@Roles(UserRole.ADMIN)
@Controller('admin/audit-logs')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  findLogs(
    @Query('targetType') targetType?: string,
    @Query('targetId') targetId?: string,
    @Query('actorId') actorId?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('page') page?: string,
  ) {
    const parsedLimit = limit ? parseInt(limit, 10) : 50;
    const parsedOffset = page
      ? (parseInt(page, 10) - 1) * parsedLimit
      : offset
        ? parseInt(offset, 10)
        : 0;

    return this.auditLogService.findLogs({
      targetType,
      targetId,
      actorId,
      limit: parsedLimit,
      offset: parsedOffset,
    });
  }
}
