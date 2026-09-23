import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Comment } from './comment.entity.js';

@Injectable()
export class CommentsRepository {
  constructor(@InjectRepository(Comment) private readonly repo: Repository<Comment>) {}

  findByIssueId(issueId: string): Promise<Comment[]> {
    return this.repo.find({ where: { issueId }, order: { createdAt: 'ASC' } });
  }

  findByIssueIds(issueIds: string[]): Promise<Comment[]> {
    return this.repo.find({ where: { issueId: In(issueIds) }, order: { createdAt: 'ASC' } });
  }

  findById(id: string): Promise<Comment | null> {
    return this.repo.findOneBy({ id });
  }

  create(data: Pick<Comment, 'issueId' | 'authorId' | 'body'>): Promise<Comment> {
    return this.repo.save(this.repo.create(data));
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
