import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { TeamsService } from '../teams/teams.service.js';
import { User } from '../users/user.entity.js';
import { UserRole } from '../users/user-role.enum.js';
import { UsersService } from '../users/users.service.js';
import { CreateProjectInput } from './create-project.input.js';
import { Project } from './project.entity.js';
import { ProjectVisibility } from './project-visibility.enum.js';
import { ProjectMemberRow, ProjectsRepository } from './projects.repository.js';
import { UpdateProjectInput } from './update-project.input.js';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly projects: ProjectsRepository,
    private readonly users: UsersService,
    private readonly teams: TeamsService,
  ) {}

  list(): Promise<Project[]> {
    return this.projects.findAll();
  }

  async listAccessibleTo(viewer: User): Promise<Project[]> {
    const all = await this.projects.findAll();
    if (viewer.role === UserRole.ADMIN) {
      return all;
    }
    const privateOthers = all.filter((project) => project.visibility === ProjectVisibility.PRIVATE && project.leadId !== viewer.id);
    if (privateOthers.length === 0) {
      return all;
    }
    const memberRows = await this.projects.membersByProjectIds(privateOthers.map((project) => project.id));
    const accessibleIds = new Set(memberRows.filter((row) => row.user.id === viewer.id).map((row) => row.projectId));
    return all.filter((project) => project.visibility !== ProjectVisibility.PRIVATE || project.leadId === viewer.id || accessibleIds.has(project.id));
  }

  /** Project ids the viewer cannot see, for excluding their issues/releases/requests from other list queries. */
  async inaccessiblePrivateProjectIds(viewer: User): Promise<string[]> {
    if (viewer.role === UserRole.ADMIN) {
      return [];
    }
    const all = await this.projects.findAll();
    const privateOthers = all.filter((project) => project.visibility === ProjectVisibility.PRIVATE && project.leadId !== viewer.id);
    if (privateOthers.length === 0) {
      return [];
    }
    const memberRows = await this.projects.membersByProjectIds(privateOthers.map((project) => project.id));
    const accessibleIds = new Set(memberRows.filter((row) => row.user.id === viewer.id).map((row) => row.projectId));
    return privateOthers.filter((project) => !accessibleIds.has(project.id)).map((project) => project.id);
  }

  async canAccess(project: Project, viewer: User): Promise<boolean> {
    if (project.visibility !== ProjectVisibility.PRIVATE) {
      return true;
    }
    if (viewer.role === UserRole.ADMIN || project.leadId === viewer.id) {
      return true;
    }
    const memberIds = await this.projects.memberIds(project.id);
    return memberIds.includes(viewer.id);
  }

  /** Like get(), but 404s (rather than leaking existence) when the viewer can't see a private project. */
  async assertAccessible(id: string, viewer: User): Promise<Project> {
    const project = await this.get(id);
    if (!(await this.canAccess(project, viewer))) {
      throw new NotFoundException(`Project ${id} not found`);
    }
    return project;
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
    if (input.teamId) {
      await this.teams.get(input.teamId);
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
    if (input.teamId) {
      await this.teams.get(input.teamId);
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
