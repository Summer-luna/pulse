import { ChevronLeft, Database, Users, Wrench } from 'lucide-react'
import { NavLink, Outlet } from 'react-router'

const navClass = ({ isActive }: { isActive: boolean }) =>
  `flex h-7 items-center gap-2 rounded-md px-2 text-dim transition-colors hover:bg-hover hover:text-ink ${isActive ? 'bg-hover text-ink' : ''}`

export function SettingsLayout() {
  return (
    <div className="flex h-full">
      <aside className="flex w-60 shrink-0 flex-col gap-4 border-r border-line bg-panel p-3">
        <NavLink to="/issues" className="flex items-center gap-1.5 px-1 text-dim hover:text-ink">
          <ChevronLeft size={14} /> Back to app
        </NavLink>
        <nav className="flex flex-col gap-0.5">
          <div className="mb-1 px-2 text-xs font-medium text-faint">Administration</div>
          <NavLink to="/settings" end className={navClass}>
            <Wrench size={15} /> Workspace
          </NavLink>
          <NavLink to="/settings/members" className={navClass}>
            <Users size={15} /> Members
          </NavLink>
          <NavLink to="/settings/data" className={navClass}>
            <Database size={15} /> Data
          </NavLink>
        </nav>
      </aside>
      <main className="min-w-0 flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  )
}
