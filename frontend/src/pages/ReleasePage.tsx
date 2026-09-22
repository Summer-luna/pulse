import { ChevronRight } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router'
import { IssuesView } from '@/components/IssuesView'
import { PageHeader } from '@/components/PageHeader'
import { ReleaseStatusPicker } from '@/components/ReleaseStatusPicker'
import { useReleaseController } from '@/controllers/use-releases-controller'
import { releaseService } from '@/services/release-service'
import { EditableText } from '@/ui/EditableText'
import { PageState } from '@/ui/PageState'
import { Picker } from '@/ui/Picker'
import { ProgressBar } from '@/ui/ProgressBar'
import { StatusIcon } from '@/ui/StatusIcon'

export function ReleasePage() {
  const { releaseId = '' } = useParams()
  const navigate = useNavigate()
  const controller = useReleaseController(releaseId)
  const { release } = controller

  if (!release) {
    return <PageState isLoading={controller.isLoading} error={controller.error} notFound />
  }

  async function onDelete() {
    if (window.confirm(`Delete release ${release!.name}? Its issues stay in the project.`)) {
      await controller.deleteRelease()
      navigate(`/projects/${release!.projectId}/releases`)
    }
  }

  const overdue = releaseService.isOverdue(release)
  const addOptions = controller.assignableIssues.map((issue) => ({
    value: issue.id,
    label: issue.title,
    hint: issue.identifier,
    icon: <StatusIcon status={issue.status} />,
  }))

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        actions={
          <>
            <Picker
              value={null}
              options={addOptions}
              onChange={(issueId) => issueId && controller.addIssue(issueId)}
              placeholder="Add issue"
              searchable
              align="right"
              disabled={addOptions.length === 0}
              className="[&>button]:bg-raised"
            />
            <button className="btn btn-danger" onClick={onDelete}>
              Delete
            </button>
          </>
        }
      >
        <nav className="flex min-w-0 items-center gap-1 text-dim">
          <Link to={`/projects/${release.projectId}/releases`} className="hover:text-ink">
            {release.project.name}
          </Link>
          <ChevronRight size={14} />
          <span className="truncate text-ink">{releaseService.displayName(release)}</span>
        </nav>
      </PageHeader>

      <section className="flex flex-col gap-3 border-b border-line px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="min-w-0 flex-1">
            <EditableText
              value={release.name}
              onSave={(name) => controller.updateRelease({ name })}
              maxLength={80}
              className="text-xl font-semibold"
            />
          </div>
          <div className="w-32 shrink-0">
            <EditableText
              value={release.version ?? ''}
              allowEmpty
              placeholder="Version"
              maxLength={40}
              onSave={(version) => controller.updateRelease({ version: version || null })}
              className="font-mono text-dim"
            />
          </div>
        </div>
        <EditableText
          multiline
          allowEmpty
          value={release.description}
          onSave={(description) => controller.updateRelease({ description })}
          placeholder="Add a description…"
        />
        <div className="flex flex-wrap items-center gap-3">
          <ReleaseStatusPicker value={release.status} onChange={(status) => controller.updateRelease({ status })} />
          <input
            type="date"
            value={release.targetDate ?? ''}
            onChange={(event) => controller.updateRelease({ targetDate: event.target.value || null })}
            aria-label="Target date"
            className="field h-7 w-40"
          />
          <span className={overdue ? 'text-danger' : 'text-dim'}>{releaseService.scheduleLabel(release)}</span>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs tabular-nums text-dim">
              {release.progress.completed}/{release.progress.total} done
            </span>
            <ProgressBar progress={release.progress} className="w-48" />
          </div>
        </div>
        {controller.mutationError && <p className="text-danger">{controller.mutationError}</p>}
      </section>

      <div className="min-h-0 flex-1">
        <IssuesView
          scope={{ releaseId }}
          emptyTitle="No issues in this release"
          emptyDescription="Use “Add issue” above, or pick this release on an issue."
        />
      </div>
    </div>
  )
}
