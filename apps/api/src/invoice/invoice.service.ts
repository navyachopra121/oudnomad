import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service.js';
import { StorageService } from '../storage/storage.service.js';
import PDFDocument from 'pdfkit';
import { Readable } from 'stream';

@Injectable()
export class InvoiceService {
  private readonly logger = new Logger(InvoiceService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly storage: StorageService,
  ) {}

  /**
   * Generate a GST/VAT invoice PDF for an order, upload to S3/R2, and
   * persist the invoice record.  Idempotent — returns existing invoice if
   * already generated.
   */
  async generateInvoice(orderId: string): Promise<{ invoiceNo: string; pdfUrl: string }> {
    // Check if already generated (idempotent)
    const existing = await this.prisma.invoice.findUnique({ where: { orderId } });
    if (existing) return { invoiceNo: existing.invoiceNo, pdfUrl: existing.pdfUrl };

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        user: { select: { email: true, firstName: true, lastName: true } },
      },
    });

    if (!order) throw new NotFoundException(`Order ${orderId} not found`);

    // Generate sequential invoice number
    const invoiceNo = await this.nextInvoiceNumber();

    // Generate PDF buffer
    const pdfBuffer = await this.buildPdf(order, invoiceNo);

    // Upload to S3/R2
    const fileName = `invoices/${order.orderNumber ?? orderId}/${invoiceNo}.pdf`;
    const pdfUrl = await this.storage.uploadBuffer(pdfBuffer, fileName, 'application/pdf');

    // Persist invoice record
    await this.prisma.invoice.create({
      data: {
        orderId,
        invoiceNo,
        pdfUrl,
      },
    });

    this.logger.log(`Invoice ${invoiceNo} generated for order ${orderId}`);
    return { invoiceNo, pdfUrl };
  }

  /**
   * Retrieve an existing invoice for an order.
   */
  async getInvoice(orderId: string): Promise<{ invoiceNo: string; pdfUrl: string }> {
    const invoice = await this.prisma.invoice.findUnique({ where: { orderId } });
    if (!invoice) {
      // Auto-generate if missing
      return this.generateInvoice(orderId);
    }
    return { invoiceNo: invoice.invoiceNo, pdfUrl: invoice.pdfUrl };
  }

  private async nextInvoiceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `OUD-INV-${year}-`;

    // Count existing invoices this year atomically
    const count = await this.prisma.invoice.count({
      where: { invoiceNo: { startsWith: prefix } },
    });

    const seq = String(count + 1).padStart(5, '0');
    return `${prefix}${seq}`;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async buildPdf(order: any, invoiceNo: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const companyName = this.config.get<string>('COMPANY_NAME') ?? 'OudNomad';
      const companyGstin = this.config.get<string>('COMPANY_GSTIN') ?? '';
      const companyVat = this.config.get<string>('COMPANY_VAT_NUMBER') ?? '';
      const companyAddress = [
        this.config.get<string>('COMPANY_ADDRESS_LINE1') ?? '',
        this.config.get<string>('COMPANY_ADDRESS_LINE2') ?? '',
        this.config.get<string>('COMPANY_CITY') ?? '',
        this.config.get<string>('COMPANY_STATE') ?? '',
        this.config.get<string>('COMPANY_PINCODE') ?? '',
      ]
        .filter(Boolean)
        .join(', ');

      const taxIdLabel = companyGstin ? `GSTIN: ${companyGstin}` : companyVat ? `VAT No: ${companyVat}` : '';

      const primaryColor = '#1a1a2e';
      const accentColor = '#b8860b'; // gold
      const lightGray = '#f5f5f5';
      const textGray = '#555555';

      // ─── HEADER ───────────────────────────────────────────────────────────
      doc
        .rect(0, 0, doc.page.width, 90)
        .fill(primaryColor);

      doc
        .fillColor('#ffffff')
        .fontSize(24)
        .font('Helvetica-Bold')
        .text(companyName, 50, 28);

      doc
        .fontSize(10)
        .font('Helvetica')
        .fillColor(accentColor)
        .text('LUXURY FRAGRANCES', 50, 58);

      // Invoice label (top-right)
      doc
        .fillColor('#ffffff')
        .fontSize(20)
        .font('Helvetica-Bold')
        .text('TAX INVOICE', 350, 28, { align: 'right', width: 200 });

      doc
        .fontSize(9)
        .font('Helvetica')
        .fillColor(accentColor)
        .text(invoiceNo, 350, 58, { align: 'right', width: 200 });

      // ─── META ROW ─────────────────────────────────────────────────────────
      let y = 110;

      // Company details (left)
      doc
        .fillColor(primaryColor)
        .fontSize(9)
        .font('Helvetica-Bold')
        .text('FROM', 50, y);

      doc
        .font('Helvetica')
        .fillColor(textGray)
        .fontSize(9)
        .text(companyAddress, 50, y + 14, { width: 240 });

      if (taxIdLabel) {
        doc.text(taxIdLabel, 50, doc.y + 4);
      }

      // Invoice details (right)
      doc
        .fillColor(primaryColor)
        .font('Helvetica-Bold')
        .fontSize(9)
        .text('INVOICE DETAILS', 350, y, { width: 200, align: 'right' });

      const issueDate = new Date().toLocaleDateString('en-AE', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });

      doc
        .font('Helvetica')
        .fillColor(textGray)
        .fontSize(9)
        .text(`Date: ${issueDate}`, 350, y + 14, { width: 200, align: 'right' })
        .text(`Order #: ${order.orderNumber ?? order.id}`, 350, doc.y + 2, { width: 200, align: 'right' })
        .text(`Status: ${order.status}`, 350, doc.y + 2, { width: 200, align: 'right' });

      // ─── BILLING ADDRESS ──────────────────────────────────────────────────
      y = Math.max(doc.y, 180) + 20;

      doc
        .rect(50, y, 240, 14)
        .fill(lightGray);

      doc
        .fillColor(primaryColor)
        .font('Helvetica-Bold')
        .fontSize(9)
        .text('BILL TO', 55, y + 3);

      const billingName =
        order.snapRecipientName ??
        `${order.user?.firstName ?? ''} ${order.user?.lastName ?? ''}`.trim();

      const billingAddr = [
        order.snapLine1,
        order.snapLine2,
        order.snapCity,
        order.snapState,
        order.snapPostalCode,
        order.snapCountryCode,
      ]
        .filter(Boolean)
        .join(', ');

      doc
        .font('Helvetica')
        .fillColor(textGray)
        .fontSize(9)
        .text(billingName, 55, y + 18)
        .text(billingAddr || 'Address on file', 55, doc.y + 2, { width: 230 })
        .text(order.user?.email ?? '', 55, doc.y + 2);

      // ─── LINE ITEMS TABLE ─────────────────────────────────────────────────
      y = doc.y + 24;

      // Table header
      doc.rect(50, y, 510, 18).fill(primaryColor);
      doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(9);
      doc.text('Item', 55, y + 5, { width: 180 });
      doc.text('Qty', 240, y + 5, { width: 50, align: 'center' });
      doc.text('Unit Price', 295, y + 5, { width: 80, align: 'right' });
      doc.text('Tax', 380, y + 5, { width: 60, align: 'right' });
      doc.text('Total', 445, y + 5, { width: 115, align: 'right' });

      y += 18;
      let subtotalSum = 0;
      let taxSum = 0;

      const taxRate = Number(order.taxAmount) / (Number(order.subtotal) || 1);

      for (const item of order.items) {
        const unitPrice = Number(item.unitPrice);
        const lineTotal = Number(item.lineTotal);
        const itemTax = lineTotal - lineTotal / (1 + taxRate);
        subtotalSum += lineTotal - itemTax;
        taxSum += itemTax;

        const rowColor = order.items.indexOf(item) % 2 === 0 ? '#ffffff' : lightGray;
        doc.rect(50, y, 510, 20).fill(rowColor);

        const productLabel = [item.productName, item.size, item.color]
          .filter(Boolean)
          .join(' — ');

        doc
          .fillColor(primaryColor)
          .font('Helvetica')
          .fontSize(8.5)
          .text(productLabel, 55, y + 6, { width: 180 })
          .text(String(item.quantity), 240, y + 6, { width: 50, align: 'center' })
          .text(`AED ${unitPrice.toFixed(2)}`, 295, y + 6, { width: 80, align: 'right' })
          .text(`AED ${itemTax.toFixed(2)}`, 380, y + 6, { width: 60, align: 'right' })
          .text(`AED ${lineTotal.toFixed(2)}`, 445, y + 6, { width: 115, align: 'right' });

        y += 20;
      }

      // ─── TOTALS ───────────────────────────────────────────────────────────
      y += 8;
      doc.moveTo(310, y).lineTo(560, y).stroke('#cccccc');
      y += 8;

      const totalRows: [string, string][] = [
        ['Subtotal', `AED ${Number(order.subtotal).toFixed(2)}`],
        ['VAT / Tax', `AED ${Number(order.taxAmount).toFixed(2)}`],
        ['Shipping', `AED ${Number(order.shippingCost).toFixed(2)}`],
      ];

      if (Number(order.discountAmount) > 0) {
        totalRows.push(['Discount', `-AED ${Number(order.discountAmount).toFixed(2)}`]);
      }

      for (const [label, value] of totalRows) {
        doc
          .fillColor(textGray)
          .font('Helvetica')
          .fontSize(9)
          .text(label, 310, y, { width: 140, align: 'right' })
          .text(value, 455, y, { width: 105, align: 'right' });
        y += 16;
      }

      // Grand Total
      doc.rect(310, y, 250, 22).fill(primaryColor);
      doc
        .fillColor('#ffffff')
        .font('Helvetica-Bold')
        .fontSize(11)
        .text('TOTAL', 315, y + 6, { width: 135, align: 'right' })
        .text(`AED ${Number(order.total).toFixed(2)}`, 455, y + 6, { width: 100, align: 'right' });

      // ─── FOOTER ───────────────────────────────────────────────────────────
      const footerY = doc.page.height - 80;
      doc
        .moveTo(50, footerY)
        .lineTo(560, footerY)
        .strokeColor(accentColor)
        .lineWidth(1)
        .stroke();

      doc
        .fillColor(textGray)
        .font('Helvetica')
        .fontSize(8)
        .text(
          'Thank you for your purchase. This is a computer-generated invoice and does not require a signature.',
          50,
          footerY + 8,
          { align: 'center', width: 510 },
        );

      if (taxIdLabel) {
        doc
          .fontSize(7.5)
          .text(taxIdLabel, 50, footerY + 22, { align: 'center', width: 510 });
      }

      doc.end();
    });
  }
}
