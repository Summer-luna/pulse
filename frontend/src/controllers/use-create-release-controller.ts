import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import type { Release } from '@/domain/types'
import { errorMessage } from '@/lib/error-message'
import { releasePipelineService } from '@/services/release-pipeline-service'
import { type ReleaseDraft, releaseService } from '@/services/release-service'
import { queryKeys } from './query-keys'
import { useRefreshAll } from './use-refresh-all'

export function useCreateReleaseController(initialPipelineId: string) {
  const refresh = useRefreshAll()
  const pipelinesQuery = useQuery({ queryKey: queryKeys.releasePipelines(undefined), queryFn: () => releasePipelineService.list() })
  const pipelines = pipelinesQuery.data ?? []
  const [draft, setDraft] = useState<ReleaseDraft>(() => releaseService.emptyDraft(initialPipelineId))
  const create = useMutation({ mutationFn: (value: ReleaseDraft) => releaseService.create(value), onSuccess: refresh })

  const pipelineId = draft.pipelineId || pipelines[0]?.id || ''

  return {
    draft: { ...draft, pipelineId },
    pipelines,
    updateDraft: (patch: Partial<ReleaseDraft>) => setDraft((current) => ({ ...current, ...patch })),
    submit: (): Promise<Release> => create.mutateAsync({ ...draft, pipelineId }),
    isSubmitting: create.isPending,
    error: errorMessage(create.error),
  }
}
