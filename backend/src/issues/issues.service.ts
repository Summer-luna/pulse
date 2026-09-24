import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { ProgressStats } from '../common/loaders/loaders.js';
import { LabelsService } from '../labels/labels.service.js';
import { ProjectsService } from '../projects/projects.service.js';
import { ReleasesService } from '../releases/releases.service.js';
import { UsersService } from '../users/users.service.js';
import { CreateIssueInput } from './create-issue.input.js';
import type { IssueQuery } from './issue-query.js';
import { IssueStatus } from './issue-status.enum.js';
import { Issue } from './issue.entity.js';
import { IssuePatch, IssuesRepository } from './issues.repository.js';
import { UpdateIssueInput } from './update-issue.input.js';

const IDENTIFIER_PATTERN = /^([A-Za-z]{2,5})-(\d+)$/;

interface RelationInput {
  parentId?: string | null;
  releaseId?: string | null;
  assigneeId?: string | null;
}

@Injectable()
export class IssuesService {
  constructor(
    private readonly issues: IssuesRepository,
    private readonly projects: ProjectsService,
    private readonly releases: ReleasesService,
    private readonly users: UsersService,
    private readonly labels: LabelsService,
  ) {}

  list(query: IssueQuery): Promise<Issue[]> {
    return this.issues.findMany(query);
  }

  findByIds(ids: string[]): Promise<Issue[]> {
    return this.issues.findByIds(ids);
  }

  findSubIssues(parentIds: string[]): Promise<Issue[]> {
    return this.issues.findByParentIds(parentIds);
  }

  progressByProjectIds(ids: string[]): Promise<Map<string, ProgressStats>> {
    return this.issues.progressBy('projectId', ids);
  }

  progressByReleaseIds(ids: string[]): Promise<Map<string, ProgressStats>> {
    return this.issues.progressBy('releaseId', ids);
  }

  progressByParentIds(ids: string[]): Promise<Map<string, ProgressStats>> {
    return this.issues.progressBy('parentId', ids);
  }

  async get(id: string): Promise<Issue> {
    const issue = await this.issues.findById(id);
    if (!issue) {
      throw new NotFoundException(`Issue ${id} not found`);
    }
    return issue;
  }

  async getByIdentifier(identifier: string): Promise<Issue> {
    const match = IDENTIFIER_PATTERN.exec(identifier);
    if (!match) {
      throw new BadRequestException(`Invalid issue identifier ${identifier}`);
    }
    const project = await this.projects.getByKey(match[1]);
    const issue = await this.issues.findByProjectAndNumber(project.id, Number(match[2]));
    if (!issue) {
      throw new NotFoundException(`Issue ${identifier} not found`);
    }
    return issue;
  }

  async create(input: CreateIssueInput, creatorId: string): Promise<Issue> {
    await this.projects.get(input.projectId);
    await this.assertRelations(input.projectId, input);
    const { labelIds, ...patch } = input;
    const resolvedLabelIds = await this.labels.resolveLabelIds(labelIds);
    const number = await this.projects.allocateIssueNumber(input.projectId);
    const issue = await this.issues.create({ ...patch, number, creatorId, ...this.completedAtFor(input.status) });
    await this.labels.setIssueLabels(issue.id, resolvedLabelIds);
    return issue;
  }

  async update(id: string, input: UpdateIssueInput): Promise<Issue> {
    const issue = await this.get(id);
    const movingProject = input.projectId !== undefined && input.projectId !== issue.projectId;
    await this.assertRelations(movingProject ? input.projectId! : issue.projectId, input, id);

    if (movingProject) {
      await this.projects.get(input.projectId!);
      const number = await this.projects.allocateIssueNumber(input.projectId!);
      await this.issues.moveToProject(id, input.projectId!, number);
      await this.issues.detachChildren(id);
    }

    const { labelIds, projectId: _projectId, parentId, releaseId, ...patch } = input;
    const statusChanged = input.status !== undefined && input.status !== issue.status;
    await this.issues.update(id, {
      ...patch,
      ...(movingProject ? {} : { parentId, releaseId }),
      ...(statusChanged ? this.completedAtFor(input.status) : {}),
    });
    if (labelIds) {
      await this.labels.setIssueLabels(id, await this.labels.resolveLabelIds(labelIds));
    }
    return this.get(id);
  }

  async remove(id: string): Promise<Issue> {
    const issue = await this.get(id);
    await this.issues.remove(id);
    return issue;
  }

  private async assertRelations(projectId: string, input: RelationInput, selfId?: string): Promise<void> {
    if (input.parentId) {
      const parent = await this.get(input.parentId);
      if (parent.projectId !== projectId) {
        throw new BadRequestException('A sub-issue must be in the same project as its parent');
      }
      if (selfId && (await this.issues.findAncestorIds(parent.id)).includes(selfId)) {
        throw new BadRequestException('An issue cannot be moved under itself or one of its sub-issues');
      }
    }
    if (input.releaseId) {
      const release = await this.releases.get(input.releaseId);
      if (release.projectId !== projectId) {
        throw new BadRequestException('An issue can only be added to a release of its own project');
      }
    }
    if (input.assigneeId) {
      await this.users.assertExists(input.assigneeId);
    }
  }

  private completedAtFor(status: IssueStatus | undefined): Pick<IssuePatch, 'completedAt'> {
    if (status === undefined) {
      return {};
    }
    return { completedAt: status === IssueStatus.DONE ? new Date() : null };
  }
}
