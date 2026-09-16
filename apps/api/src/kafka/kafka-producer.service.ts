import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer, KafkaConfig, logLevel } from 'kafkajs';

export const NOTIFICATION_TOPIC = 'notifications';

export interface NotificationMessage {
  /** Deterministic key so Kafka delivers to the same partition; also used as idempotency key in the worker */
  idempotencyKey: string;
  type:
    | 'ORDER_CONFIRMATION'
    | 'SHIPPING_UPDATE'
    | 'PASSWORD_RESET'
    | 'ABANDONED_CART';
  recipient: string;
  payload: Record<string, unknown>;
}

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaProducerService.name);
  private producer: Producer;

  constructor(private readonly config: ConfigService) {
    const broker = this.config.get<string>('KAFKA_BROKER', 'localhost:9092');
    const kafkaCfg: KafkaConfig = {
      clientId: 'oudnomad-api',
      brokers: [broker],
      logLevel: logLevel.WARN,
    };
    this.producer = new Kafka(kafkaCfg).producer({
      // Idempotent producer — guarantees exactly-once delivery at the broker level
      idempotent: true,
      maxInFlightRequests: 5,
    });
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.producer.connect();
      this.logger.log('Kafka producer connected');
    } catch (err) {
      // Non-fatal at startup — events will fail gracefully until Kafka is up
      this.logger.error('Kafka producer failed to connect on init', err);
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.producer.disconnect().catch(() => {/* swallow on shutdown */});
  }

  /**
   * Fire-and-forget publish. Callers MUST NOT await this in the hot path
   * unless they want to block the request. Log errors; do not rethrow.
   */
  async publish(message: NotificationMessage): Promise<void> {
    try {
      await this.producer.send({
        topic: NOTIFICATION_TOPIC,
        messages: [
          {
            key: message.idempotencyKey,
            value: JSON.stringify(message),
          },
        ],
      });
      this.logger.debug(`Published ${message.type} for ${message.recipient}`);
    } catch (err) {
      this.logger.error(
        `Failed to publish ${message.type} notification for ${message.recipient}`,
        err,
      );
    }
  }

  async publishProductChanged(productId: string): Promise<void> {
    try {
      await this.producer.send({
        topic: 'product.changed',
        messages: [
          {
            key: productId,
            value: JSON.stringify({ productId, timestamp: new Date().toISOString() }),
          },
        ],
      });
      this.logger.debug(`Published product.changed for ${productId}`);
    } catch (err) {
      this.logger.error(`Failed to publish product.changed for ${productId}`, err);
    }
  }
}
