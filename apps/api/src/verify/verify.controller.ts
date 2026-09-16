import { Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { VerifyService } from './verify.service.js';

/**
 * VerifyController — Phase 0 connectivity & storage verification endpoints.
 *
 * POST /api/verify/storage     → test local server file upload & static URL
 * POST /api/verify/cloudinary  → test Cloudinary upload (if configured)
 * POST /api/verify/stripe      → create a test PaymentIntent on Stripe
 */
@Controller('verify')
export class VerifyController {
  constructor(private readonly verifyService: VerifyService) {}

  @Post('storage')
  @HttpCode(HttpStatus.OK)
  async testStorage() {
    return this.verifyService.testLocalStorageUpload();
  }

  @Post('cloudinary')
  @HttpCode(HttpStatus.OK)
  async testCloudinary() {
    return this.verifyService.testCloudinaryUpload();
  }

  @Post('stripe')
  @HttpCode(HttpStatus.OK)
  async testStripe() {
    return this.verifyService.testStripePaymentIntent();
  }
}
