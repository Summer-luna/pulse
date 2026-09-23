import { useMutation, useQuery } from '@tanstack/react-query'
import type { UserRole } from '@/graphql/generated/graphql'
import { errorMessage } from '@/lib/error-message'
import { userService } from '@/services/user-service'
import { queryKeys } from './query-keys'
import { useRefreshAll } from './use-refresh-all'

export function useUsersController() {
  const query = useQuery({ queryKey: queryKeys.users, queryFn: () => userService.list(), staleTime: 60_000 })
  return { users: query.data ?? [] }
}

export function useMembersController() {
  const refresh = useRefreshAll()
  const query = useQuery({ queryKey: queryKeys.users, queryFn: () => userService.list() })

  const invite = useMutation({
    mutationFn: ({ emails, role }: { emails: string; role: UserRole }) => userService.invite(emails, role),
    onSuccess: refresh,
  })
  const remove = useMutation({
    mutationFn: (id: string) => userService.remove(id),
    onSuccess: refresh,
  })

  return {
    members: query.data ?? [],
    isLoading: query.isLoading,
    error: errorMessage(query.error),
    invite: invite.mutateAsync,
    isInviting: invite.isPending,
    inviteError: errorMessage(invite.error),
    removeMember: remove.mutateAsync,
  }
}
