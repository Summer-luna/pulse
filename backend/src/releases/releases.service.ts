import { Injectable, NotFoundException } from '@nestjs/common';
import { ProjectsService } from '../projects/projects.service.js';
import { CreateReleaseInput } from './create-release.input.js';
import { ReleasePatch, ReleasesRepository } from './releases.repository.js';
import { Release } from './release.entity.js';
import { ReleaseStatus } from './release-status.enum.js';
import { UpdateReleaseInput } from './update-release.input.js';

@Injectable()
export class ReleasesService {
  constructor(
    private readonly releases: ReleasesRepository,
    private readonly projects: ProjectsService,
  ) {}

  list(projectId?: string): Promise<Release[]> {
    return this.releases.findAll(projectId);
  }

  findByIds(ids: string[]): Promise<Release[]> {
    return this.releases.findByIds(ids);
  }

  async get(id: string): Promise<Release> {
    const release = await this.releases.findById(id);
    if (!release) {
      throw new NotFoundException(`Release ${id} not found`);
    }
    return release;
  }

  async create(input: CreateReleaseInput): Promise<Release> {
    await this.projects.get(input.projectId);
    return this.releases.create({ ...input, ...this.releasedAtFor(input.status) });
  }

  async update(id: string, input: UpdateReleaseInput): Promise<Release> {
    await this.get(id);
    await this.releases.update(id, { ...input, ...this.releasedAtFor(input.status) });
    return this.get(id);
  }

  async remove(id: string): Promise<Release> {
    const release = await this.get(id);
    await this.releases.remove(id);
    return release;
  }

  private releasedAtFor(status: ReleaseStatus | undefined): Pick<ReleasePatch, 'releasedAt'> {
    if (status === undefined) {
      return {};
    }
    return { releasedAt: status === ReleaseStatus.COMPLETED ? new Date() : null };
  }
}
