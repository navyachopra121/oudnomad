import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RazorpayPaymentService } from './razorpay-payment.service.js';
import { StripePaymentService } from './stripe-payment.service.js';
import { MockPaymentService } from './mock-payment.service.js';
import { PaymentWebhookService } from './payment-webhook.service.js';
import { PaymentWebhookController } from './payment-webhook.controller.js';
import { PAYMENT_SERVICE } from './payment.interface.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [PaymentWebhookController],
  providers: [
    RazorpayPaymentService,
    StripePaymentService,
    MockPaymentService,
    PaymentWebhookService,
    {
      provide: PAYMENT_SERVICE,
      useFactory: (
        config: ConfigService,
        stripe: StripePaymentService,
        razorpay: RazorpayPaymentService,
        mock: MockPaymentService,
      ) => {
        const provider = (config.get<string>('PAYMENT_PROVIDER') ?? 'stripe').toLowerCase();
        if (provider === 'stripe') return stripe;
        if (provider === 'razorpay') return razorpay;
        return mock;
      },
      inject: [ConfigService, StripePaymentService, RazorpayPaymentService, MockPaymentService],
    },
  ],
  exports: [PAYMENT_SERVICE, PaymentWebhookService],
})
export class PaymentsModule {}
