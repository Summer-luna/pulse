import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useParams } from 'react-router'
import { CreateRequestModal } from '@/components/CreateRequestModal'
import { RequestList } from '@/components/RequestList'
import { useRequestsController } from '@/controllers/use-requests-controller'
import { EmptyState } from '@/ui/EmptyState'
import { PageState } from '@/ui/PageState'

export function ProjectRequestsTab() {
  const { projectId = '' } = useParams()
  const { requests, isLoading, error, convertRequest, removeRequest } = useRequestsController(projectId)
  const [creating, setCreating] = useState(false)
  const create = (
    <button className="btn btn-primary" onClick={() => setCreating(true)}>
      <Plus size={14} /> New request
    </button>
  )

  return (
    <div className="h-full overflow-y-auto">
      {requests.length > 0 && <div className="flex justify-end border-b border-line px-4 py-2">{create}</div>}
      <PageState isLoading={isLoading} error={error} />
      {!isLoading && requests.length === 0 && (
        <EmptyState
          title="No requests yet"
          description="Track external or internal asks here before converting the ones you'll build into issues."
          action={create}
        />
      )}
      <RequestList requests={requests} onConvert={convertRequest} onRemove={removeRequest} />
      {creating && <CreateRequestModal projectId={projectId} onClose={() => setCreating(false)} />}
    </div>
  )
}
