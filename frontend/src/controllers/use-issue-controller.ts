import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import type { UpdateIssueInput } from '@/graphql/generated/graphql'
import { errorMessage } from '@/lib/error-message'
import { commentService } from '@/services/comment-service'
import { issueService } from '@/services/issue-service'
import { releaseService } from '@/services/release-service'
import { queryKeys } from './query-keys'
import { useRefreshAll } from './use-refresh-all'

export function useIssueController(identifier: string) {
  const refresh = useRefreshAll()
  const detail = useQuery({ queryKey: queryKeys.issue(identifier), queryFn: () => issueService.getDetail(identifier) })
  const issue = detail.data ?? null
  const projectId = issue?.projectId

  const projectIssues = useQuery({
    queryKey: queryKeys.issues({ projectId }),
    queryFn: () => issueService.list({ projectId }),
    enabled: Boolean(projectId),
  })
  const releases = useQuery({
    queryKey: queryKeys.releases(projectId),
    queryFn: () => releaseService.list(projectId),
    enabled: Boolean(projectId),
  })

  const parentCandidates = useMemo(
    () => (issue ? issueService.parentCandidates(issue, projectIssues.data ?? []) : []),
    [issue, projectIssues.data],
  )

  const update = useMutation({
    mutationFn: (input: UpdateIssueInput) => issueService.update(issue!.id, input),
    onSuccess: refresh,
  })
  const updateOther = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateIssueInput }) => issueService.update(id, input),
    onSuccess: refresh,
  })
  const remove = useMutation({ mutationFn: () => issueService.remove(issue!.id), onSuccess: refresh })
  const addSubIssue = useMutation({
    mutationFn: (title: string) => issueService.createSubIssue(issue!, title),
    onSuccess: refresh,
  })
  const addComment = useMutation({
    mutationFn: (body: string) => commentService.create(issue!.id, body),
    onSuccess: refresh,
  })
  const removeComment = useMutation({
    mutationFn: (id: string) => commentService.remove(id),
    onSuccess: refresh,
  })

  return {
    issue,
    isLoading: detail.isLoading,
    error: errorMessage(detail.error),
    mutationError: errorMessage(
      update.error ?? updateOther.error ?? remove.error ?? addSubIssue.error ?? addComment.error ?? removeComment.error,
    ),
    releases: releases.data ?? [],
    parentCandidates,
    updateIssue: update.mutateAsync,
    updateSubIssue: (id: string, input: UpdateIssueInput) => updateOther.mutate({ id, input }),
    deleteIssue: remove.mutateAsync,
    createSubIssue: addSubIssue.mutateAsync,
    addComment: addComment.mutateAsync,
    isAddingComment: addComment.isPending,
    removeComment: removeComment.mutateAsync,
  }
}
