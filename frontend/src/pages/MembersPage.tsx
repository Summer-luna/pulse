import { UserPlus } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/app/auth-context'
import { InviteMembersModal } from '@/components/InviteMembersModal'
import { PageHeader } from '@/components/PageHeader'
import { useMembersController } from '@/controllers/use-users-controller'
import { USER_ROLE_LABEL } from '@/domain/user-role'
import { Avatar } from '@/ui/Avatar'
import { PageState } from '@/ui/PageState'

export function MembersPage() {
  const { members, isLoading, error, removeMember } = useMembersController()
  const { user: currentUser } = useAuth()
  const [search, setSearch] = useState('')
  const [inviting, setInviting] = useState(false)

  const needle = search.trim().toLowerCase()
  const visible = needle
    ? members.filter((member) => member.name.toLowerCase().includes(needle) || member.email.toLowerCase().includes(needle))
    : members

  async function onRemove(id: string, name: string) {
    if (window.confirm(`Remove ${name} from the workspace?`)) {
      await removeMember(id)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        actions={
          <button className="btn btn-primary" onClick={() => setInviting(true)}>
            <UserPlus size={14} /> Invite
          </button>
        }
      >
        <h1 className="font-medium">Members</h1>
      </PageHeader>
      <div className="flex items-center gap-2 border-b border-line px-4 py-2">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name or email"
          className="field h-7 w-64"
        />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <PageState isLoading={isLoading} error={error} />
        <div className="flex h-9 items-center gap-4 border-b border-line/60 px-4 text-xs text-dim">
          <span className="flex-1">Name</span>
          <span className="w-56 shrink-0">Email</span>
          <span className="w-20 shrink-0">Role</span>
          <span className="w-20 shrink-0">Joined</span>
          <span className="w-16 shrink-0" />
        </div>
        {visible.map((member) => (
          <div key={member.id} className="flex h-11 items-center gap-4 border-b border-line/60 px-4">
            <span className="flex min-w-0 flex-1 items-center gap-2">
              <Avatar name={member.name} color={member.color} size={20} />
              <span className="truncate">{member.name}</span>
            </span>
            <span className="w-56 shrink-0 truncate text-dim">{member.email}</span>
            <span className="w-20 shrink-0">
              <span className={`chip ${member.role === 'ADMIN' ? 'text-accent-strong' : 'text-dim'}`}>{USER_ROLE_LABEL[member.role]}</span>
            </span>
            <span className="w-20 shrink-0 text-xs text-dim">
              {new Date(member.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
            <span className="w-16 shrink-0 text-right">
              {member.id !== currentUser?.id && (
                <button type="button" className="text-xs text-faint hover:text-danger" onClick={() => onRemove(member.id, member.name)}>
                  Remove
                </button>
              )}
            </span>
          </div>
        ))}
      </div>
      {inviting && <InviteMembersModal onClose={() => setInviting(false)} />}
    </div>
  )
}
