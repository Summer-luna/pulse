import { ListTree } from 'lucide-react'
import { Link } from 'react-router'
import type { Issue } from '@/domain/types'
import type { UpdateIssueInput } from '@/graphql/generated/graphql'
import { formatShortDate } from '@/lib/format-date'
import { Avatar } from '@/ui/Avatar'
import { EstimateIcon } from '@/ui/EstimateIcon'
import { LabelChip } from '@/ui/LabelChip'
import { IssuePriorityPicker } from './IssuePriorityPicker'

interface Props {
  issue: Issue
  onUpdate: (id: string, input: UpdateIssueInput) => void
}

export function IssueCard({ issue, onUpdate }: Props) {
  return (
    <div
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData('text/plain', issue.id)
        event.dataTransfer.effectAllowed = 'move'
      }}
      className="cursor-grab rounded-lg border border-line bg-raised p-3 active:cursor-grabbing"
    >
      <div className="mb-1.5 flex items-center justify-between">
        <span className="font-mono text-xs text-faint">{issue.identifier}</span>
        {issue.assignee && <Avatar name={issue.assignee.name} color={issue.assignee.color} />}
      </div>
      <Link to={`/issues/${issue.identifier}`} draggable={false} className="mb-2 block leading-snug hover:underline">
        {issue.title}
      </Link>
      <div className="flex items-center gap-2 text-xs text-dim">
        <IssuePriorityPicker value={issue.priority} onChange={(priority) => onUpdate(issue.id, { priority })} iconOnly />
        {issue.estimate !== null && (
          <span className="inline-flex items-center gap-0.5" title={`${issue.estimate} points`}>
            <EstimateIcon value={issue.estimate} />
            {issue.estimate}
          </span>
        )}
        {issue.subIssueProgress && (
          <span className="inline-flex items-center gap-1">
            <ListTree size={12} />
            {issue.subIssueProgress.completed}/{issue.subIssueProgress.total}
          </span>
        )}
        {issue.dueDate && <span>{formatShortDate(issue.dueDate)}</span>}
      </div>
      {issue.labels.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {issue.labels.map((label) => (
            <LabelChip key={label.id} name={label.name} color={label.color} />
          ))}
        </div>
      )}
    </div>
  )
}
