import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { CartService, CartIdentity } from './cart.service.js';
import { AddCartItemDto } from './dto/add-item.dto.js';
import { UpdateCartItemDto } from './dto/update-item.dto.js';
import { OptionalJwtAuthGuard } from './guards/optional-auth.guard.js';
import { Public } from '../auth/decorators/public.decorator.js';

@Public()
@UseGuards(OptionalJwtAuthGuard)
@Controller('cart')
export class CartController {
  private readonly guestTtlDays: number;

  constructor(
    private readonly cartService: CartService,
    private readonly config: ConfigService,
  ) {
    this.guestTtlDays = Number(this.config.get<string>('GUEST_CART_TTL_DAYS') ?? 30);
  }

  private resolveIdentity(req: Request, res: Response): CartIdentity {
    const user = (req as any).user as { sub: string } | undefined;
    if (user && user.sub) {
      return { userId: user.sub };
    }

    let sessionId = req.cookies?.guest_session_id as string | undefined;

    if (!sessionId) {
      sessionId = randomUUID();
      const isProduction = this.config.get<string>('NODE_ENV') === 'production';
      res.cookie('guest_session_id', sessionId, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        maxAge: this.guestTtlDays * 24 * 60 * 60 * 1000,
        path: '/',
      });
    }

    return { sessionId };
  }

  /** GET /api/cart */
  @Get()
  getCart(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const identity = this.resolveIdentity(req, res);
    return this.cartService.getCart(identity);
  }

  /** POST /api/cart/items */
  @Post('items')
  @HttpCode(HttpStatus.OK)
  addItem(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() dto: AddCartItemDto,
  ) {
    const identity = this.resolveIdentity(req, res);
    return this.cartService.addItem(identity, dto.variantId, dto.quantity);
  }

  /** PATCH /api/cart/items/:variantId */
  @Patch('items/:variantId')
  @HttpCode(HttpStatus.OK)
  updateItem(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param('variantId') variantId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    const identity = this.resolveIdentity(req, res);
    return this.cartService.updateItem(identity, variantId, dto.quantity);
  }

  /** DELETE /api/cart/items/:variantId */
  @Delete('items/:variantId')
  @HttpCode(HttpStatus.OK)
  removeItem(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param('variantId') variantId: string,
  ) {
    const identity = this.resolveIdentity(req, res);
    return this.cartService.removeItem(identity, variantId);
  }

  /** DELETE /api/cart */
  @Delete()
  @HttpCode(HttpStatus.OK)
  clearCart(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const identity = this.resolveIdentity(req, res);
    return this.cartService.clearCart(identity);
  }
}
