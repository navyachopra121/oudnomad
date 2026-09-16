import { Resend } from 'resend';
import type { EmailProvider, SendHtmlOpts } from './email-provider.interface.js';

export class ResendEmailProvider implements EmailProvider {
  private readonly client: Resend;
  private readonly from: string;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) throw new Error('RESEND_API_KEY env var is required');
    this.from = process.env.RESEND_FROM ?? 'noreply@oudnomad.com';
    this.client = new Resend(apiKey);
  }

  async sendHtml(opts: SendHtmlOpts): Promise<void> {
    const { error } = await this.client.emails.send({
      from: this.from,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
    });

    if (error) {
      throw new Error(`Resend delivery error: ${error.message}`);
    }
  }
}
