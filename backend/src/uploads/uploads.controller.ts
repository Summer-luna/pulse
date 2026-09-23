import { randomUUID } from 'node:crypto';
import { extname } from 'node:path';
import { BadRequestException, Controller, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';
import { diskStorage } from 'multer';
import { ALLOWED_IMAGE_TYPES, MAX_UPLOAD_BYTES, UPLOADS_DIR } from './uploads.constants.js';
import type { UploadResponse } from './upload.model.js';

const EXTENSION_BY_MIME: Record<string, string> = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/gif': '.gif',
  'image/webp': '.webp',
};

@Controller('uploads')
export class UploadsController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: UPLOADS_DIR,
        filename: (_req, file, callback) => {
          const extension = EXTENSION_BY_MIME[file.mimetype] ?? extname(file.originalname) ?? '';
          callback(null, `${randomUUID()}${extension}`);
        },
      }),
      limits: { fileSize: MAX_UPLOAD_BYTES },
      fileFilter: (_req, file, callback) => {
        callback(null, ALLOWED_IMAGE_TYPES.has(file.mimetype));
      },
    }),
  )
  upload(@UploadedFile() file: Express.Multer.File | undefined, @Req() req: Request): UploadResponse {
    if (!file) {
      throw new BadRequestException('Upload a PNG, JPEG, GIF or WebP image up to 8MB');
    }
    const origin = `${req.protocol}://${req.get('host')}`;
    return { url: `${origin}/uploads/${file.filename}` };
  }
}
