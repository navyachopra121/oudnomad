import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ShippingService, type DhlWebhookPayload } from './shipping.service.js';
import { Public } from '../auth/decorators/public.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import type { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user?: { sub: string; role: string };
}

/**
 * POST /shipping/webhook
 *   DHL registers this URL in the DHL Developer Portal.
 *   Receives real-time transit events (picked_up, in_transit, delivered, etc.).
 *
 * GET  /shipping/track/:orderId
 *   Customer-facing — returns live tracking events for their order.
 */
@Controller('shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  /**
   * DHL webhook — must be public (no JWT), DHL calls this server-to-server.
   * DHL does NOT send a standard HMAC signature on all event types, but
   * you can whitelist DHL's IP ranges via a firewall rule or API Gateway.
   *
   * Endpoint to register in DHL Developer Portal:
   *   https://developer.dhl.com → MyDHL API → Notifications → Add endpoint URL
   */
  @Public()
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleDhlWebhook(@Body() body: DhlWebhookPayload): Promise<{ received: boolean }> {
    await this.shippingService.handleWebhookEvent(body);
    return { received: true };
  }

  /**
   * GET /shipping/track/:orderId
   * Returns live tracking timeline. Authenticated customers can only see their own orders.
   */
  @UseGuards(JwtAuthGuard)
  @Get('track/:orderId')
  async trackOrder(@Param('orderId') orderId: string, @Req() req: AuthenticatedRequest) {
    const userId = req.user?.sub;
    return this.shippingService.getTrackingInfo(orderId, userId);
  }
}
