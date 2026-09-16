import { Module } from '@nestjs/common';
import { CategoriesModule } from './categories/categories.module.js';
import { ProductsModule } from './products/products.module.js';
import { ImagesModule } from './images/images.module.js';

@Module({
  imports: [CategoriesModule, ProductsModule, ImagesModule],
  exports: [CategoriesModule, ProductsModule, ImagesModule],
})
export class CatalogModule {}
