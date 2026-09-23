import { Plus, Search } from 'lucide-react'
import { useDialogs } from '@/app/dialogs-context'
import { PageHeader } from '@/components/PageHeader'
import { ReleasePipelineList } from '@/components/ReleasePipelineList'
import { useReleasePipelinesController } from '@/controllers/use-release-pipelines-controller'
import { EmptyState } from '@/ui/EmptyState'
import { PageState } from '@/ui/PageState'

export function ReleasesPage() {
  const { pipelines, total, isLoading, error, search, setSearch } = useReleasePipelinesController()
  const dialogs = useDialogs()

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        actions={
          <button className="btn btn-primary" onClick={() => dialogs.openCreatePipeline()}>
            <Plus size={14} /> New pipeline
          </button>
        }
      >
        <h1 className="font-medium">Releases</h1>
      </PageHeader>
      <div className="flex items-center gap-2 border-b border-line px-4 py-2">
        <label className="relative">
          <Search size={14} className="pointer-events-none absolute top-1/2 left-2 -translate-y-1/2 text-faint" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Filter by pipeline name…"
            className="field h-7 w-64 pl-7"
          />
        </label>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <PageState isLoading={isLoading} error={error} />
        {!isLoading && pipelines.length === 0 && (
          <EmptyState
            title={total === 0 ? 'No release pipelines yet' : 'No matching pipelines'}
            description={total === 0 ? 'A pipeline tracks the releases that ship for a project.' : 'Try a different filter.'}
          />
        )}
        <ReleasePipelineList pipelines={pipelines} />
      </div>
    </div>
  )
}
