/**
 * Abstraction over email delivery backends.
 * Swap between Resend and SES by setting EMAIL_PROVIDER env var.
 */
export interface EmailProvider {
  sendHtml(opts: SendHtmlOpts): Promise<void>;
}

export interface SendHtmlOpts {
  to: string;
  subject: string;
  html: string;
  /** Optional plain-text fallback */
  text?: string;
}
