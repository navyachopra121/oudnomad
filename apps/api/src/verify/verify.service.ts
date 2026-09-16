import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import Stripe from 'stripe';
import { StorageService, UploadResult } from '../storage/storage.service.js';

export interface LocalStorageTestResult {
  success: boolean;
  message: string;
  file: UploadResult;
}

export interface CloudinaryTestResult {
  success: boolean;
  publicId?: string;
  url?: string;
  format?: string;
  bytes?: number;
  message?: string;
}

export interface StripeTestResult {
  success: boolean;
  id: string;
  status: string;
  amount: number;
  currency: string;
}

/**
 * VerifyService — Phase 0 connectivity and storage verification testing.
 */
@Injectable()
export class VerifyService {
  private readonly logger = new Logger(VerifyService.name);
  private stripe: Stripe;
  private isCloudinaryConfigured = false;

  constructor(
    private readonly config: ConfigService,
    private readonly storageService: StorageService,
  ) {
    // Optional Cloudinary Configuration
    const cloudName = this.config.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.config.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.config.get<string>('CLOUDINARY_API_SECRET');

    if (cloudName && apiKey && apiSecret) {
      cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
      this.isCloudinaryConfigured = true;
    } else {
      this.logger.log('Cloudinary credentials not present — local server storage is active.');
    }

    // Configure Stripe
    const stripeKey = this.config.get<string>('STRIPE_SECRET_KEY') ?? 'sk_test_mock';
    this.stripe = new Stripe(stripeKey, {
      apiVersion: '2025-08-27.basil',
    });
  }

  /**
   * Tests local disk file storage by writing a 1x1 transparent PNG file to ./uploads/test
   */
  async testLocalStorageUpload(): Promise<LocalStorageTestResult> {
    this.logger.log('Testing local server file storage upload...');

    const testPngBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      'base64',
    );

    const fileResult = await this.storageService.saveFile(
      testPngBuffer,
      'phase0_test.png',
      'image/png',
      { subfolder: 'test' },
    );

    this.logger.log(`Local storage test succeeded. File available at: ${fileResult.url}`);

    return {
      success: true,
      message: 'Local server storage upload & static asset URL verification successful',
      file: fileResult,
    };
  }

  /**
   * Uploads a test image to Cloudinary (if configured)
   */
  async testCloudinaryUpload(): Promise<CloudinaryTestResult> {
    if (!this.isCloudinaryConfigured) {
      return {
        success: false,
        message: 'Cloudinary is currently disabled/unconfigured. Local server storage is active.',
      };
    }

    const testImageBase64 =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

    this.logger.log('Testing Cloudinary upload...');

    const result = await cloudinary.uploader.upload(testImageBase64, {
      public_id: 'phase0_test',
      folder: 'oudnomad_test',
      overwrite: true,
      resource_type: 'image',
    });

    return {
      success: true,
      publicId: result.public_id,
      url: result.secure_url,
      format: result.format,
      bytes: result.bytes,
    };
  }

  /**
   * Creates a £0.50 test PaymentIntent on Stripe
   */
  async testStripePaymentIntent(): Promise<StripeTestResult> {
    this.logger.log('Testing Stripe PaymentIntent creation...');

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: 50,
      currency: 'gbp',
      description: 'Phase 0 connectivity test — safe to ignore',
      metadata: { source: 'phase0_verification' },
    });

    return {
      success: true,
      id: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
    };
  }
}
