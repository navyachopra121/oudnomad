import { Module } from '@nestjs/common';
import { ImagesService } from './images.service.js';
import { PrismaModule } from '../../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  providers: [ImagesService],
  exports: [ImagesService],
})
export class ImagesModule {}
