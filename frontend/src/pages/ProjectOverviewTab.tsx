import { useNavigate, useParams } from 'react-router'
import { MembersPicker } from '@/components/MembersPicker'
import { ProjectPriorityPicker } from '@/components/ProjectPriorityPicker'
import { ProjectStatusPicker } from '@/components/ProjectStatusPicker'
import { UserPicker } from '@/components/UserPicker'
import { useProjectController } from '@/controllers/use-projects-controller'
import { EditableText } from '@/ui/EditableText'
import { PageState } from '@/ui/PageState'
import { ProgressBar } from '@/ui/ProgressBar'

export function ProjectOverviewTab() {
  const { projectId = '' } = useParams()
  const navigate = useNavigate()
  const controller = useProjectController(projectId)
  const { project } = controller

  if (!project) {
    return <PageState isLoading={controller.isLoading} error={controller.error} notFound />
  }

  async function onDelete() {
    if (window.confirm(`Delete ${project!.name}? All of its issues and releases will be deleted too.`)) {
      await controller.deleteProject()
      navigate('/projects')
    }
  }

  return (
    <div className="mx-auto flex h-full max-w-3xl flex-col gap-6 overflow-y-auto p-6">
      <div className="flex flex-col gap-2">
        <EditableText
          value={project.name}
          onSave={(name) => controller.updateProject({ name })}
          maxLength={80}
          className="text-xl font-semibold"
        />
        <EditableText
          multiline
          allowEmpty
          value={project.description}
          onSave={(description) => controller.updateProject({ description })}
          placeholder="Add a description…"
        />
      </div>

      <section className="grid grid-cols-[8rem_1fr] items-center gap-x-4 gap-y-3 rounded-xl border border-line bg-panel p-4">
        <span className="text-dim">Status</span>
        <div>
          <ProjectStatusPicker value={project.status} onChange={(status) => controller.updateProject({ status })} />
        </div>
        <span className="text-dim">Priority</span>
        <div>
          <ProjectPriorityPicker value={project.priority} onChange={(priority) => controller.updateProject({ priority })} />
        </div>
        <span className="text-dim">Lead</span>
        <div>
          <UserPicker
            value={project.leadId}
            onChange={(leadId) => controller.updateProject({ leadId })}
            placeholder="No lead"
            noneLabel="No lead"
          />
        </div>
        <span className="text-dim">Members</span>
        <div>
          <MembersPicker
            values={project.members.map((member) => member.id)}
            onChange={(memberIds) => controller.updateProject({ memberIds })}
          />
        </div>
        <span className="text-dim">Start date</span>
        <div>
          <input
            type="date"
            value={project.startDate ?? ''}
            onChange={(event) => controller.updateProject({ startDate: event.target.value || null })}
            className="field h-7 w-40"
          />
        </div>
        <span className="text-dim">Target date</span>
        <div>
          <input
            type="date"
            value={project.targetDate ?? ''}
            onChange={(event) => controller.updateProject({ targetDate: event.target.value || null })}
            className="field h-7 w-40"
          />
        </div>
        <span className="text-dim">Progress</span>
        <div className="flex items-center gap-3">
          <ProgressBar progress={project.progress} className="max-w-64 flex-1" />
          <span className="text-xs text-dim">
            {project.progress.completed} of {project.progress.total} issues done
          </span>
        </div>
      </section>

      {controller.mutationError && <p className="text-danger">{controller.mutationError}</p>}

      <div>
        <button className="btn btn-danger" onClick={onDelete}>
          Delete project
        </button>
      </div>
    </div>
  )
}
