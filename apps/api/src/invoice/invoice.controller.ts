import { Controller, Get, Param, Res, UseGuards, Req } from '@nestjs/common';
import { InvoiceService } from './invoice.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import type { Request, Response } from 'express';

interface AuthenticatedRequest extends Request {
  user?: { sub: string; role: string };
}

/**
 * GET /orders/:orderId/invoice
 *   - Customers can download their own order invoice
 *   - Admins can download any invoice
 *
 * GET /admin/orders/:orderId/invoice
 *   - Admin-only route (convenience alias)
 */
@Controller()
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  /**
   * Customer invoice download.
   * Returns a redirect to the PDF URL (or inline JSON with URL).
   */
  @UseGuards(JwtAuthGuard)
  @Get('orders/:orderId/invoice')
  async getCustomerInvoice(
    @Param('orderId') orderId: string,
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
  ) {
    const invoice = await this.invoiceService.getInvoice(orderId);
    // Redirect to PDF URL for direct browser download
    return res.redirect(invoice.pdfUrl);
  }

  /**
   * Admin invoice — also generates if not yet generated.
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('admin/orders/:orderId/invoice')
  async getAdminInvoice(@Param('orderId') orderId: string) {
    return this.invoiceService.getInvoice(orderId);
  }

  /**
   * Admin: manually trigger invoice generation (e.g. for historical orders).
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('admin/orders/:orderId/invoice/generate')
  async generateInvoice(@Param('orderId') orderId: string) {
    return this.invoiceService.generateInvoice(orderId);
  }
}
