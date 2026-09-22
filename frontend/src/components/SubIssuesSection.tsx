import { type FormEvent, useState } from 'react'
import type { Issue, IssueDetail } from '@/domain/types'
import type { UpdateIssueInput } from '@/graphql/generated/graphql'
import { issueService } from '@/services/issue-service'
import { ProgressBar } from '@/ui/ProgressBar'
import { IssueRow } from './IssueRow'

interface Props {
  issue: NonNullable<IssueDetail>
  onCreate: (title: string) => Promise<unknown>
  onUpdate: (id: string, input: UpdateIssueInput) => void
}

export function SubIssuesSection({ issue, onCreate, onUpdate }: Props) {
  const [title, setTitle] = useState('')
  const subIssues: Issue[] = issueService.sort(issue.subIssues)

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (!title.trim()) {
      return
    }
    try {
      await onCreate(title)
      setTitle('')
    } catch {
      // 错误已通过 controller.mutationError 展示
    }
  }

  return (
    <section className="mt-8">
      <div className="mb-2 flex items-center gap-3">
        <h2 className="font-medium">Sub-issues</h2>
        {issue.subIssueProgress && (
          <>
            <span className="text-xs tabular-nums text-dim">
              {issue.subIssueProgress.completed}/{issue.subIssueProgress.total}
            </span>
            <ProgressBar progress={issue.subIssueProgress} className="w-40" showLabel={false} />
          </>
        )}
      </div>
      <div className="overflow-hidden rounded-lg border border-line">
        {subIssues.map((subIssue) => (
          <IssueRow key={subIssue.id} issue={subIssue} onUpdate={onUpdate} />
        ))}
        <form onSubmit={onSubmit}>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Add sub-issue…  (press Enter)"
            maxLength={200}
            className="h-10 w-full bg-transparent px-4 outline-none placeholder:text-faint"
          />
        </form>
      </div>
    </section>
  )
}
