import { ISSUE_STATUS_LABEL } from '@/domain/issue-status'
import type { UpdateIssueInput } from '@/graphql/generated/graphql'
import { issueService, type StatusSection } from '@/services/issue-service'
import { StatusIcon } from '@/ui/StatusIcon'
import { IssueRow } from './IssueRow'

interface Props {
  sections: StatusSection[]
  onUpdate: (id: string, input: UpdateIssueInput) => void
}

export function IssueList({ sections, onUpdate }: Props) {
  return (
    <div>
      {sections.map((section) => (
        <section key={section.status}>
          <header className="sticky top-0 z-10 flex h-9 items-center gap-2 border-b border-line/60 bg-panel px-4">
            <StatusIcon status={section.status} />
            <h3 className="font-medium">{ISSUE_STATUS_LABEL[section.status]}</h3>
            <span className="text-dim">{section.issues.length}</span>
          </header>
          {issueService.nest(section.issues).map(({ issue, depth }) => (
            <IssueRow key={issue.id} issue={issue} depth={depth} onUpdate={onUpdate} />
          ))}
        </section>
      ))}
    </div>
  )
}
