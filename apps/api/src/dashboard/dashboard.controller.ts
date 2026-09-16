import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { UserRole } from '@prisma/client';

@Roles(UserRole.ADMIN)
@Controller('admin/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /** Admin — GET /api/admin/dashboard/summary */
  @Get('summary')
  getSummary() {
    return this.dashboardService.getSummary();
  }
}
