import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { fileTypeFromFile } from 'file-type';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from '../../prisma/prisma.service.js';

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

@Injectable()
export class ImagesService {
  private readonly logger = new Logger(ImagesService.name);
  private readonly uploadDir: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    const rootUpload = this.config.get<string>('UPLOAD_DIR') ?? './uploads';
    this.uploadDir = path.resolve(rootUpload);
    this.ensureDirectoryExists(path.join(this.uploadDir, 'products'));
  }

  private ensureDirectoryExists(dir: string): void {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  /**
   * Magic-byte signature validation of uploaded image file.
   * If invalid, deletes file immediately from disk and throws BadRequestException.
   */
  async validateUploadedImage(filePath: string): Promise<void> {
    const detected = await fileTypeFromFile(filePath);
    if (!detected || !ALLOWED_MIME_TYPES.has(detected.mime)) {
      await fs.promises.unlink(filePath).catch(() => {});
      throw new BadRequestException(
        `Invalid image file type. Allowed formats: JPEG, PNG, WebP. Detected: ${detected?.mime ?? 'unknown'}`,
      );
    }
  }

  /**
   * Save uploaded image record for product.
   */
  async addProductImage(
    productId: string,
    file: Express.Multer.File,
    altText?: string,
  ) {
    const relativePath = `products/${file.filename}`;
    const fullPath = path.join(this.uploadDir, relativePath);

    // Validate magic byte signature
    await this.validateUploadedImage(fullPath);

    // Get current max sort order
    const maxSort = await this.prisma.productImage.aggregate({
      where: { productId },
      _max: { sortOrder: true },
    });
    const sortOrder = (maxSort._max.sortOrder ?? -1) + 1;

    return this.prisma.productImage.create({
      data: {
        productId,
        path: relativePath,
        relativePath,
        url: `/uploads/${relativePath}`,
        altText,
        sortOrder,
      },
    });
  }

  /**
   * Delete product image record AND unlink file from disk.
   */
  async deleteProductImage(productId: string, imageId: string): Promise<void> {
    const image = await this.prisma.productImage.findFirst({
      where: { id: imageId, productId },
    });

    if (!image) {
      throw new BadRequestException('Product image not found');
    }

    // Unlink file from disk
    const diskPath = path.join(this.uploadDir, image.path || image.relativePath || '');
    if (fs.existsSync(diskPath)) {
      await fs.promises.unlink(diskPath).catch((err) => {
        this.logger.warn(`Failed to unlink image file: ${diskPath}`, err);
      });
    }

    // Delete DB record
    await this.prisma.productImage.delete({
      where: { id: imageId },
    });
  }
}
