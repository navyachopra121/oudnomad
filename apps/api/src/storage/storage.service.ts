import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

export interface UploadOptions {
  subfolder?: string;
  allowedMimeTypes?: string[];
  maxSizeBytes?: number;
}

export interface UploadResult {
  filename: string;
  originalName: string;
  relativePath: string;
  url: string;
  mimeType: string;
  size: number;
}

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly uploadRootDir: string;
  private readonly baseUrl: string;

  constructor(private readonly config: ConfigService) {
    const customUploadDir = this.config.get<string>('UPLOAD_DIR');
    this.uploadRootDir = customUploadDir
      ? path.resolve(customUploadDir)
      : path.join(process.cwd(), 'uploads');

    const port = this.config.get<string>('PORT') ?? '3001';
    const host = this.config.get<string>('APP_URL') ?? `http://localhost:${port}`;
    this.baseUrl = `${host}/uploads`;

    // Ensure upload root directory exists on startup
    if (!existsSync(this.uploadRootDir)) {
      mkdirSync(this.uploadRootDir, { recursive: true });
      this.logger.log(`Created uploads directory at ${this.uploadRootDir}`);
    }
  }

  /**
   * Saves a file buffer or Express.Multer.File to local disk storage.
   */
  async saveFile(
    fileBuffer: Buffer,
    originalFilename: string,
    mimeType: string,
    options: UploadOptions = {},
  ): Promise<UploadResult> {
    const {
      subfolder = 'general',
      allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'],
      maxSizeBytes = 10 * 1024 * 1024, // 10MB default
    } = options;

    if (fileBuffer.length > maxSizeBytes) {
      throw new BadRequestException(
        `File size (${(fileBuffer.length / (1024 * 1024)).toFixed(2)}MB) exceeds maximum limit of ${(maxSizeBytes / (1024 * 1024)).toFixed(2)}MB`,
      );
    }

    if (allowedMimeTypes.length > 0 && !allowedMimeTypes.includes(mimeType)) {
      throw new BadRequestException(
        `Invalid file format: ${mimeType}. Allowed formats: ${allowedMimeTypes.join(', ')}`,
      );
    }

    // Target folder directory
    const targetDir = path.join(this.uploadRootDir, subfolder);
    if (!existsSync(targetDir)) {
      await fs.mkdir(targetDir, { recursive: true });
    }

    // Generate safe, collision-free filename
    const ext = path.extname(originalFilename).toLowerCase() || this.getExtensionFromMime(mimeType);
    const uniqueFilename = `${randomUUID()}${ext}`;
    const targetFilePath = path.join(targetDir, uniqueFilename);

    // Save file asynchronously
    await fs.writeFile(targetFilePath, fileBuffer);

    const relativePath = `${subfolder}/${uniqueFilename}`;
    const url = `${this.baseUrl}/${relativePath}`;

    this.logger.log(`Saved file: ${relativePath} (${fileBuffer.length} bytes)`);

    return {
      filename: uniqueFilename,
      originalName: originalFilename,
      relativePath,
      url,
      mimeType,
      size: fileBuffer.length,
    };
  }

  /**
   * Deletes a file from local storage using its relative path or URL.
   */
  async deleteFile(relativePathOrUrl: string): Promise<boolean> {
    let cleanPath = relativePathOrUrl;
    if (cleanPath.startsWith(this.baseUrl)) {
      cleanPath = cleanPath.replace(`${this.baseUrl}/`, '');
    } else if (cleanPath.startsWith('/uploads/')) {
      cleanPath = cleanPath.replace('/uploads/', '');
    }

    const fullPath = path.join(this.uploadRootDir, cleanPath);

    // Prevent directory traversal attacks
    if (!fullPath.startsWith(this.uploadRootDir)) {
      throw new BadRequestException('Invalid file path');
    }

    if (!existsSync(fullPath)) {
      this.logger.warn(`Attempted to delete non-existent file: ${fullPath}`);
      return false;
    }

    await fs.unlink(fullPath);
    this.logger.log(`Deleted file: ${cleanPath}`);
    return true;
  }

  /**
   * Helper to derive file extension from common MIME types if missing from filename
   */
  private getExtensionFromMime(mimeType: string): string {
    const map: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
      'image/gif': '.gif',
      'application/pdf': '.pdf',
    };
    return map[mimeType] ?? '.bin';
  }
}
