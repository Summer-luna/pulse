import type { IssuePriority, ProjectPriority } from '@/graphql/generated/graphql'

interface Props {
  priority: IssuePriority | ProjectPriority
}

const BARS: Record<IssuePriority | ProjectPriority, number> = { URGENT: 3, HIGH: 3, MEDIUM: 2, LOW: 1, NO_PRIORITY: 0 }

export function PriorityIcon({ priority }: Props) {
  if (priority === 'URGENT') {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden className="shrink-0">
        <rect width="14" height="14" rx="3" fill="#f2703d" />
        <path d="M7 3.5v4.2" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="7" cy="10.2" r="0.9" fill="#fff" />
      </svg>
    )
  }
  if (priority === 'NO_PRIORITY') {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden className="shrink-0">
        <path d="M2 7h2.2M5.9 7h2.2M9.8 7H12" stroke="#62666f" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    )
  }
  const filled = BARS[priority]
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden className="shrink-0">
      {[0, 1, 2].map((index) => (
        <rect
          key={index}
          x={2 + index * 4}
          y={9 - index * 3}
          width="2.4"
          height={3 + index * 3}
          rx="0.8"
          fill={index < filled ? '#c3c6cc' : '#3a3d44'}
        />
      ))}
    </svg>
  )
}
