import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { IssuesService } from '../issues/issues.service.js';
import { ProjectsService } from '../projects/projects.service.js';
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

  async get(id: string): Promise<CustomerRequest> {
    const request = await this.requests.findById(id);
    if (!request) {
      throw new NotFoundException(`Request ${id} not found`);
    }
    return request;
  }

  async create(input: CreateRequestInput): Promise<CustomerRequest> {
    await this.projects.get(input.projectId);
    return this.requests.create(input);
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
    if (issue.projectId !== request.projectId) {
      throw new BadRequestException('The issue must be in the same project as the request');
    }
    await this.requests.update(id, { convertedIssueId: issueId, status: RequestStatus.CONVERTED });
    return this.get(id);
  }
}
