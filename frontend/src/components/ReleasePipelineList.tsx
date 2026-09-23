import { Link } from 'react-router'
import { RELEASE_PIPELINE_TYPE_LABEL } from '@/domain/release-pipeline-type'
import { RELEASE_STATUS_COLOR } from '@/domain/release-status'
import type { ReleasePipeline } from '@/domain/types'
import { releaseService } from '@/services/release-service'
import { StatusDot } from '@/ui/StatusDot'
import { ProjectBadge } from './ProjectBadge'

interface Props {
  pipelines: ReleasePipeline[]
}

export function ReleasePipelineList({ pipelines }: Props) {
  return (
    <div>
      <div className="flex h-9 items-center gap-4 border-b border-line/60 px-4 text-xs text-dim">
        <span className="flex-1">Pipeline name</span>
        <span className="w-40 shrink-0">Project</span>
        <span className="w-28 shrink-0">Type</span>
        <span className="w-20 shrink-0 text-right">Releases</span>
        <span className="w-44 shrink-0">Latest release</span>
      </div>
      {pipelines.map((pipeline) => (
        <Link
          key={pipeline.id}
          to={`/release-pipelines/${pipeline.id}`}
          className="flex h-11 items-center gap-4 border-b border-line/60 px-4 hover:bg-hover"
        >
          <span className="min-w-0 flex-1 truncate font-medium">{pipeline.name}</span>
          <span className="flex w-40 shrink-0 items-center gap-1.5 truncate text-xs text-dim">
            <ProjectBadge projectKey={pipeline.project.key} size={16} />
            {pipeline.project.name}
          </span>
          <span className="w-28 shrink-0 text-xs text-dim">{RELEASE_PIPELINE_TYPE_LABEL[pipeline.type]}</span>
          <span className="w-20 shrink-0 text-right text-xs tabular-nums text-dim">{pipeline.releaseCount}</span>
          <span className="w-44 shrink-0 truncate text-xs">
            {pipeline.latestRelease ? (
              <StatusDot
                color={RELEASE_STATUS_COLOR[pipeline.latestRelease.status]}
                label={releaseService.displayName(pipeline.latestRelease)}
              />
            ) : (
              <span className="text-faint">No releases</span>
            )}
          </span>
        </Link>
      ))}
    </div>
  )
}
