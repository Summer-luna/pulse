import { Plus } from 'lucide-react'
import { useParams } from 'react-router'
import { useDialogs } from '@/app/dialogs-context'
import { ReleaseList } from '@/components/ReleaseList'
import { useReleasesController } from '@/controllers/use-releases-controller'
import { EmptyState } from '@/ui/EmptyState'
import { PageState } from '@/ui/PageState'

export function ProjectReleasesTab() {
  const { projectId = '' } = useParams()
  const { releases, isLoading, error } = useReleasesController(projectId)
  const dialogs = useDialogs()
  const create = (
    <button className="btn btn-primary" onClick={() => dialogs.openCreateRelease(projectId)}>
      <Plus size={14} /> New release
    </button>
  )

  return (
    <div className="h-full overflow-y-auto">
      {releases.length > 0 && <div className="flex justify-end border-b border-line px-4 py-2">{create}</div>}
      <PageState isLoading={isLoading} error={error} />
      {!isLoading && releases.length === 0 && (
        <EmptyState
          title="No releases yet"
          description="Group issues into releases to track what ships together."
          action={create}
        />
      )}
      <ReleaseList releases={releases} />
    </div>
  )
}
