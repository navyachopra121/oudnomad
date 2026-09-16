import { diskStorage } from 'multer';
import { extname, join, resolve } from 'path';
import { randomUUID } from 'crypto';
import * as fs from 'fs';

export const getProductImageStorage = () => {
  const rootUpload = process.env.UPLOAD_DIR ?? './uploads';
  const destDir = resolve(join(rootUpload, 'products'));

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  return diskStorage({
    destination: destDir,
    filename: (_req, file, cb) => {
      const ext = extname(file.originalname).toLowerCase();
      cb(null, `${randomUUID()}${ext}`);
    },
  });
};

export const imageUploadLimits = {
  fileSize: 5 * 1024 * 1024, // 5MB limit
};
