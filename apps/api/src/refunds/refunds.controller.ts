import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RefundsService } from './refunds.service.js';
import { CreateRefundDto } from './dto/create-refund.dto.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { JwtPayload } from '../auth/decorators/current-user.decorator.js';
import { UserRole } from '@prisma/client';

@Roles(UserRole.ADMIN)
@Controller('admin/refunds')
export class RefundsController {
  constructor(private readonly refundsService: RefundsService) {}

  /** Admin — POST /api/admin/refunds */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  createRefund(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateRefundDto,
  ) {
    return this.refundsService.createRefund(user.sub, dto);
  }

  /** Admin — GET /api/admin/refunds/order/:orderId */
  @Get('order/:orderId')
  findRefundsByOrder(@Param('orderId') orderId: string) {
    return this.refundsService.findRefundsByOrder(orderId);
  }

  /** Admin — GET /api/admin/refunds/:id */
  @Get(':id')
  findRefundById(@Param('id') id: string) {
    return this.refundsService.findRefundById(id);
  }
}
