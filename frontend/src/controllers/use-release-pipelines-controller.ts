import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { errorMessage } from '@/lib/error-message'
import { releasePipelineService, type ReleasePipelineDraft } from '@/services/release-pipeline-service'
import { releaseService } from '@/services/release-service'
import { queryKeys } from './query-keys'
import { useRefreshAll } from './use-refresh-all'

export function useReleasePipelinesController(projectId?: string) {
  const query = useQuery({
    queryKey: queryKeys.releasePipelines(projectId),
    queryFn: () => releasePipelineService.list(projectId),
  })
  const [search, setSearch] = useState('')
  const pipelines = useMemo(() => releasePipelineService.filter(query.data ?? [], search), [query.data, search])

  return { pipelines, total: query.data?.length ?? 0, isLoading: query.isLoading, error: errorMessage(query.error), search, setSearch }
}

export function useReleasePipelineController(id: string) {
  const query = useQuery({ queryKey: queryKeys.releasePipeline(id), queryFn: () => releasePipelineService.get(id) })
  const pipeline = query.data ?? null

  const releasesQuery = useQuery({
    queryKey: queryKeys.releases(pipeline?.projectId),
    queryFn: () => releaseService.list(pipeline!.projectId),
    enabled: Boolean(pipeline),
  })
  const releases = useMemo(
    () => (releasesQuery.data ?? []).filter((release) => release.pipelineId === id),
    [releasesQuery.data, id],
  )

  return { pipeline, releases, isLoading: query.isLoading, error: errorMessage(query.error) }
}

export function useCreatePipelineController(initialProjectId = '') {
  const refresh = useRefreshAll()
  const [draft, setDraft] = useState<ReleasePipelineDraft>(() => releasePipelineService.emptyDraft(initialProjectId))
  const create = useMutation({
    mutationFn: (value: ReleasePipelineDraft) => releasePipelineService.create(value),
    onSuccess: refresh,
  })

  return {
    draft,
    updateDraft: (patch: Partial<ReleasePipelineDraft>) => setDraft((current) => ({ ...current, ...patch })),
    submit: () => create.mutateAsync(draft),
    isSubmitting: create.isPending,
    error: errorMessage(create.error),
  }
}
