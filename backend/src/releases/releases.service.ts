import { Injectable, NotFoundException } from '@nestjs/common';
import { ProjectsService } from '../projects/projects.service.js';
import { ReleasePipelinesService } from '../release-pipelines/release-pipelines.service.js';
import { User } from '../users/user.entity.js';
import { CreateReleaseInput } from './create-release.input.js';
import { ReleasePatch, ReleasesRepository } from './releases.repository.js';
import { Release } from './release.entity.js';
import { ReleaseStatus } from './release-status.enum.js';
import { UpdateReleaseInput } from './update-release.input.js';

@Injectable()
export class ReleasesService {
  constructor(
    private readonly releases: ReleasesRepository,
    private readonly pipelines: ReleasePipelinesService,
    private readonly projects: ProjectsService,
  ) {}

  list(projectId?: string): Promise<Release[]> {
    return this.releases.findAll(projectId);
  }

  async listForViewer(projectId: string | undefined, viewer: User): Promise<Release[]> {
    if (projectId) {
      await this.projects.assertAccessible(projectId, viewer);
      return this.releases.findAll(projectId);
    }
    const excluded = await this.projects.inaccessiblePrivateProjectIds(viewer);
    return this.releases.findAll(undefined, excluded);
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

  async getForViewer(id: string, viewer: User): Promise<Release> {
    const release = await this.get(id);
    await this.projects.assertAccessible(release.projectId, viewer);
    return release;
  }

  async create(input: CreateReleaseInput): Promise<Release> {
    const pipeline = await this.pipelines.get(input.pipelineId);
    return this.releases.create({ ...input, projectId: pipeline.projectId, ...this.releasedAtFor(input.status) });
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
