import { useState } from 'react'

interface Props {
  value: string
  onSave: (value: string) => void
  placeholder?: string
  multiline?: boolean
  allowEmpty?: boolean
  className?: string
  maxLength?: number
}

export function EditableText({
  value,
  onSave,
  placeholder,
  multiline = false,
  allowEmpty = false,
  className = '',
  maxLength,
}: Props) {
  const [draft, setDraft] = useState(value)
  const [syncedValue, setSyncedValue] = useState(value)

  if (value !== syncedValue) {
    setSyncedValue(value)
    setDraft(value)
  }

  function commit() {
    const next = draft.trim()
    if (next === value.trim()) {
      setDraft(value)
      return
    }
    if (!next && !allowEmpty) {
      setDraft(value)
      return
    }
    onSave(next)
  }

  const shared = {
    value: draft,
    placeholder,
    maxLength,
    onChange: (event: { target: { value: string } }) => setDraft(event.target.value),
    onBlur: commit,
    className: `w-full rounded-md border border-transparent bg-transparent outline-none placeholder:text-faint hover:border-line focus:border-accent ${className}`,
  }

  return multiline ? (
    <textarea {...shared} rows={Math.max(3, draft.split('\n').length)} className={`${shared.className} resize-none px-2 py-1.5 leading-relaxed`} />
  ) : (
    <input
      {...shared}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          event.currentTarget.blur()
        }
      }}
      className={`${shared.className} px-2 py-1`}
    />
  )
}
