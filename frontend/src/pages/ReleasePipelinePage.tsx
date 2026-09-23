import { ChevronRight, Plus } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { useDialogs } from '@/app/dialogs-context'
import { PageHeader } from '@/components/PageHeader'
import { ProjectBadge } from '@/components/ProjectBadge'
import { ReleaseList } from '@/components/ReleaseList'
import { useReleasePipelineController } from '@/controllers/use-release-pipelines-controller'
import { RELEASE_PIPELINE_TYPE_LABEL } from '@/domain/release-pipeline-type'
import { EmptyState } from '@/ui/EmptyState'
import { PageState } from '@/ui/PageState'

export function ReleasePipelinePage() {
  const { pipelineId = '' } = useParams()
  const { pipeline, releases, isLoading, error } = useReleasePipelineController(pipelineId)
  const dialogs = useDialogs()

  if (!pipeline) {
    return <PageState isLoading={isLoading} error={error} notFound />
  }

  const create = (
    <button className="btn btn-primary" onClick={() => dialogs.openCreateRelease(pipeline.id)}>
      <Plus size={14} /> New release
    </button>
  )

  return (
    <div className="flex h-full flex-col">
      <PageHeader actions={create}>
        <nav className="flex min-w-0 items-center gap-1 text-dim">
          <Link to="/releases" className="hover:text-ink">
            Releases
          </Link>
          <ChevronRight size={14} />
          <span className="truncate text-ink">{pipeline.name}</span>
        </nav>
      </PageHeader>
      <div className="flex items-center gap-3 border-b border-line px-6 py-3 text-xs text-dim">
        <span className="flex items-center gap-1.5">
          <ProjectBadge projectKey={pipeline.project.key} size={16} />
          {pipeline.project.name}
        </span>
        <span className="chip">{RELEASE_PIPELINE_TYPE_LABEL[pipeline.type]}</span>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {releases.length === 0 && (
          <EmptyState title="No releases yet" description="Releases in this pipeline collect the issues that ship together." />
        )}
        <ReleaseList releases={releases} />
      </div>
    </div>
  )
}
