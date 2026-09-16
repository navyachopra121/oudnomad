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
import { OrdersService } from './orders.service.js';
import { CheckoutDto } from './dto/checkout.dto.js';
import { CreatePaymentAttemptDto } from '../payments/dto/create-payment-attempt.dto.js';
import { VerifyPaymentDto } from '../payments/dto/verify-payment.dto.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { JwtPayload } from '../auth/decorators/current-user.decorator.js';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /** GET /api/checkout/shipping-methods */
  @Get('checkout/shipping-methods')
  getShippingMethods() {
    return this.ordersService.getShippingMethods();
  }

  /** POST /api/checkout */
  @Post('checkout')
  @HttpCode(HttpStatus.CREATED)
  checkout(@CurrentUser() user: JwtPayload, @Body() dto: CheckoutDto) {
    return this.ordersService.checkout(user.sub, dto);
  }

  /**
   * POST /api/checkout/:orderId/payment-attempts
   * Creates a Razorpay order for first payment attempt or retry.
   * Returns { gatewayOrderId, amount, currency, razorpayKeyId } for frontend Checkout.js.
   */
  @Post('checkout/:orderId/payment-attempts')
  @HttpCode(HttpStatus.CREATED)
  createPaymentAttempt(
    @CurrentUser() user: JwtPayload,
    @Param('orderId') orderId: string,
    @Body() dto: CreatePaymentAttemptDto,
  ) {
    return this.ordersService.createPaymentAttempt(user.sub, orderId, dto.idempotencyKey);
  }

  /**
   * POST /api/checkout/payment-attempts/:attemptId/verify
   * Verifies client-side Razorpay signature — UX feedback only.
   * Does NOT transition Order.status. Authoritative confirmation comes via webhook.
   */
  @Post('checkout/payment-attempts/:attemptId/verify')
  @HttpCode(HttpStatus.OK)
  verifyPayment(
    @CurrentUser() user: JwtPayload,
    @Param('attemptId') attemptId: string,
    @Body() dto: VerifyPaymentDto,
  ) {
    return this.ordersService.verifyPayment(user.sub, attemptId, dto);
  }

  /** GET /api/orders */
  @Get('orders')
  findUserOrders(
    @CurrentUser() user: JwtPayload,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.ordersService.findUserOrders(
      user.sub,
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
    );
  }

  /** GET /api/orders/:id */
  @Get('orders/:id')
  findOrderById(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.ordersService.findOrderById(user.sub, id);
  }
}
