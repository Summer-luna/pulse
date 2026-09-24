import { MoreHorizontal } from 'lucide-react'
import { type FormEvent, useRef, useState } from 'react'
import { useCreateIssueController } from '@/controllers/use-create-issue-controller'
import type { Issue } from '@/domain/types'
import type { IssueDraft } from '@/services/issue-service'
import { DescriptionField } from '@/ui/DescriptionField'
import { Modal } from '@/ui/Modal'
import { PopoverButton } from '@/ui/PopoverButton'
import { Switch } from '@/ui/Switch'
import { EstimatePicker } from './EstimatePicker'
import { IssuePriorityPicker } from './IssuePriorityPicker'
import { IssueStatusPicker } from './IssueStatusPicker'
import { LabelPicker } from './LabelPicker'
import { ProjectPicker } from './ProjectPicker'
import { ReleasePicker } from './ReleasePicker'
import { UserPicker } from './UserPicker'

interface Props {
  defaults: Partial<IssueDraft>
  onClose: () => void
  onCreated?: (issue: Issue) => void
}

export function CreateIssueModal({ defaults, onClose, onCreated }: Props) {
  const controller = useCreateIssueController(defaults)
  const { draft, updateDraft } = controller
  const [createMore, setCreateMore] = useState(false)
  const titleRef = useRef<HTMLInputElement>(null)

  const project = controller.projects.find((candidate) => candidate.id === draft.projectId)

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    try {
      const issue = await controller.submit()
      onCreated?.(issue)
      if (createMore) {
        updateDraft({ title: '', description: '' })
        titleRef.current?.focus()
      } else {
        onClose()
      }
    } catch {
      // 错误已通过 controller.error 展示
    }
  }

  return (
    <Modal title={project ? `${project.name} · New issue` : 'New issue'} onClose={onClose}>
      <form onSubmit={onSubmit} className="flex flex-col gap-3 p-4">
        <input
          ref={titleRef}
          autoFocus
          value={draft.title}
          onChange={(event) => updateDraft({ title: event.target.value })}
          placeholder="Issue title"
          maxLength={200}
          className="w-full bg-transparent text-lg font-medium outline-none placeholder:text-faint"
        />
        <DescriptionField
          value={draft.description}
          onChange={(description) => updateDraft({ description })}
          placeholder="Add description…"
          className="min-h-20"
        />
        <div className="flex flex-wrap items-center gap-2">
          <IssueStatusPicker value={draft.status} onChange={(status) => updateDraft({ status })} />
          <IssuePriorityPicker value={draft.priority} onChange={(priority) => updateDraft({ priority })} />
          <EstimatePicker value={draft.estimate} onChange={(estimate) => updateDraft({ estimate })} />
          <UserPicker
            value={draft.assigneeId}
            onChange={(assigneeId) => updateDraft({ assigneeId })}
            placeholder="Assignee"
            noneLabel="Unassigned"
          />
          <ProjectPicker
            value={draft.projectId}
            projects={controller.projects}
            onChange={(projectId) => updateDraft({ projectId })}
          />
          <LabelPicker values={draft.labelIds} onChange={(labelIds) => updateDraft({ labelIds })} />
          <PopoverButton icon={<MoreHorizontal size={15} />} label="More options">
            <label className="flex flex-col gap-1 text-xs text-dim">
              Release
              <ReleasePicker
                value={draft.releaseId}
                releases={controller.releases}
                onChange={(releaseId) => updateDraft({ releaseId })}
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-dim">
              Due date
              <input
                type="date"
                value={draft.dueDate ?? ''}
                onChange={(event) => updateDraft({ dueDate: event.target.value || null })}
                aria-label="Due date"
                className="field h-7"
              />
            </label>
          </PopoverButton>
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-line pt-3">
          {controller.error && <p className="mr-auto text-danger">{controller.error}</p>}
          <Switch checked={createMore} onChange={setCreateMore} label="Create more" />
          <button type="submit" className="btn btn-primary" disabled={controller.isSubmitting || !draft.title.trim()}>
            {controller.isSubmitting ? 'Creating…' : 'Create issue'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
