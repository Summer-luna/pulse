import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import type { Issue } from '@/domain/types'
import { errorMessage } from '@/lib/error-message'
import { type IssueDraft, issueService } from '@/services/issue-service'
import { releaseService } from '@/services/release-service'
import { queryKeys } from './query-keys'
import { useProjectsController } from './use-projects-controller'
import { useRefreshAll } from './use-refresh-all'
import { useUsersController } from './use-users-controller'

export function useCreateIssueController(defaults: Partial<IssueDraft>) {
  const refresh = useRefreshAll()
  const { projects } = useProjectsController()
  const { users } = useUsersController()
  const [draft, setDraft] = useState<IssueDraft>(() => issueService.emptyDraft(defaults.projectId ?? '', defaults))

  const projectId = draft.projectId || projects[0]?.id || ''
  const releases = useQuery({
    queryKey: queryKeys.releases(projectId),
    queryFn: () => releaseService.list(projectId),
    enabled: Boolean(projectId),
  })

  const create = useMutation({ mutationFn: (value: IssueDraft) => issueService.create(value), onSuccess: refresh })

  function updateDraft(patch: Partial<IssueDraft>) {
    setDraft((current) => ({ ...current, ...patch, ...(patch.projectId ? { releaseId: null } : {}) }))
  }

  return {
    draft: { ...draft, projectId },
    updateDraft,
    projects,
    users,
    releases: (releases.data ?? []).filter((release) => release.status !== 'COMPLETED' && release.status !== 'CANCELED'),
    submit: (): Promise<Issue> => create.mutateAsync({ ...draft, projectId }),
    isSubmitting: create.isPending,
    error: errorMessage(create.error),
  }
}
