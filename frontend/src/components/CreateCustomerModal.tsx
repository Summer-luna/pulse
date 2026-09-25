import { type FormEvent, useState } from 'react'
import { useCreateCustomerController } from '@/controllers/use-customers-controller'
import {
  CUSTOMER_STATUS_LABEL,
  CUSTOMER_STATUSES,
  CUSTOMER_TIER_LABEL,
  CUSTOMER_TIERS,
  CUSTOMER_TYPE_LABEL,
  CUSTOMER_TYPES,
} from '@/domain/customer'
import { Modal } from '@/ui/Modal'
import { Picker } from '@/ui/Picker'
import { UserPicker } from './UserPicker'

interface Props {
  onClose: () => void
}

const STATUS_OPTIONS = CUSTOMER_STATUSES.map((status) => ({ value: status, label: CUSTOMER_STATUS_LABEL[status] }))
const TIER_OPTIONS = CUSTOMER_TIERS.map((tier) => ({ value: tier, label: CUSTOMER_TIER_LABEL[tier] }))
const TYPE_OPTIONS = CUSTOMER_TYPES.map((type) => ({ value: type, label: CUSTOMER_TYPE_LABEL[type] }))

export function CreateCustomerModal({ onClose }: Props) {
  const controller = useCreateCustomerController()
  const { draft, updateDraft } = controller
  const [domainDraft, setDomainDraft] = useState('')

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    try {
      await controller.submit()
      onClose()
    } catch {
      // 错误已通过 controller.error 展示
    }
  }

  function addDomain() {
    const domain = domainDraft.trim()
    if (domain && !draft.domains.includes(domain)) {
      updateDraft({ domains: [...draft.domains, domain] })
    }
    setDomainDraft('')
  }

  return (
    <Modal title="Create customer" onClose={onClose}>
      <form onSubmit={onSubmit} className="flex flex-col gap-4 p-4">
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-dim">Name</span>
            <input
              autoFocus
              value={draft.name}
              onChange={(event) => updateDraft({ name: event.target.value })}
              placeholder="Customer name"
              maxLength={120}
              className="field"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-dim">Owner</span>
            <UserPicker value={draft.ownerId} onChange={(ownerId) => updateDraft({ ownerId })} placeholder="Owner" noneLabel="No owner" />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-dim">Status</span>
            <Picker
              value={draft.status}
              options={STATUS_OPTIONS}
              onChange={(next) => next && updateDraft({ status: next })}
              placeholder="Status"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-dim">Type</span>
            <Picker
              value={draft.type}
              options={TYPE_OPTIONS}
              onChange={(next) => next && updateDraft({ type: next })}
              placeholder="Type"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-dim">Tier</span>
            <Picker
              value={draft.tier}
              options={TIER_OPTIONS}
              onChange={(tier) => updateDraft({ tier })}
              placeholder="Tier"
              noneLabel="No tier"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-dim">Annual revenue</span>
            <div className="field flex items-center gap-1 p-0 px-2.5">
              <span className="text-faint">$</span>
              <input
                type="number"
                min={0}
                value={draft.annualRevenue ?? ''}
                onChange={(event) => updateDraft({ annualRevenue: event.target.value ? Number(event.target.value) : null })}
                placeholder="0"
                className="h-8 w-full bg-transparent outline-none"
              />
            </div>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-dim">Size</span>
            <input
              value={draft.size}
              onChange={(event) => updateDraft({ size: event.target.value })}
              placeholder="e.g. 50-100"
              maxLength={40}
              className="field"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-dim">Domains</span>
          <div className="flex flex-wrap gap-1.5">
            {draft.domains.map((domain) => (
              <span key={domain} className="chip gap-1.5">
                {domain}
                <button
                  type="button"
                  onClick={() => updateDraft({ domains: draft.domains.filter((existing) => existing !== domain) })}
                  className="cursor-pointer text-faint hover:text-danger"
                  aria-label={`Remove ${domain}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <input
            value={domainDraft}
            onChange={(event) => setDomainDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                addDomain()
              }
            }}
            onBlur={addDomain}
            placeholder="customer.com"
            className="field"
          />
        </label>

        <div className="flex items-center justify-end gap-2 border-t border-line pt-3">
          {controller.error && <p className="mr-auto text-danger">{controller.error}</p>}
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={controller.isSubmitting}>
            {controller.isSubmitting ? 'Creating…' : 'Create customer'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
