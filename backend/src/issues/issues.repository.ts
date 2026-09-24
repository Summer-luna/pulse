import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import type { ProgressStats } from '../common/loaders/loaders.js';
import type { IssueQuery } from './issue-query.js';
import { Issue } from './issue.entity.js';

export type IssuePatch = Partial<Omit<Issue, 'id' | 'projectId' | 'number' | 'createdAt' | 'updatedAt'>>;
export type ProgressGroup = 'projectId' | 'releaseId' | 'parentId';

@Injectable()
export class IssuesRepository {
  constructor(@InjectRepository(Issue) private readonly repo: Repository<Issue>) {}

  findMany(query: IssueQuery): Promise<Issue[]> {
    const qb = this.repo.createQueryBuilder('issue').orderBy('issue.createdAt', 'DESC').addOrderBy('issue.number', 'DESC');
    if (query.projectId) {
      qb.andWhere('issue.projectId = :projectId', { projectId: query.projectId });
    }
    if (query.releaseId) {
      qb.andWhere('issue.releaseId = :releaseId', { releaseId: query.releaseId });
    }
    if (query.assigneeId) {
      qb.andWhere('issue.assigneeId = :assigneeId', { assigneeId: query.assigneeId });
    }
    if (query.parentId) {
      qb.andWhere('issue.parentId = :parentId', { parentId: query.parentId });
    }
    if (query.topLevelOnly) {
      qb.andWhere('issue.parentId IS NULL');
    }
    if (query.statuses?.length) {
      qb.andWhere('issue.status IN (:...statuses)', { statuses: query.statuses });
    }
    if (query.search?.trim()) {
      const escaped = query.search.trim().replace(/[\\%_]/g, '\\$&');
      qb.andWhere('issue.title ILIKE :search', { search: `%${escaped}%` });
    }
    return qb.getMany();
  }

  findById(id: string): Promise<Issue | null> {
    return this.repo.findOneBy({ id });
  }

  findByIds(ids: string[]): Promise<Issue[]> {
    return this.repo.findBy({ id: In(ids) });
  }

  findByProjectAndNumber(projectId: string, number: number): Promise<Issue | null> {
    return this.repo.findOneBy({ projectId, number });
  }

  findByParentIds(parentIds: string[]): Promise<Issue[]> {
    return this.repo.find({ where: { parentId: In(parentIds) }, order: { number: 'ASC' } });
  }

  create(data: IssuePatch & Pick<Issue, 'projectId' | 'number' | 'title'>): Promise<Issue> {
    return this.repo.save(this.repo.create(data));
  }

  async update(id: string, patch: IssuePatch): Promise<void> {
    await this.repo.update(id, patch);
  }

  async moveToProject(id: string, projectId: string, number: number): Promise<void> {
    await this.repo.update(id, { projectId, number, parentId: null, releaseId: null });
  }

  async detachChildren(parentId: string): Promise<void> {
    await this.repo.update({ parentId }, { parentId: null });
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async findAncestorIds(id: string): Promise<string[]> {
    const rows: { id: string }[] = await this.repo.query(
      `WITH RECURSIVE ancestors AS (
         SELECT id, parent_id FROM issues WHERE id = $1
         UNION
         SELECT i.id, i.parent_id FROM issues i JOIN ancestors a ON i.id = a.parent_id
       )
       SELECT id FROM ancestors`,
      [id],
    );
    return rows.map((row) => row.id);
  }

  async progressBy(group: ProgressGroup, ids: string[]): Promise<Map<string, ProgressStats>> {
    if (ids.length === 0) {
      return new Map();
    }
    const rows = await this.repo
      .createQueryBuilder('issue')
      .select(`issue.${group}`, 'key')
      .addSelect('COUNT(*)', 'total')
      .addSelect(`COUNT(*) FILTER (WHERE issue.status = 'DONE')`, 'completed')
      .where(`issue.${group} IN (:...ids)`, { ids })
      .andWhere(`issue.status <> 'CANCELED'`)
      .groupBy(`issue.${group}`)
      .getRawMany<{ key: string; total: string; completed: string }>();
    return new Map(rows.map((row) => [row.key, { total: Number(row.total), completed: Number(row.completed) }]));
  }
}
