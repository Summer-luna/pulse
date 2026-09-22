interface Props {
  name: string
  color: string
  size?: number
}

export function Avatar({ name, color, size = 18 }: Props) {
  const initials = name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  return (
    <span
      title={name}
      className="inline-flex shrink-0 items-center justify-center rounded-full font-medium text-white"
      style={{ width: size, height: size, background: color, fontSize: size * 0.45 }}
    >
      {initials}
    </span>
  )
}

export function UnassignedAvatar({ size = 18 }: { size?: number }) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full border border-dashed border-faint text-faint"
      style={{ width: size, height: size }}
      aria-label="Unassigned"
    />
  )
}
