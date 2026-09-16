import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { SearchService } from '../search/search.service.js';
import { KafkaProducerService } from '../kafka/kafka-producer.service.js';
import { Prisma } from '@prisma/client';

export interface CreateReviewDto {
  rating: number; // 1-5
  title?: string;
  body?: string;
}

export interface UpdateReviewDto {
  rating?: number;
  title?: string;
  body?: string;
}

@Injectable()
export class ReviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly searchService: SearchService,
    private readonly kafkaProducer: KafkaProducerService,
  ) {}

  private async recomputeProductRating(tx: Prisma.TransactionClient, productId: string) {
    const agg = await tx.review.aggregate({
      where: { productId, deletedAt: null },
      _avg: { rating: true },
      _count: true,
    });

    const avgRating = agg._avg.rating ? Number(agg._avg.rating.toFixed(2)) : 0;
    const reviewCount = agg._count ?? 0;

    await tx.product.update({
      where: { id: productId },
      data: {
        avgRating,
        reviewCount,
      },
    });
  }

  private async notifyProductChanged(productId: string) {
    await this.searchService.syncProductById(productId);
    await this.kafkaProducer.publishProductChanged(productId);
  }

  async findByProduct(productId: string, page = 1, limit = 10) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product || product.deletedAt) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { productId, deletedAt: null },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.review.count({
        where: { productId, deletedAt: null },
      }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async create(userId: string, productId: string, dto: CreateReviewDto) {
    if (dto.rating < 1 || dto.rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product || product.deletedAt) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const existing = await this.prisma.review.findFirst({
      where: { productId, userId, deletedAt: null },
    });
    if (existing) {
      throw new ConflictException('You have already submitted a review for this product');
    }

    const review = await this.prisma.$transaction(async (tx) => {
      const created = await tx.review.create({
        data: {
          productId,
          userId,
          rating: dto.rating,
          title: dto.title,
          body: dto.body,
        },
      });

      await this.recomputeProductRating(tx, productId);
      return created;
    });

    await this.notifyProductChanged(productId);
    return review;
  }

  async update(userId: string, reviewId: string, dto: UpdateReviewDto) {
    if (dto.rating !== undefined && (dto.rating < 1 || dto.rating > 5)) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });
    if (!review || review.deletedAt) {
      throw new NotFoundException(`Review with ID ${reviewId} not found`);
    }

    if (review.userId !== userId) {
      throw new ForbiddenException('You can only edit your own reviews');
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const res = await tx.review.update({
        where: { id: reviewId },
        data: {
          ...(dto.rating !== undefined ? { rating: dto.rating } : {}),
          ...(dto.title !== undefined ? { title: dto.title } : {}),
          ...(dto.body !== undefined ? { body: dto.body } : {}),
        },
      });

      await this.recomputeProductRating(tx, review.productId);
      return res;
    });

    await this.notifyProductChanged(review.productId);
    return updated;
  }

  async delete(userId: string, reviewId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });
    if (!review || review.deletedAt) {
      throw new NotFoundException(`Review with ID ${reviewId} not found`);
    }

    if (review.userId !== userId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.review.update({
        where: { id: reviewId },
        data: { deletedAt: new Date() },
      });

      await this.recomputeProductRating(tx, review.productId);
    });

    await this.notifyProductChanged(review.productId);
    return { success: true };
  }

  async report(productId: string, reviewId: string) {
    const review = await this.prisma.review.findFirst({
      where: { id: reviewId, productId, deletedAt: null },
    });
    if (!review) {
      throw new NotFoundException(`Review not found`);
    }

    await this.prisma.review.update({
      where: { id: reviewId },
      data: { isReported: true },
    });

    return { reported: true };
  }

  async findReportedAdmin(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { isReported: true, deletedAt: null },
        include: {
          user: { select: { id: true, email: true, firstName: true, lastName: true } },
          product: { select: { id: true, name: true, slug: true } },
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.review.count({
        where: { isReported: true, deletedAt: null },
      }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async removeAdmin(adminUserId: string, reviewId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });
    if (!review || review.deletedAt) {
      throw new NotFoundException(`Review with ID ${reviewId} not found`);
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.review.update({
        where: { id: reviewId },
        data: { deletedAt: new Date() },
      });

      await tx.auditLog.create({
        data: {
          actorId: adminUserId,
          action: 'review.remove',
          targetType: 'Review',
          targetId: reviewId,
          metadata: {
            productId: review.productId,
            userId: review.userId,
            rating: review.rating,
          },
        },
      });

      await this.recomputeProductRating(tx, review.productId);
    });

    await this.notifyProductChanged(review.productId);
    return { success: true };
  }
}
