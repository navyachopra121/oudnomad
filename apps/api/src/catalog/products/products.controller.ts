import { Controller, Get, Query, Param } from '@nestjs/common';
import { ProductsService } from './products.service.js';
import { ProductQueryDto } from './dto/product-query.dto.js';
import { Public } from '../../auth/decorators/public.decorator.js';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /** Public — GET /api/products */
  @Public()
  @Get()
  findAll(@Query() query: ProductQueryDto) {
    return this.productsService.findAllPublic(query);
  }

  /** Public — GET /api/products/search?q=... */
  @Public()
  @Get('search')
  search(
    @Query('q') q: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.productsService.searchFullText(q, limit ? Number(limit) : 20, offset ? Number(offset) : 0);
  }

  /** Public — GET /api/products/:slug */
  @Public()
  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlugPublic(slug);
  }
}
