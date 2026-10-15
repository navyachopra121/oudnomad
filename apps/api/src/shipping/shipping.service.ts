import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service.js';
import { KafkaProducerService } from '../kafka/kafka-producer.service.js';
import { OrderStatus } from '@prisma/client';
import { DhlClient, type DhlCreateShipmentPayload, type DhlTrackingEvent } from './dhl.client.js';

@Injectable()
export class ShippingService {
  private readonly logger = new Logger(ShippingService.name);

  constructor(
    private readonly dhl: DhlClient,
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly kafka: KafkaProducerService,
  ) {}

  /**
   * Called when an order moves to CONFIRMED status.
   * Creates a DHL shipment and stores AWB + tracking URL on the order.
   */
  async dispatchOrder(orderId: string): Promise<void> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { variant: { include: { product: true } } } } },
    });

    if (!order) throw new NotFoundException(`Order ${orderId} not found`);
    if (order.awbCode) {
      this.logger.warn(`Order ${orderId} already has AWB ${order.awbCode}, skipping dispatch`);
      return;
    }

    // Build the DHL payload from order data
    const shipperAddress = {
      postalCode: this.config.get<string>('COMPANY_PINCODE') ?? '',
      cityName: this.config.get<string>('COMPANY_CITY') ?? '',
      countryCode: this.config.get<string>('COMPANY_COUNTRY_CODE') ?? 'AE',
      addressLine1: this.config.get<string>('COMPANY_ADDRESS_LINE1') ?? '',
      addressLine2: this.config.get<string>('COMPANY_ADDRESS_LINE2'),
    };

    const receiverAddress = {
      postalCode: order.snapPostalCode ?? '',
      cityName: order.snapCity ?? '',
      countryCode: order.snapCountryCode ?? '',
      addressLine1: order.snapLine1 ?? '',
      addressLine2: order.snapLine2 ?? undefined,
      stateOrProvinceCode: order.snapState ?? undefined,
    };

    const description = order.items
      .map((i) => `${i.productName} x${i.quantity}`)
      .join(', ')
      .substring(0, 70);

    // Determine if customs declaration is needed (non-AE destinations)
    const isCustomsRequired = (order.snapCountryCode ?? 'AE') !== 'AE';

    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const payload: DhlCreateShipmentPayload = {
      plannedShippingDateAndTime: tomorrow.toISOString().replace('T', ' ').substring(0, 19) + ' GMT+04:00',
      pickup: { isRequested: false },
      productCode: 'P', // DHL Express Worldwide
      accounts: [{ number: this.dhl.accountNo, typeCode: 'shipper' }],
      customerDetails: {
        shipperDetails: {
          postalAddress: shipperAddress,
          contactInformation: {
            fullName: this.config.get<string>('COMPANY_NAME') ?? 'OudNomad',
            email: this.config.get<string>('COMPANY_EMAIL'),
            phone: this.config.get<string>('COMPANY_PHONE') ?? '',
          },
        },
        receiverDetails: {
          postalAddress: receiverAddress,
          contactInformation: {
            fullName: order.snapRecipientName ?? '',
            phone: order.snapPhone ?? '',
          },
        },
      },
      content: {
        packages: [
          {
            weight: this.estimateWeightKg(order.items),
            dimensions: { length: 30, width: 20, height: 15 },
          },
        ],
        isCustomsDeclarable: isCustomsRequired,
        declaredValue: isCustomsRequired ? Number(order.total) : undefined,
        declaredValueCurrency: 'AED',
        description,
        unitOfMeasurement: 'metric',
        ...(isCustomsRequired
          ? {
              exportDeclaration: {
                lineItems: order.items.map((item, idx) => ({
                  number: idx + 1,
                  description: item.productName.substring(0, 50),
                  price: Number(item.unitPrice),
                  priceCurrency: 'AED',
                  quantity: { value: item.quantity, unitOfMeasurement: 'PCS' },
                  commodityCodes: [{ typeCode: 'outbound', value: '3303009000' }], // HS code for perfume
                  exportReasonType: 'permanent',
                  isTaxesPaid: false,
                })),
                exportReason: 'Sale of goods',
                shipmentType: 'personal',
              },
            }
          : {}),
      },
      outputImageProperties: {
        printerDPI: 300,
        encodingFormat: 'pdf',
        imageOptions: [
          { typeCode: 'label', templateName: 'ECOM26_84_001', isRequested: true },
        ],
      },
    };

    const result = await this.dhl.createShipment(payload);

    const awbCode = result.shipmentTrackingNumber;
    const trackingUrl = this.dhl.getTrackingUrl(awbCode);
    const carrierShipmentId = result.packages?.[0]?.trackingNumber ?? awbCode;

    // Persist AWB and tracking URL on order
    await this.prisma.order.update({
      where: { id: orderId },
      data: {
        awbCode,
        carrierShipmentId,
        trackingUrl,
        dispatchedAt: new Date(),
        status: OrderStatus.PLACED,
      },
    });

    // Emit shipping update event to Kafka → triggers email notification
    await this.kafka.publish({
      idempotencyKey: `order-shipped-${orderId}`,
      type: 'SHIPPING_UPDATE',
      recipient: '', // will be fetched by notification worker from orderId
      payload: {
        orderId,
        orderNumber: order.orderNumber,
        awbCode,
        trackingUrl,
        estimatedDelivery: payload.plannedShippingDateAndTime,
      },
    });

    this.logger.log(`Order ${orderId} dispatched via DHL. AWB: ${awbCode}`);
  }

  /**
   * Handle a transit event webhook from DHL.
   * DHL sends events to our registered webhook URL.
   */
  async handleWebhookEvent(event: DhlWebhookPayload): Promise<void> {
    const awb = event.trackingNumber;
    if (!awb) return;

    const order = await this.prisma.order.findFirst({ where: { awbCode: awb } });
    if (!order) {
      this.logger.warn(`No order found for DHL AWB ${awb}`);
      return;
    }

    const typeCode = event.event?.typeCode;
    this.logger.log(`DHL event [${typeCode}] for order ${order.id} (AWB: ${awb})`);

    // Map DHL event codes to our OrderStatus
    if (typeCode === 'OK' || typeCode === 'DL') {
      // Delivered
      await this.prisma.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.DELIVERED, deliveredAt: new Date() },
      });
      void this.kafka.publish({
        idempotencyKey: `order-delivered-${order.id}-${Date.now()}`,
        type: 'SHIPPING_UPDATE',
        recipient: '',
        payload: { orderId: order.id, orderNumber: order.orderNumber, event: 'DELIVERED' },
      });
    } else if (['PU', 'DF', 'AF', 'OD'].includes(typeCode ?? '')) {
      // In transit (picked up, departed facility, arrived facility, out for delivery)
      // Ensure we're in SHIPPED state
      if (order.status === OrderStatus.PLACED || order.status === OrderStatus.CONFIRMED) {
        await this.prisma.order.update({
          where: { id: order.id },
          data: { status: OrderStatus.SHIPPED },
        });
      }
      void this.kafka.publish({
        idempotencyKey: `order-tracking-${order.id}-${Date.now()}`,
        type: 'SHIPPING_UPDATE',
        recipient: '',
        payload: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          event: event.event,
          trackingUrl: order.trackingUrl,
        },
      });
    }
  }

  /**
   * Get tracking events for an order's AWB.
   */
  async getTrackingInfo(orderId: string, userId?: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException(`Order ${orderId} not found`);

    // If userId provided, validate ownership
    if (userId && order.userId !== userId) {
      throw new BadRequestException('You do not own this order');
    }

    if (!order.awbCode) {
      return {
        status: 'not_dispatched',
        message: 'Your order is being prepared for shipment',
        events: [],
      };
    }

    const tracking = await this.dhl.trackShipment(order.awbCode);
    const shipment = tracking.shipments?.[0];

    return {
      awbCode: order.awbCode,
      trackingUrl: order.trackingUrl,
      status: shipment?.status ?? 'unknown',
      description: shipment?.description ?? '',
      estimatedDelivery: shipment?.estimatedDeliveryDate,
      events: (shipment?.events ?? []).map((e: DhlTrackingEvent) => ({
        timestamp: e.timestamp,
        location: e.location?.address?.addressLocality,
        description: e.description,
        typeCode: e.typeCode,
      })),
    };
  }

  /**
   * Cancel a DHL shipment when an order is cancelled.
   */
  async cancelShipment(orderId: string): Promise<void> {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order?.carrierShipmentId) return;

    await this.dhl.cancelShipment(order.carrierShipmentId);
    this.logger.log(`Cancelled DHL shipment for order ${orderId}`);
  }

  private estimateWeightKg(items: Array<{ quantity: number }>): number {
    // Estimate 0.15 kg per unit (perfume bottle); cap at DHL limit
    const total = items.reduce((sum, i) => sum + i.quantity * 0.15, 0);
    return Math.max(0.1, Math.min(total, 70));
  }
}

export interface DhlWebhookPayload {
  trackingNumber?: string;
  event?: {
    typeCode?: string;
    description?: string;
    timestamp?: string;
    location?: { address?: { addressLocality?: string; countryCode?: string } };
  };
}
