import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerRequest } from './customer-request.entity.js';

export type RequestPatch = Partial<Omit<CustomerRequest, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>>;

@Injectable()
export class RequestsRepository {
  constructor(@InjectRepository(CustomerRequest) private readonly repo: Repository<CustomerRequest>) {}

  findAll(projectId?: string): Promise<CustomerRequest[]> {
    return this.repo.find({
      where: projectId ? { projectId } : {},
      order: { createdAt: 'DESC' },
    });
  }

  findById(id: string): Promise<CustomerRequest | null> {
    return this.repo.findOneBy({ id });
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
