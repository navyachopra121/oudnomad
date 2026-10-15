import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface ContactRequestBody {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

const RECIPIENT_EMAIL = 'hello.oudnomaddubai@gmail.com';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT || 465),
  secure: process.env.SMTP_SECURE !== 'false',
  auth: {
    user: process.env.SMTP_USER || 'hello.oudnomaddubai@gmail.com',
    pass: process.env.SMTP_PASS || 'ivafqgvoulkucnio',
  },
});

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ContactRequestBody;
    const name = (body.name || '').trim();
    const email = (body.email || '').trim().toLowerCase();
    const phone = (body.phone || '').trim();
    const message = (body.message || '').trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Please provide your name, email, and message.' },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 422 }
      );
    }

    console.log('[Contact Form] New submission received:');
    console.log(`  Name: ${name}`);
    console.log(`  Email: ${email}`);
    console.log(`  Phone: ${phone}`);
    console.log(`  Message: ${message}`);

    // Dispatch email via Gmail SMTP
    try {
      const info = await transporter.sendMail({
        from: `"Oud Nomad Concierge" <${process.env.SMTP_USER || 'hello.oudnomaddubai@gmail.com'}>`,
        to: RECIPIENT_EMAIL,
        replyTo: email,
        subject: `[Oud Nomad] New Website Inquiry from ${name}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0b0c10; color: #f5f5f7; border-radius: 8px;">
            <h2 style="color: #c5a059; border-bottom: 1px solid rgba(197, 160, 89, 0.2); padding-bottom: 12px; margin-top: 0;">New Website Inquiry</h2>
            <p style="font-size: 14px; color: #a1a1aa;">A new message was submitted via the Oud Nomad contact form:</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr>
                <td style="padding: 8px 0; color: #c5a059; font-weight: 600; width: 100px;">Name:</td>
                <td style="padding: 8px 0; color: #ffffff;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #c5a059; font-weight: 600;">Email:</td>
                <td style="padding: 8px 0; color: #ffffff;"><a href="mailto:${email}" style="color: #ffb91d;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #c5a059; font-weight: 600;">Phone:</td>
                <td style="padding: 8px 0; color: #ffffff;"><a href="tel:${phone}" style="color: #ffb91d;">${phone || 'Not provided'}</a></td>
              </tr>
            </table>
            <div style="background: #14151a; border-left: 3px solid #c5a059; padding: 16px; margin: 20px 0; border-radius: 4px;">
              <strong style="color: #c5a059; display: block; margin-bottom: 8px;">Message:</strong>
              <p style="margin: 0; line-height: 1.6; white-space: pre-wrap; color: #e4e4e7;">${message}</p>
            </div>
            <p style="font-size: 12px; color: #71717a; margin-top: 24px; text-align: center;">
              Sent from Oud Nomad Storefront (oudnomaddubai.com)
            </p>
          </div>
        `,
      });
      console.log('[Contact Form] Email sent successfully:', info.messageId);
    } catch (mailErr: any) {
      console.error('[Contact Form] Failed to send email via SMTP:', mailErr.message);
      // We still return 200 so the customer experience succeeds, since their message was captured in logs.
    }

    return NextResponse.json(
      { success: true, message: 'Your message has been received successfully.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Contact Form] Server error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again or email us directly.' },
      { status: 500 }
    );
  }
}
