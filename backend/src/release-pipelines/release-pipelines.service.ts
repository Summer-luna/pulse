import { Injectable, NotFoundException } from '@nestjs/common';
import { ProjectsService } from '../projects/projects.service.js';
import { Release } from '../releases/release.entity.js';
import { User } from '../users/user.entity.js';
import { CreateReleasePipelineInput } from './create-release-pipeline.input.js';
import { ReleasePipeline } from './release-pipeline.entity.js';
import { ReleasePipelinesRepository } from './release-pipelines.repository.js';
import { UpdateReleasePipelineInput } from './update-release-pipeline.input.js';

@Injectable()
export class ReleasePipelinesService {
  constructor(
    private readonly pipelines: ReleasePipelinesRepository,
    private readonly projects: ProjectsService,
  ) {}

  list(projectId?: string): Promise<ReleasePipeline[]> {
    return this.pipelines.findAll(projectId);
  }

  async listForViewer(projectId: string | undefined, viewer: User): Promise<ReleasePipeline[]> {
    if (projectId) {
      await this.projects.assertAccessible(projectId, viewer);
      return this.pipelines.findAll(projectId);
    }
    const excluded = await this.projects.inaccessiblePrivateProjectIds(viewer);
    return this.pipelines.findAll(undefined, excluded);
  }

  async get(id: string): Promise<ReleasePipeline> {
    const pipeline = await this.pipelines.findById(id);
    if (!pipeline) {
      throw new NotFoundException(`Release pipeline ${id} not found`);
    }
    return pipeline;
  }

  async getForViewer(id: string, viewer: User): Promise<ReleasePipeline> {
    const pipeline = await this.get(id);
    await this.projects.assertAccessible(pipeline.projectId, viewer);
    return pipeline;
  }

  async create(input: CreateReleasePipelineInput): Promise<ReleasePipeline> {
    await this.projects.get(input.projectId);
    return this.pipelines.create(input);
  }

  async update(id: string, input: UpdateReleasePipelineInput): Promise<ReleasePipeline> {
    await this.get(id);
    await this.pipelines.update(id, input);
    return this.get(id);
  }

  async remove(id: string): Promise<ReleasePipeline> {
    const pipeline = await this.get(id);
    await this.pipelines.remove(id);
    return pipeline;
  }

  releaseCount(pipelineId: string): Promise<number> {
    return this.pipelines.releaseCount(pipelineId);
  }

  latestRelease(pipelineId: string): Promise<Release | null> {
    return this.pipelines.latestRelease(pipelineId);
  }
}
