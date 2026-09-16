import {
  Controller,
  Post,
  Req,
  Headers,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'crypto';
import { PaymentWebhookService } from './payment-webhook.service.js';
import { Public } from '../auth/decorators/public.decorator.js';
import type { Request } from 'express';

@Controller()
export class PaymentWebhookController {
  private readonly logger = new Logger(PaymentWebhookController.name);
  private readonly webhookSecret: string;

  constructor(
    private readonly webhookService: PaymentWebhookService,
    private readonly config: ConfigService,
  ) {
    this.webhookSecret = this.config.get<string>('RAZORPAY_WEBHOOK_SECRET') ?? '';
  }

  /**
   * POST /api/webhooks/razorpay
   *
   * Raw body required — excluded from global JSON body parser in main.ts.
   * Razorpay signature is verified against the raw bytes before processing.
   * Route is @Public() — authentication is the HMAC signature check itself.
   */
  @Public()
  @Post('webhooks/razorpay')
  async handleWebhook(
    @Req() req: Request,
    @Headers('x-razorpay-signature') signature: string,
  ) {
    const rawBody = req.body as Buffer;

    if (this.webhookSecret) {
      const expected = createHmac('sha256', this.webhookSecret)
        .update(rawBody)
        .digest('hex');

      if (expected !== signature) {
        this.logger.warn('Razorpay webhook — invalid signature rejected');
        throw new UnauthorizedException('Invalid webhook signature');
      }
    } else {
      // No secret configured — only allow in development
      this.logger.warn('RAZORPAY_WEBHOOK_SECRET not set — skipping signature verification');
    }

    const event = JSON.parse(rawBody.toString());
    await this.webhookService.handleEvent(event);

    return { received: true };
  }
}
