import { Check, ChevronDown } from 'lucide-react'
import { useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import { USER_ROLE_LABEL } from '@/domain/user-role'
import type { UserRole } from '@/graphql/generated/graphql'
import { useDropdownPanel } from '@/ui/use-dropdown-panel'

interface Props {
  value: UserRole
  onChange: (role: UserRole) => void
}

const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  GUEST: 'Limited access to teams',
  MEMBER: 'Full access with limited permissions',
  ADMIN: 'Full administrative access',
}

const ROLES: UserRole[] = ['GUEST', 'MEMBER', 'ADMIN']
const PANEL_WIDTH = 288

export function RolePicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const { triggerRef, panelRef, position } = useDropdownPanel(open, 'left', close)

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="field flex cursor-pointer items-center justify-between gap-2"
      >
        <span>
          <span className="font-medium">{USER_ROLE_LABEL[value]}</span>
          <span className="text-dim"> - {ROLE_DESCRIPTIONS[value]}</span>
        </span>
        <ChevronDown size={14} className="shrink-0 text-faint" />
      </button>

      {open &&
        position &&
        createPortal(
          <div
            ref={panelRef}
            style={{ position: 'fixed', left: position.left, width: PANEL_WIDTH, top: position.top, bottom: position.bottom }}
            className="z-50 rounded-lg border border-line bg-raised py-1 shadow-xl"
          >
            {ROLES.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => {
                  onChange(role)
                  close()
                }}
                className="flex w-full cursor-pointer items-start justify-between gap-2 px-3 py-1.5 text-left text-[13px] hover:bg-hover"
              >
                <span className="min-w-0">
                  <span className="font-medium">{USER_ROLE_LABEL[role]}</span>
                  <span className="text-dim"> - {ROLE_DESCRIPTIONS[role]}</span>
                </span>
                {role === value && <Check size={14} className="mt-0.5 shrink-0 text-dim" />}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </div>
  )
}
