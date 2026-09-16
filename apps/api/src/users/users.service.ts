import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { AuditLogService } from '../audit-log/audit-log.service.js';
import type { UpdateProfileDto } from './dto/update-profile.dto.js';
import { UserRole } from '@prisma/client';

const USER_SELECT = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  role: true,
  emailVerified: true,
  isBlocked: true,
  createdAt: true,
} as const;

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  async findById(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: USER_SELECT,
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(id: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.findFirst({ where: { id, deletedAt: null } });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: USER_SELECT,
    });
  }

  /**
   * Admin: List users with search and role filters.
   */
  async findAdminUsers(query: {
    search?: string;
    role?: UserRole;
    page?: number;
    limit?: number;
  }) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 20);
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };
    if (query.role) where.role = query.role;
    if (query.search) {
      where.OR = [
        { email: { contains: query.search, mode: 'insensitive' } },
        { firstName: { contains: query.search, mode: 'insensitive' } },
        { lastName: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: USER_SELECT,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  /**
   * Admin: Toggle isBlocked status on user with last-admin lockout check.
   */
  async toggleBlockUser(targetUserId: string, isBlocked: boolean, adminId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: targetUserId },
    });
    if (!user || user.deletedAt) {
      throw new NotFoundException(`User ${targetUserId} not found`);
    }

    if (isBlocked && user.role === UserRole.ADMIN) {
      const activeAdminsCount = await this.prisma.user.count({
        where: {
          role: UserRole.ADMIN,
          isBlocked: false,
          deletedAt: null,
        },
      });
      if (activeAdminsCount <= 1) {
        throw new BadRequestException('Cannot block the last remaining active admin user');
      }
    }

    const updated = await this.prisma.user.update({
      where: { id: targetUserId },
      data: { isBlocked },
      select: USER_SELECT,
    });

    await this.auditLogService.log({
      actorId: adminId,
      action: isBlocked ? 'user.block' : 'user.unblock',
      targetType: 'User',
      targetId: targetUserId,
      metadata: { targetEmail: user.email, isBlocked },
    });

    return updated;
  }

  /**
   * Admin: Change user role with last-admin lockout check.
   */
  async changeUserRole(targetUserId: string, newRole: UserRole, adminId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: targetUserId },
    });
    if (!user || user.deletedAt) {
      throw new NotFoundException(`User ${targetUserId} not found`);
    }

    if (user.role === UserRole.ADMIN && newRole !== UserRole.ADMIN) {
      const activeAdminsCount = await this.prisma.user.count({
        where: {
          role: UserRole.ADMIN,
          isBlocked: false,
          deletedAt: null,
        },
      });
      if (activeAdminsCount <= 1) {
        throw new BadRequestException('Cannot demote the last remaining active admin user');
      }
    }

    const updated = await this.prisma.user.update({
      where: { id: targetUserId },
      data: { role: newRole },
      select: USER_SELECT,
    });

    await this.auditLogService.log({
      actorId: adminId,
      action: 'user.role_change',
      targetType: 'User',
      targetId: targetUserId,
      metadata: { fromRole: user.role, toRole: newRole },
    });

    return updated;
  }
}
