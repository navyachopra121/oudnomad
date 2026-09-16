import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service.js';
import { ImagesService } from '../images/images.service.js';
import { CreateProductDto, CreateVariantDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { UpdateVariantDto } from './dto/update-variant.dto.js';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { UserRole } from '@prisma/client';
import { getProductImageStorage, imageUploadLimits } from '../images/multer.config.js';

@Roles(UserRole.ADMIN)
@Controller('admin/products')
export class ProductsAdminController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly imagesService: ImagesService,
  ) {}

  /** Admin — POST /api/admin/products */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  /** Admin — GET /api/admin/products */
  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.productsService.findAllAdmin(
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
    );
  }

  /** Admin — GET /api/admin/products/:id */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findByIdAdmin(id);
  }

  /** Admin — PATCH /api/admin/products/:id */
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  /** Admin — DELETE /api/admin/products/:id */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.productsService.delete(id);
  }

  /** Admin — POST /api/admin/products/:id/variants */
  @Post(':id/variants')
  @HttpCode(HttpStatus.CREATED)
  addVariant(@Param('id') id: string, @Body() dto: CreateVariantDto) {
    return this.productsService.addVariant(id, dto);
  }

  /** Admin — PATCH /api/admin/products/:id/variants/:variantId */
  @Patch(':id/variants/:variantId')
  updateVariant(
    @Param('id') id: string,
    @Param('variantId') variantId: string,
    @Body() dto: UpdateVariantDto,
  ) {
    return this.productsService.updateVariant(id, variantId, dto);
  }

  /** Admin — DELETE /api/admin/products/:id/variants/:variantId */
  @Delete(':id/variants/:variantId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeVariant(
    @Param('id') id: string,
    @Param('variantId') variantId: string,
  ) {
    await this.productsService.deleteVariant(id, variantId);
  }

  /** Admin — POST /api/admin/products/:id/images */
  @Post(':id/images')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: getProductImageStorage(),
      limits: imageUploadLimits,
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  async uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('altText') altText?: string,
  ) {
    return this.imagesService.addProductImage(id, file, altText);
  }

  /** Admin — DELETE /api/admin/products/:id/images/:imageId */
  @Delete(':id/images/:imageId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteImage(
    @Param('id') id: string,
    @Param('imageId') imageId: string,
  ) {
    await this.imagesService.deleteProductImage(id, imageId);
  }
}
