import type { Comment } from '@/domain/types'
import { commentRepository } from '@/repositories/comment-repository'

class CommentService {
  create(issueId: string, body: string): Promise<Comment> {
    const trimmed = body.trim()
    if (!trimmed) {
      throw new Error('Comment cannot be empty')
    }
    return commentRepository.create({ issueId, body: trimmed })
  }

  remove(id: string): Promise<void> {
    return commentRepository.remove(id)
  }
}

export const commentService = new CommentService()
