import {
  SESClient,
  SendEmailCommand,
} from '@aws-sdk/client-ses';
import type { EmailProvider, SendHtmlOpts } from './email-provider.interface.js';

export class SesEmailProvider implements EmailProvider {
  private readonly client: SESClient;
  private readonly from: string;

  constructor() {
    this.from = process.env.SES_FROM ?? 'noreply@oudnomad.com';
    this.client = new SESClient({
      region: process.env.AWS_REGION ?? 'us-east-1',
      credentials: process.env.AWS_ACCESS_KEY_ID
        ? {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
          }
        : undefined, // Falls back to IAM role / instance profile in production
    });
  }

  async sendHtml(opts: SendHtmlOpts): Promise<void> {
    await this.client.send(
      new SendEmailCommand({
        Source: this.from,
        Destination: { ToAddresses: [opts.to] },
        Message: {
          Subject: { Data: opts.subject, Charset: 'UTF-8' },
          Body: {
            Html: { Data: opts.html, Charset: 'UTF-8' },
            ...(opts.text && { Text: { Data: opts.text, Charset: 'UTF-8' } }),
          },
        },
      }),
    );
  }
}
