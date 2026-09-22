import { X } from 'lucide-react'
import { type ReactNode, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface Props {
  title: string
  onClose: () => void
  children: ReactNode
  maxWidthClassName?: string
  minHeightClassName?: string
}

export function Modal({ title, onClose, children, maxWidthClassName = 'max-w-xl', minHeightClassName = '' }: Props) {
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
    <div className="fixed inset-0 z-40 flex items-start justify-center bg-black/60 px-4 pt-[12vh]" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-label={title}
        className={`flex max-h-[86vh] w-full ${maxWidthClassName} ${minHeightClassName} flex-col rounded-xl border border-line bg-panel shadow-2xl`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-line px-4 py-2.5">
          <h2 className="text-sm font-medium">{title}</h2>
          <button className="btn btn-ghost size-7 p-0" onClick={onClose} aria-label="Close">
            <X size={15} />
          </button>
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
