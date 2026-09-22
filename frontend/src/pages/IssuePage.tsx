import { ChevronRight, Trash2 } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router'
import { EstimatePicker } from '@/components/EstimatePicker'
import { IssuePriorityPicker } from '@/components/IssuePriorityPicker'
import { IssueStatusPicker } from '@/components/IssueStatusPicker'
import { LabelPicker } from '@/components/LabelPicker'
import { PageHeader } from '@/components/PageHeader'
import { ProjectBadge } from '@/components/ProjectBadge'
import { ReleasePicker } from '@/components/ReleasePicker'
import { SubIssuesSection } from '@/components/SubIssuesSection'
import { UserPicker } from '@/components/UserPicker'
import { useIssueController } from '@/controllers/use-issue-controller'
import { formatFullDate } from '@/lib/format-date'
import { EditableText } from '@/ui/EditableText'
import { PageState } from '@/ui/PageState'
import { Picker } from '@/ui/Picker'
import { StatusIcon } from '@/ui/StatusIcon'

export function IssuePage() {
  const { identifier = '' } = useParams()
  const navigate = useNavigate()
  const controller = useIssueController(identifier)
  const { issue } = controller

  if (!issue) {
    return <PageState isLoading={controller.isLoading} error={controller.error} notFound />
  }

  async function onDelete() {
    if (window.confirm(`Delete ${issue!.identifier}? Its sub-issues will become top-level issues.`)) {
      await controller.deleteIssue()
      navigate(`/projects/${issue!.projectId}/issues`)
    }
  }

  const parentOptions = controller.parentCandidates.map((candidate) => ({
    value: candidate.id,
    label: candidate.title,
    hint: candidate.identifier,
    icon: <StatusIcon status={candidate.status} />,
  }))
  const selectableReleases = controller.releases.filter(
    (release) => release.id === issue.releaseId || (release.status !== 'COMPLETED' && release.status !== 'CANCELED'),
  )

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        actions={
          <button className="btn btn-danger" onClick={onDelete}>
            <Trash2 size={14} /> Delete
          </button>
        }
      >
        <nav className="flex min-w-0 items-center gap-1 text-dim">
          <Link to={`/projects/${issue.projectId}/issues`} className="flex items-center gap-1.5 hover:text-ink">
            <ProjectBadge projectKey={issue.project.key} size={16} />
            {issue.project.name}
          </Link>
          {issue.parent && (
            <>
              <ChevronRight size={14} />
              <Link to={`/issues/${issue.parent.identifier}`} className="truncate hover:text-ink">
                {issue.parent.identifier} {issue.parent.title}
              </Link>
            </>
          )}
          <ChevronRight size={14} />
          <span className="font-mono text-ink">{issue.identifier}</span>
        </nav>
      </PageHeader>

      <div className="flex min-h-0 flex-1">
        <div className="min-w-0 flex-1 overflow-y-auto px-8 py-6">
          <div className="mx-auto max-w-3xl">
            <EditableText
              value={issue.title}
              onSave={(title) => controller.updateIssue({ title })}
              maxLength={200}
              className="text-2xl font-semibold"
            />
            <div className="mt-2">
              <EditableText
                multiline
                allowEmpty
                value={issue.description}
                onSave={(description) => controller.updateIssue({ description })}
                placeholder="Add description…"
              />
            </div>
            <SubIssuesSection issue={issue} onCreate={controller.createSubIssue} onUpdate={controller.updateSubIssue} />
            {controller.mutationError && <p className="mt-4 text-danger">{controller.mutationError}</p>}
          </div>
        </div>

        <aside className="w-72 shrink-0 overflow-y-auto overflow-x-hidden border-l border-line bg-panel p-4">
          <h2 className="mb-3 text-xs font-medium text-faint">Properties</h2>
          <dl className="grid grid-cols-[5.5rem_1fr] items-center gap-x-2 gap-y-2.5">
            <dt className="text-dim">Status</dt>
            <dd>
              <IssueStatusPicker align="right" value={issue.status} onChange={(status) => controller.updateIssue({ status })} />
            </dd>
            <dt className="text-dim">Priority</dt>
            <dd>
              <IssuePriorityPicker align="right" value={issue.priority} onChange={(priority) => controller.updateIssue({ priority })} />
            </dd>
            <dt className="text-dim">Estimate</dt>
            <dd>
              <EstimatePicker align="right" value={issue.estimate} onChange={(estimate) => controller.updateIssue({ estimate })} />
            </dd>
            <dt className="text-dim">Assignee</dt>
            <dd>
              <UserPicker
                value={issue.assigneeId}
                onChange={(assigneeId) => controller.updateIssue({ assigneeId })}
                placeholder="Unassigned"
                noneLabel="Unassigned"
                align="right"
              />
            </dd>
            <dt className="text-dim">Release</dt>
            <dd>
              <ReleasePicker
                value={issue.releaseId}
                releases={selectableReleases}
                align="right"
                onChange={(releaseId) => controller.updateIssue({ releaseId })}
              />
            </dd>
            <dt className="text-dim">Parent</dt>
            <dd>
              <Picker
                value={issue.parentId}
                options={parentOptions}
                onChange={(parentId) => controller.updateIssue({ parentId })}
                placeholder="No parent"
                noneLabel="No parent"
                align="right"
                searchable
              />
            </dd>
            <dt className="text-dim">Labels</dt>
            <dd>
              <LabelPicker
                values={issue.labels.map((label) => label.id)}
                onChange={(labelIds) => controller.updateIssue({ labelIds })}
                align="right"
              />
            </dd>
            <dt className="text-dim">Due date</dt>
            <dd>
              <input
                type="date"
                value={issue.dueDate ?? ''}
                onChange={(event) => controller.updateIssue({ dueDate: event.target.value || null })}
                aria-label="Due date"
                className="field h-7"
              />
            </dd>
          </dl>
          <p className="mt-6 text-xs text-faint">
            Created {formatFullDate(issue.createdAt)}
            <br />
            Updated {formatFullDate(issue.updatedAt)}
          </p>
        </aside>
      </div>
    </div>
  )
}
