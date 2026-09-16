import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service.js';
import type { CreateReviewDto, UpdateReviewDto } from './reviews.service.js';
import { Public } from '../auth/decorators/public.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { JwtPayload } from '../auth/decorators/current-user.decorator.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { UserRole } from '@prisma/client';

@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  /** Public — GET /api/products/:id/reviews */
  @Public()
  @Get('products/:id/reviews')
  async getProductReviews(
    @Param('id') productId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.reviewsService.findByProduct(
      productId,
      page ? Number(page) : 1,
      limit ? Number(limit) : 10,
    );
  }

  /** Customer — POST /api/products/:id/reviews */
  @Post('products/:id/reviews')
  async createReview(
    @CurrentUser() user: JwtPayload,
    @Param('id') productId: string,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewsService.create(user.sub, productId, dto);
  }

  /** Customer — PATCH /api/reviews/:id */
  @Patch('reviews/:id')
  async updateReview(
    @CurrentUser() user: JwtPayload,
    @Param('id') reviewId: string,
    @Body() dto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(user.sub, reviewId, dto);
  }

  /** Customer — DELETE /api/reviews/:id */
  @Delete('reviews/:id')
  async deleteReview(
    @CurrentUser() user: JwtPayload,
    @Param('id') reviewId: string,
  ) {
    return this.reviewsService.delete(user.sub, reviewId);
  }

  /** Customer — POST /api/products/:id/reviews/:reviewId/report */
  @Post('products/:id/reviews/:reviewId/report')
  async reportReview(
    @Param('id') productId: string,
    @Param('reviewId') reviewId: string,
  ) {
    return this.reviewsService.report(productId, reviewId);
  }

  /** Admin — GET /api/admin/reviews?reported=true */
  @Roles(UserRole.ADMIN)
  @Get('admin/reviews')
  async getAdminReviews(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.reviewsService.findReportedAdmin(
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
    );
  }

  /** Admin — DELETE /api/admin/reviews/:id */
  @Roles(UserRole.ADMIN)
  @Delete('admin/reviews/:id')
  async removeReviewAdmin(
    @CurrentUser() user: JwtPayload,
    @Param('id') reviewId: string,
  ) {
    return this.reviewsService.removeAdmin(user.sub, reviewId);
  }
}
