import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { CreateProjectInput } from './create-project.input.js';
import { Project } from './project.entity.js';
import { ProjectMemberRow, ProjectsRepository } from './projects.repository.js';
import { UpdateProjectInput } from './update-project.input.js';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly projects: ProjectsRepository,
    private readonly users: UsersService,
  ) {}

  list(): Promise<Project[]> {
    return this.projects.findAll();
  }

  findByIds(ids: string[]): Promise<Project[]> {
    return this.projects.findByIds(ids);
  }

  membersByProjectIds(ids: string[]): Promise<ProjectMemberRow[]> {
    return this.projects.membersByProjectIds(ids);
  }

  async get(id: string): Promise<Project> {
    const project = await this.projects.findById(id);
    if (!project) {
      throw new NotFoundException(`Project ${id} not found`);
    }
    return project;
  }

  async getByKey(key: string): Promise<Project> {
    const project = await this.projects.findByKey(key.toUpperCase());
    if (!project) {
      throw new NotFoundException(`Project ${key} not found`);
    }
    return project;
  }

  async create(input: CreateProjectInput): Promise<Project> {
    const key = input.key.toUpperCase();
    if (await this.projects.findByKey(key)) {
      throw new ConflictException(`Project key ${key} is already in use`);
    }
    if (input.leadId) {
      await this.users.assertExists(input.leadId);
    }
    const { memberIds, ...patch } = input;
    const resolvedMemberIds = await this.resolveMemberIds(memberIds);
    const project = await this.projects.create({ ...patch, key });
    await this.projects.setMembers(project.id, resolvedMemberIds);
    return project;
  }

  async update(id: string, input: UpdateProjectInput): Promise<Project> {
    await this.get(id);
    if (input.leadId) {
      await this.users.assertExists(input.leadId);
    }
    const { memberIds, ...patch } = input;
    await this.projects.update(id, patch);
    if (memberIds) {
      await this.projects.setMembers(id, await this.resolveMemberIds(memberIds));
    }
    return this.get(id);
  }

  async remove(id: string): Promise<Project> {
    const project = await this.get(id);
    await this.projects.remove(id);
    return project;
  }

  allocateIssueNumber(projectId: string): Promise<number> {
    return this.projects.allocateIssueNumber(projectId);
  }

  private async resolveMemberIds(memberIds: string[] | undefined): Promise<string[]> {
    if (!memberIds || memberIds.length === 0) {
      return [];
    }
    const unique = [...new Set(memberIds)];
    const found = await this.users.findByIds(unique);
    if (found.length !== unique.length) {
      throw new BadRequestException('One or more members do not exist');
    }
    return unique;
  }
}
