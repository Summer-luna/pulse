import { Link } from 'react-router'
import { RELEASE_STATUS_COLOR, RELEASE_STATUS_LABEL } from '@/domain/release-status'
import type { Release } from '@/domain/types'
import { releaseService } from '@/services/release-service'
import { ProgressBar } from '@/ui/ProgressBar'
import { StatusDot } from '@/ui/StatusDot'

interface Props {
  releases: Release[]
}

export function ReleaseList({ releases }: Props) {
  return (
    <div>
      {releases.map((release) => {
        const overdue = releaseService.isOverdue(release)
        return (
          <Link
            key={release.id}
            to={`/projects/${release.projectId}/releases/${release.id}`}
            className="flex h-11 items-center gap-4 border-b border-line/60 px-4 hover:bg-hover"
          >
            <span className="min-w-0 flex-1 truncate font-medium">{release.name}</span>
            {release.version && <span className="chip font-mono">{release.version}</span>}
            <span className="w-28 shrink-0 text-xs">
              <StatusDot color={RELEASE_STATUS_COLOR[release.status]} label={RELEASE_STATUS_LABEL[release.status]} />
            </span>
            <span className={`w-36 shrink-0 text-xs ${overdue ? 'text-danger' : 'text-dim'}`}>
              {releaseService.scheduleLabel(release)}
            </span>
            <span className="w-10 shrink-0 text-right text-xs tabular-nums text-dim">
              {release.progress.completed}/{release.progress.total}
            </span>
            <ProgressBar progress={release.progress} className="w-32 shrink-0" />
          </Link>
        )
      })}
    </div>
  )
}
