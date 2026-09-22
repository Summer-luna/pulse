import { useQueryClient } from '@tanstack/react-query'

export function useRefreshAll(): () => Promise<void> {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries()
}
