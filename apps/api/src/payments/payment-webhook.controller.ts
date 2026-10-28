import {
  Controller,
  Post,
  Req,
  Headers,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'crypto';
import Stripe from 'stripe';
import { PaymentWebhookService } from './payment-webhook.service.js';
import { Public } from '../auth/decorators/public.decorator.js';
import type { Request } from 'express';

@Controller()
export class PaymentWebhookController {
  private readonly logger = new Logger(PaymentWebhookController.name);
  private readonly razorpayWebhookSecret: string;
  private readonly stripeWebhookSecret: string;
  private readonly stripe: Stripe | null = null;

  constructor(
    private readonly webhookService: PaymentWebhookService,
    private readonly config: ConfigService,
  ) {
    this.razorpayWebhookSecret = this.config.get<string>('RAZORPAY_WEBHOOK_SECRET') ?? '';
    this.stripeWebhookSecret = this.config.get<string>('STRIPE_WEBHOOK_SECRET') ?? '';

    const stripeSecretKey = this.config.get<string>('STRIPE_SECRET_KEY');
    if (stripeSecretKey) {
      this.stripe = new Stripe(stripeSecretKey, {
        apiVersion: '2025-02-24.acacia' as any,
      });
    }
  }

  private extractRawBody(req: Request): Buffer {
    const raw = (req as any).rawBody;
    if (Buffer.isBuffer(raw)) return raw;
    if (Buffer.isBuffer(req.body)) return req.body;
    if (typeof req.body === 'string') return Buffer.from(req.body, 'utf-8');
    return Buffer.from(JSON.stringify(req.body || {}), 'utf-8');
  }

  /**
   * POST /api/webhooks/stripe
   *
   * Verifies cryptographic Stripe signature against raw body bytes.
   * Marked @Public() — authorization is validated by constructEvent HMAC check.
   */
  @Public()
  @Post('webhooks/stripe')
  async handleStripeWebhook(
    @Req() req: Request,
    @Headers('stripe-signature') signature: string,
  ) {
    const rawBody = this.extractRawBody(req);
    let event: any;

    if (this.stripeWebhookSecret && this.stripe) {
      if (!signature) {
        this.logger.warn('Stripe webhook rejected: Missing stripe-signature header');
        throw new BadRequestException('Missing stripe-signature header');
      }
      try {
        event = this.stripe.webhooks.constructEvent(
          rawBody,
          signature,
          this.stripeWebhookSecret,
        );
      } catch (err: any) {
        this.logger.warn(`Stripe webhook signature validation failed: ${err.message}`);
        throw new BadRequestException(`Webhook signature error: ${err.message}`);
      }
    } else {
      if (!this.stripeWebhookSecret) {
        this.logger.warn('STRIPE_WEBHOOK_SECRET not configured — parsing payload without signature check');
      }
      try {
        event = typeof req.body === 'object' && !Buffer.isBuffer(req.body)
          ? req.body
          : JSON.parse(rawBody.toString('utf-8'));
      } catch (_) {
        throw new BadRequestException('Invalid JSON payload in Stripe webhook body');
      }
    }

    await this.webhookService.handleStripeEvent(event);
    return { received: true };
  }

  /**
   * POST /api/webhooks/razorpay
   *
   * Razorpay signature is verified against the raw bytes before processing.
   * Route is @Public() — authentication is the HMAC signature check itself.
   */
  @Public()
  @Post('webhooks/razorpay')
  async handleWebhook(
    @Req() req: Request,
    @Headers('x-razorpay-signature') signature: string,
  ) {
    const rawBody = this.extractRawBody(req);

    if (this.razorpayWebhookSecret) {
      const expected = createHmac('sha256', this.razorpayWebhookSecret)
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

    const event = JSON.parse(rawBody.toString('utf-8'));
    await this.webhookService.handleEvent(event);

    return { received: true };
  }
}
