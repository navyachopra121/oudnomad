/**
 * Oudnomad Notification Worker
 * ─────────────────────────────────────────────────────────────────────────────
 * Standalone Node.js process that:
 *  1. Connects to Kafka and consumes the `notifications` topic
 *  2. Renders React Email templates and sends via Resend or AWS SES
 *  3. Records idempotency state in Postgres (via Prisma)
 *  4. Routes persistent failures to `notifications.dlq`
 *  5. Runs a cron job to detect and notify abandoned carts
 */
import { PrismaClient } from '@prisma/client';
import { createEmailProvider } from './email/email-provider.factory.js';
import { startKafkaConsumer } from './kafka/kafka-consumer.js';
import { startAbandonedCartCron } from './cron/abandoned-cart-cron.js';

async function main() {
  console.log('[notification-worker] Starting...');

  const prisma = new PrismaClient({
    log: process.env.LOG_LEVEL === 'debug' ? ['query', 'info', 'warn', 'error'] : ['warn', 'error'],
  });

  const emailProvider = createEmailProvider();

  // Start Kafka consumer
  const { consumer, producer } = await startKafkaConsumer(emailProvider, prisma);

  // Start abandoned-cart cron
  startAbandonedCartCron(prisma);

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    console.log(`[notification-worker] Received ${signal} — shutting down gracefully...`);
    try {
      await consumer.disconnect();
      await producer.disconnect();
      await prisma.$disconnect();
      console.log('[notification-worker] Shutdown complete');
      process.exit(0);
    } catch (err) {
      console.error('[notification-worker] Error during shutdown:', err);
      process.exit(1);
    }
  };

  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));

  console.log('[notification-worker] Running — waiting for messages...');
}

main().catch((err) => {
  console.error('[notification-worker] Fatal startup error:', err);
  process.exit(1);
});
