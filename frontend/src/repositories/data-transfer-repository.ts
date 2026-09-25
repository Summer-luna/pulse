import { graphqlEndpoint } from '@/lib/api-config'
import { getToken } from '@/lib/auth-token'

const exportEndpoint = graphqlEndpoint.replace(/\/graphql\/?$/, '/admin/data/export')
const importEndpoint = graphqlEndpoint.replace(/\/graphql\/?$/, '/admin/data/import')

function authHeaders(): HeadersInit | undefined {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : undefined
}

async function errorMessage(response: Response, fallback: string): Promise<string> {
  const body = (await response.json().catch(() => null)) as { message?: string } | null
  return body?.message ?? fallback
}

class DataTransferRepository {
  async exportArchive(): Promise<Blob> {
    const response = await fetch(exportEndpoint, { headers: authHeaders() })
    if (!response.ok) {
      throw new Error(await errorMessage(response, 'Export failed'))
    }
    return response.blob()
  }

  async importArchive(file: File): Promise<void> {
    const formData = new FormData()
    formData.append('file', file)
    const response = await fetch(importEndpoint, { method: 'POST', headers: authHeaders(), body: formData })
    if (!response.ok) {
      throw new Error(await errorMessage(response, 'Import failed'))
    }
  }
}

export const dataTransferRepository = new DataTransferRepository()
