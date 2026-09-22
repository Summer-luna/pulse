import { Plus } from 'lucide-react'
import { useDialogs } from '@/app/dialogs-context'
import { IssuesView } from '@/components/IssuesView'
import { PageHeader } from '@/components/PageHeader'

export function IssuesPage() {
  const dialogs = useDialogs()

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        actions={
          <button className="btn btn-primary" onClick={() => dialogs.openCreateIssue()}>
            <Plus size={14} /> New issue
          </button>
        }
      >
        <h1 className="font-medium">All issues</h1>
      </PageHeader>
      <div className="min-h-0 flex-1">
        <IssuesView scope={{}} emptyTitle="No issues yet" emptyDescription="Press C to create your first issue." />
      </div>
    </div>
  )
}
