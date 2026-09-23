import { join } from 'node:path';

export const UPLOADS_DIR = join(process.cwd(), 'uploads');
export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/gif', 'image/webp']);
