import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  Inject,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { PAYMENT_SERVICE } from '../payments/payment.interface.js';
import type { PaymentService } from '../payments/payment.interface.js';
import { CreateRefundDto } from './dto/create-refund.dto.js';
import { Decimal } from '@prisma/client/runtime/library';
import { RefundStatus, PaymentAttemptStatus } from '@prisma/client';

@Injectable()
export class RefundsService {
  private readonly logger = new Logger(RefundsService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(PAYMENT_SERVICE) private readonly paymentService: PaymentService,
  ) {}

  async createRefund(adminUserId: string, dto: CreateRefundDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
      include: {
        paymentAttempts: {
          where: { status: PaymentAttemptStatus.SUCCEEDED },
          orderBy: { createdAt: 'desc' },
        },
        refunds: {
          where: { status: { in: [RefundStatus.PENDING, RefundStatus.PROCESSED] } },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order ${dto.orderId} not found`);
    }

    const successfulAttempt = order.paymentAttempts[0];
    if (!successfulAttempt || !successfulAttempt.gatewayPaymentId) {
      throw new BadRequestException(
        'No successful payment attempt with gateway payment ID found for this order',
      );
    }

    const totalRefunded = order.refunds.reduce(
      (sum, r) => sum + Number(r.amount),
      0,
    );
    const maxRefundable = Number(successfulAttempt.amount) - totalRefunded;

    if (dto.amount > maxRefundable) {
      throw new BadRequestException(
        `Refund amount ${dto.amount} exceeds remaining refundable amount ${maxRefundable}`,
      );
    }

    const refund = await this.prisma.refund.create({
      data: {
        orderId: order.id,
        paymentAttemptId: successfulAttempt.id,
        amount: dto.amount,
        reason: dto.reason,
        initiatedByAdminId: adminUserId,
        status: RefundStatus.PENDING,
      },
    });

    try {
      const result = await this.paymentService.createRefund(
        successfulAttempt,
        new Decimal(dto.amount),
      );

      const updated = await this.prisma.refund.update({
        where: { id: refund.id },
        data: {
          gatewayRefundId: result.gatewayRefundId,
          status: RefundStatus.PROCESSED,
        },
      });

      await this.prisma.orderStatusEvent.create({
        data: {
          orderId: order.id,
          status: order.status,
          note: `Refund of ${dto.amount} initiated (Refund ID: ${updated.id})`,
        },
      });

      return updated;
    } catch (err: any) {
      await this.prisma.refund.update({
        where: { id: refund.id },
        data: {
          status: RefundStatus.FAILED,
        },
      });
      this.logger.error(`Refund failed for order ${order.id}: ${err.message}`, err.stack);
      throw new BadRequestException(`Refund failed: ${err.message}`);
    }
  }

  async findRefundsByOrder(orderId: string) {
    return this.prisma.refund.findMany({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findRefundById(id: string) {
    const refund = await this.prisma.refund.findUnique({
      where: { id },
      include: {
        order: true,
        paymentAttempt: true,
      },
    });
    if (!refund) {
      throw new NotFoundException(`Refund ${id} not found`);
    }
    return refund;
  }
}
