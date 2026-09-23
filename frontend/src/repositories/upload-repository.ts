import { uploadsEndpoint } from '@/lib/api-config'
import { getToken } from '@/lib/auth-token'

class UploadRepository {
  async upload(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)
    const token = getToken()

    const response = await fetch(uploadsEndpoint, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: formData,
    })
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { message?: string } | null
      throw new Error(body?.message ?? 'Image upload failed')
    }
    const data = (await response.json()) as { url: string }
    return data.url
  }
}

export const uploadRepository = new UploadRepository()
