import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerInput } from './create-customer.input.js';
import { Customer } from './customer.entity.js';
import { CustomerStatus } from './customer-status.enum.js';
import { CustomerType } from './customer-type.enum.js';
import { CustomersRepository } from './customers.repository.js';
import { UpdateCustomerInput } from './update-customer.input.js';

@Injectable()
export class CustomersService {
  constructor(private readonly customers: CustomersRepository) {}

  list(): Promise<Customer[]> {
    return this.customers.findAll();
  }

  findByIds(ids: string[]): Promise<Customer[]> {
    return this.customers.findByIds(ids);
  }

  async get(id: string): Promise<Customer> {
    const customer = await this.customers.findById(id);
    if (!customer) {
      throw new NotFoundException(`Customer ${id} not found`);
    }
    return customer;
  }

  create(input: CreateCustomerInput): Promise<Customer> {
    return this.customers.create({
      ...input,
      status: input.status ?? CustomerStatus.ACTIVE,
      type: input.type ?? CustomerType.EXTERNAL,
      domains: input.domains ?? [],
    });
  }

  async update(id: string, input: UpdateCustomerInput): Promise<Customer> {
    await this.get(id);
    await this.customers.update(id, input);
    return this.get(id);
  }

  async remove(id: string): Promise<Customer> {
    const customer = await this.get(id);
    await this.customers.remove(id);
    return customer;
  }

  requestCount(customerId: string): Promise<number> {
    return this.customers.requestCount(customerId);
  }
}
