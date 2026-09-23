import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Comment } from './comment.entity.js';
import { CommentsRepository } from './comments.repository.js';
import { CreateCommentInput } from './create-comment.input.js';

@Injectable()
export class CommentsService {
  constructor(private readonly comments: CommentsRepository) {}

  listByIssueId(issueId: string): Promise<Comment[]> {
    return this.comments.findByIssueId(issueId);
  }

  listByIssueIds(issueIds: string[]): Promise<Comment[]> {
    return this.comments.findByIssueIds(issueIds);
  }

  create(input: CreateCommentInput, authorId: string): Promise<Comment> {
    return this.comments.create({ issueId: input.issueId, authorId, body: input.body.trim() });
  }

  async remove(id: string, currentUserId: string): Promise<Comment> {
    const comment = await this.comments.findById(id);
    if (!comment) {
      throw new NotFoundException(`Comment ${id} not found`);
    }
    if (comment.authorId !== currentUserId) {
      throw new ForbiddenException('You can only delete your own comments');
    }
    await this.comments.remove(id);
    return comment;
  }
}
