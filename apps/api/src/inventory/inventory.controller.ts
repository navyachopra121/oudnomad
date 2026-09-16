import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { InventoryService } from './inventory.service.js';
import { AdjustInventoryDto } from './dto/adjust-inventory.dto.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { JwtPayload } from '../auth/decorators/current-user.decorator.js';
import { UserRole } from '@prisma/client';

@Roles(UserRole.ADMIN)
@Controller('admin/inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  /** Admin — GET /api/admin/inventory */
  @Get()
  findInventory(
    @Query('lowStockOnly') lowStockOnly?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.inventoryService.findInventory(
      lowStockOnly === 'true',
      page ? parseInt(page, 10) : undefined,
      limit ? parseInt(limit, 10) : undefined,
    );
  }

  /** Admin — POST /api/admin/inventory/:id/adjust */
  @Post(':id/adjust')
  @HttpCode(HttpStatus.OK)
  adjustInventory(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: AdjustInventoryDto,
  ) {
    return this.inventoryService.adjustInventory(id, dto, user.sub);
  }

  /** Admin — GET /api/admin/inventory/:id/adjustments */
  @Get(':id/adjustments')
  findAdjustments(
    @Param('id') id: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.inventoryService.findAdjustments(
      id,
      page ? parseInt(page, 10) : undefined,
      limit ? parseInt(limit, 10) : undefined,
    );
  }
}
