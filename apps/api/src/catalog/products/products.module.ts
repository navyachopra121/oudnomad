import { Module } from '@nestjs/common';
import { ProductsService } from './products.service.js';
import { ProductsController } from './products.controller.js';
import { ProductsAdminController } from './products.admin.controller.js';
import { PrismaModule } from '../../prisma/prisma.module.js';
import { ImagesModule } from '../images/images.module.js';

@Module({
  imports: [PrismaModule, ImagesModule],
  controllers: [ProductsController, ProductsAdminController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
