import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary() {
    const now = new Date();

    // Computing boundaries in UTC
    const startOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
    
    const dayOfWeek = startOfToday.getUTCDay();
    const startOfWeek = new Date(startOfToday.getTime() - dayOfWeek * 86400000);

    const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0));

    // 1. Order counts
    const [todayOrders, weekOrders, monthOrders] = await Promise.all([
      this.prisma.order.count({ where: { createdAt: { gte: startOfToday } } }),
      this.prisma.order.count({ where: { createdAt: { gte: startOfWeek } } }),
      this.prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
    ]);

    // 2. Revenue (Only completed / non-cancelled orders count towards revenue)
    const validRevenueStatuses: OrderStatus[] = [
      OrderStatus.CONFIRMED,
      OrderStatus.PLACED,
      OrderStatus.SHIPPED,
      OrderStatus.DELIVERED,
    ];

    const [todayPaidOrders, weekPaidOrders, monthPaidOrders] = await Promise.all([
      this.prisma.order.findMany({
        where: {
          createdAt: { gte: startOfToday },
          status: { in: validRevenueStatuses },
        },
        select: { total: true },
      }),
      this.prisma.order.findMany({
        where: {
          createdAt: { gte: startOfWeek },
          status: { in: validRevenueStatuses },
        },
        select: { total: true },
      }),
      this.prisma.order.findMany({
        where: {
          createdAt: { gte: startOfMonth },
          status: { in: validRevenueStatuses },
        },
        select: { total: true },
      }),
    ]);

    const calculateTotalMinor = (orders: Array<{ total: any }>) => {
      const sum = orders.reduce((acc, o) => acc + Number(o.total), 0);
      return Math.round(sum * 100);
    };

    const revenue = {
      today: [{ currency: 'INR', totalMinor: calculateTotalMinor(todayPaidOrders) }],
      thisWeek: [{ currency: 'INR', totalMinor: calculateTotalMinor(weekPaidOrders) }],
      thisMonth: [{ currency: 'INR', totalMinor: calculateTotalMinor(monthPaidOrders) }],
    };

    // 3. Orders by Status
    const allStatuses = Object.values(OrderStatus);
    const statusCounts = await Promise.all(
      allStatuses.map((status) =>
        this.prisma.order.count({ where: { status } }).then((count) => ({ status, count })),
      ),
    );

    const ordersByStatus = statusCounts.reduce(
      (acc, curr) => {
        acc[curr.status] = curr.count;
        return acc;
      },
      {} as Record<OrderStatus, number>,
    );

    // 4. Low stock items
    const lowStockInventories = await this.prisma.inventory.findMany({
      where: {
        quantityAvailable: { lte: 5 },
      },
      take: 10,
      include: {
        variant: {
          include: {
            product: { select: { name: true } },
          },
        },
      },
    });

    const lowStock = lowStockInventories.map((inv) => ({
      variantId: inv.variantId,
      productName: inv.variant.product.name,
      sku: inv.variant.sku,
      quantityAvailable: inv.quantityAvailable,
      threshold: inv.lowStockThreshold,
    }));

    return {
      orders: {
        today: todayOrders,
        thisWeek: weekOrders,
        thisMonth: monthOrders,
      },
      revenue,
      ordersByStatus,
      lowStock,
    };
  }
}
