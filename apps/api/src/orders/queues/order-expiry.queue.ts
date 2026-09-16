import { Queue } from 'bullmq';
import { Logger } from '@nestjs/common';

const logger = new Logger('OrderExpiryQueue');
const redisUrl = process.env.REDIS_URL ?? 'redis://localhost:6379';

export let orderExpiryQueue: Queue | null = null;

try {
  orderExpiryQueue = new Queue('order-expiry', {
    connection: {
      url: redisUrl,
      maxRetriesPerRequest: 3,
    },
  });
} catch (err: any) {
  logger.warn(`Failed to initialize BullMQ order-expiry queue: ${err.message}`);
}

export async function scheduleOrderExpiry(orderId: string, timeoutMinutes = 10): Promise<void> {
  if (!orderExpiryQueue) return;
  try {
    const delay = timeoutMinutes * 60 * 1000;
    await orderExpiryQueue.add(
      'expire-order',
      { orderId },
      { delay, jobId: `expire-${orderId}` },
    );
    logger.log(`Scheduled 10-min expiry job for order ${orderId}`);
  } catch (err: any) {
    logger.warn(`Failed to schedule expiry job for order ${orderId}: ${err.message}`);
  }
}

export async function cancelScheduledExpiry(orderId: string): Promise<void> {
  if (!orderExpiryQueue) return;
  try {
    const job = await orderExpiryQueue.getJob(`expire-${orderId}`);
    if (job) {
      await job.remove();
      logger.log(`Cancelled scheduled expiry job for order ${orderId}`);
    }
  } catch (err: any) {
    logger.warn(`Failed to cancel expiry job for order ${orderId}: ${err.message}`);
  }
}
