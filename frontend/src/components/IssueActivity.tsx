import { useState } from 'react'
import type { Comment, User } from '@/domain/types'
import { formatRelativeTime } from '@/lib/format-date'
import { Avatar } from '@/ui/Avatar'

interface Props {
  createdAt: string
  creator: User | null
  comments: Comment[]
  onAddComment: (body: string) => Promise<unknown>
  isAddingComment: boolean
  onRemoveComment: (id: string) => Promise<unknown>
}

export function IssueActivity({ createdAt, creator, comments, onAddComment, isAddingComment, onRemoveComment }: Props) {
  const [draft, setDraft] = useState('')

  async function submit() {
    const body = draft.trim()
    if (!body) {
      return
    }
    await onAddComment(body)
    setDraft('')
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-medium">Activity</h3>

      <p className="flex items-center gap-1.5 text-xs text-dim">
        <Avatar name={creator?.name ?? 'Unknown'} color={creator?.color ?? '#62666f'} size={16} />
        <span className="text-ink">{creator?.name ?? 'Someone'}</span>
        created the issue · {formatRelativeTime(createdAt)}
      </p>

      {comments.map((comment) => (
        <div key={comment.id} className="group rounded-md border border-line bg-raised p-3">
          <div className="flex items-center gap-1.5 text-xs">
            <Avatar name={comment.author?.name ?? 'Unknown'} color={comment.author?.color ?? '#62666f'} size={16} />
            <span className="font-medium">{comment.author?.name ?? 'Someone'}</span>
            <span className="text-faint">{formatRelativeTime(comment.createdAt)}</span>
            <button
              type="button"
              onClick={() => onRemoveComment(comment.id)}
              className="ml-auto cursor-pointer text-faint opacity-0 hover:text-danger group-hover:opacity-100"
            >
              Delete
            </button>
          </div>
          <p className="mt-1.5 whitespace-pre-wrap">{comment.body}</p>
        </div>
      ))}

      <div className="flex flex-col gap-1.5">
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Leave a comment…"
          rows={2}
          className="field h-auto min-h-16 resize-y py-2 leading-relaxed"
        />
        <button
          type="button"
          onClick={submit}
          disabled={!draft.trim() || isAddingComment}
          className="btn btn-primary self-end"
        >
          {isAddingComment ? 'Posting…' : 'Comment'}
        </button>
      </div>
    </div>
  )
}
