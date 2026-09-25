import { Users } from 'lucide-react'
import type { FormEvent } from 'react'
import { useCreateTeamController } from '@/controllers/use-teams-controller'
import { TEAM_ACCESS_LABEL, TEAM_ACCESSES } from '@/domain/team'
import { keyColor } from '@/lib/key-color'
import { Modal } from '@/ui/Modal'
import { Picker } from '@/ui/Picker'

interface Props {
  onClose: () => void
}

const ACCESS_OPTIONS = TEAM_ACCESSES.map((access) => ({ value: access, label: TEAM_ACCESS_LABEL[access] }))

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
    <Modal title="Create a new team" onClose={onClose} maxWidthClassName="max-w-2xl">
      <form onSubmit={onSubmit} className="flex flex-col gap-6 p-5">
        <p className="-mt-2 text-xs text-faint">Create a new team to manage separate cycles, workflows, and notifications</p>

        <div className="divide-y divide-line rounded-lg border border-line">
          <div className="flex items-center justify-between gap-4 p-4">
            <span className="font-medium">Icon &amp; Name</span>
            <div className="flex items-center gap-2">
              <span
                className="flex size-8 shrink-0 items-center justify-center rounded-lg text-white"
                style={{ background: keyColor(draft.key || draft.name || 'team') }}
              >
                <Users size={16} />
              </span>
              <input
                autoFocus
                value={draft.name}
                onChange={(event) => updateDraft({ name: event.target.value })}
                placeholder="e.g. Engineering"
                maxLength={80}
                className="field h-9 w-56"
              />
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 p-4">
            <div>
              <div className="font-medium">Identifier</div>
              <div className="text-xs text-faint">Used to identify issues from this team (e.g. ENG-123)</div>
            </div>
            <input
              value={draft.key}
              onChange={(event) => updateDraft({ key: event.target.value.toUpperCase() })}
              placeholder="e.g. ENG"
              maxLength={5}
              aria-label="Team identifier"
              className="field h-9 w-24 font-mono uppercase"
            />
          </div>
        </div>

        <div>
          <div className="mb-1 font-medium">Team access</div>
          <p className="mb-2 text-xs text-faint">
            Control who can access the team and its content. Private teams are visible only to team members and workspace admins.
          </p>
          <div className="flex items-center justify-between gap-4 rounded-lg border border-line p-4">
            <span className="font-medium">Team access</span>
            <Picker
              value={draft.access}
              options={ACCESS_OPTIONS}
              onChange={(next) => next && updateDraft({ access: next })}
              placeholder="Team access"
              align="right"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-line pt-4">
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
