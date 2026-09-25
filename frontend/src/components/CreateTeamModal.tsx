import { Users } from 'lucide-react'
import type { FormEvent } from 'react'
import { useCreateTeamController } from '@/controllers/use-teams-controller'
import { keyColor } from '@/lib/key-color'
import { DescriptionField } from '@/ui/DescriptionField'
import { Modal } from '@/ui/Modal'
import { MembersPicker } from './MembersPicker'

interface Props {
  onClose: () => void
}

export function CreateTeamModal({ onClose }: Props) {
  const controller = useCreateTeamController()
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
    <Modal title="New team" onClose={onClose}>
      <form onSubmit={onSubmit} className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-3">
          <span
            className="flex size-9 shrink-0 items-center justify-center rounded-lg text-white"
            style={{ background: keyColor(draft.key || draft.name || 'team') }}
          >
            <Users size={18} />
          </span>
          <input
            autoFocus
            value={draft.name}
            onChange={(event) => updateDraft({ name: event.target.value })}
            placeholder="Team name"
            maxLength={80}
            className="w-full bg-transparent text-lg font-medium outline-none placeholder:text-faint"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="chip h-7 gap-1.5 text-dim">
            Key
            <input
              value={draft.key}
              onChange={(event) => updateDraft({ key: event.target.value.toUpperCase() })}
              placeholder="KEY"
              maxLength={5}
              aria-label="Team key"
              className="w-14 bg-transparent font-mono text-ink uppercase outline-none"
            />
          </label>
          <MembersPicker values={draft.memberIds} onChange={(memberIds) => updateDraft({ memberIds })} />
        </div>

        <DescriptionField
          value={draft.description}
          onChange={(description) => updateDraft({ description })}
          placeholder="What is this team responsible for?"
          className="min-h-20"
        />

        <div className="flex items-center justify-end gap-2 border-t border-line pt-3">
          {controller.error && <p className="mr-auto text-danger">{controller.error}</p>}
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={controller.isSubmitting}>
            {controller.isSubmitting ? 'Creating…' : 'Create team'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

