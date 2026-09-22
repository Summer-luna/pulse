import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import type { UpdateReleaseInput } from '@/graphql/generated/graphql'
import { errorMessage } from '@/lib/error-message'
import { issueService } from '@/services/issue-service'
import { releaseService } from '@/services/release-service'
import { queryKeys } from './query-keys'
import { useRefreshAll } from './use-refresh-all'

export function useReleasesController(projectId?: string) {
  const query = useQuery({ queryKey: queryKeys.releases(projectId), queryFn: () => releaseService.list(projectId) })
  const groups = useMemo(() => releaseService.groupByProject(query.data ?? []), [query.data])
  return { releases: query.data ?? [], groups, isLoading: query.isLoading, error: errorMessage(query.error) }
}

export function useReleaseController(id: string) {
  const refresh = useRefreshAll()
  const query = useQuery({ queryKey: queryKeys.release(id), queryFn: () => releaseService.get(id) })
  const release = query.data ?? null

  const releaseIssues = useQuery({
    queryKey: queryKeys.issues({ releaseId: id }),
    queryFn: () => issueService.list({ releaseId: id }),
  })
  const projectIssues = useQuery({
    queryKey: queryKeys.issues({ projectId: release?.projectId }),
    queryFn: () => issueService.list({ projectId: release?.projectId }),
    enabled: Boolean(release),
  })

  const assignableIssues = useMemo(
    () => (release ? issueService.sort(releaseService.assignableIssues(release, projectIssues.data ?? [])) : []),
    [release, projectIssues.data],
  )

  const update = useMutation({ mutationFn: (input: UpdateReleaseInput) => releaseService.update(id, input), onSuccess: refresh })
  const remove = useMutation({ mutationFn: () => releaseService.remove(id), onSuccess: refresh })
  const add = useMutation({ mutationFn: (issueId: string) => releaseService.addIssue(id, issueId), onSuccess: refresh })
  const detach = useMutation({ mutationFn: (issueId: string) => releaseService.removeIssue(issueId), onSuccess: refresh })

  return {
    release,
    issues: releaseIssues.data ?? [],
    assignableIssues,
    isLoading: query.isLoading,
    error: errorMessage(query.error),
    mutationError: errorMessage(update.error ?? remove.error ?? add.error ?? detach.error),
    updateRelease: update.mutateAsync,
    deleteRelease: remove.mutateAsync,
    addIssue: add.mutateAsync,
    removeIssue: detach.mutateAsync,
  }
}
