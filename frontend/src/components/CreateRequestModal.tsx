import type { FormEvent } from 'react'
import { useCustomersController } from '@/controllers/use-customers-controller'
import { useCreateRequestController } from '@/controllers/use-requests-controller'
import type { CustomerType } from '@/graphql/generated/graphql'
import { DescriptionField } from '@/ui/DescriptionField'
import { Modal } from '@/ui/Modal'
import { CustomerPicker } from './CustomerPicker'
import { UserPicker } from './UserPicker'

interface Props {
  projectId?: string
  customerId?: string
  customerName?: string
  customerType?: CustomerType
  onClose: () => void
}

export function CreateRequestModal({ projectId, customerId, customerName, customerType, onClose }: Props) {
  const controller = useCreateRequestController(projectId, customerId, customerName)
  const { draft, updateDraft } = controller
  const { customers } = useCustomersController()

  const effectiveCustomerType = customerId ? customerType : customers.find((customer) => customer.id === draft.customerId)?.type
  const isInternal = effectiveCustomerType !== 'EXTERNAL'

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    try {
      await controller.submit()
      onClose()
    } catch {
      // 错误已通过 controller.error 展示
    }
  }

  return (
    <Modal title="New request" onClose={onClose}>
      <form onSubmit={onSubmit} className="flex flex-col gap-3 p-4">
        <input
          autoFocus
          value={draft.title}
          onChange={(event) => updateDraft({ title: event.target.value })}
          placeholder="Request title"
          maxLength={200}
          className="w-full bg-transparent text-lg font-medium outline-none placeholder:text-faint"
        />
        <DescriptionField
          value={draft.description}
          onChange={(description) => updateDraft({ description })}
          placeholder="Add description…"
          className="min-h-20"
        />
        <div className="flex flex-wrap items-center gap-2">
          {!customerId && !isInternal && (
            <input
              value={draft.requestor}
              onChange={(event) => updateDraft({ requestor: event.target.value })}
              placeholder="Requestor"
              maxLength={120}
              className="field h-7 w-40"
            />
          )}
          {isInternal && (
            <UserPicker
              value={draft.requestorUserId}
              onChange={(requestorUserId) => updateDraft({ requestorUserId })}
              placeholder="Requestor"
              noneLabel="Requestor"
            />
          )}
          {!customerId && <CustomerPicker value={draft.customerId} onChange={(next) => updateDraft({ customerId: next })} />}
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-line pt-3">
          {controller.error && <p className="mr-auto text-danger">{controller.error}</p>}
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={controller.isSubmitting}>
            {controller.isSubmitting ? 'Creating…' : 'Create request'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
