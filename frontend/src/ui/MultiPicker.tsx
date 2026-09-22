import { Check } from 'lucide-react'
import { type ReactNode, useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import { useDropdownPanel } from './use-dropdown-panel'

export interface MultiPickerOption<T extends string> {
  value: T
  label: string
  icon?: ReactNode
}

interface Props<T extends string> {
  values: T[]
  options: MultiPickerOption<T>[]
  onChange: (values: T[]) => void
  placeholder: string
  triggerIcon?: ReactNode
  /** Shown as "N <unit>" when more than one option is selected */
  unit?: string
  searchable?: boolean
  searchPlaceholder?: string
  align?: 'left' | 'right'
  className?: string
}

export function MultiPicker<T extends string>({
  values,
  options,
  onChange,
  placeholder,
  triggerIcon,
  unit = 'members',
  searchable = false,
  searchPlaceholder = 'Search…',
  align = 'left',
  className = '',
}: Props<T>) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const close = useCallback(() => setOpen(false), [])
  const { triggerRef, panelRef, position } = useDropdownPanel(open, align, close)
  const selected = options.filter((option) => values.includes(option.value))

  function toggle(value: T) {
    onChange(values.includes(value) ? values.filter((current) => current !== value) : [...values, value])
  }

  const needle = query.trim().toLowerCase()
  const visible = needle ? options.filter((option) => option.label.toLowerCase().includes(needle)) : options

  return (
    <div className={`inline-block ${className}`} onClick={(event) => event.stopPropagation()}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((current) => !current)}
        title={selected.map((option) => option.label).join(', ') || placeholder}
        className="chip h-7 max-w-full cursor-pointer text-[13px] text-ink hover:bg-hover"
      >
        {selected.length === 0 ? (
          <>
            {triggerIcon}
            <span className="truncate">{placeholder}</span>
          </>
        ) : (
          <>
            <span className="isolate flex -space-x-1.5">
              {selected.slice(0, 4).map((option) => (
                <span key={option.value} className="ring-2 ring-panel rounded-full">
                  {option.icon}
                </span>
              ))}
            </span>
            {selected.length === 1 && <span className="truncate">{selected[0].label}</span>}
            {selected.length > 1 && (
              <span>
                {selected.length} {unit}
              </span>
            )}
          </>
        )}
      </button>
      {open &&
        position &&
        createPortal(
          <div
            ref={panelRef}
            style={{ position: 'fixed', left: position.left, width: position.width, top: position.top, bottom: position.bottom }}
            className="z-50 rounded-lg border border-line bg-raised py-1 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            {searchable && (
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={searchPlaceholder}
                className="mx-1 mb-1 h-7 w-[calc(100%-0.5rem)] rounded border border-line bg-canvas px-2 text-xs outline-none focus:border-accent"
              />
            )}
            <ul className="max-h-64 overflow-y-auto">
              {visible.map((option) => {
                const checked = values.includes(option.value)
                return (
                  <li key={option.value}>
                    <button
                      type="button"
                      onClick={() => toggle(option.value)}
                      className="flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-left text-[13px] hover:bg-hover"
                    >
                      <span
                        className={`flex size-4 shrink-0 items-center justify-center rounded border ${
                          checked ? 'border-accent bg-accent' : 'border-line'
                        }`}
                      >
                        {checked && <Check size={11} strokeWidth={3} className="text-white" />}
                      </span>
                      {option.icon}
                      <span className="flex-1 truncate">{option.label}</span>
                    </button>
                  </li>
                )
              })}
              {visible.length === 0 && <li className="px-3 py-2 text-xs text-faint">No results</li>}
            </ul>
          </div>,
          document.body,
        )}
    </div>
  )
}
