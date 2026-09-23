import { NodeViewWrapper, type ReactNodeViewProps } from '@tiptap/react'
import { Copy, Download, Link as LinkIcon, Maximize2, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { ImageLightbox } from './ImageLightbox'

async function fetchBlob(src: string): Promise<Blob> {
  const response = await fetch(src)
  if (!response.ok) {
    throw new Error('Could not load the image')
  }
  return response.blob()
}

export function ImageNodeView({ node, deleteNode }: ReactNodeViewProps) {
  const src = node.attrs.src as string
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  function flash(message: string) {
    setFeedback(message)
    setTimeout(() => setFeedback(null), 1500)
  }

  async function onDownload() {
    try {
      const blob = await fetchBlob(src)
      const objectUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = objectUrl
      link.download = src.split('/').pop() ?? 'image'
      link.click()
      URL.revokeObjectURL(objectUrl)
    } catch {
      flash('Download failed')
    }
  }

  async function onCopyImage() {
    try {
      const blob = await fetchBlob(src)
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })])
      flash('Image copied')
    } catch {
      flash('Copy failed')
    }
  }

  async function onCopyLink() {
    try {
      await navigator.clipboard.writeText(src)
      flash('Link copied')
    } catch {
      flash('Copy failed')
    }
  }

  return (
    <NodeViewWrapper className="group relative my-1 inline-block max-w-full align-top">
      <img src={src} alt={(node.attrs.alt as string | null) ?? ''} className="block max-w-full rounded-md border border-line" />
      <div
        className="absolute top-1.5 right-1.5 flex items-center gap-0.5 rounded-md border border-line bg-raised p-0.5 opacity-0 shadow-lg transition-opacity group-hover:opacity-100"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button type="button" onClick={() => setLightboxOpen(true)} className="rounded p-1 text-dim hover:bg-hover hover:text-ink" title="Expand">
          <Maximize2 size={13} />
        </button>
        <button type="button" onClick={() => void onDownload()} className="rounded p-1 text-dim hover:bg-hover hover:text-ink" title="Download">
          <Download size={13} />
        </button>
        <button type="button" onClick={() => void onCopyImage()} className="rounded p-1 text-dim hover:bg-hover hover:text-ink" title="Copy image">
          <Copy size={13} />
        </button>
        <button type="button" onClick={() => void onCopyLink()} className="rounded p-1 text-dim hover:bg-hover hover:text-ink" title="Copy link">
          <LinkIcon size={13} />
        </button>
        <button type="button" onClick={() => deleteNode()} className="rounded p-1 text-danger hover:bg-danger/10" title="Delete">
          <Trash2 size={13} />
        </button>
      </div>
      {feedback && <span className="absolute top-1.5 left-1.5 rounded bg-raised px-1.5 py-0.5 text-xs text-dim shadow">{feedback}</span>}
      {lightboxOpen && <ImageLightbox src={src} onClose={() => setLightboxOpen(false)} />}
    </NodeViewWrapper>
  )
}
