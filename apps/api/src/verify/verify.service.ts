import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import Stripe from 'stripe';

export interface CloudinaryTestResult {
  success: boolean;
  publicId: string;
  url: string;
  format: string;
  bytes: number;
}

export interface StripeTestResult {
  success: boolean;
  id: string;
  status: string;
  amount: number;
  currency: string;
}

/**
 * VerifyService — Phase 0 connectivity testing only.
 *
 * Validates:
 *  1. Cloudinary credentials work → uploads a 1×1 pixel transparent PNG
 *  2. Stripe credentials work → creates a test PaymentIntent for £0.50
 *
 * Remove or guard these endpoints before production deployment.
 */
@Injectable()
export class VerifyService {
  private readonly logger = new Logger(VerifyService.name);
  private stripe: Stripe;

  constructor(private readonly config: ConfigService) {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: this.config.getOrThrow<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.config.getOrThrow<string>('CLOUDINARY_API_KEY'),
      api_secret: this.config.getOrThrow<string>('CLOUDINARY_API_SECRET'),
    });

    // Configure Stripe
    this.stripe = new Stripe(this.config.getOrThrow<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2025-08-27.basil',
    });
  }

  /**
   * Uploads a 1×1 pixel transparent PNG to Cloudinary as a base64 data URI.
   * Uses the 'oudnomad_test' folder and public_id 'phase0_test' so it's easy to find and delete.
   */
  async testCloudinaryUpload(): Promise<CloudinaryTestResult> {
    // Minimal 1×1 transparent PNG as base64
    const testImageBase64 =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

    this.logger.log('Testing Cloudinary upload...');

    const result = await cloudinary.uploader.upload(testImageBase64, {
      public_id: 'phase0_test',
      folder: 'oudnomad_test',
      overwrite: true,
      resource_type: 'image',
    });

    this.logger.log(`Cloudinary upload succeeded: ${result.secure_url}`);

    return {
      success: true,
      publicId: result.public_id,
      url: result.secure_url,
      format: result.format,
      bytes: result.bytes,
    };
  }

  /**
   * Creates a £0.50 test PaymentIntent on Stripe (not captured — safe for testing).
   * Uses GBP as the default currency; can be changed to match your primary currency.
   */
  async testStripePaymentIntent(): Promise<StripeTestResult> {
    this.logger.log('Testing Stripe PaymentIntent creation...');

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: 50, // £0.50 in pence (Stripe uses smallest currency unit)
      currency: 'gbp',
      description: 'Phase 0 connectivity test — safe to ignore',
      metadata: { source: 'phase0_verification' },
    });

    this.logger.log(`Stripe PaymentIntent created: ${paymentIntent.id}`);

    return {
      success: true,
      id: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
    };
  }
}
