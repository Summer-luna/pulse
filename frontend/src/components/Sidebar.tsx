import { CircleDot, FolderKanban, LogOut, Package, Plus, SquarePen } from 'lucide-react'
import { NavLink } from 'react-router'
import { useAuth } from '@/app/auth-context'
import { useDialogs } from '@/app/dialogs-context'
import { useProjectsController } from '@/controllers/use-projects-controller'
import { Avatar } from '@/ui/Avatar'
import { ProjectBadge } from './ProjectBadge'

const navClass = ({ isActive }: { isActive: boolean }) =>
  `flex h-7 items-center gap-2 rounded-md px-2 text-dim transition-colors hover:bg-hover hover:text-ink ${isActive ? 'bg-hover text-ink' : ''}`

export function Sidebar() {
  const { projects } = useProjectsController()
  const dialogs = useDialogs()
  const { user, logout } = useAuth()

  return (
    <aside className="flex w-60 shrink-0 flex-col gap-4 border-r border-line bg-panel p-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 font-medium">
          <span className="flex size-5 items-center justify-center rounded bg-accent text-xs font-bold text-white">L</span>
          Linear Clone
        </div>
        <button className="btn btn-ghost size-7 p-0" onClick={() => dialogs.openCreateIssue()} title="New issue (C)" aria-label="New issue">
          <SquarePen size={15} />
        </button>
      </div>

      <nav className="flex flex-col gap-0.5">
        <NavLink to="/issues" end={false} className={navClass}>
          <CircleDot size={15} /> All issues
        </NavLink>
        <NavLink to="/projects" end className={navClass}>
          <FolderKanban size={15} /> Projects
        </NavLink>
        <NavLink to="/releases" className={navClass}>
          <Package size={15} /> Releases
        </NavLink>
      </nav>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mb-1 flex items-center justify-between px-2 text-xs font-medium text-faint">
          Your projects
          <button className="cursor-pointer rounded p-0.5 hover:bg-hover hover:text-ink" onClick={dialogs.openCreateProject} aria-label="New project">
            <Plus size={13} />
          </button>
        </div>
        <div className="flex flex-col gap-0.5">
          {projects.map((project) => (
            <NavLink key={project.id} to={`/projects/${project.id}/issues`} className={navClass}>
              <ProjectBadge projectKey={project.key} size={16} />
              <span className="truncate">{project.name}</span>
            </NavLink>
          ))}
        </div>
      </div>

      {user && (
        <div className="flex items-center gap-2 border-t border-line px-1 pt-3">
          <Avatar name={user.name} color={user.color} size={22} />
          <span className="min-w-0 flex-1 truncate text-dim">{user.name}</span>
          <button className="btn btn-ghost size-7 shrink-0 p-0" onClick={logout} title="Sign out" aria-label="Sign out">
            <LogOut size={14} />
          </button>
        </div>
      )}
    </aside>
  )
}
