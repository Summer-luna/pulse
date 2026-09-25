import { Plus, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { CreateCustomerModal } from '@/components/CreateCustomerModal'
import { CustomerStatusPicker } from '@/components/CustomerStatusPicker'
import { PageHeader } from '@/components/PageHeader'
import { UserPicker } from '@/components/UserPicker'
import { useCustomersController } from '@/controllers/use-customers-controller'
import { CUSTOMER_STATUSES, CUSTOMER_TIER_LABEL, CUSTOMER_TYPE_LABEL } from '@/domain/customer'
import type { CustomerStatus } from '@/graphql/generated/graphql'
import { keyColor } from '@/lib/key-color'
import { EmptyState } from '@/ui/EmptyState'
import { PageState } from '@/ui/PageState'

export function CustomersPage() {
  const { customers, total, isLoading, error, search, setSearch, removeCustomer, updateCustomer } = useCustomersController()
  const [creating, setCreating] = useState(false)
  const navigate = useNavigate()

  const statusCounts = useMemo(() => {
    const counts = Object.fromEntries(CUSTOMER_STATUSES.map((status) => [status, 0])) as Record<CustomerStatus, number>
    for (const customer of customers) {
      counts[customer.status] += 1
    }
    return counts
  }, [customers])

  const ownerCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    let unowned = 0
    for (const customer of customers) {
      if (customer.owner) {
        counts[customer.owner.id] = (counts[customer.owner.id] ?? 0) + 1
      } else {
        unowned += 1
      }
    }
    return { counts, unowned }
  }, [customers])

  async function onRemove(id: string, name: string) {
    if (window.confirm(`Delete customer ${name}?`)) {
      await removeCustomer(id)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        actions={
          <button className="btn btn-primary" onClick={() => setCreating(true)}>
            <Plus size={14} /> New customer
          </button>
        }
      >
        <h1 className="font-medium">Customers</h1>
      </PageHeader>
      <div className="flex items-center gap-2 border-b border-line px-4 py-2">
        <label className="relative">
          <Search size={14} className="pointer-events-none absolute top-1/2 left-2 -translate-y-1/2 text-faint" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Find by name…"
            className="field h-7 w-64 pl-7"
          />
        </label>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <PageState isLoading={isLoading} error={error} />
        {!isLoading && customers.length === 0 && (
          <EmptyState
            title={total === 0 ? 'No customers yet' : 'No matching customers'}
            description={total === 0 ? 'Track the accounts behind your requests here.' : 'Try a different search.'}
          />
        )}
        {customers.length > 0 && (
          <>
            <div className="flex h-9 items-center gap-4 border-b border-line/60 px-4 text-xs text-dim">
              <span className="flex-1">Name</span>
              <span className="w-20 shrink-0 text-right">Requests</span>
              <span className="w-24 shrink-0">Status</span>
              <span className="w-20 shrink-0">Type</span>
              <span className="w-20 shrink-0">Tier</span>
              <span className="w-40 shrink-0">Owner</span>
              <span className="w-16 shrink-0" />
            </div>
            {customers.map((customer) => (
              <div
                key={customer.id}
                role="link"
                tabIndex={0}
                onClick={() => navigate(`/customers/${customer.id}`)}
                onKeyDown={(event) => event.key === 'Enter' && navigate(`/customers/${customer.id}`)}
                className="flex h-11 cursor-pointer items-center gap-4 border-b border-line/60 px-4 outline-none hover:bg-hover focus-visible:bg-hover"
              >
                <span className="flex min-w-0 flex-1 items-center gap-2">
                  <span
                    className="flex size-5 shrink-0 items-center justify-center rounded text-[10px] font-semibold text-white"
                    style={{ background: keyColor(customer.name) }}
                  >
                    {customer.name[0]}
                  </span>
                  <span className="min-w-0 truncate font-medium">{customer.name}</span>
                </span>
                <span className="w-20 shrink-0 text-right text-xs tabular-nums text-dim">{customer.requestCount}</span>
                <span className="w-24 shrink-0">
                  <CustomerStatusPicker
                    value={customer.status}
                    counts={statusCounts}
                    onChange={(status) => updateCustomer(customer.id, { status })}
                  />
                </span>
                <span className="w-20 shrink-0 text-xs text-dim">{CUSTOMER_TYPE_LABEL[customer.type]}</span>
                <span className="w-20 shrink-0 text-xs text-dim">{customer.tier ? CUSTOMER_TIER_LABEL[customer.tier] : '—'}</span>
                <span className="w-40 shrink-0">
                  <UserPicker
                    value={customer.ownerId}
                    onChange={(ownerId) => updateCustomer(customer.id, { ownerId })}
                    placeholder="Owner"
                    noneLabel="No owner"
                    noneCount={ownerCounts.unowned}
                    counts={ownerCounts.counts}
                  />
                </span>
                <span className="w-16 shrink-0 text-right">
                  <button
                    type="button"
                    className="cursor-pointer text-xs text-faint hover:text-danger"
                    onClick={(event) => {
                      event.stopPropagation()
                      onRemove(customer.id, customer.name)
                    }}
                  >
                    Delete
                  </button>
                </span>
              </div>
            ))}
          </>
        )}
      </div>
      {creating && <CreateCustomerModal onClose={() => setCreating(false)} />}
    </div>
  )
}
