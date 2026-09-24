import { ChevronRight, FolderKanban, Search, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useProjectsController } from '@/controllers/use-projects-controller'
import type { Issue } from '@/domain/types'
import { ProjectBadge } from './ProjectBadge'

interface Props {
  issue: Issue
  position: { x: number; y: number }
  onMoveProject: (projectId: string) => void
  onDelete: () => void
  onClose: () => void
}

const MENU_WIDTH = 240

export function IssueContextMenu({ issue, position, onMoveProject, onDelete, onClose }: Props) {
  const [view, setView] = useState<'root' | 'project'>('root')
  const [search, setSearch] = useState('')
  const { projects } = useProjectsController()

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!(event.target as HTMLElement).closest('[data-issue-context-menu]')) {
        onClose()
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('mousedown', onPointerDown, true)
    document.addEventListener('keydown', onKeyDown, true)
    return () => {
      document.removeEventListener('mousedown', onPointerDown, true)
      document.removeEventListener('keydown', onKeyDown, true)
    }
  }, [onClose])

  const left = Math.min(position.x, window.innerWidth - MENU_WIDTH - 8)
  const needle = search.trim().toLowerCase()
  const visibleProjects = needle
    ? projects.filter((project) => project.name.toLowerCase().includes(needle))
    : projects.filter((project) => project.id !== issue.projectId)

  return createPortal(
    <div
      data-issue-context-menu
      style={{ position: 'fixed', left, top: position.y, width: MENU_WIDTH }}
      className="z-50 rounded-lg border border-line bg-raised py-1 shadow-xl"
      onClick={(event) => event.stopPropagation()}
    >
      {view === 'root' ? (
        <>
          <button
            type="button"
            onClick={() => setView('project')}
            className="flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-left text-[13px] hover:bg-hover"
          >
            <FolderKanban size={14} />
            <span className="flex-1">Move to project</span>
            <ChevronRight size={14} className="text-faint" />
          </button>
          <div className="my-1 border-t border-line" />
          <button
            type="button"
            onClick={onDelete}
            className="flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-left text-[13px] text-danger hover:bg-hover"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </>
      ) : (
        <>
          <label className="relative mx-2 mb-1 block">
            <Search size={13} className="pointer-events-none absolute top-1/2 left-2 -translate-y-1/2 text-faint" />
            <input
              autoFocus
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Move to project…"
              className="h-7 w-[calc(100%-0.5rem)] rounded border border-line bg-canvas pl-7 text-xs outline-none focus:border-accent"
            />
          </label>
          <ul className="max-h-64 overflow-y-auto">
            {visibleProjects.map((project) => (
              <li key={project.id}>
                <button
                  type="button"
                  onClick={() => onMoveProject(project.id)}
                  className="flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-left text-[13px] hover:bg-hover"
                >
                  <ProjectBadge projectKey={project.key} size={16} />
                  <span className="truncate">{project.name}</span>
                </button>
              </li>
            ))}
            {visibleProjects.length === 0 && <li className="px-3 py-2 text-xs text-faint">No matching projects</li>}
          </ul>
        </>
      )}
    </div>,
    document.body,
  )
}
