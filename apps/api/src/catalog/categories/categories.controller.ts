import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CategoriesService } from './categories.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { Public } from '../../auth/decorators/public.decorator.js';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { UserRole } from '@prisma/client';

@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  /** Public — GET /api/categories (returns complete hierarchical tree) */
  @Public()
  @Get('categories')
  getTree() {
    return this.categoriesService.getTree();
  }

  /** Admin — POST /api/admin/categories */
  @Roles(UserRole.ADMIN)
  @Post('admin/categories')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  /** Admin — PATCH /api/admin/categories/:id */
  @Roles(UserRole.ADMIN)
  @Patch('admin/categories/:id')
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.update(id, dto);
  }

  /** Admin — DELETE /api/admin/categories/:id */
  @Roles(UserRole.ADMIN)
  @Delete('admin/categories/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.categoriesService.delete(id);
  }

  /** Admin — GET /api/admin/collections */
  @Roles(UserRole.ADMIN)
  @Get('admin/collections')
  findCollections(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.categoriesService.findCollectionsAdmin(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
      search,
    );
  }

  /** Admin — POST /api/admin/collections */
  @Roles(UserRole.ADMIN)
  @Post('admin/collections')
  @HttpCode(HttpStatus.CREATED)
  createCollection(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  /** Admin — PATCH /api/admin/collections/:id */
  @Roles(UserRole.ADMIN)
  @Patch('admin/collections/:id')
  updateCollection(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.update(id, dto);
  }

  /** Admin — DELETE /api/admin/collections/:id */
  @Roles(UserRole.ADMIN)
  @Delete('admin/collections/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeCollection(@Param('id') id: string) {
    await this.categoriesService.delete(id);
  }
}

