import { ListTree, Package } from 'lucide-react'
import { useNavigate } from 'react-router'
import type { Issue } from '@/domain/types'
import type { UpdateIssueInput } from '@/graphql/generated/graphql'
import { formatShortDate } from '@/lib/format-date'
import { EstimateIcon } from '@/ui/EstimateIcon'
import { LabelChip } from '@/ui/LabelChip'
import { IssuePriorityPicker } from './IssuePriorityPicker'
import { IssueStatusPicker } from './IssueStatusPicker'
import { UserPicker } from './UserPicker'

interface Props {
  issue: Issue
  onUpdate: (id: string, input: UpdateIssueInput) => void
}

export function IssueRow({ issue, onUpdate }: Props) {
  const navigate = useNavigate()
  const open = () => navigate(`/issues/${issue.identifier}`)

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={open}
      onKeyDown={(event) => event.key === 'Enter' && open()}
      className="flex h-10 cursor-pointer items-center gap-2.5 border-b border-line/60 px-4 outline-none hover:bg-hover focus-visible:bg-hover"
    >
      <IssuePriorityPicker value={issue.priority} onChange={(priority) => onUpdate(issue.id, { priority })} iconOnly />
      {issue.estimate !== null && (
        <span className="flex shrink-0 items-center gap-0.5 text-xs text-dim" title={`${issue.estimate} points`}>
          <EstimateIcon value={issue.estimate} />
          {issue.estimate}
        </span>
      )}
      <span className="w-16 shrink-0 font-mono text-xs text-faint">{issue.identifier}</span>
      <IssueStatusPicker value={issue.status} onChange={(status) => onUpdate(issue.id, { status })} iconOnly />
      <span className={`flex-1 truncate ${issue.status === 'DONE' || issue.status === 'CANCELED' ? 'text-dim' : ''}`}>
        {issue.title}
      </span>
      {issue.labels.slice(0, 2).map((label) => (
        <LabelChip key={label.id} name={label.name} color={label.color} />
      ))}
      {issue.labels.length > 2 && (
        <span className="chip shrink-0" title={issue.labels.slice(2).map((label) => label.name).join(', ')}>
          +{issue.labels.length - 2}
        </span>
      )}
      {issue.parentId && <span className="chip">Sub-issue</span>}
      {issue.subIssueProgress && (
        <span className="chip" title="Sub-issues completed">
          <ListTree size={12} />
          {issue.subIssueProgress.completed}/{issue.subIssueProgress.total}
        </span>
      )}
      {issue.release && (
        <span className="chip max-w-32" title={issue.release.name}>
          <Package size={12} className="shrink-0" />
          <span className="truncate">{issue.release.version ?? issue.release.name}</span>
        </span>
      )}
      {issue.dueDate && <span className="text-xs text-dim">{formatShortDate(issue.dueDate)}</span>}
      <UserPicker
        value={issue.assigneeId}
        onChange={(assigneeId) => onUpdate(issue.id, { assigneeId })}
        placeholder="Assignee"
        noneLabel="Unassigned"
        align="right"
        iconOnly
      />
      <span className="w-12 shrink-0 text-right text-xs text-faint">{formatShortDate(issue.createdAt)}</span>
    </div>
  )
}
