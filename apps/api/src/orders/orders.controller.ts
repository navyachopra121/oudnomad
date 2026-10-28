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
import { CancelOrderDto } from './dto/cancel-order.dto.js';
import { CreatePaymentAttemptDto } from '../payments/dto/create-payment-attempt.dto.js';
import { VerifyPaymentDto } from '../payments/dto/verify-payment.dto.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { JwtPayload } from '../auth/decorators/current-user.decorator.js';
import { Public } from '../auth/decorators/public.decorator.js';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /** GET /api/checkout/shipping-methods */
  @Public()
  @Get('checkout/shipping-methods')
  getShippingMethods() {
    return this.ordersService.getShippingMethods();
  }

  /** POST /api/checkout */
  @Public()
  @Post('checkout')
  @HttpCode(HttpStatus.CREATED)
  checkout(@CurrentUser() user: JwtPayload | undefined, @Body() dto: CheckoutDto) {
    return this.ordersService.checkout(user?.sub, dto);
  }

  /**
   * POST /api/checkout/:orderId/payment-attempts
   * Creates a payment attempt (Stripe PaymentIntent or Razorpay order) for initial payment or retry.
   * Returns gateway order identifiers & publishable keys for the frontend payment SDK.
   */
  @Public()
  @Post('checkout/:orderId/payment-attempts')
  @HttpCode(HttpStatus.CREATED)
  createPaymentAttempt(
    @CurrentUser() user: JwtPayload | undefined,
    @Param('orderId') orderId: string,
    @Body() dto: CreatePaymentAttemptDto,
  ) {
    return this.ordersService.createPaymentAttempt(user?.sub, orderId, dto.idempotencyKey);
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
  @Public()
  @Get('orders/:id')
  findOrderById(@CurrentUser() user: JwtPayload | undefined, @Param('id') id: string) {
    return this.ordersService.findOrderById(user?.sub, id);
  }

  /**
   * POST /api/orders/:id/cancel
   * Allows customer to cancel their order with reason. Restocks inventory and triggers auto-refund if paid.
   */
  @Post('orders/:id/cancel')
  @HttpCode(HttpStatus.OK)
  cancelOrder(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: CancelOrderDto,
  ) {
    return this.ordersService.cancelOrder(user.sub, id, dto.reason);
  }
}
