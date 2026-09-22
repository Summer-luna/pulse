interface Props {
  name: string
  color: string
  className?: string
}

export function LabelChip({ name, color, className = '' }: Props) {
  return (
    <span className={`chip max-w-32 shrink-0 ${className}`} title={name}>
      <span className="size-2 shrink-0 rounded-full" style={{ background: color }} />
      <span className="truncate">{name}</span>
    </span>
  )
}
