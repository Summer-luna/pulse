import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import type { Project } from '@/domain/types'
import { errorMessage } from '@/lib/error-message'
import { type ProjectDraft, projectService } from '@/services/project-service'
import { useRefreshAll } from './use-refresh-all'

export function useCreateProjectController() {
  const refresh = useRefreshAll()
  const [draft, setDraft] = useState<ProjectDraft>(() => projectService.emptyDraft())
  const [keyEdited, setKeyEdited] = useState(false)

  const create = useMutation({ mutationFn: (value: ProjectDraft) => projectService.create(value), onSuccess: refresh })

  function updateDraft(patch: Partial<ProjectDraft>) {
    setDraft((current) => {
      const next = { ...current, ...patch }
      if (patch.name !== undefined && !keyEdited) {
        next.key = projectService.suggestKey(patch.name)
      }
      return next
    })
    if (patch.key !== undefined) {
      setKeyEdited(true)
    }
  }

  return {
    draft,
    updateDraft,
    submit: (): Promise<Project> => create.mutateAsync(draft),
    isSubmitting: create.isPending,
    error: errorMessage(create.error),
  }
}
