import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import type { Release } from '@/domain/types'
import { errorMessage } from '@/lib/error-message'
import { type ReleaseDraft, releaseService } from '@/services/release-service'
import { useProjectsController } from './use-projects-controller'
import { useRefreshAll } from './use-refresh-all'

export function useCreateReleaseController(initialProjectId: string) {
  const refresh = useRefreshAll()
  const { projects } = useProjectsController()
  const [draft, setDraft] = useState<ReleaseDraft>(() => releaseService.emptyDraft(initialProjectId))
  const create = useMutation({ mutationFn: (value: ReleaseDraft) => releaseService.create(value), onSuccess: refresh })

  const projectId = draft.projectId || projects[0]?.id || ''

  return {
    draft: { ...draft, projectId },
    projects,
    updateDraft: (patch: Partial<ReleaseDraft>) => setDraft((current) => ({ ...current, ...patch })),
    submit: (): Promise<Release> => create.mutateAsync({ ...draft, projectId }),
    isSubmitting: create.isPending,
    error: errorMessage(create.error),
  }
}
