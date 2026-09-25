import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Release } from '../releases/release.entity.js';
import { ReleasePipeline } from './release-pipeline.entity.js';

export type ReleasePipelinePatch = Partial<Omit<ReleasePipeline, 'id' | 'createdAt' | 'updatedAt'>>;

@Injectable()
export class ReleasePipelinesRepository {
  constructor(
    @InjectRepository(ReleasePipeline) private readonly repo: Repository<ReleasePipeline>,
    @InjectRepository(Release) private readonly releases: Repository<Release>,
  ) {}

  releaseCount(pipelineId: string): Promise<number> {
    return this.releases.count({ where: { pipelineId } });
  }

  latestRelease(pipelineId: string): Promise<Release | null> {
    return this.releases.findOne({ where: { pipelineId }, order: { createdAt: 'DESC' } });
  }

  findAll(projectId?: string, excludedProjectIds: string[] = []): Promise<ReleasePipeline[]> {
    const qb = this.repo.createQueryBuilder('pipeline').orderBy('pipeline.createdAt', 'DESC');
    if (projectId) {
      qb.andWhere('pipeline.projectId = :projectId', { projectId });
    }
    if (excludedProjectIds.length > 0) {
      qb.andWhere('pipeline.projectId NOT IN (:...excludedProjectIds)', { excludedProjectIds });
    }
    return qb.getMany();
  }

  findById(id: string): Promise<ReleasePipeline | null> {
    return this.repo.findOneBy({ id });
  }

  create(data: Pick<ReleasePipeline, 'projectId' | 'name'> & ReleasePipelinePatch): Promise<ReleasePipeline> {
    return this.repo.save(this.repo.create(data));
  }

  async update(id: string, patch: ReleasePipelinePatch): Promise<void> {
    await this.repo.update(id, patch);
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
