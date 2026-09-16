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
import { OrdersService } from './orders.service.js';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { JwtPayload } from '../auth/decorators/current-user.decorator.js';
import { UserRole, OrderStatus } from '@prisma/client';

@Roles(UserRole.ADMIN)
@Controller('admin/orders')
export class OrdersAdminController {
  constructor(private readonly ordersService: OrdersService) {}

  /** Admin — GET /api/admin/orders */
  @Get()
  findAll(
    @Query('status') status?: OrderStatus,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.ordersService.findAdminOrders({
      status,
      startDate,
      endDate,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  /** Admin — GET /api/admin/orders/:id */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOrderById('', id, true);
  }

  /** Admin — PATCH /api/admin/orders/:id/release */
  @Patch(':id/release')
  @HttpCode(HttpStatus.OK)
  releaseOrder(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body('note') note?: string,
  ) {
    return this.ordersService.adminUpdateStatus(
      id,
      OrderStatus.PLACED,
      note ?? 'Admin released order for fulfillment',
      user.sub,
    );
  }

  /** Admin — PATCH /api/admin/orders/:id/status */
  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  updateStatus(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.adminUpdateStatus(id, dto.status, dto.note, user.sub);
  }
}
