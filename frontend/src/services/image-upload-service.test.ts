import { beforeEach, describe, expect, it, vi } from 'vitest'

const { upload } = vi.hoisted(() => ({ upload: vi.fn() }))
vi.mock('@/repositories/upload-repository', () => ({ uploadRepository: { upload } }))

const { imageUploadService } = await import('./image-upload-service')

function file(type: string, size: number): File {
  return { type, size, name: 'test' } as File
}

describe('imageUploadService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('rejects unsupported file types without calling the repository', async () => {
    await expect(imageUploadService.upload(file('image/svg+xml', 100))).rejects.toThrow('supported')
    expect(upload).not.toHaveBeenCalled()
  })

  it('rejects files over 8MB without calling the repository', async () => {
    await expect(imageUploadService.upload(file('image/png', 9 * 1024 * 1024))).rejects.toThrow('8MB')
    expect(upload).not.toHaveBeenCalled()
  })

  it('uploads a valid image and returns its url', async () => {
    upload.mockResolvedValue('http://localhost:4000/uploads/abc.png')
    await expect(imageUploadService.upload(file('image/png', 1024))).resolves.toBe('http://localhost:4000/uploads/abc.png')
  })
})
