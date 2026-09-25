import { FolderKanban, Lock, Plus, Search, Users } from 'lucide-react'
import { useState } from 'react'
import { CreateTeamModal } from '@/components/CreateTeamModal'
import { PageHeader } from '@/components/PageHeader'
import { useTeamsController } from '@/controllers/use-teams-controller'
import { keyColor } from '@/lib/key-color'
import { Avatar } from '@/ui/Avatar'
import { EmptyState } from '@/ui/EmptyState'
import { PageState } from '@/ui/PageState'

export function TeamsPage() {
  const { teams, isLoading, error, toggleMembership, removeTeam } = useTeamsController()
  const [search, setSearch] = useState('')
  const [creating, setCreating] = useState(false)

  const needle = search.trim().toLowerCase()
  const visible = needle ? teams.filter((team) => team.name.toLowerCase().includes(needle)) : teams

  async function onRemove(id: string, name: string) {
    if (window.confirm(`Delete team ${name}?`)) {
      await removeTeam(id)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        actions={
          <button className="btn btn-primary" onClick={() => setCreating(true)}>
            <Plus size={14} /> New team
          </button>
        }
      >
        <h1 className="font-medium">Teams</h1>
      </PageHeader>
      <div className="flex items-center gap-2 border-b border-line px-4 py-2">
        <label className="relative">
          <Search size={14} className="pointer-events-none absolute top-1/2 left-2 -translate-y-1/2 text-faint" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Find teams…"
            className="field h-7 w-64 pl-7"
          />
        </label>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <PageState isLoading={isLoading} error={error} />
        {!isLoading && visible.length === 0 && (
          <EmptyState
            title={teams.length === 0 ? 'No teams yet' : 'No matching teams'}
            description={teams.length === 0 ? 'Group your projects and members under a team.' : 'Try a different search.'}
          />
        )}
        {visible.length > 0 && (
          <>
            <div className="flex h-9 items-center gap-4 border-b border-line/60 px-4 text-xs text-dim">
              <span className="flex-1">Name</span>
              <span className="w-48 shrink-0">Description</span>
              <span className="w-24 shrink-0">Membership</span>
              <span className="w-28 shrink-0">Members</span>
              <span className="w-28 shrink-0">Active projects</span>
              <span className="w-16 shrink-0" />
            </div>
            {visible.map((team) => (
              <div key={team.id} className="flex h-11 items-center gap-4 border-b border-line/60 px-4">
                <span className="flex min-w-0 flex-1 items-center gap-2">
                  <span
                    className="flex size-5 shrink-0 items-center justify-center rounded text-[10px] font-semibold text-white"
                    style={{ background: keyColor(team.key) }}
                  >
                    <Users size={12} />
                  </span>
                  <span className="min-w-0 truncate font-medium">{team.name}</span>
                  <span className="shrink-0 font-mono text-xs text-faint">{team.key}</span>
                  {team.access === 'PRIVATE' && <Lock size={12} className="shrink-0 text-faint" title="Private to team members" />}
                </span>
                <span className="w-48 shrink-0 truncate text-xs text-dim">{team.description || '—'}</span>
                <span className="w-24 shrink-0">
                  <button
                    type="button"
                    className={`chip h-7 cursor-pointer text-xs ${team.isMember ? 'text-ink' : 'text-dim hover:text-ink'}`}
                    onClick={() => toggleMembership(team.id, team.isMember)}
                  >
                    {team.isMember ? 'Joined' : 'Join'}
                  </button>
                </span>
                <span className="flex w-28 shrink-0 items-center gap-1">
                  <span className="flex -space-x-1.5">
                    {team.members.slice(0, 3).map((member) => (
                      <Avatar key={member.id} name={member.name} color={member.color} size={18} />
                    ))}
                  </span>
                  {team.members.length > 3 && <span className="text-xs text-faint">+{team.members.length - 3}</span>}
                  {team.members.length === 0 && <span className="text-xs text-faint">0</span>}
                </span>
                <span className="flex w-28 shrink-0 items-center gap-1.5 text-xs text-dim">
                  <FolderKanban size={13} className="text-faint" />
                  {team.activeProjectCount}
                </span>
                <span className="w-16 shrink-0 text-right">
                  <button
                    type="button"
                    className="cursor-pointer text-xs text-faint hover:text-danger"
                    onClick={() => onRemove(team.id, team.name)}
                  >
                    Delete
                  </button>
                </span>
              </div>
            ))}
          </>
        )}
      </div>
      {creating && <CreateTeamModal onClose={() => setCreating(false)} />}
    </div>
  )
}
