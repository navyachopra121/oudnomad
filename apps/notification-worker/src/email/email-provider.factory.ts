import type { EmailProvider } from './email-provider.interface.js';
import { SmtpEmailProvider } from './smtp-email.provider.js';
import { ResendEmailProvider } from './resend-email.provider.js';
import { SesEmailProvider } from './ses-email.provider.js';

/**
 * Factory: selects email provider based on EMAIL_PROVIDER env var.
 * Defaults to 'smtp' (custom in-house SMTP server).
 */
export function createEmailProvider(): EmailProvider {
  const provider = (process.env.EMAIL_PROVIDER || 'smtp').toLowerCase();

  switch (provider) {
    case 'resend':
      return new ResendEmailProvider();
    case 'ses':
      return new SesEmailProvider();
    case 'smtp':
    default:
      return new SmtpEmailProvider();
  }
}
