import { type ReactNode, useEffect, useMemo, useState } from 'react'
import { CreateIssueModal } from '@/components/CreateIssueModal'
import { CreatePipelineModal } from '@/components/CreatePipelineModal'
import { CreateProjectModal } from '@/components/CreateProjectModal'
import { CreateReleaseModal } from '@/components/CreateReleaseModal'
import type { IssueDraft } from '@/services/issue-service'
import { DialogsContext } from './dialogs-context'

type OpenDialog =
  | { kind: 'issue'; defaults: Partial<IssueDraft> }
  | { kind: 'project' }
  | { kind: 'release'; pipelineId: string }
  | { kind: 'pipeline' }
  | null

function isTypingTarget(target: EventTarget | null): boolean {
  const element = target as HTMLElement | null
  return Boolean(element?.closest('input, textarea, select, [contenteditable="true"]'))
}

export function DialogsProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<OpenDialog>(null)

  const api = useMemo(
    () => ({
      openCreateIssue: (defaults: Partial<IssueDraft> = {}) => setDialog({ kind: 'issue', defaults }),
      openCreateProject: () => setDialog({ kind: 'project' }),
      openCreateRelease: (pipelineId = '') => setDialog({ kind: 'release', pipelineId }),
      openCreatePipeline: () => setDialog({ kind: 'pipeline' }),
    }),
    [],
  )

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'c' && !event.metaKey && !event.ctrlKey && !event.altKey && !isTypingTarget(event.target)) {
        event.preventDefault()
        api.openCreateIssue()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [api])

  const close = () => setDialog(null)

  return (
    <DialogsContext.Provider value={api}>
      {children}
      {dialog?.kind === 'issue' && <CreateIssueModal defaults={dialog.defaults} onClose={close} />}
      {dialog?.kind === 'project' && <CreateProjectModal onClose={close} />}
      {dialog?.kind === 'release' && <CreateReleaseModal pipelineId={dialog.pipelineId} onClose={close} />}
      {dialog?.kind === 'pipeline' && <CreatePipelineModal onClose={close} />}
    </DialogsContext.Provider>
  )
}
