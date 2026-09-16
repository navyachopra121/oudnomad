import { Controller, Get, Post, Param, Query } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service.js';
import { Public } from '../auth/decorators/public.decorator.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { UserRole } from '@prisma/client';

@Controller()
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  /** Public — GET /api/products/:id/recommendations */
  @Public()
  @Get('products/:id/recommendations')
  async getRecommendations(
    @Param('id') productId: string,
    @Query('limit') limit?: string,
  ) {
    return this.recommendationsService.getRecommendationsForProduct(
      productId,
      limit ? Number(limit) : 6,
    );
  }

  /** Admin — POST /api/admin/recommendations/recompute */
  @Roles(UserRole.ADMIN)
  @Post('admin/recommendations/recompute')
  async recompute() {
    return this.recommendationsService.computeRecommendations();
  }
}
