import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UsersService } from './users.service.js';
import { UserRole } from '@prisma/client';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UsersService Admin Guards', () => {
  let service: UsersService;
  let prismaMock: any;
  let auditLogMock: any;

  beforeEach(() => {
    prismaMock = {
      user: {
        findUnique: vi.fn(),
        count: vi.fn(),
        update: vi.fn(),
      },
    };
    auditLogMock = {
      log: vi.fn().mockResolvedValue({}),
    };
    service = new UsersService(prismaMock, auditLogMock);
  });

  describe('toggleBlockUser', () => {
    it('should throw BadRequestException when trying to block the last remaining active admin', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'admin-1',
        email: 'admin@example.com',
        role: UserRole.ADMIN,
        isBlocked: false,
        deletedAt: null,
      });
      prismaMock.user.count.mockResolvedValue(1); // Only 1 active admin

      await expect(
        service.toggleBlockUser('admin-1', true, 'admin-1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should allow blocking an admin if multiple active admins exist', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'admin-1',
        email: 'admin1@example.com',
        role: UserRole.ADMIN,
        isBlocked: false,
        deletedAt: null,
      });
      prismaMock.user.count.mockResolvedValue(2); // 2 active admins
      prismaMock.user.update.mockResolvedValue({
        id: 'admin-1',
        email: 'admin1@example.com',
        role: UserRole.ADMIN,
        isBlocked: true,
      });

      const result = await service.toggleBlockUser('admin-1', true, 'admin-2');
      expect(result.isBlocked).toBe(true);
      expect(auditLogMock.log).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'user.block' }),
      );
    });
  });

  describe('changeUserRole', () => {
    it('should throw BadRequestException when trying to demote the last remaining active admin', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'admin-1',
        email: 'admin@example.com',
        role: UserRole.ADMIN,
        isBlocked: false,
        deletedAt: null,
      });
      prismaMock.user.count.mockResolvedValue(1);

      await expect(
        service.changeUserRole('admin-1', UserRole.CUSTOMER, 'admin-1'),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
