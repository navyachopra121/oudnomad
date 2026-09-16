import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * MailService — thin email abstraction.
 * In development (NODE_ENV != production), emails are logged to console instead
 * of sent. Swap the `sendMail` implementation to Resend/SendGrid/Postmark by
 * replacing only this service — AuthService stays untouched.
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly isDev: boolean;
  private readonly fromAddress: string;

  constructor(private readonly config: ConfigService) {
    this.isDev = this.config.get<string>('NODE_ENV') !== 'production';
    this.fromAddress =
      this.config.get<string>('MAIL_FROM_ADDRESS') ?? 'noreply@oudnomad.com';
  }

  async sendVerificationEmail(to: string, token: string): Promise<void> {
    const appUrl =
      this.config.get<string>('NEXT_PUBLIC_API_URL') ?? 'http://localhost:3000';
    const link = `${appUrl}/verify-email?token=${token}`;

    await this.sendMail({
      to,
      subject: 'Verify your OudNomad email address',
      html: `
        <h2>Welcome to OudNomad!</h2>
        <p>Please verify your email address by clicking the link below. This link expires in 24 hours.</p>
        <p><a href="${link}">Verify Email Address</a></p>
        <p>If you did not create an account, you can safely ignore this email.</p>
      `,
    });
  }

  async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    const appUrl =
      this.config.get<string>('NEXT_PUBLIC_API_URL') ?? 'http://localhost:3000';
    const link = `${appUrl}/reset-password?token=${token}`;

    await this.sendMail({
      to,
      subject: 'Reset your OudNomad password',
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested a password reset. Click the link below to set a new password. This link expires in 30 minutes.</p>
        <p><a href="${link}">Reset Password</a></p>
        <p>If you did not request a password reset, you can safely ignore this email.</p>
      `,
    });
  }

  private async sendMail(options: MailOptions): Promise<void> {
    if (this.isDev) {
      // Dev mode: log email instead of sending
      this.logger.log(
        `[DEV EMAIL] To: ${options.to} | Subject: ${options.subject}\n${options.html}`,
      );
      return;
    }

    // TODO: Replace with real provider (Resend/SendGrid/Postmark) in production
    // Example with Resend:
    // const resend = new Resend(this.config.getOrThrow('MAIL_PROVIDER_API_KEY'));
    // await resend.emails.send({ from: this.fromAddress, ...options });
    this.logger.warn('MAIL_PROVIDER not configured — email not sent in production');
  }
}
