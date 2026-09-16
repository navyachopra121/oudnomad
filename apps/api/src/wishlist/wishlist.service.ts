import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class WishlistService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserWishlist(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.wishlistItem.findMany({
        where: { userId },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              description: true,
              avgRating: true,
              reviewCount: true,
              images: { orderBy: { sortOrder: 'asc' }, take: 1 },
              variants: {
                where: { deletedAt: null },
                select: {
                  id: true,
                  price: true,
                  stock: true,
                  inventory: { select: { quantityAvailable: true } },
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.wishlistItem.count({
        where: { userId },
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

  async addItem(userId: string, productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product || product.deletedAt) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // Idempotent add: upsert or skip if existing
    const existing = await this.prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existing) {
      return existing;
    }

    return this.prisma.wishlistItem.create({
      data: {
        userId,
        productId,
      },
    });
  }

  async removeItem(userId: string, productId: string) {
    // Idempotent delete
    await this.prisma.wishlistItem.deleteMany({
      where: {
        userId,
        productId,
      },
    });

    return { success: true };
  }
}
