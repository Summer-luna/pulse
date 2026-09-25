import { useState } from 'react'
import { Link } from 'react-router'
import { REQUEST_STATUS_COLOR, REQUEST_STATUS_LABEL } from '@/domain/request'
import type { CustomerRequest } from '@/domain/types'
import { formatRelativeTime, formatShortDate } from '@/lib/format-date'
import { CreateIssueModal } from './CreateIssueModal'

interface Props {
  requests: CustomerRequest[]
  onConvert: (id: string, issueId: string) => void
  onRemove: (id: string) => void
}

function RequestStatusIcon({ status }: { status: CustomerRequest['status'] }) {
  const color = REQUEST_STATUS_COLOR[status]
  return (
    <svg width={14} height={14} viewBox="0 0 14 14" fill="none" aria-hidden className="mt-0.5 shrink-0">
      {status === 'OPEN' && <circle cx="7" cy="7" r="5.75" stroke={color} strokeWidth="1.5" strokeDasharray="1.8 1.6" />}
      {status === 'CONVERTED' && (
        <>
          <circle cx="7" cy="7" r="7" fill={color} />
          <path d="M4 7.2 6.1 9.2 10 5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {status === 'DECLINED' && (
        <>
          <circle cx="7" cy="7" r="5.75" stroke={color} strokeWidth="1.5" />
          <path d="M4.5 4.5 9.5 9.5M9.5 4.5 4.5 9.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
    </svg>
  )
}

export function RequestList({ requests, onConvert, onRemove }: Props) {
  const [converting, setConverting] = useState<CustomerRequest | null>(null)

  return (
    <div>
      {requests.map((request) => (
        <div key={request.id} className="group border-b border-line/60 px-4 py-2.5 hover:bg-hover">
          <div className="flex items-center gap-2">
            <RequestStatusIcon status={request.status} />
            <span className="min-w-0 flex-1 truncate font-medium">{request.title}</span>
            {request.customer && <span className="chip shrink-0">{request.customer.name}</span>}
            <span className="shrink-0 text-xs text-dim">{REQUEST_STATUS_LABEL[request.status]}</span>
            <span className="shrink-0 text-xs text-faint">{formatShortDate(request.createdAt)}</span>
            <span className="flex shrink-0 items-center gap-3 opacity-0 group-hover:opacity-100">
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
          {request.description && (
            <div className="pl-[1.375rem]">
              <p className="mt-1 text-xs text-faint">
                Added by {request.requestorUser?.name ?? request.requestor} · {formatRelativeTime(request.createdAt)}
              </p>
              <p className="mt-0.5 text-sm text-dim">{request.description}</p>
            </div>
          )}
        </div>
      ))}
      {converting && (
        <CreateIssueModal
          defaults={{ projectId: converting.projectId ?? undefined, title: converting.title, description: converting.description }}
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
