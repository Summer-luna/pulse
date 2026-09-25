import { useState } from 'react'
import { dataTransferRepository } from '@/repositories/data-transfer-repository'

function triggerDownload(blob: Blob): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `pulse-backup-${new Date().toISOString().slice(0, 10)}.zip`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export function useDataTransferController() {
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function exportData() {
    setError(null)
    setIsExporting(true)
    try {
      const blob = await dataTransferRepository.exportArchive()
      triggerDownload(blob)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed')
    } finally {
      setIsExporting(false)
    }
  }

  async function importData(file: File) {
    setError(null)
    setIsImporting(true)
    try {
      await dataTransferRepository.importArchive(file)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed')
      throw err
    } finally {
      setIsImporting(false)
    }
  }

  return { isExporting, isImporting, error, exportData, importData }
}
