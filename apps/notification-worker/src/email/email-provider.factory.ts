import type { EmailProvider } from './email-provider.interface.js';
import { ResendEmailProvider } from './resend-email.provider.js';
import { SesEmailProvider } from './ses-email.provider.js';

/**
 * Factory: selects email provider based on EMAIL_PROVIDER env var.
 * Defaults to Resend.
 */
export function createEmailProvider(): EmailProvider {
  const provider = process.env.EMAIL_PROVIDER ?? 'resend';

  switch (provider) {
    case 'ses':
      return new SesEmailProvider();
    case 'resend':
    default:
      return new ResendEmailProvider();
  }
}
