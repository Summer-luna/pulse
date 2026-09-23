import { ISSUE_STATUS_COLOR } from '@/domain/issue-status'
import type { IssueStatus } from '@/graphql/generated/graphql'

interface Props {
  status: IssueStatus
  size?: number
}

function pie(fraction: number): string {
  const angle = fraction * Math.PI * 2
  const x = 7 + 3 * Math.sin(angle)
  const y = 7 - 3 * Math.cos(angle)
  const largeArc = fraction > 0.5 ? 1 : 0
  return `M7 7 L7 4 A3 3 0 ${largeArc} 1 ${x.toFixed(2)} ${y.toFixed(2)} Z`
}

export function StatusIcon({ status, size = 14 }: Props) {
  const color = ISSUE_STATUS_COLOR[status]
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden className="shrink-0">
      {status === 'BACKLOG' && (
        <circle cx="7" cy="7" r="5.75" stroke={color} strokeWidth="1.5" strokeDasharray="1.8 1.6" />
      )}
      {status === 'TODO' && <circle cx="7" cy="7" r="5.75" stroke={color} strokeWidth="1.5" />}
      {(status === 'IN_PROGRESS' || status === 'IN_REVIEW') && (
        <>
          <circle cx="7" cy="7" r="5.75" stroke={color} strokeWidth="1.5" />
          <path d={pie(status === 'IN_PROGRESS' ? 0.5 : 0.75)} fill={color} />
        </>
      )}
      {status === 'BLOCKED' && (
        <>
          <circle cx="7" cy="7" r="5.75" stroke={color} strokeWidth="1.5" />
          <rect x="4" y="6.25" width="6" height="1.5" fill={color} />
        </>
      )}
      {status === 'DONE' && (
        <>
          <circle cx="7" cy="7" r="7" fill={color} />
          <path d="M4 7.2 6.1 9.2 10 5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {status === 'CANCELED' && (
        <>
          <circle cx="7" cy="7" r="7" fill={color} />
          <path d="M4.8 4.8 9.2 9.2M9.2 4.8 4.8 9.2" stroke="#0d0e10" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
    </svg>
  )
}
