import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import type { Issue } from '@/domain/types'
import type { IssuesFilterInput, UpdateIssueInput } from '@/graphql/generated/graphql'
import { errorMessage } from '@/lib/error-message'
import { issueService } from '@/services/issue-service'
import { queryKeys } from './query-keys'
import { useRefreshAll } from './use-refresh-all'

export type IssuesViewMode = 'list' | 'board'

const VIEW_STORAGE_KEY = 'linear.issues.view'

function readStoredView(): IssuesViewMode {
  try {
    return localStorage.getItem(VIEW_STORAGE_KEY) === 'board' ? 'board' : 'list'
  } catch {
    return 'list'
  }
}

export function useIssuesViewController(scope: IssuesFilterInput) {
  const queryClient = useQueryClient()
  const refresh = useRefreshAll()
  const [view, setViewState] = useState<IssuesViewMode>(readStoredView)
  const [search, setSearch] = useState('')
  const [hideSubIssues, setHideSubIssues] = useState(false)

  const query = useQuery({ queryKey: queryKeys.issues(scope), queryFn: () => issueService.list(scope) })

  const sections = useMemo(() => {
    const visible = issueService.filter(query.data ?? [], { search, hideSubIssues })
    return issueService.groupByStatus(visible, { includeEmpty: view === 'board' })
  }, [query.data, search, hideSubIssues, view])

  const update = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateIssueInput }) => issueService.update(id, input),
    onMutate: async ({ id, input }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.issuesRoot })
      const previous = queryClient.getQueriesData<Issue[]>({ queryKey: queryKeys.issuesRoot })
      queryClient.setQueriesData<Issue[]>({ queryKey: queryKeys.issuesRoot }, (issues) =>
        issues?.map((issue) => (issue.id === id ? issueService.applyLocalPatch(issue, input) : issue)),
      )
      return { previous }
    },
    onError: (_error, _variables, context) => {
      context?.previous.forEach(([key, data]) => queryClient.setQueryData(key, data))
    },
    onSettled: refresh,
  })

  function setView(next: IssuesViewMode) {
    setViewState(next)
    try {
      localStorage.setItem(VIEW_STORAGE_KEY, next)
    } catch {
      // 存储不可用时只在本次会话内保留视图选择
    }
  }

  return {
    sections,
    total: query.data?.length ?? 0,
    isLoading: query.isLoading,
    error: errorMessage(query.error ?? update.error),
    view,
    setView,
    search,
    setSearch,
    hideSubIssues,
    setHideSubIssues,
    updateIssue: (id: string, input: UpdateIssueInput) => update.mutate({ id, input }),
  }
}
