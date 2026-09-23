import { useState } from 'react'
import { useMembersController } from '@/controllers/use-users-controller'
import type { InvitedMember } from '@/domain/types'
import type { UserRole } from '@/graphql/generated/graphql'
import { Modal } from '@/ui/Modal'
import { Picker } from '@/ui/Picker'

interface Props {
  onClose: () => void
}

const ROLE_OPTIONS = [
  { value: 'GUEST' as UserRole, label: 'Guest', hint: 'Limited access' },
  { value: 'MEMBER' as UserRole, label: 'Member', hint: 'Full access with limited permissions' },
  { value: 'ADMIN' as UserRole, label: 'Admin', hint: 'Full administrative access' },
]

export function InviteMembersModal({ onClose }: Props) {
  const { invite, isInviting, inviteError } = useMembersController()
  const [emails, setEmails] = useState('')
  const [role, setRole] = useState<UserRole>('MEMBER')
  const [invited, setInvited] = useState<InvitedMember[] | null>(null)

  async function onSubmit() {
    const result = await invite({ emails, role })
    setInvited(result)
  }

  if (invited) {
    return (
      <Modal title="Invite to your workspace" onClose={onClose}>
        <div className="flex flex-col gap-3 p-4">
          <p className="text-dim">
            There's no email delivery in this app, so here are the temporary passwords — share them with each person yourself.
          </p>
          <div className="flex flex-col gap-2">
            {invited.map((entry) => (
              <div key={entry.user.id} className="flex items-center justify-between rounded-md border border-line bg-raised px-3 py-2">
                <span className="truncate">{entry.user.email}</span>
                <code className="rounded bg-line px-1.5 py-0.5 font-mono text-xs">{entry.temporaryPassword}</code>
              </div>
            ))}
          </div>
          <button type="button" className="btn btn-primary self-end" onClick={onClose}>
            Done
          </button>
        </div>
      </Modal>
    )
  }

  return (
    <Modal title="Invite to your workspace" onClose={onClose}>
      <div className="flex flex-col gap-3 p-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-dim">Email</span>
          <textarea
            autoFocus
            value={emails}
            onChange={(event) => setEmails(event.target.value)}
            placeholder="email@bu.edu, email2@bu.edu…"
            rows={2}
            className="field h-auto min-h-16 resize-y py-2 leading-relaxed"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-dim">Role</span>
          <Picker
            value={role}
            options={ROLE_OPTIONS}
            onChange={(next) => next && setRole(next)}
            placeholder="Role"
            className="w-full [&>button]:w-full [&>button]:justify-start"
          />
        </label>
        {inviteError && <p className="text-danger">{inviteError}</p>}
        <button type="button" className="btn btn-primary self-end" onClick={onSubmit} disabled={isInviting || !emails.trim()}>
          {isInviting ? 'Sending…' : 'Send invites'}
        </button>
      </div>
    </Modal>
  )
}
