import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RazorpayPaymentService } from './razorpay-payment.service.js';
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
    MockPaymentService,
    PaymentWebhookService,
    {
      provide: PAYMENT_SERVICE,
      useFactory: (
        config: ConfigService,
        razorpay: RazorpayPaymentService,
        mock: MockPaymentService,
      ) => {
        const provider = config.get<string>('PAYMENT_PROVIDER') ?? 'mock';
        return provider === 'razorpay' ? razorpay : mock;
      },
      inject: [ConfigService, RazorpayPaymentService, MockPaymentService],
    },
  ],
  exports: [PAYMENT_SERVICE, PaymentWebhookService],
})
export class PaymentsModule {}
