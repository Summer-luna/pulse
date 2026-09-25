import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CustomerRequest } from './customer-request.entity.js';

export type RequestPatch = Partial<Omit<CustomerRequest, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>>;

@Injectable()
export class RequestsRepository {
  constructor(@InjectRepository(CustomerRequest) private readonly repo: Repository<CustomerRequest>) {}

  findAll(projectId?: string, customerId?: string, excludedProjectIds: string[] = []): Promise<CustomerRequest[]> {
    const qb = this.repo.createQueryBuilder('request').orderBy('request.createdAt', 'DESC');
    if (projectId) {
      qb.andWhere('request.projectId = :projectId', { projectId });
    }
    if (customerId) {
      qb.andWhere('request.customerId = :customerId', { customerId });
    }
    if (excludedProjectIds.length > 0) {
      qb.andWhere('(request.projectId IS NULL OR request.projectId NOT IN (:...excludedProjectIds))', { excludedProjectIds });
    }
    return qb.getMany();
  }

  findById(id: string): Promise<CustomerRequest | null> {
    return this.repo.findOneBy({ id });
  }

  findByConvertedIssueIds(issueIds: string[]): Promise<CustomerRequest[]> {
    return this.repo.findBy({ convertedIssueId: In(issueIds) });
  }

  create(data: Pick<CustomerRequest, 'projectId' | 'title' | 'requestor'> & RequestPatch): Promise<CustomerRequest> {
    return this.repo.save(this.repo.create(data));
  }

  async update(id: string, patch: RequestPatch): Promise<void> {
    await this.repo.update(id, patch);
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
