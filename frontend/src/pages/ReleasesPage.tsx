import { Plus } from 'lucide-react'
import { Link } from 'react-router'
import { useDialogs } from '@/app/dialogs-context'
import { PageHeader } from '@/components/PageHeader'
import { ReleaseList } from '@/components/ReleaseList'
import { useReleasesController } from '@/controllers/use-releases-controller'
import { EmptyState } from '@/ui/EmptyState'
import { PageState } from '@/ui/PageState'

export function ReleasesPage() {
  const { groups, releases, isLoading, error } = useReleasesController()
  const dialogs = useDialogs()

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        actions={
          <button className="btn btn-primary" onClick={() => dialogs.openCreateRelease()}>
            <Plus size={14} /> New release
          </button>
        }
      >
        <h1 className="font-medium">Releases</h1>
      </PageHeader>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <PageState isLoading={isLoading} error={error} />
        {!isLoading && releases.length === 0 && (
          <EmptyState title="No releases yet" description="Releases belong to a project and collect the issues that ship together." />
        )}
        {groups.map((group) => (
          <section key={group.projectId}>
            <h2 className="sticky top-0 z-10 border-b border-line/60 bg-panel px-4 py-2 font-medium">
              <Link to={`/projects/${group.projectId}/releases`} className="hover:underline">
                {group.projectName}
              </Link>
            </h2>
            <ReleaseList releases={group.releases} />
          </section>
        ))}
      </div>
    </div>
  )
}
