import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ConfigService } from '@nestjs/config';
import { StorageService } from './storage.service.js';
import * as fs from 'fs/promises';
import { existsSync } from 'fs';
import * as path from 'path';

describe('StorageService', () => {
  let service: StorageService;
  const testUploadDir = path.join(process.cwd(), 'test-uploads-scratch');

  beforeEach(() => {
    const mockConfig = {
      get: (key: string) => {
        if (key === 'UPLOAD_DIR') return testUploadDir;
        if (key === 'PORT') return '3001';
        return null;
      },
    } as unknown as ConfigService;

    service = new StorageService(mockConfig);
  });

  afterEach(async () => {
    if (existsSync(testUploadDir)) {
      await fs.rm(testUploadDir, { recursive: true, force: true });
    }
  });

  it('should save a file buffer to disk and return proper metadata & URL', async () => {
    const buffer = Buffer.from('test image content');
    const result = await service.saveFile(buffer, 'product.png', 'image/png', {
      subfolder: 'products',
    });

    expect(result.originalName).toBe('product.png');
    expect(result.mimeType).toBe('image/png');
    expect(result.size).toBe(buffer.length);
    expect(result.relativePath).toContain('products/');
    expect(result.url).toContain('/uploads/products/');

    const fullSavedPath = path.join(testUploadDir, result.relativePath);
    expect(existsSync(fullSavedPath)).toBe(true);
  });

  it('should reject files exceeding maxSizeBytes limit', async () => {
    const buffer = Buffer.from('large content');
    await expect(
      service.saveFile(buffer, 'large.png', 'image/png', { maxSizeBytes: 5 }),
    ).rejects.toThrow(/exceeds maximum limit/);
  });

  it('should reject files with unallowed MIME types', async () => {
    const buffer = Buffer.from('executable script');
    await expect(
      service.saveFile(buffer, 'malicious.exe', 'application/x-msdownload', {
        allowedMimeTypes: ['image/jpeg', 'image/png'],
      }),
    ).rejects.toThrow(/Invalid file format/);
  });

  it('should delete a saved file by relative path or URL', async () => {
    const buffer = Buffer.from('content to delete');
    const result = await service.saveFile(buffer, 'temp.jpg', 'image/jpeg');

    const deleted = await service.deleteFile(result.relativePath);
    expect(deleted).toBe(true);

    const fullSavedPath = path.join(testUploadDir, result.relativePath);
    expect(existsSync(fullSavedPath)).toBe(false);
  });
});
