import { Download, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import { PageHeader } from '@/components/PageHeader'
import { useDataTransferController } from '@/controllers/use-data-transfer-controller'

export function DataSettingsPage() {
  const { isExporting, isImporting, error, exportData, importData } = useDataTransferController()
  const [imported, setImported] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function onPickFile() {
    fileInputRef.current?.click()
  }

  async function onFileSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (
      !window.confirm(
        'Importing will permanently replace all current data (database and uploaded files) with the contents of this backup. This cannot be undone. Continue?',
      )
    ) {
      return
    }
    try {
      await importData(file)
      setImported(true)
      window.setTimeout(() => window.location.reload(), 1500)
    } catch {
      // 错误已通过 controller.error 展示
    }
  }

  return (
    <div className="flex h-full flex-col">
      <PageHeader>
        <h1 className="font-medium">Data</h1>
      </PageHeader>
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <div className="max-w-xl space-y-6">
          <section className="rounded-md border border-line p-4">
            <h2 className="font-medium">Export</h2>
            <p className="mt-1 text-sm text-dim">
              Download a single .zip file with the full database and all uploaded images. Use it as a backup or to migrate to another
              server.
            </p>
            <button type="button" className="btn btn-primary mt-3" onClick={exportData} disabled={isExporting}>
              <Download size={14} /> {isExporting ? 'Exporting…' : 'Export data'}
            </button>
          </section>

          <section className="rounded-md border border-line p-4">
            <h2 className="font-medium">Import</h2>
            <p className="mt-1 text-sm text-dim">
              Restore from a .zip exported above. <span className="text-danger">This permanently replaces all current data</span> —
              database and uploaded files alike.
            </p>
            <input ref={fileInputRef} type="file" accept=".zip,application/zip" className="hidden" onChange={onFileSelected} />
            <button type="button" className="btn mt-3" onClick={onPickFile} disabled={isImporting}>
              <Upload size={14} /> {isImporting ? 'Importing…' : 'Import data…'}
            </button>
            {imported && <p className="mt-2 text-sm text-accent-strong">Import complete. Reloading…</p>}
          </section>

          {error && <p className="text-danger">{error}</p>}
        </div>
      </div>
    </div>
  )
}
