import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface DhlAuthToken {
  token: string;
  expiresAt: number; // epoch ms
}

export interface DhlCreateShipmentPayload {
  plannedShippingDateAndTime: string; // ISO-8601, e.g. "2024-10-14T10:00:00 GMT+05:30"
  pickup: {
    isRequested: boolean;
    closeTime?: string; // "18:00"
    location?: string;  // "reception"
    pickupDetails?: {
      postalAddress: DhlAddress;
      pickupRequestorDetails: { name: string; email: string; phone: string };
    };
  };
  productCode: string; // "P" = DHL Express Worldwide
  accounts: Array<{ number: string; typeCode: 'shipper' | 'payer' }>;
  customerDetails: {
    shipperDetails: { postalAddress: DhlAddress; contactInformation: DhlContact };
    receiverDetails: { postalAddress: DhlAddress; contactInformation: DhlContact };
  };
  content: {
    packages: Array<{
      weight: number;
      dimensions: { length: number; width: number; height: number };
    }>;
    isCustomsDeclarable: boolean;
    declaredValue?: number;
    declaredValueCurrency?: string;
    description: string;
    incoterm?: string;
    unitOfMeasurement: 'metric' | 'imperial';
    exportDeclaration?: {
      lineItems: Array<{
        number: number;
        description: string;
        price: number;
        priceCurrency: string;
        quantity: { value: number; unitOfMeasurement: string };
        commodityCodes: Array<{ typeCode: string; value: string }>;
        exportReasonType: string;
        isTaxesPaid: boolean;
      }>;
      exportReason: string;
      shipmentType: string;
    };
  };
  outputImageProperties?: {
    printerDPI?: number;
    encodingFormat?: string;
    imageOptions?: Array<{ typeCode: string; templateName?: string; isRequested: boolean }>;
  };
}

export interface DhlAddress {
  postalCode: string;
  cityName: string;
  countryCode: string; // ISO 2-letter
  addressLine1: string;
  addressLine2?: string;
  addressLine3?: string;
  stateOrProvinceCode?: string;
}

export interface DhlContact {
  fullName: string;
  email?: string;
  phone: string;
}

export interface DhlShipmentResponse {
  shipmentTrackingNumber: string;
  trackingUrl: string;
  packages: Array<{
    trackingNumber: string;
    documents?: Array<{ imageFormat: string; content: string }>;
  }>;
  documents?: Array<{ imageFormat: string; content: string }>;
}

export interface DhlTrackingEvent {
  timestamp: string; // ISO-8601
  location: { address: { addressLocality: string; countryCode: string } };
  description: string;
  typeCode: string; // "PU" = picked up, "DF" = departed facility, "AF" = arrived facility, "OD" = out for delivery, "OK" = delivered, "PL" = processed label
}

export interface DhlTrackingResponse {
  shipments: Array<{
    id: string;
    status: string; // "delivered" | "transit" | "delivered" etc
    description: string;
    events: DhlTrackingEvent[];
    estimatedDeliveryDate?: string;
  }>;
}

@Injectable()
export class DhlClient {
  private readonly logger = new Logger(DhlClient.name);

  /** DHL Express Unified Tracking API base URL */
  private readonly trackingBaseUrl = 'https://api-mock.dhl.com/mydhl/tracking/shipments';

  /** DHL Express MyDHL API base URL */
  private readonly mydhlBaseUrl = 'https://express.api.dhl.com/mydhlapi';

  private readonly apiKey: string;
  private readonly accountNumber: string;

  constructor(private readonly config: ConfigService) {
    this.apiKey = this.config.get<string>('DHL_API_KEY') ?? '';
    this.accountNumber = this.config.get<string>('DHL_ACCOUNT_NUMBER') ?? '';

    if (!this.apiKey) {
      this.logger.warn('DHL_API_KEY not set — shipping calls will fail');
    }
  }

  private get authHeader(): Record<string, string> {
    return {
      'DHL-API-Key': this.apiKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  }

  /**
   * Create a DHL Express shipment and get tracking/AWB number.
   */
  async createShipment(payload: DhlCreateShipmentPayload): Promise<DhlShipmentResponse> {
    const url = `${this.mydhlBaseUrl}/shipments`;
    this.logger.log(`Creating DHL shipment to ${payload.customerDetails.receiverDetails.postalAddress.cityName}`);

    const response = await fetch(url, {
      method: 'POST',
      headers: this.authHeader,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body = await response.text();
      this.logger.error(`DHL createShipment failed [${response.status}]: ${body}`);
      throw new HttpException(
        `DHL shipment creation failed: ${response.statusText}`,
        HttpStatus.BAD_GATEWAY,
      );
    }

    return response.json() as Promise<DhlShipmentResponse>;
  }

  /**
   * Track shipment by AWB/tracking number.
   */
  async trackShipment(trackingNumber: string): Promise<DhlTrackingResponse> {
    const url = `${this.trackingBaseUrl}?trackingNumber=${encodeURIComponent(trackingNumber)}&trackingView=all-checkpoints&levelOfDetail=all`;

    const response = await fetch(url, {
      method: 'GET',
      headers: this.authHeader,
    });

    if (!response.ok) {
      const body = await response.text();
      this.logger.error(`DHL tracking failed [${response.status}]: ${body}`);
      throw new HttpException(
        `DHL tracking lookup failed: ${response.statusText}`,
        HttpStatus.BAD_GATEWAY,
      );
    }

    return response.json() as Promise<DhlTrackingResponse>;
  }

  /**
   * Cancel a DHL shipment (if not yet picked up).
   */
  async cancelShipment(shipmentId: string): Promise<void> {
    const url = `${this.mydhlBaseUrl}/shipments/${encodeURIComponent(shipmentId)}/cancel`;
    this.logger.log(`Cancelling DHL shipment ${shipmentId}`);

    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.authHeader,
    });

    if (!response.ok && response.status !== 404) {
      const body = await response.text();
      this.logger.error(`DHL cancel failed [${response.status}]: ${body}`);
      throw new HttpException(
        `DHL cancellation failed: ${response.statusText}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  /**
   * Get DHL tracking URL for a given AWB.
   */
  getTrackingUrl(awbCode: string): string {
    return `https://www.dhl.com/en/express/tracking.html?AWB=${awbCode}&brand=DHL`;
  }

  get accountNo(): string {
    return this.accountNumber;
  }
}
