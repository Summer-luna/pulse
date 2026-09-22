import { useQuery } from '@tanstack/react-query'
import { labelService } from '@/services/label-service'
import { queryKeys } from './query-keys'

export function useLabelsController() {
  const query = useQuery({ queryKey: queryKeys.labels, queryFn: () => labelService.list(), staleTime: 60_000 })
  return { labels: query.data ?? [], isLoading: query.isLoading }
}
