import { uploadRepository } from '@/repositories/upload-repository'

const ALLOWED_TYPES = new Set(['image/png', 'image/jpeg', 'image/gif', 'image/webp'])
const MAX_BYTES = 8 * 1024 * 1024

class ImageUploadService {
  isImageFile(file: File): boolean {
    return ALLOWED_TYPES.has(file.type)
  }

  async upload(file: File): Promise<string> {
    if (!this.isImageFile(file)) {
      throw new Error('Only PNG, JPEG, GIF or WebP images are supported')
    }
    if (file.size > MAX_BYTES) {
      throw new Error('Images must be 8MB or smaller')
    }
    return uploadRepository.upload(file)
  }
}

export const imageUploadService = new ImageUploadService()
