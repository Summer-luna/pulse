import { type ReactNode, useEffect, useMemo, useState } from 'react'
import { CreateIssueModal } from '@/components/CreateIssueModal'
import { CreateProjectModal } from '@/components/CreateProjectModal'
import { CreateReleaseModal } from '@/components/CreateReleaseModal'
import type { IssueDraft } from '@/services/issue-service'
import { DialogsContext } from './dialogs-context'

type OpenDialog =
  | { kind: 'issue'; defaults: Partial<IssueDraft> }
  | { kind: 'project' }
  | { kind: 'release'; projectId: string }
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
      openCreateRelease: (projectId = '') => setDialog({ kind: 'release', projectId }),
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
      {dialog?.kind === 'release' && <CreateReleaseModal projectId={dialog.projectId} onClose={close} />}
    </DialogsContext.Provider>
  )
}
