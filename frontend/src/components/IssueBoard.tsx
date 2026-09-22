import { useState } from 'react'
import { ISSUE_STATUS_LABEL } from '@/domain/issue-status'
import type { IssueStatus, UpdateIssueInput } from '@/graphql/generated/graphql'
import type { StatusSection } from '@/services/issue-service'
import { StatusIcon } from '@/ui/StatusIcon'
import { IssueCard } from './IssueCard'

interface Props {
  sections: StatusSection[]
  onUpdate: (id: string, input: UpdateIssueInput) => void
}

export function IssueBoard({ sections, onUpdate }: Props) {
  const [dropTarget, setDropTarget] = useState<IssueStatus | null>(null)

  return (
    <div className="flex h-full gap-3 overflow-x-auto p-4">
      {sections.map((section) => (
        <section
          key={section.status}
          onDragOver={(event) => {
            event.preventDefault()
            setDropTarget(section.status)
          }}
          onDragLeave={() => setDropTarget((current) => (current === section.status ? null : current))}
          onDrop={(event) => {
            event.preventDefault()
            setDropTarget(null)
            const issueId = event.dataTransfer.getData('text/plain')
            const issue = sections.flatMap((s) => s.issues).find((candidate) => candidate.id === issueId)
            if (issue && issue.status !== section.status) {
              onUpdate(issue.id, { status: section.status })
            }
          }}
          className={`flex w-72 shrink-0 flex-col rounded-xl border bg-panel transition-colors ${
            dropTarget === section.status ? 'border-accent' : 'border-line'
          }`}
        >
          <header className="flex h-9 items-center gap-2 px-3">
            <StatusIcon status={section.status} />
            <h3 className="font-medium">{ISSUE_STATUS_LABEL[section.status]}</h3>
            <span className="text-dim">{section.issues.length}</span>
          </header>
          <div className="flex min-h-24 flex-1 flex-col gap-2 overflow-y-auto p-2 pt-0">
            {section.issues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} onUpdate={onUpdate} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
