import { Check } from 'lucide-react'
import { type ReactNode, useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import { useDropdownPanel } from './use-dropdown-panel'

export interface PickerOption<T extends string> {
  value: T
  label: string
  icon?: ReactNode
  hint?: string
}

interface Props<T extends string> {
  value: T | null
  options: PickerOption<T>[]
  onChange: (value: T | null) => void
  placeholder: string
  noneLabel?: string
  noneIcon?: ReactNode
  searchable?: boolean
  iconOnly?: boolean
  align?: 'left' | 'right'
  disabled?: boolean
  className?: string
}

export function Picker<T extends string>({
  value,
  options,
  onChange,
  placeholder,
  noneLabel,
  noneIcon,
  searchable = false,
  iconOnly = false,
  align = 'left',
  disabled = false,
  className = '',
}: Props<T>) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const close = useCallback(() => setOpen(false), [])
  const { triggerRef, panelRef, position } = useDropdownPanel(open, align, close)
  const selected = options.find((option) => option.value === value)

  function choose(next: T | null) {
    setOpen(false)
    setQuery('')
    if (next !== value) {
      onChange(next)
    }
  }

  const needle = query.trim().toLowerCase()
  const visible = needle ? options.filter((option) => option.label.toLowerCase().includes(needle)) : options
  const triggerIcon = selected?.icon ?? (value === null ? noneIcon : undefined)

  return (
    <div className={`inline-block ${className}`} onClick={(event) => event.stopPropagation()}>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        title={selected?.label ?? placeholder}
        className={
          iconOnly
            ? 'flex size-6 cursor-pointer items-center justify-center rounded-md hover:bg-hover disabled:cursor-default'
            : 'chip h-7 max-w-full cursor-pointer text-[13px] text-ink hover:bg-hover disabled:cursor-default'
        }
      >
        {triggerIcon}
        {!iconOnly && <span className="truncate">{selected?.label ?? placeholder}</span>}
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
                placeholder="Search…"
                className="mx-1 mb-1 h-7 w-[calc(100%-0.5rem)] rounded border border-line bg-canvas px-2 text-xs outline-none focus:border-accent"
              />
            )}
            <ul className="max-h-64 overflow-y-auto">
              {noneLabel && !needle && (
                <PickerItem label={noneLabel} icon={noneIcon} selected={value === null} onSelect={() => choose(null)} />
              )}
              {visible.map((option) => (
                <PickerItem
                  key={option.value}
                  label={option.label}
                  icon={option.icon}
                  hint={option.hint}
                  selected={option.value === value}
                  onSelect={() => choose(option.value)}
                />
              ))}
              {visible.length === 0 && <li className="px-3 py-2 text-xs text-faint">No results</li>}
            </ul>
          </div>,
          document.body,
        )}
    </div>
  )
}

interface ItemProps {
  label: string
  icon?: ReactNode
  hint?: string
  selected: boolean
  onSelect: () => void
}

function PickerItem({ label, icon, hint, selected, onSelect }: ItemProps) {
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        className="flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-left text-[13px] hover:bg-hover"
      >
        {icon}
        <span className="flex-1 truncate">{label}</span>
        {hint && <span className="font-mono text-xs text-faint">{hint}</span>}
        {selected && <Check size={14} className="text-dim" />}
      </button>
    </li>
  )
}
