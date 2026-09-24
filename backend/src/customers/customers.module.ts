import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerRequest } from '../requests/customer-request.entity.js';
import { Customer } from './customer.entity.js';
import { CustomersRepository } from './customers.repository.js';
import { CustomersResolver } from './customers.resolver.js';
import { CustomersService } from './customers.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, CustomerRequest])],
  providers: [CustomersRepository, CustomersResolver, CustomersService],
  exports: [CustomersService],
})
export class CustomersModule {}
