import { useMutation, useQuery } from '@tanstack/react-query'
import type { UpdateProjectInput } from '@/graphql/generated/graphql'
import { errorMessage } from '@/lib/error-message'
import { projectService } from '@/services/project-service'
import { queryKeys } from './query-keys'
import { useRefreshAll } from './use-refresh-all'

export function useProjectsController() {
  const refresh = useRefreshAll()
  const query = useQuery({ queryKey: queryKeys.projects, queryFn: () => projectService.list() })
  const update = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateProjectInput }) => projectService.update(id, input),
    onSuccess: refresh,
  })

  return {
    projects: query.data ?? [],
    isLoading: query.isLoading,
    error: errorMessage(query.error),
    updateProject: (id: string, input: UpdateProjectInput) => update.mutate({ id, input }),
  }
}

export function useProjectController(id: string) {
  const refresh = useRefreshAll()
  const query = useQuery({ queryKey: queryKeys.project(id), queryFn: () => projectService.get(id) })

  const update = useMutation({
    mutationFn: (input: UpdateProjectInput) => projectService.update(id, input),
    onSuccess: refresh,
  })
  const remove = useMutation({ mutationFn: () => projectService.remove(id), onSuccess: refresh })

  return {
    project: query.data ?? null,
    isLoading: query.isLoading,
    error: errorMessage(query.error),
    updateProject: update.mutateAsync,
    deleteProject: remove.mutateAsync,
    mutationError: errorMessage(update.error ?? remove.error),
  }
}
