import { useEffect, useLayoutEffect, useRef, useState } from 'react'

export interface DropdownPosition {
  left: number
  width: number
  top?: number
  bottom?: number
}

const PANEL_WIDTH = 224
const ESTIMATED_PANEL_HEIGHT = 320
const VIEWPORT_MARGIN = 8

/**
 * Positions a dropdown panel with `position: fixed` (via a portal) instead of
 * `position: absolute` inside the trigger, so it never gets clipped by an
 * ancestor's `overflow: auto` (e.g. a scrollable modal body or list).
 */
export function useDropdownPanel(open: boolean, align: 'left' | 'right', onClose: () => void) {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<DropdownPosition | null>(null)

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) {
      setPosition(null)
      return
    }
    const rect = triggerRef.current.getBoundingClientRect()
    const left =
      align === 'right'
        ? Math.max(VIEWPORT_MARGIN, rect.right - PANEL_WIDTH)
        : Math.min(rect.left, window.innerWidth - PANEL_WIDTH - VIEWPORT_MARGIN)
    const spaceBelow = window.innerHeight - rect.bottom
    if (spaceBelow < ESTIMATED_PANEL_HEIGHT && rect.top > spaceBelow) {
      setPosition({ left, width: PANEL_WIDTH, bottom: window.innerHeight - rect.top + 4 })
    } else {
      setPosition({ left, width: PANEL_WIDTH, top: rect.bottom + 4 })
    }
  }, [open, align])

  useEffect(() => {
    if (!open) {
      return
    }
    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node
      if (!triggerRef.current?.contains(target) && !panelRef.current?.contains(target)) {
        onClose()
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
      }
    }
    function onViewportChange() {
      onClose()
    }
    // Capture phase: some ancestors (e.g. Modal) call stopPropagation() on mousedown
    // during the bubble phase, which would otherwise stop this from ever reaching
    // document and keep the dropdown open forever.
    document.addEventListener('mousedown', onPointerDown, true)
    document.addEventListener('keydown', onKeyDown, true)
    window.addEventListener('scroll', onViewportChange, true)
    window.addEventListener('resize', onViewportChange)
    return () => {
      document.removeEventListener('mousedown', onPointerDown, true)
      document.removeEventListener('keydown', onKeyDown, true)
      window.removeEventListener('scroll', onViewportChange, true)
      window.removeEventListener('resize', onViewportChange)
    }
  }, [open, onClose])

  return { triggerRef, panelRef, position }
}
