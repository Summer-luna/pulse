import { Box } from 'lucide-react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { useCreateProjectController } from '@/controllers/use-create-project-controller'
import { keyColor } from '@/lib/key-color'
import { Modal } from '@/ui/Modal'
import { MembersPicker } from './MembersPicker'
import { ProjectPriorityPicker } from './ProjectPriorityPicker'
import { ProjectStatusPicker } from './ProjectStatusPicker'
import { UserPicker } from './UserPicker'

interface Props {
  onClose: () => void
}

export function CreateProjectModal({ onClose }: Props) {
  const controller = useCreateProjectController()
  const navigate = useNavigate()
  const { draft, updateDraft } = controller

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    try {
      const project = await controller.submit()
      onClose()
      navigate(`/projects/${project.id}/issues`)
    } catch {
      // 错误已通过 controller.error 展示
    }
  }

  return (
    <Modal title="New project" onClose={onClose} maxWidthClassName="max-w-[84rem]" minHeightClassName="min-h-[70vh]">
      <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
        <div className="flex flex-col gap-3 px-5 pt-4">
          <span
            className="flex size-9 items-center justify-center rounded-lg text-white"
            style={{ background: keyColor(draft.key || draft.name || 'project') }}
          >
            <Box size={18} />
          </span>
          <input
            autoFocus
            value={draft.name}
            onChange={(event) => updateDraft({ name: event.target.value })}
            placeholder="Project name"
            maxLength={80}
            className="w-full bg-transparent text-2xl font-semibold outline-none placeholder:text-faint"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 px-5 py-3">
          <ProjectStatusPicker value={draft.status} onChange={(status) => updateDraft({ status })} />
          <ProjectPriorityPicker value={draft.priority} onChange={(priority) => updateDraft({ priority })} />
          <UserPicker
            value={draft.leadId}
            onChange={(leadId) => updateDraft({ leadId })}
            placeholder="Lead"
            noneLabel="No lead"
          />
          <MembersPicker values={draft.memberIds} onChange={(memberIds) => updateDraft({ memberIds })} />
          <label className="chip h-7 gap-1.5 text-dim">
            Start
            <input
              type="date"
              value={draft.startDate ?? ''}
              onChange={(event) => updateDraft({ startDate: event.target.value || null })}
              aria-label="Start date"
              className="w-28 bg-transparent text-ink outline-none [color-scheme:dark]"
            />
          </label>
          <label className="chip h-7 gap-1.5 text-dim">
            Target
            <input
              type="date"
              value={draft.targetDate ?? ''}
              onChange={(event) => updateDraft({ targetDate: event.target.value || null })}
              aria-label="Target date"
              className="w-28 bg-transparent text-ink outline-none [color-scheme:dark]"
            />
          </label>
          <label className="chip h-7 gap-1.5 text-dim">
            Key
            <input
              value={draft.key}
              onChange={(event) => updateDraft({ key: event.target.value.toUpperCase() })}
              placeholder="KEY"
              maxLength={5}
              aria-label="Project key"
              className="w-14 bg-transparent font-mono text-ink uppercase outline-none"
            />
          </label>
        </div>

        <textarea
          value={draft.description}
          onChange={(event) => updateDraft({ description: event.target.value })}
          placeholder="Write a description, a project brief, or collect ideas…"
          className="field min-h-32 flex-1 resize-none border-transparent border-t border-t-line bg-transparent px-5 py-3 focus:border-transparent focus:border-t-line"
        />

        <div className="flex items-center justify-end gap-2 border-t border-line p-4">
          {controller.error && <p className="mr-auto text-danger">{controller.error}</p>}
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={controller.isSubmitting}>
            {controller.isSubmitting ? 'Creating…' : 'Create project'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
