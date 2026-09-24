import { Args, Context, ID, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import type { GraphQLContext } from '../common/loaders/loaders.js';
import { User } from '../users/user.entity.js';
import { CreateCustomerInput } from './create-customer.input.js';
import { Customer } from './customer.entity.js';
import { CustomersService } from './customers.service.js';
import { UpdateCustomerInput } from './update-customer.input.js';

@Resolver(() => Customer)
export class CustomersResolver {
  constructor(private readonly customers: CustomersService) {}

  @Query(() => [Customer], { name: 'customers' })
  list(): Promise<Customer[]> {
    return this.customers.list();
  }

  @Query(() => Customer, { name: 'customer' })
  get(@Args('id', { type: () => ID }) id: string): Promise<Customer> {
    return this.customers.get(id);
  }

  @Mutation(() => Customer)
  createCustomer(@Args('input', { type: () => CreateCustomerInput }) input: CreateCustomerInput): Promise<Customer> {
    return this.customers.create(input);
  }

  @Mutation(() => Customer)
  updateCustomer(
    @Args('id', { type: () => ID }) id: string,
    @Args('input', { type: () => UpdateCustomerInput }) input: UpdateCustomerInput,
  ): Promise<Customer> {
    return this.customers.update(id, input);
  }

  @Mutation(() => Customer)
  deleteCustomer(@Args('id', { type: () => ID }) id: string): Promise<Customer> {
    return this.customers.remove(id);
  }

  @ResolveField(() => User, { nullable: true })
  owner(@Parent() customer: Customer, @Context() ctx: GraphQLContext): Promise<User | null> {
    return customer.ownerId ? ctx.loaders.userById.load(customer.ownerId) : Promise.resolve(null);
  }

  @ResolveField(() => Int)
  requestCount(@Parent() customer: Customer): Promise<number> {
    return this.customers.requestCount(customer.id);
  }
}
