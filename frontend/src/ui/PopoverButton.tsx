import { type ReactNode, useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import { useDropdownPanel } from './use-dropdown-panel'

interface Props {
  icon: ReactNode
  label: string
  align?: 'left' | 'right'
  children: ReactNode | ((close: () => void) => ReactNode)
}

export function PopoverButton({ icon, label, align = 'left', children }: Props) {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const { triggerRef, panelRef, position } = useDropdownPanel(open, align, close)

  return (
    <div className="inline-block" onClick={(event) => event.stopPropagation()}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((current) => !current)}
        title={label}
        aria-label={label}
        className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full border border-line text-dim hover:bg-hover hover:text-ink"
      >
        {icon}
      </button>
      {open &&
        position &&
        createPortal(
          <div
            ref={panelRef}
            style={{ position: 'fixed', left: position.left, width: position.width, top: position.top, bottom: position.bottom }}
            className="z-50 flex flex-col gap-2 rounded-lg border border-line bg-raised p-3 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            {typeof children === 'function' ? children(close) : children}
          </div>,
          document.body,
        )}
    </div>
  )
}
