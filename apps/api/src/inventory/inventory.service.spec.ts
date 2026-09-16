import { describe, it, expect, beforeEach, vi } from 'vitest';
import { InventoryService } from './inventory.service.js';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('InventoryService', () => {
  let service: InventoryService;
  let prismaMock: any;
  let auditLogMock: any;

  beforeEach(() => {
    prismaMock = {
      inventory: {
        findUnique: vi.fn(),
      },
      $transaction: vi.fn(),
    };
    auditLogMock = {
      log: vi.fn().mockResolvedValue({}),
    };
    service = new InventoryService(prismaMock, auditLogMock);
  });

  describe('adjustInventory', () => {
    it('should throw NotFoundException if inventory record does not exist', async () => {
      prismaMock.inventory.findUnique.mockResolvedValue(null);

      await expect(
        service.adjustInventory('inv-999', { delta: 5, reason: 'restock' }, 'admin-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if adjustment results in negative stock', async () => {
      prismaMock.inventory.findUnique.mockResolvedValue({
        id: 'inv-1',
        quantityAvailable: 2,
      });

      prismaMock.$transaction.mockImplementation(async (callback: any) => {
        const tx = {
          inventory: {
            update: vi.fn().mockResolvedValue({
              id: 'inv-1',
              variantId: 'var-1',
              quantityAvailable: -3,
            }),
          },
        };
        return callback(tx);
      });

      await expect(
        service.adjustInventory('inv-1', { delta: -5, reason: 'damaged' }, 'admin-1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should perform valid adjustment and create InventoryAdjustment record', async () => {
      prismaMock.inventory.findUnique.mockResolvedValue({
        id: 'inv-1',
        quantityAvailable: 10,
      });

      const txInventoryUpdate = vi.fn().mockResolvedValue({
        id: 'inv-1',
        variantId: 'var-1',
        quantityAvailable: 15,
      });
      const txAdjustmentCreate = vi.fn().mockResolvedValue({ id: 'adj-1' });
      const txVariantUpdate = vi.fn().mockResolvedValue({});

      prismaMock.$transaction.mockImplementation(async (callback: any) => {
        const tx = {
          inventory: { update: txInventoryUpdate },
          inventoryAdjustment: { create: txAdjustmentCreate },
          productVariant: { update: txVariantUpdate },
        };
        return callback(tx);
      });

      const result = await service.adjustInventory(
        'inv-1',
        { delta: 5, reason: 'restock shipment' },
        'admin-1',
      );

      expect(result.quantityAvailable).toBe(15);
      expect(txAdjustmentCreate).toHaveBeenCalledWith({
        data: {
          inventoryId: 'inv-1',
          adjustedBy: 'admin-1',
          delta: 5,
          reason: 'restock shipment',
        },
      });
      expect(auditLogMock.log).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'inventory.adjust' }),
      );
    });
  });
});
