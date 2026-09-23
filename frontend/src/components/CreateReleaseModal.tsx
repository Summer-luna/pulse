import type { FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { useCreateReleaseController } from '@/controllers/use-create-release-controller'
import { DescriptionField } from '@/ui/DescriptionField'
import { Modal } from '@/ui/Modal'
import { ProjectPicker } from './ProjectPicker'
import { ReleaseStatusPicker } from './ReleaseStatusPicker'

interface Props {
  projectId: string
  onClose: () => void
}

export function CreateReleaseModal({ projectId, onClose }: Props) {
  const controller = useCreateReleaseController(projectId)
  const navigate = useNavigate()
  const { draft, updateDraft } = controller

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    try {
      const release = await controller.submit()
      onClose()
      navigate(`/projects/${release.projectId}/releases/${release.id}`)
    } catch {
      // 错误已通过 controller.error 展示
    }
  }

  return (
    <Modal title="New release" onClose={onClose}>
      <form onSubmit={onSubmit} className="flex flex-col gap-3 p-4">
        <div className="flex gap-2">
          <input
            autoFocus
            value={draft.name}
            onChange={(event) => updateDraft({ name: event.target.value })}
            placeholder="Release name"
            maxLength={80}
            className="field flex-1"
          />
          <input
            value={draft.version}
            onChange={(event) => updateDraft({ version: event.target.value })}
            placeholder="v1.0"
            maxLength={40}
            aria-label="Version"
            className="field w-28 font-mono"
          />
        </div>
        <DescriptionField
          value={draft.description}
          onChange={(description) => updateDraft({ description })}
          placeholder="Description"
          className="min-h-16 rounded-md border border-line bg-raised px-2.5 py-2 hover:border-line focus-within:border-accent"
        />
        <div className="flex flex-wrap items-center gap-2">
          <ProjectPicker
            value={draft.projectId}
            projects={controller.projects}
            onChange={(next) => updateDraft({ projectId: next })}
          />
          <ReleaseStatusPicker value={draft.status} onChange={(status) => updateDraft({ status })} />
          <input
            type="date"
            value={draft.targetDate ?? ''}
            onChange={(event) => updateDraft({ targetDate: event.target.value || null })}
            aria-label="Target date"
            className="field h-7 w-36"
          />
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-line pt-3">
          {controller.error && <p className="mr-auto text-danger">{controller.error}</p>}
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={controller.isSubmitting}>
            {controller.isSubmitting ? 'Creating…' : 'Create release'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
