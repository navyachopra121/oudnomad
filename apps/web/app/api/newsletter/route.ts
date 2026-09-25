import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/newsletter
 * Accepts { email: string } and stores/forwards the subscription.
 *
 * Production wiring options:
 *  1. Forward to Klaviyo / Mailchimp / Brevo via their REST API
 *  2. Write to a database table (e.g. Supabase, Planetscale)
 *  3. Send notification email via Nodemailer / Resend to hello.oudnomaddubai@gmail.com
 *
 * For now: validates the email and returns 200 so the popup UX works end-to-end.
 * Swap the TODO block below with your real integration.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { email?: unknown };
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';

    // Basic RFC-5322-ish validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ message: 'Please enter a valid email address.' }, { status: 422 });
    }

    // TODO: integrate with your email marketing platform here
    // Example (Resend):
    //   await resend.emails.send({ from: '...', to: 'hello.oudnomaddubai@gmail.com', subject: 'New subscriber', html: email });
    // Example (Mailchimp):
    //   await fetch(https://us1.api.mailchimp.com/3.0/lists/{LIST_ID}/members, { ... });

    console.log('[newsletter] New subscriber:', email);

    return NextResponse.json({ message: 'Subscribed successfully.' }, { status: 200 });
  } catch (err) {
    console.error('[newsletter] Error:', err);
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}
