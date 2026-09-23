import type { FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { useCreatePipelineController } from '@/controllers/use-release-pipelines-controller'
import { useProjectsController } from '@/controllers/use-projects-controller'
import { Modal } from '@/ui/Modal'
import { ProjectPicker } from './ProjectPicker'
import { ReleasePipelineTypePicker } from './ReleasePipelineTypePicker'

interface Props {
  onClose: () => void
}

export function CreatePipelineModal({ onClose }: Props) {
  const controller = useCreatePipelineController()
  const { projects } = useProjectsController()
  const navigate = useNavigate()
  const { draft, updateDraft } = controller

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    try {
      const pipeline = await controller.submit()
      onClose()
      navigate(`/release-pipelines/${pipeline.id}`)
    } catch {
      // 错误已通过 controller.error 展示
    }
  }

  return (
    <Modal title="New pipeline" onClose={onClose}>
      <form onSubmit={onSubmit} className="flex flex-col gap-3 p-4">
        <input
          autoFocus
          value={draft.name}
          onChange={(event) => updateDraft({ name: event.target.value })}
          placeholder="Pipeline name"
          maxLength={80}
          className="field"
        />
        <div className="flex flex-wrap items-center gap-2">
          <ProjectPicker value={draft.projectId} projects={projects} onChange={(projectId) => updateDraft({ projectId })} />
          <ReleasePipelineTypePicker value={draft.type} onChange={(type) => updateDraft({ type })} />
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-line pt-3">
          {controller.error && <p className="mr-auto text-danger">{controller.error}</p>}
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={controller.isSubmitting}>
            {controller.isSubmitting ? 'Creating…' : 'Create pipeline'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
