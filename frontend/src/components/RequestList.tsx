import { useState } from 'react'
import { Link } from 'react-router'
import { REQUEST_SOURCE_LABEL, REQUEST_STATUS_COLOR, REQUEST_STATUS_LABEL } from '@/domain/request'
import type { CustomerRequest } from '@/domain/types'
import { formatShortDate } from '@/lib/format-date'
import { StatusDot } from '@/ui/StatusDot'
import { CreateIssueModal } from './CreateIssueModal'

interface Props {
  requests: CustomerRequest[]
  onConvert: (id: string, issueId: string) => void
  onRemove: (id: string) => void
}

export function RequestList({ requests, onConvert, onRemove }: Props) {
  const [converting, setConverting] = useState<CustomerRequest | null>(null)

  return (
    <div>
      <div className="flex h-9 items-center gap-4 border-b border-line/60 px-4 text-xs text-dim">
        <span className="flex-1">Title</span>
        <span className="w-32 shrink-0">Requestor</span>
        <span className="w-32 shrink-0">Customer</span>
        <span className="w-20 shrink-0">Source</span>
        <span className="w-24 shrink-0">Status</span>
        <span className="w-16 shrink-0">Date</span>
        <span className="w-40 shrink-0" />
      </div>
      {requests.map((request) => (
        <div key={request.id} className="flex h-11 items-center gap-4 border-b border-line/60 px-4">
          <span className="min-w-0 flex-1 truncate">{request.title}</span>
          <span className="w-32 shrink-0 truncate text-dim">{request.requestor}</span>
          <span className="w-32 shrink-0 truncate text-dim">{request.customer?.name ?? '—'}</span>
          <span className="w-20 shrink-0 text-xs text-dim">{REQUEST_SOURCE_LABEL[request.source]}</span>
          <span className="w-24 shrink-0">
            <StatusDot color={REQUEST_STATUS_COLOR[request.status]} label={REQUEST_STATUS_LABEL[request.status]} />
          </span>
          <span className="w-16 shrink-0 text-xs text-dim">{formatShortDate(request.createdAt)}</span>
          <span className="flex w-40 shrink-0 items-center justify-end gap-3">
            {request.convertedIssue ? (
              <Link to={`/issues/${request.convertedIssue.identifier}`} className="truncate text-xs text-accent-strong hover:underline">
                {request.convertedIssue.identifier}
              </Link>
            ) : (
              <>
                <button type="button" className="cursor-pointer text-xs text-dim hover:text-ink" onClick={() => setConverting(request)}>
                  Convert to issue
                </button>
                <button
                  type="button"
                  className="cursor-pointer text-xs text-faint hover:text-danger"
                  onClick={() => onRemove(request.id)}
                >
                  Delete
                </button>
              </>
            )}
          </span>
        </div>
      ))}
      {converting && (
        <CreateIssueModal
          defaults={{ projectId: converting.projectId, title: converting.title, description: converting.description }}
          onClose={() => setConverting(null)}
          onCreated={(issue) => {
            onConvert(converting.id, issue.id)
            setConverting(null)
          }}
        />
      )}
    </div>
  )
}
