import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { IssuesService } from '../issues/issues.service.js';
import { ProjectsService } from '../projects/projects.service.js';
import { User } from '../users/user.entity.js';
import { CreateRequestInput } from './create-request.input.js';
import { CustomerRequest } from './customer-request.entity.js';
import { RequestStatus } from './request-status.enum.js';
import { RequestsRepository } from './requests.repository.js';
import { UpdateRequestInput } from './update-request.input.js';

@Injectable()
export class RequestsService {
  constructor(
    private readonly requests: RequestsRepository,
    private readonly projects: ProjectsService,
    private readonly issues: IssuesService,
  ) {}

  list(projectId?: string, customerId?: string): Promise<CustomerRequest[]> {
    return this.requests.findAll(projectId, customerId);
  }

  async listForViewer(projectId: string | undefined, customerId: string | undefined, viewer: User): Promise<CustomerRequest[]> {
    if (projectId) {
      await this.projects.assertAccessible(projectId, viewer);
      return this.requests.findAll(projectId, customerId);
    }
    const excluded = await this.projects.inaccessiblePrivateProjectIds(viewer);
    return this.requests.findAll(undefined, customerId, excluded);
  }

  findByConvertedIssueIds(issueIds: string[]): Promise<CustomerRequest[]> {
    return this.requests.findByConvertedIssueIds(issueIds);
  }

  async get(id: string): Promise<CustomerRequest> {
    const request = await this.requests.findById(id);
    if (!request) {
      throw new NotFoundException(`Request ${id} not found`);
    }
    return request;
  }

  async getForViewer(id: string, viewer: User): Promise<CustomerRequest> {
    const request = await this.get(id);
    if (request.projectId && !(await this.projects.canAccess(await this.projects.get(request.projectId), viewer))) {
      throw new NotFoundException(`Request ${id} not found`);
    }
    return request;
  }

  async create(input: CreateRequestInput): Promise<CustomerRequest> {
    if (input.projectId) {
      await this.projects.get(input.projectId);
    }
    return this.requests.create({ ...input, projectId: input.projectId ?? null });
  }

  async update(id: string, input: UpdateRequestInput): Promise<CustomerRequest> {
    await this.get(id);
    await this.requests.update(id, input);
    return this.get(id);
  }

  async remove(id: string): Promise<CustomerRequest> {
    const request = await this.get(id);
    await this.requests.remove(id);
    return request;
  }

  async linkToIssue(id: string, issueId: string): Promise<CustomerRequest> {
    const request = await this.get(id);
    if (request.convertedIssueId) {
      throw new BadRequestException('This request has already been converted to an issue');
    }
    const issue = await this.issues.get(issueId);
    if (request.projectId && issue.projectId !== request.projectId) {
      throw new BadRequestException('The issue must be in the same project as the request');
    }
    await this.requests.update(id, { convertedIssueId: issueId, status: RequestStatus.CONVERTED });
    return this.get(id);
  }
}
