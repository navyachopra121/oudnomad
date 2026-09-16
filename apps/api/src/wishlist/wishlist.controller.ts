import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { JwtPayload } from '../auth/decorators/current-user.decorator.js';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  /** Customer — GET /api/wishlist */
  @Get()
  async getWishlist(
    @CurrentUser() user: JwtPayload,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.wishlistService.getUserWishlist(
      user.sub,
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
    );
  }

  /** Customer — POST /api/wishlist/:productId */
  @Post(':productId')
  async addToWishlist(
    @CurrentUser() user: JwtPayload,
    @Param('productId') productId: string,
  ) {
    return this.wishlistService.addItem(user.sub, productId);
  }

  /** Customer — DELETE /api/wishlist/:productId */
  @Delete(':productId')
  async removeFromWishlist(
    @CurrentUser() user: JwtPayload,
    @Param('productId') productId: string,
  ) {
    return this.wishlistService.removeItem(user.sub, productId);
  }
}
