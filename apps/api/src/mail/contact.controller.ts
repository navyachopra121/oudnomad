import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { MailService } from './mail.service.js';
import { Public } from '../auth/decorators/public.decorator.js';

class ContactDto {
  name!: string;
  email!: string;
  phone?: string;
  message!: string;
}

class OrderCreateDto {
  orderId!: string;
  customer!: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
    postalCode?: string;
  };
  items!: Array<{
    id?: string;
    name: string;
    size?: string;
    quantity: number;
    price: number;
  }>;
  subtotal!: number;
  shipping!: number;
  discount?: number;
  total!: number;
  currency?: string;
  paymentMethod?: string;
}

@Controller()
export class ContactController {
  constructor(private readonly mailService: MailService) {}

  @Public()
  @Post('contact')
  async handleContact(@Body() dto: ContactDto) {
    if (!dto.name || !dto.email || !dto.message) {
      throw new BadRequestException('Please provide your name, email, and message.');
    }

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0c0c0e; color: #f5f5f7; border: 1px solid #c5a059;">
        <h2 style="color: #ffb91d; border-bottom: 1px solid rgba(197, 160, 89, 0.2); padding-bottom: 12px; margin-top: 0;">New Website Inquiry</h2>
        <p style="font-size: 14px; color: #a1a1aa;">A new message was submitted via the Oud Nomad contact form:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px;">
          <tr><td style="padding: 6px 0; color: #ffb91d; font-weight: 600; width: 100px;">Name:</td><td>${dto.name}</td></tr>
          <tr><td style="padding: 6px 0; color: #ffb91d; font-weight: 600;">Email:</td><td><a href="mailto:${dto.email}" style="color: #ffb91d;">${dto.email}</a></td></tr>
          ${dto.phone ? `<tr><td style="padding: 6px 0; color: #ffb91d; font-weight: 600;">Phone:</td><td>${dto.phone}</td></tr>` : ''}
        </table>
        <div style="background: rgba(255, 255, 255, 0.04); padding: 16px; border-left: 3px solid #ffb91d; margin: 16px 0;">
          <p style="margin: 0; white-space: pre-line; line-height: 1.6;">${dto.message}</p>
        </div>
        <p style="font-size: 11px; color: #71717a; border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 12px;">Submitted directly from oudnomaddubai.com</p>
      </div>
    `;

    await this.mailService.sendMail({
      to: 'hello.oudnomaddubai@gmail.com',
      subject: `[Oud Nomad] New Website Inquiry from ${dto.name}`,
      html,
    });

    return { success: true, message: 'Your message has been sent to the Oud Nomad atelier concierge.' };
  }

  @Public()
  @Post('orders/create')
  async handleOrderCreate(@Body() dto: OrderCreateDto) {
    if (!dto.orderId || !dto.customer?.email || !dto.items || dto.items.length === 0) {
      throw new BadRequestException('Invalid order payload.');
    }

    const currency = dto.currency || 'AED';
    const itemsHtml = dto.items
      .map(
        (it) => `
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
          <td style="padding: 10px 8px; color: #ffffff;">
            <strong>${it.name || 'Artisanal Flacon'}</strong><br/>
            <span style="font-size: 11px; color: #a1a1aa;">Size: ${it.size || '50ml'} | Qty: ${it.quantity}</span>
          </td>
          <td style="padding: 10px 8px; text-align: right; color: #ffb91d; font-weight: 600;">
            ${currency} ${(it.price * it.quantity).toLocaleString()}
          </td>
        </tr>`
      )
      .join('');

    // 1. Alert to Brand Owner
    const ownerHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 620px; margin: 0 auto; padding: 28px; background: #0c0c0e; color: #f5f5f7; border: 1px solid #c5a059; border-radius: 4px;">
        <div style="text-align: center; border-bottom: 1px solid rgba(197, 160, 89, 0.3); padding-bottom: 16px; margin-bottom: 24px;">
          <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 3px; color: #ffb91d;">OUD NOMAD DUBAI</span>
          <h2 style="color: #ffffff; margin: 8px 0 4px; font-weight: 400; font-family: Georgia, serif;">New Customer Order</h2>
          <p style="font-size: 13px; color: #a1a1aa; margin: 0;">Order Reference: <strong style="color: #ffb91d;">${dto.orderId}</strong></p>
        </div>

        <h3 style="font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #ffb91d; margin-bottom: 8px;">Customer Dossier</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px;">
          <tr><td style="padding: 4px 0; color: #a1a1aa; width: 120px;">Name:</td><td style="color: #fff;">${dto.customer.name}</td></tr>
          <tr><td style="padding: 4px 0; color: #a1a1aa;">Email:</td><td style="color: #fff;"><a href="mailto:${dto.customer.email}" style="color: #ffb91d;">${dto.customer.email}</a></td></tr>
          <tr><td style="padding: 4px 0; color: #a1a1aa;">Phone:</td><td style="color: #fff;">${dto.customer.phone || 'N/A'}</td></tr>
          <tr><td style="padding: 4px 0; color: #a1a1aa;">Delivery Destination:</td><td style="color: #fff;">${dto.customer.address || ''}, ${dto.customer.city || ''}, ${dto.customer.country || ''}</td></tr>
          <tr><td style="padding: 4px 0; color: #a1a1aa;">Payment Mode:</td><td style="color: #fff;">${dto.paymentMethod || 'Direct / Card'}</td></tr>
        </table>

        <h3 style="font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #ffb91d; margin-bottom: 8px;">Ordered Flacons</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 16px;">
          ${itemsHtml}
        </table>

        <div style="background: rgba(255,255,255,0.03); padding: 14px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 13px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: #a1a1aa;">
            <span>Subtotal:</span><span style="color: #fff;">${currency} ${dto.subtotal}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: #a1a1aa;">
            <span>Shipping:</span><span style="color: #fff;">${dto.shipping === 0 ? 'Complimentary' : `${currency} ${dto.shipping}`}</span>
          </div>
          ${dto.discount ? `<div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: #53ff73;"><span>Discount:</span><span>-${currency} ${dto.discount}</span></div>` : ''}
          <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: bold; color: #ffb91d; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 8px; margin-top: 8px;">
            <span>Grand Total:</span><span>${currency} ${dto.total}</span>
          </div>
        </div>
      </div>
    `;

    // 2. Customer Confirmation
    const customerHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; background: #0c0c0e; color: #f5f5f7; border: 1px solid #c5a059;">
        <div style="text-align: center; border-bottom: 1px solid rgba(197, 160, 89, 0.3); padding-bottom: 20px; margin-bottom: 24px;">
          <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 3px; color: #ffb91d;">OUD NOMAD DUBAI</span>
          <h1 style="color: #ffffff; margin: 12px 0 6px; font-weight: 300; font-family: Georgia, serif; font-size: 24px;">Thank You For Your Order</h1>
          <p style="font-size: 13px; color: #a1a1aa; margin: 0;">Order Reference: <strong style="color: #ffb91d;">${dto.orderId}</strong></p>
        </div>

        <p style="font-size: 13px; line-height: 1.6; color: #d4d4d8;">
          Dear ${dto.customer.name || 'Valued Collector'},<br/><br/>
          We have received your order. Our blenders at the Dubai atelier are preparing your bespoke flacons with the utmost precision, hand-sealing each bottle before dispatch via our white-glove courier network.
        </p>

        <div style="margin: 20px 0; border: 1px solid rgba(255,255,255,0.1); padding: 16px; background: rgba(255,255,255,0.02);">
          <h3 style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #ffb91d; margin-top: 0; margin-bottom: 12px;">Consignment Details</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">${itemsHtml}</table>
          <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px; margin-top: 10px; text-align: right; color: #ffb91d; font-size: 15px; font-weight: 600;">
            Total: ${currency} ${dto.total}
          </div>
        </div>

        <div style="font-size: 12px; color: #a1a1aa; line-height: 1.6; border-top: 1px solid rgba(197,160,89,0.2); padding-top: 16px; text-align: center;">
          <p style="margin: 0 0 4px;">For inquiries, reply to this email or contact us at <a href="mailto:hello.oudnomaddubai@gmail.com" style="color: #ffb91d;">hello.oudnomaddubai@gmail.com</a>.</p>
          <p style="margin: 0; font-style: italic; color: #71717a;">Oud Nomad Dubai — Artisanal Perfumery & Pure Agarwood Extracts</p>
        </div>
      </div>
    `;

    await Promise.allSettled([
      this.mailService.sendMail({
        to: 'hello.oudnomaddubai@gmail.com',
        subject: `🔔 New Order Received: ${dto.orderId} (${currency} ${dto.total}) - ${dto.customer.name}`,
        html: ownerHtml,
      }),
      this.mailService.sendMail({
        to: dto.customer.email,
        subject: `Order Confirmation ${dto.orderId} — Oud Nomad Dubai`,
        html: customerHtml,
      }),
    ]);

    return { success: true, orderId: dto.orderId };
  }
}
