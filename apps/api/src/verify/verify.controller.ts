import { Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { VerifyService } from './verify.service.js';

/**
 * VerifyController — Phase 0 connectivity verification endpoints.
 *
 * These endpoints are for one-time Phase 0 verification ONLY.
 * They should be removed or secured before going to production.
 *
 * POST /api/verify/cloudinary  → upload a test image to Cloudinary
 * POST /api/verify/stripe      → create a test PaymentIntent on Stripe
 */
@Controller('verify')
export class VerifyController {
  constructor(private readonly verifyService: VerifyService) {}

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
