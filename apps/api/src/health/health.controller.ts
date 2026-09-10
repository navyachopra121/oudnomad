import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service.js';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  /**
   * GET /api/health
   *
   * Returns the connectivity status of all backing services.
   * Used by:
   *  - Docker/container healthchecks
   *  - Load balancer probes
   *  - Phase 0 verification
   *
   * Returns 200 when all checks pass, 503 when any check fails.
   */
  @Get()
  check() {
    return this.healthService.check();
  }
}
