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
  ) {
    return this.auditLogService.findLogs({
      targetType,
      targetId,
      actorId,
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    });
  }
}
