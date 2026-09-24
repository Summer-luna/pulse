import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import type { UpdateRequestInput } from '@/graphql/generated/graphql'
import { errorMessage } from '@/lib/error-message'
import { type RequestDraft, requestService } from '@/services/request-service'
import { queryKeys } from './query-keys'
import { useRefreshAll } from './use-refresh-all'

export function useRequestsController(projectId?: string) {
  const refresh = useRefreshAll()
  const query = useQuery({ queryKey: queryKeys.requests(projectId), queryFn: () => requestService.list(projectId) })

  const update = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateRequestInput }) => requestService.update(id, input),
    onSuccess: refresh,
  })
  const remove = useMutation({ mutationFn: (id: string) => requestService.remove(id), onSuccess: refresh })
  const convert = useMutation({
    mutationFn: ({ id, issueId }: { id: string; issueId: string }) => requestService.convertToIssue(id, issueId),
    onSuccess: refresh,
  })

  return {
    requests: query.data ?? [],
    isLoading: query.isLoading,
    error: errorMessage(query.error),
    updateRequest: (id: string, input: UpdateRequestInput) => update.mutate({ id, input }),
    removeRequest: remove.mutateAsync,
    convertRequest: (id: string, issueId: string) => convert.mutateAsync({ id, issueId }),
  }
}

export function useCreateRequestController(projectId: string) {
  const refresh = useRefreshAll()
  const [draft, setDraft] = useState<RequestDraft>(() => requestService.emptyDraft(projectId))
  const create = useMutation({ mutationFn: (value: RequestDraft) => requestService.create(value), onSuccess: refresh })

  return {
    draft,
    updateDraft: (patch: Partial<RequestDraft>) => setDraft((current) => ({ ...current, ...patch })),
    submit: () => create.mutateAsync(draft),
    isSubmitting: create.isPending,
    error: errorMessage(create.error),
  }
}
