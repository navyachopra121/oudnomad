import nodemailer, { Transporter } from 'nodemailer';
import type { EmailProvider, SendHtmlOpts } from './email-provider.interface.js';

export class SmtpEmailProvider implements EmailProvider {
  private transporter: Transporter | null = null;
  private readonly from: string;

  constructor() {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const secure = process.env.SMTP_SECURE === 'true' || port === 465;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    this.from = process.env.MAIL_FROM_ADDRESS || process.env.SMTP_FROM || 'OudNomad <noreply@oudnomad.com>';

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
      });
      console.log(`[SMTP Provider] Initialized SMTP transporter: ${host}:${port} (${user})`);
    } else {
      console.log('[SMTP Provider] SMTP credentials not provided, running in mock logger mode');
    }
  }

  async sendHtml(opts: SendHtmlOpts): Promise<void> {
    if (this.transporter) {
      await this.transporter.sendMail({
        from: this.from,
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
        text: opts.text,
      });
      console.log(`[SMTP Provider] Email dispatched to ${opts.to}`);
    } else {
      console.log(`[SMTP Provider Log] To: ${opts.to} | Subject: ${opts.subject}`);
    }
  }
}
