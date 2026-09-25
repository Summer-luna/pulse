import { Lock, Plus } from 'lucide-react'
import { Link } from 'react-router'
import { useDialogs } from '@/app/dialogs-context'
import { PageHeader } from '@/components/PageHeader'
import { ProjectBadge } from '@/components/ProjectBadge'
import { ProjectPriorityPicker } from '@/components/ProjectPriorityPicker'
import { ProjectStatusPicker } from '@/components/ProjectStatusPicker'
import { UserPicker } from '@/components/UserPicker'
import { useProjectsController } from '@/controllers/use-projects-controller'
import { PROJECT_STATUS_COLOR } from '@/domain/project-status'
import { progressPercent } from '@/lib/progress'
import { EmptyState } from '@/ui/EmptyState'
import { PageState } from '@/ui/PageState'
import { ProgressRing } from '@/ui/ProgressRing'

export function ProjectsPage() {
  const { projects, isLoading, error, updateProject } = useProjectsController()
  const dialogs = useDialogs()

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        actions={
          <button className="btn btn-primary" onClick={dialogs.openCreateProject}>
            <Plus size={14} /> New project
          </button>
        }
      >
        <h1 className="font-medium">Projects</h1>
      </PageHeader>
      <div className="min-h-0 flex-1 overflow-auto">
        <PageState isLoading={isLoading} error={error} />
        {!isLoading && projects.length === 0 && (
          <EmptyState title="No projects yet" description="Projects group issues and releases together." />
        )}
        {!isLoading && projects.length > 0 && (
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="sticky top-0 z-10 border-b border-line bg-panel text-xs text-faint">
                <th className="px-4 py-2 font-medium">Name</th>
                <th className="w-16 px-2 py-2 font-medium">Key</th>
                <th className="w-32 px-2 py-2 font-medium">Priority</th>
                <th className="w-40 px-2 py-2 font-medium">Lead</th>
                <th className="w-28 px-2 py-2 font-medium">Target date</th>
                <th className="w-16 px-2 py-2 text-right font-medium">Issues</th>
                <th className="w-44 px-2 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => {
                const percent = progressPercent(project.progress)
                return (
                  <tr key={project.id} className="border-b border-line/60 hover:bg-hover">
                    <td className="px-4 py-1.5">
                      <Link
                        to={`/projects/${project.id}/overview`}
                        className="flex min-w-0 items-center gap-2 rounded py-1 outline-none hover:underline focus-visible:ring-1 focus-visible:ring-accent"
                      >
                        <ProjectBadge projectKey={project.key} size={20} />
                        <span className="truncate font-medium">{project.name}</span>
                        {project.visibility === 'PRIVATE' && (
                          <Lock size={12} className="shrink-0 text-faint" aria-label="Private to members">
                            <title>Private to members</title>
                          </Lock>
                        )}
                      </Link>
                    </td>
                    <td className="px-2 py-1.5 font-mono text-xs text-faint">{project.key}</td>
                    <td className="px-2 py-1.5">
                      <ProjectPriorityPicker
                        value={project.priority}
                        onChange={(priority) => updateProject(project.id, { priority })}
                      />
                    </td>
                    <td className="px-2 py-1.5">
                      <UserPicker
                        value={project.leadId}
                        onChange={(leadId) => updateProject(project.id, { leadId })}
                        placeholder="Lead"
                        noneLabel="No lead"
                      />
                    </td>
                    <td className="px-2 py-1.5">
                      <input
                        type="date"
                        value={project.targetDate ?? ''}
                        onChange={(event) => updateProject(project.id, { targetDate: event.target.value || null })}
                        aria-label="Target date"
                        className="h-7 w-full rounded-md bg-transparent px-1 text-xs text-dim outline-none hover:bg-hover focus:bg-raised focus:text-ink [color-scheme:dark]"
                      />
                    </td>
                    <td className="px-2 py-1.5 text-right">
                      <Link
                        to={`/projects/${project.id}/issues`}
                        className="text-xs tabular-nums text-dim outline-none hover:text-ink hover:underline focus-visible:ring-1 focus-visible:ring-accent"
                      >
                        {project.progress.total}
                      </Link>
                    </td>
                    <td className="px-2 py-1.5">
                      <span className="inline-flex items-center gap-2">
                        <ProgressRing percent={percent} color={PROJECT_STATUS_COLOR[project.status]} />
                        <ProjectStatusPicker value={project.status} onChange={(status) => updateProject(project.id, { status })} />
                        <span className="text-xs tabular-nums text-faint">{percent}%</span>
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
