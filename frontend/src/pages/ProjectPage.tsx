import { Plus } from 'lucide-react'
import { NavLink, Outlet, useParams } from 'react-router'
import { useDialogs } from '@/app/dialogs-context'
import { PageHeader } from '@/components/PageHeader'
import { ProjectBadge } from '@/components/ProjectBadge'
import { useProjectController } from '@/controllers/use-projects-controller'
import { PageState } from '@/ui/PageState'

const tabClass = ({ isActive }: { isActive: boolean }) =>
  `flex h-7 items-center rounded-md px-2.5 text-dim transition-colors hover:text-ink ${isActive ? 'bg-hover text-ink' : ''}`

export function ProjectPage() {
  const { projectId = '' } = useParams()
  const { project, isLoading, error } = useProjectController(projectId)
  const dialogs = useDialogs()

  if (!project) {
    return <PageState isLoading={isLoading} error={error} notFound />
  }

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        actions={
          <button className="btn btn-primary" onClick={() => dialogs.openCreateIssue({ projectId: project.id })}>
            <Plus size={14} /> New issue
          </button>
        }
      >
        <ProjectBadge projectKey={project.key} size={20} />
        <h1 className="truncate font-medium">{project.name}</h1>
        <span className="font-mono text-xs text-faint">{project.key}</span>
        <nav className="ml-4 flex gap-1">
          <NavLink to="overview" className={tabClass}>
            Overview
          </NavLink>
          <NavLink to="issues" className={tabClass}>
            Issues
          </NavLink>
          <NavLink to="releases" className={tabClass}>
            Releases
          </NavLink>
          <NavLink to="requests" className={tabClass}>
            Requests
          </NavLink>
        </nav>
      </PageHeader>
      <div className="min-h-0 flex-1">
        <Outlet />
      </div>
    </div>
  )
}
