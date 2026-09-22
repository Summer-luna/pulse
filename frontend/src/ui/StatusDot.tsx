interface Props {
  color: string
  label: string
}

export function StatusDot({ color, label }: Props) {
  return (
    <span className="inline-flex items-center gap-1.5 text-dim">
      <span className="size-2 shrink-0 rounded-full" style={{ background: color }} />
      {label}
    </span>
  )
}
