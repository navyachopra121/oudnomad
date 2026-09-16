import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { NotificationStatus } from '@prisma/client';

@Injectable()
export class NotificationsAdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getFailedNotifications(opts: {
    page: number;
    limit: number;
    type?: string;
  }) {
    const { page, limit, type } = opts;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {
      status: {
        in: [NotificationStatus.FAILED, NotificationStatus.DEAD_LETTERED],
      },
    };

    if (type) {
      where.type = type;
    }

    const [items, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          idempotencyKey: true,
          type: true,
          status: true,
          recipient: true,
          attempts: true,
          lastError: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.notification.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
