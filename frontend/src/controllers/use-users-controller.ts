import { useQuery } from '@tanstack/react-query'
import { userService } from '@/services/user-service'
import { queryKeys } from './query-keys'

export function useUsersController() {
  const query = useQuery({ queryKey: queryKeys.users, queryFn: () => userService.list(), staleTime: 60_000 })
  return { users: query.data ?? [] }
}
