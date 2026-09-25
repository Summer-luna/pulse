import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { errorMessage } from '@/lib/error-message'
import { type TeamDraft, teamService } from '@/services/team-service'
import { queryKeys } from './query-keys'
import { useRefreshAll } from './use-refresh-all'

export function useTeamsController() {
  const refresh = useRefreshAll()
  const query = useQuery({ queryKey: queryKeys.teams, queryFn: () => teamService.list() })

  const remove = useMutation({ mutationFn: (id: string) => teamService.remove(id), onSuccess: refresh })
  const toggleMembership = useMutation({
    mutationFn: ({ id, isMember }: { id: string; isMember: boolean }) => (isMember ? teamService.leave(id) : teamService.join(id)),
    onSuccess: refresh,
  })

  return {
    teams: query.data ?? [],
    isLoading: query.isLoading,
    error: errorMessage(query.error),
    removeTeam: remove.mutateAsync,
    toggleMembership: (id: string, isMember: boolean) => toggleMembership.mutateAsync({ id, isMember }),
  }
}

export function useCreateTeamController() {
  const refresh = useRefreshAll()
  const [draft, setDraft] = useState<TeamDraft>(() => teamService.emptyDraft())
  const [keyEdited, setKeyEdited] = useState(false)
  const create = useMutation({ mutationFn: (value: TeamDraft) => teamService.create(value), onSuccess: refresh })

  function updateDraft(patch: Partial<TeamDraft>) {
    setDraft((current) => {
      const next = { ...current, ...patch }
      if (patch.name !== undefined && !keyEdited) {
        next.key = teamService.suggestKey(patch.name)
      }
      return next
    })
    if (patch.key !== undefined) {
      setKeyEdited(true)
    }
  }

  return {
    draft,
    updateDraft,
    submit: () => create.mutateAsync(draft),
    isSubmitting: create.isPending,
    error: errorMessage(create.error),
  }
}
