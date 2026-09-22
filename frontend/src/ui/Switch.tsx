interface Props {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
}

export function Switch({ checked, onChange, label }: Props) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-dim select-none">
      {label}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-[18px] w-8 shrink-0 rounded-full transition-colors ${checked ? 'bg-accent' : 'bg-line'}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 size-[14px] rounded-full bg-white transition-transform ${checked ? 'translate-x-[14px]' : 'translate-x-0'}`}
        />
      </button>
    </label>
  )
}
