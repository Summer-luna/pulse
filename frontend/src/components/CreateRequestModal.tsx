import type { FormEvent } from 'react'
import { useCreateRequestController } from '@/controllers/use-requests-controller'
import { REQUEST_SOURCE_LABEL, REQUEST_SOURCES } from '@/domain/request'
import { DescriptionField } from '@/ui/DescriptionField'
import { Modal } from '@/ui/Modal'
import { Picker } from '@/ui/Picker'
import { CustomerPicker } from './CustomerPicker'

interface Props {
  projectId?: string
  customerId?: string
  customerName?: string
  onClose: () => void
}

const SOURCE_OPTIONS = REQUEST_SOURCES.map((source) => ({ value: source, label: REQUEST_SOURCE_LABEL[source] }))

export function CreateRequestModal({ projectId, customerId, customerName, onClose }: Props) {
  const controller = useCreateRequestController(projectId, customerId, customerName)
  const { draft, updateDraft } = controller

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
          {!customerId && (
            <input
              value={draft.requestor}
              onChange={(event) => updateDraft({ requestor: event.target.value })}
              placeholder="Requestor"
              maxLength={120}
              className="field h-7 w-40"
            />
          )}
          <Picker
            value={draft.source}
            options={SOURCE_OPTIONS}
            onChange={(next) => next && updateDraft({ source: next })}
            placeholder="Source"
          />
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
