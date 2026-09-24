import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { CreateRequestModal } from '@/components/CreateRequestModal'
import { CustomerStatusPicker } from '@/components/CustomerStatusPicker'
import { PageHeader } from '@/components/PageHeader'
import { RequestList } from '@/components/RequestList'
import { UserPicker } from '@/components/UserPicker'
import { useCustomerController } from '@/controllers/use-customers-controller'
import { useRequestsController } from '@/controllers/use-requests-controller'
import { keyColor } from '@/lib/key-color'
import { EmptyState } from '@/ui/EmptyState'
import { PageState } from '@/ui/PageState'

export function CustomerPage() {
  const { customerId = '' } = useParams()
  const { customer, isLoading, error, updateCustomer } = useCustomerController(customerId)
  const requestsController = useRequestsController(undefined, customerId)
  const [creating, setCreating] = useState(false)

  if (!customer) {
    return <PageState isLoading={isLoading} error={error} notFound />
  }

  const create = (
    <button className="btn btn-primary" onClick={() => setCreating(true)}>
      <Plus size={14} /> Add request
    </button>
  )

  return (
    <div className="flex h-full flex-col">
      <PageHeader>
        <nav className="flex min-w-0 items-center gap-1 text-dim">
          <Link to="/customers" className="hover:text-ink">
            Customers
          </Link>
          <span className="px-1">/</span>
          <span className="truncate text-ink">{customer.name}</span>
        </nav>
      </PageHeader>
      <div className="min-h-0 flex-1 overflow-y-auto px-8 py-6">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-3">
            <span
              className="flex size-9 shrink-0 items-center justify-center rounded text-sm font-semibold text-white"
              style={{ background: keyColor(customer.name) }}
            >
              {customer.name[0]}
            </span>
            <h1 className="text-xl font-semibold">{customer.name}</h1>
          </div>

          <div className="mt-6 flex gap-8">
            <div>
              <div className="mb-1.5 text-xs text-dim">Status</div>
              <CustomerStatusPicker value={customer.status} onChange={(status) => updateCustomer({ status })} />
            </div>
            <div>
              <div className="mb-1.5 text-xs text-dim">Owner</div>
              <UserPicker
                value={customer.ownerId}
                onChange={(ownerId) => updateCustomer({ ownerId })}
                placeholder="Owner"
                noneLabel="No owner"
              />
            </div>
          </div>

          <div className="mt-8 border-t border-line pt-6">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-medium">Requests {customer.requestCount}</h2>
              {requestsController.requests.length > 0 && create}
            </div>
            <PageState isLoading={requestsController.isLoading} error={requestsController.error} />
            {!requestsController.isLoading && requestsController.requests.length === 0 && (
              <EmptyState title="No requests yet" description="Track this customer's asks here." action={create} />
            )}
            {requestsController.requests.length > 0 && (
              <RequestList
                requests={requestsController.requests}
                onConvert={requestsController.convertRequest}
                onRemove={requestsController.removeRequest}
              />
            )}
          </div>
        </div>
      </div>
      {creating && <CreateRequestModal customerId={customerId} onClose={() => setCreating(false)} />}
    </div>
  )
}
