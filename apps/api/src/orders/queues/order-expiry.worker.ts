import { Worker, Job } from 'bullmq';
import { Logger } from '@nestjs/common';

const logger = new Logger('OrderExpiryWorker');
const redisUrl = process.env.REDIS_URL ?? 'redis://localhost:6379';

export interface OrderExpiryPayload {
  orderId: string;
}

/**
 * Bootstraps the BullMQ worker for the 'order-expiry' queue.
 * Called once from OrdersModule.forRoot / onModuleInit via OrdersWorkerService.
 *
 * The worker itself cannot be a NestJS provider that injects PrismaService
 * directly (BullMQ workers run in a separate event-loop context), so we pass
 * a handler callback from the NestJS layer.
 */
export function createOrderExpiryWorker(
  handler: (job: Job<OrderExpiryPayload>) => Promise<void>,
): Worker<OrderExpiryPayload> {
  const worker = new Worker<OrderExpiryPayload>(
    'order-expiry',
    handler,
    {
      connection: {
        url: redisUrl,
        maxRetriesPerRequest: 3,
      },
      concurrency: 5,
    },
  );

  worker.on('completed', (job) => {
    logger.log(`[OrderExpiryWorker] Job ${job.id} completed for order ${job.data.orderId}`);
  });

  worker.on('failed', (job, err) => {
    logger.error(
      `[OrderExpiryWorker] Job ${job?.id} failed for order ${job?.data?.orderId}: ${err.message}`,
    );
  });

  return worker;
}
