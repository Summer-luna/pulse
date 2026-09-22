import type { Progress } from '@/domain/types'
import { progressPercent } from '@/lib/progress'

interface Props {
  progress: Progress | null | undefined
  showLabel?: boolean
  className?: string
}

export function ProgressBar({ progress, showLabel = true, className = '' }: Props) {
  const percent = progressPercent(progress)
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="h-1.5 min-w-14 flex-1 overflow-hidden rounded-full bg-line">
        <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${percent}%` }} />
      </div>
      {showLabel && <span className="w-9 text-right text-xs tabular-nums text-dim">{percent}%</span>}
    </div>
  )
}
