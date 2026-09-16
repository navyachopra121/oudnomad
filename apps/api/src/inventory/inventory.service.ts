import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { AuditLogService } from '../audit-log/audit-log.service.js';
import { AdjustInventoryDto } from './dto/adjust-inventory.dto.js';

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  async findInventory(lowStockOnly = false, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (lowStockOnly) {
      // Filter where quantityAvailable <= lowStockThreshold or 5
      where.OR = [
        { quantityAvailable: { lte: 5 } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.inventory.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
        include: {
          variant: {
            include: {
              product: {
                select: { id: true, name: true, slug: true, status: true },
              },
            },
          },
        },
      }),
      this.prisma.inventory.count({ where }),
    ]);

    return {
      items: items.map((inv) => ({
        id: inv.id,
        variantId: inv.variantId,
        sku: inv.variant.sku,
        variantName: inv.variant.name,
        productName: inv.variant.product.name,
        productId: inv.variant.product.id,
        quantityAvailable: inv.quantityAvailable,
        quantityReserved: inv.quantityReserved,
        lowStockThreshold: inv.lowStockThreshold,
        updatedAt: inv.updatedAt,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async adjustInventory(inventoryId: string, dto: AdjustInventoryDto, adminId: string) {
    const existing = await this.prisma.inventory.findUnique({
      where: { id: inventoryId },
    });
    if (!existing) {
      throw new NotFoundException(`Inventory record ${inventoryId} not found`);
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const inv = await tx.inventory.update({
        where: { id: inventoryId },
        data: { quantityAvailable: { increment: dto.delta } },
      });

      if (inv.quantityAvailable < 0) {
        throw new BadRequestException('Adjustment would result in negative stock');
      }

      await tx.inventoryAdjustment.create({
        data: {
          inventoryId,
          adjustedBy: adminId,
          delta: dto.delta,
          reason: dto.reason,
        },
      });

      // Synchronize productVariant.stock field
      await tx.productVariant.update({
        where: { id: inv.variantId },
        data: { stock: inv.quantityAvailable },
      });

      return inv;
    });

    await this.auditLogService.log({
      actorId: adminId,
      action: 'inventory.adjust',
      targetType: 'Inventory',
      targetId: inventoryId,
      metadata: {
        delta: dto.delta,
        reason: dto.reason,
        newQuantity: updated.quantityAvailable,
      },
    });

    return updated;
  }

  async findAdjustments(inventoryId: string, page = 1, limit = 20) {
    const existing = await this.prisma.inventory.findUnique({
      where: { id: inventoryId },
    });
    if (!existing) {
      throw new NotFoundException(`Inventory record ${inventoryId} not found`);
    }

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.inventoryAdjustment.findMany({
        where: { inventoryId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.inventoryAdjustment.count({ where: { inventoryId } }),
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
