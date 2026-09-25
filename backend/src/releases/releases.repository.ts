import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Release } from './release.entity.js';

export type ReleasePatch = Partial<Omit<Release, 'id' | 'createdAt' | 'updatedAt'>>;

@Injectable()
export class ReleasesRepository {
  constructor(@InjectRepository(Release) private readonly repo: Repository<Release>) {}

  findAll(projectId?: string, excludedProjectIds: string[] = []): Promise<Release[]> {
    const qb = this.repo.createQueryBuilder('release').orderBy('release.createdAt', 'DESC');
    if (projectId) {
      qb.andWhere('release.projectId = :projectId', { projectId });
    }
    if (excludedProjectIds.length > 0) {
      qb.andWhere('release.projectId NOT IN (:...excludedProjectIds)', { excludedProjectIds });
    }
    return qb.getMany();
  }

  findById(id: string): Promise<Release | null> {
    return this.repo.findOneBy({ id });
  }

  findByIds(ids: string[]): Promise<Release[]> {
    return this.repo.findBy({ id: In(ids) });
  }

  create(data: ReleasePatch & Pick<Release, 'projectId' | 'pipelineId' | 'name'>): Promise<Release> {
    return this.repo.save(this.repo.create(data));
  }

  async update(id: string, patch: ReleasePatch): Promise<void> {
    await this.repo.update(id, patch);
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
