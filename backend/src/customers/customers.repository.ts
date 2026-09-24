import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CustomerRequest } from '../requests/customer-request.entity.js';
import { Customer } from './customer.entity.js';

export type CustomerPatch = Partial<Omit<Customer, 'id' | 'createdAt'>>;

@Injectable()
export class CustomersRepository {
  constructor(
    @InjectRepository(Customer) private readonly repo: Repository<Customer>,
    @InjectRepository(CustomerRequest) private readonly requests: Repository<CustomerRequest>,
  ) {}

  findAll(): Promise<Customer[]> {
    return this.repo.find({ order: { name: 'ASC' } });
  }

  findById(id: string): Promise<Customer | null> {
    return this.repo.findOneBy({ id });
  }

  findByIds(ids: string[]): Promise<Customer[]> {
    return this.repo.findBy({ id: In(ids) });
  }

  create(data: Pick<Customer, 'name'> & CustomerPatch): Promise<Customer> {
    return this.repo.save(this.repo.create(data));
  }

  async update(id: string, patch: CustomerPatch): Promise<void> {
    await this.repo.update(id, patch);
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  requestCount(customerId: string): Promise<number> {
    return this.requests.count({ where: { customerId } });
  }
}
