import { KanbanSquare, List, Search } from 'lucide-react'
import { useIssuesViewController } from '@/controllers/use-issues-view-controller'
import type { IssuesFilterInput } from '@/graphql/generated/graphql'
import { EmptyState } from '@/ui/EmptyState'
import { PageState } from '@/ui/PageState'
import { IssueBoard } from './IssueBoard'
import { IssueList } from './IssueList'

interface Props {
  scope: IssuesFilterInput
  emptyTitle?: string
  emptyDescription?: string
}

export function IssuesView({ scope, emptyTitle = 'No issues yet', emptyDescription }: Props) {
  const controller = useIssuesViewController(scope)
  const { sections, view } = controller
  const hasIssues = sections.some((section) => section.issues.length > 0)

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center gap-2 border-b border-line px-4 py-2">
        <label className="relative">
          <Search size={14} className="pointer-events-none absolute top-1/2 left-2 -translate-y-1/2 text-faint" />
          <input
            value={controller.search}
            onChange={(event) => controller.setSearch(event.target.value)}
            placeholder="Filter issues…"
            className="field h-7 w-56 pl-7"
          />
        </label>
        <label className="flex cursor-pointer items-center gap-1.5 text-dim select-none">
          <input
            type="checkbox"
            checked={controller.hideSubIssues}
            onChange={(event) => controller.setHideSubIssues(event.target.checked)}
            className="accent-accent"
          />
          Hide sub-issues
        </label>
        <div className="ml-auto flex rounded-md border border-line p-0.5">
          <button
            className={`btn h-6 border-0 px-2 ${view === 'list' ? 'bg-hover' : 'btn-ghost'}`}
            onClick={() => controller.setView('list')}
            aria-pressed={view === 'list'}
          >
            <List size={14} /> List
          </button>
          <button
            className={`btn h-6 border-0 px-2 ${view === 'board' ? 'bg-hover' : 'btn-ghost'}`}
            onClick={() => controller.setView('board')}
            aria-pressed={view === 'board'}
          >
            <KanbanSquare size={14} /> Board
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <PageState isLoading={controller.isLoading} error={controller.error} />
        {!controller.isLoading && !hasIssues && view === 'list' && (
          <EmptyState
            title={controller.total === 0 ? emptyTitle : 'No matching issues'}
            description={controller.total === 0 ? emptyDescription : 'Try a different filter.'}
          />
        )}
        {view === 'list' ? (
          <IssueList sections={sections} onUpdate={controller.updateIssue} />
        ) : (
          <IssueBoard sections={sections} onUpdate={controller.updateIssue} />
        )}
      </div>
    </div>
  )
}
