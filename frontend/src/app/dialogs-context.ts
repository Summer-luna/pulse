import { createContext, useContext } from 'react'
import type { IssueDraft } from '@/services/issue-service'

export interface DialogsApi {
  openCreateIssue: (defaults?: Partial<IssueDraft>) => void
  openCreateProject: () => void
  openCreateRelease: (pipelineId?: string) => void
  openCreatePipeline: () => void
}

export const DialogsContext = createContext<DialogsApi | null>(null)

export function useDialogs(): DialogsApi {
  const api = useContext(DialogsContext)
  if (!api) {
    throw new Error('useDialogs must be used inside DialogsProvider')
  }
  return api
}
