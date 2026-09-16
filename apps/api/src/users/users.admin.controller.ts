import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { JwtPayload } from '../auth/decorators/current-user.decorator.js';
import { UserRole } from '@prisma/client';

@Roles(UserRole.ADMIN)
@Controller('admin/users')
export class UsersAdminController {
  constructor(private readonly usersService: UsersService) {}

  /** Admin — GET /api/admin/users */
  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('role') role?: UserRole,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.usersService.findAdminUsers({
      search,
      role,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  /** Admin — PATCH /api/admin/users/:id/block */
  @Patch(':id/block')
  @HttpCode(HttpStatus.OK)
  toggleBlock(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body('isBlocked') isBlocked: boolean,
  ) {
    return this.usersService.toggleBlockUser(id, !!isBlocked, user.sub);
  }

  /** Admin — PATCH /api/admin/users/:id/role */
  @Patch(':id/role')
  @HttpCode(HttpStatus.OK)
  changeRole(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body('role') role: UserRole,
  ) {
    return this.usersService.changeUserRole(id, role, user.sub);
  }
}
