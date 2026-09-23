import { X } from 'lucide-react'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'

interface Props {
  src: string
  onClose: () => void
}

export function ImageLightbox({ src, onClose }: Props) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-8" onMouseDown={onClose}>
      <button
        type="button"
        className="btn btn-ghost absolute top-4 right-4 size-8 p-0 text-white hover:bg-white/10 hover:text-white"
        onClick={onClose}
        aria-label="Close"
      >
        <X size={18} />
      </button>
      <img
        src={src}
        alt=""
        className="max-h-full max-w-full rounded-md object-contain"
        onMouseDown={(event) => event.stopPropagation()}
      />
    </div>,
    document.body,
  )
}
