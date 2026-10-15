import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const STORE_OWNER_EMAIL = 'hello.oudnomaddubai@gmail.com';

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
    const body = await req.json();
    const {
      orderId,
      customer,
      items,
      subtotal,
      shipping,
      discount,
      total,
      currency = 'AED',
      paymentMethod = 'Standard Checkout (Pending Stripe Gateway)',
    } = body;

    if (!orderId || !customer?.email || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid order payload. Missing orderId, customer email, or items.' },
        { status: 400 }
      );
    }

    const itemsHtml = items
      .map(
        (it: any) => `
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
          <td style="padding: 12px 8px; color: #ffffff;">
            <strong>${it.name || 'Artisanal Flacon'}</strong><br/>
            <span style="font-size: 11px; color: #a1a1aa;">Size: ${it.size || '50ml'} | Qty: ${it.quantity}</span>
          </td>
          <td style="padding: 12px 8px; text-align: right; color: #ffb91d; font-weight: 600;">
            ${currency} ${(it.price * it.quantity).toLocaleString()}
          </td>
        </tr>`
      )
      .join('');

    // 1. Send Notification to Store Owner (Oud Nomad Team)
    const ownerMailPromise = transporter.sendMail({
      from: `"Oud Nomad Orders" <${process.env.SMTP_USER || 'hello.oudnomaddubai@gmail.com'}>`,
      to: STORE_OWNER_EMAIL,
      replyTo: customer.email,
      subject: `🔔 New Order Received: ${orderId} (${currency} ${total}) - ${customer.name || 'Collector'}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 620px; margin: 0 auto; padding: 28px; background: #0c0c0e; color: #f5f5f7; border: 1px solid #c5a059; border-radius: 4px;">
          <div style="text-align: center; border-bottom: 1px solid rgba(197, 160, 89, 0.3); padding-bottom: 16px; margin-bottom: 24px;">
            <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 3px; color: #ffb91d;">OUD NOMAD DUBAI</span>
            <h2 style="color: #ffffff; margin: 8px 0 4px; font-weight: 400; font-family: Georgia, serif;">New Customer Order</h2>
            <p style="font-size: 13px; color: #a1a1aa; margin: 0;">Order ID: <strong style="color: #ffb91d;">${orderId}</strong></p>
          </div>

          <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #ffb91d; margin-bottom: 12px;">Customer Details</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 24px;">
            <tr><td style="padding: 4px 0; color: #a1a1aa; width: 120px;">Name:</td><td style="color: #fff;">${customer.name || 'N/A'}</td></tr>
            <tr><td style="padding: 4px 0; color: #a1a1aa;">Email:</td><td style="color: #fff;"><a href="mailto:${customer.email}" style="color: #ffb91d;">${customer.email}</a></td></tr>
            <tr><td style="padding: 4px 0; color: #a1a1aa;">Phone:</td><td style="color: #fff;">${customer.phone || 'N/A'}</td></tr>
            <tr><td style="padding: 4px 0; color: #a1a1aa;">Address:</td><td style="color: #fff;">${customer.address || ''}, ${customer.city || ''}, ${customer.country || ''} ${customer.postalCode || ''}</td></tr>
            <tr><td style="padding: 4px 0; color: #a1a1aa;">Payment Mode:</td><td style="color: #fff;">${paymentMethod}</td></tr>
          </table>

          <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #ffb91d; margin-bottom: 12px;">Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 16px;">
            <thead>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.2); text-align: left; color: #a1a1aa; font-size: 11px; text-transform: uppercase;">
                <th style="padding: 8px;">Item</th>
                <th style="padding: 8px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>

          <div style="background: rgba(255,255,255,0.03); padding: 14px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 13px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: #a1a1aa;">
              <span>Subtotal:</span><span style="color: #fff;">${currency} ${subtotal}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: #a1a1aa;">
              <span>Shipping:</span><span style="color: #fff;">${shipping === 0 ? 'Complimentary' : `${currency} ${shipping}`}</span>
            </div>
            ${discount ? `<div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: #53ff73;"><span>Discount:</span><span>-${currency} ${discount}</span></div>` : ''}
            <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: bold; color: #ffb91d; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 8px; margin-top: 8px;">
              <span>Grand Total:</span><span>${currency} ${total}</span>
            </div>
          </div>
        </div>
      `,
    });

    // 2. Send Confirmation to Customer
    const customerMailPromise = transporter.sendMail({
      from: `"Oud Nomad Dubai" <${process.env.SMTP_USER || 'hello.oudnomaddubai@gmail.com'}>`,
      to: customer.email,
      subject: `Order Confirmation ${orderId} — Oud Nomad Dubai`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; background: #0c0c0e; color: #f5f5f7; border: 1px solid #c5a059;">
          <div style="text-align: center; border-bottom: 1px solid rgba(197, 160, 89, 0.3); padding-bottom: 20px; margin-bottom: 24px;">
            <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 3px; color: #ffb91d;">OUD NOMAD DUBAI</span>
            <h1 style="color: #ffffff; margin: 12px 0 6px; font-weight: 300; font-family: Georgia, serif; font-size: 24px;">Thank You For Your Order</h1>
            <p style="font-size: 13px; color: #a1a1aa; margin: 0;">Order Reference: <strong style="color: #ffb91d;">${orderId}</strong></p>
          </div>

          <p style="font-size: 13px; line-height: 1.6; color: #d4d4d8;">
            Dear ${customer.name || 'Valued Collector'},<br/><br/>
            We have received your order. Our master blenders at the Dubai atelier are preparing your bespoke flacons with the utmost precision, hand-sealing each vial before dispatch via our white-glove courier network.
          </p>

          <div style="margin: 24px 0; border: 1px solid rgba(255,255,255,0.1); padding: 16px; background: rgba(255,255,255,0.02);">
            <h3 style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #ffb91d; margin-top: 0; margin-bottom: 12px;">Items in your consignment</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">${itemsHtml}</table>
            <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px; margin-top: 10px; text-align: right; color: #ffb91d; font-size: 15px; font-weight: 600;">
              Total: ${currency} ${total}
            </div>
          </div>

          <div style="font-size: 12px; color: #a1a1aa; line-height: 1.6; border-top: 1px solid rgba(197,160,89,0.2); padding-top: 16px; text-align: center;">
            <p style="margin: 0 0 4px;">If you have any questions, reply directly to this email or reach us at <a href="mailto:hello.oudnomaddubai@gmail.com" style="color: #ffb91d;">hello.oudnomaddubai@gmail.com</a>.</p>
            <p style="margin: 0; font-style: italic; color: #71717a;">Oud Nomad Dubai — Artisanal Perfumery & Pure Agarwood Extracts</p>
          </div>
        </div>
      `,
    });

    // Execute concurrently
    await Promise.allSettled([ownerMailPromise, customerMailPromise]);

    return NextResponse.json({
      success: true,
      orderId,
      message: 'Order created and confirmation emails dispatched.',
    });
  } catch (err: any) {
    console.error('Order creation error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to process order' },
      { status: 500 }
    );
  }
}
