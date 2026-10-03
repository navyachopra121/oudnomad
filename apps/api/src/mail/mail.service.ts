import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { Transporter } from 'nodemailer';

export interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * MailService — in-house custom SMTP email service.
 * Supports custom SMTP (Hostinger, cPanel, Gmail, AWS SES, or any custom mail server).
 * If SMTP credentials are not yet configured, gracefully logs the email to console
 * so registration and workflows never fail.
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: Transporter | null = null;
  private readonly fromAddress: string;

  constructor(private readonly config: ConfigService) {
    this.fromAddress =
      this.config.get<string>('MAIL_FROM_ADDRESS') ||
      this.config.get<string>('SMTP_FROM') ||
      'OudNomad <noreply@oudnomad.com>';

    this.initTransporter();
  }

  private initTransporter(): void {
    const host = this.config.get<string>('SMTP_HOST');
    const port = Number(this.config.get<string>('SMTP_PORT') || 587);
    const secure =
      this.config.get<string>('SMTP_SECURE') === 'true' || port === 465;
    const user = this.config.get<string>('SMTP_USER');
    const pass = this.config.get<string>('SMTP_PASS');

    if (host && user && pass) {
      try {
        this.transporter = nodemailer.createTransport({
          host,
          port,
          secure,
          auth: { user, pass },
          tls: {
            rejectUnauthorized:
              this.config.get<string>('NODE_ENV') === 'production',
          },
        });
        this.logger.log(`📧 Custom SMTP ready: ${host}:${port} (${user})`);
      } catch (err: any) {
        this.logger.error(
          `Failed to initialize SMTP transporter: ${err.message}`,
        );
        this.transporter = null;
      }
    } else {
      this.logger.log(
        'ℹ️ SMTP credentials not yet provided in .env — running in fallback logger mode',
      );
    }
  }

  /**
   * Verify SMTP connection status.
   */
  async verifyConnection(): Promise<{ connected: boolean; message: string }> {
    if (!this.transporter) {
      return {
        connected: false,
        message: 'No SMTP transporter configured (missing SMTP_HOST/USER/PASS)',
      };
    }
    try {
      await this.transporter.verify();
      return { connected: true, message: 'SMTP server connection verified successfully' };
    } catch (err: any) {
      return { connected: false, message: `SMTP connection failed: ${err.message}` };
    }
  }

  async sendVerificationEmail(to: string, token: string): Promise<void> {
    const appUrl =
      this.config.get<string>('NEXT_PUBLIC_API_URL') ??
      this.config.get<string>('FRONTEND_URL') ??
      'http://187.126.116.61';
    const link = `${appUrl}/verify-email?token=${token}`;

    await this.sendMail({
      to,
      subject: 'Verify your OudNomad account',
      html: `
        <div style="background-color: #0b0c10; color: #f5f5f7; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; text-align: center;">
          <div style="max-width: 500px; margin: 0 auto; background: #13151b; border: 1px solid #c5a05933; border-radius: 12px; padding: 32px;">
            <h1 style="color: #c5a059; font-size: 26px; letter-spacing: 2px; margin-bottom: 20px;">OUDNOMAD</h1>
            <p style="font-size: 16px; color: #d1d5db; line-height: 1.6;">Welcome to OudNomad. Please verify your email address to activate your account and explore our luxury fragrances.</p>
            <div style="margin: 32px 0;">
              <a href="${link}" style="background-color: #c5a059; color: #0b0c10; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px; letter-spacing: 1px; display: inline-block;">VERIFY EMAIL ADDRESS</a>
            </div>
            <p style="font-size: 13px; color: #6b7280; line-height: 1.5;">This link will expire in 24 hours. If you did not create an account, you can safely ignore this email.</p>
          </div>
        </div>
      `,
    });
  }

  async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    const appUrl =
      this.config.get<string>('NEXT_PUBLIC_API_URL') ??
      this.config.get<string>('FRONTEND_URL') ??
      'http://187.126.116.61';
    const link = `${appUrl}/reset-password?token=${token}`;

    await this.sendMail({
      to,
      subject: 'Reset your OudNomad password',
      html: `
        <div style="background-color: #0b0c10; color: #f5f5f7; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; text-align: center;">
          <div style="max-width: 500px; margin: 0 auto; background: #13151b; border: 1px solid #c5a05933; border-radius: 12px; padding: 32px;">
            <h1 style="color: #c5a059; font-size: 26px; letter-spacing: 2px; margin-bottom: 20px;">OUDNOMAD</h1>
            <p style="font-size: 16px; color: #d1d5db; line-height: 1.6;">You requested a password reset. Click the button below to choose a new password.</p>
            <div style="margin: 32px 0;">
              <a href="${link}" style="background-color: #c5a059; color: #0b0c10; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px; letter-spacing: 1px; display: inline-block;">RESET PASSWORD</a>
            </div>
            <p style="font-size: 13px; color: #6b7280; line-height: 1.5;">This link will expire in 30 minutes. If you did not request this, you can safely ignore this email.</p>
          </div>
        </div>
      `,
    });
  }

  async sendMail(options: MailOptions): Promise<void> {
    if (this.transporter) {
      try {
        await this.transporter.sendMail({
          from: this.fromAddress,
          to: options.to,
          subject: options.subject,
          html: options.html,
        });
        this.logger.log(`✉️ Email successfully delivered to: ${options.to} via SMTP`);
        return;
      } catch (err: any) {
        this.logger.error(`Failed to send email via SMTP to ${options.to}: ${err.message}`);
        // Fallback to log so user flow is not broken
      }
    }

    // Fallback log
    this.logger.log(
      `[MOCK/DEV EMAIL DISPATCH]\nTo: ${options.to}\nSubject: ${options.subject}\nFrom: ${this.fromAddress}`,
    );
  }
}
