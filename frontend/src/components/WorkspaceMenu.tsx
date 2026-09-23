import { ChevronDown, LogOut, Settings, Users } from 'lucide-react'
import { type ReactNode, useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router'
import { useAuth } from '@/app/auth-context'
import { useDropdownPanel } from '@/ui/use-dropdown-panel'

export function WorkspaceMenu() {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const { triggerRef, panelRef, position } = useDropdownPanel(open, 'left', close)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const isAdmin = user?.role === 'ADMIN'

  function go(path: string) {
    close()
    navigate(path)
  }

  return (
    <div className="min-w-0 flex-1">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full min-w-0 cursor-pointer items-center gap-1.5 rounded-md px-1 py-0.5 font-medium hover:bg-hover"
      >
        <span className="flex size-5 shrink-0 items-center justify-center rounded bg-accent text-xs font-bold text-white">L</span>
        <span className="min-w-0 flex-1 truncate text-left">Linear Clone</span>
        <ChevronDown size={14} className="shrink-0 text-faint" />
      </button>

      {open &&
        position &&
        createPortal(
          <div
            ref={panelRef}
            style={{ position: 'fixed', left: position.left, width: position.width, top: position.top, bottom: position.bottom }}
            className="z-50 rounded-lg border border-line bg-raised py-1 shadow-xl"
          >
            {isAdmin ? (
              <>
                <MenuItem icon={<Settings size={14} />} label="Settings" onClick={() => go('/settings')} />
                <MenuItem icon={<Users size={14} />} label="Invite and manage members" onClick={() => go('/settings/members')} />
                <div className="my-1 border-t border-line" />
              </>
            ) : (
              <p className="px-3 py-2 text-xs text-faint">Only workspace admins can manage settings and members.</p>
            )}
            <MenuItem icon={<LogOut size={14} />} label="Log out" onClick={logout} />
          </div>,
          document.body,
        )}
    </div>
  )
}

function MenuItem({ icon, label, onClick }: { icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-left text-[13px] hover:bg-hover"
    >
      {icon}
      {label}
    </button>
  )
}
