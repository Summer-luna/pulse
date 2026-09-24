import { Args, Context, ID, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import type { GraphQLContext } from '../common/loaders/loaders.js';
import { Customer } from '../customers/customer.entity.js';
import { Issue } from '../issues/issue.entity.js';
import { Project } from '../projects/project.entity.js';
import { CreateRequestInput } from './create-request.input.js';
import { CustomerRequest } from './customer-request.entity.js';
import { RequestsService } from './requests.service.js';
import { UpdateRequestInput } from './update-request.input.js';

@Resolver(() => CustomerRequest)
export class RequestsResolver {
  constructor(private readonly requests: RequestsService) {}

  @Query(() => [CustomerRequest], { name: 'requests' })
  list(@Args('projectId', { type: () => ID, nullable: true }) projectId?: string): Promise<CustomerRequest[]> {
    return this.requests.list(projectId);
  }

  @Query(() => CustomerRequest, { name: 'request' })
  get(@Args('id', { type: () => ID }) id: string): Promise<CustomerRequest> {
    return this.requests.get(id);
  }

  @Mutation(() => CustomerRequest)
  createRequest(@Args('input', { type: () => CreateRequestInput }) input: CreateRequestInput): Promise<CustomerRequest> {
    return this.requests.create(input);
  }

  @Mutation(() => CustomerRequest)
  updateRequest(
    @Args('id', { type: () => ID }) id: string,
    @Args('input', { type: () => UpdateRequestInput }) input: UpdateRequestInput,
  ): Promise<CustomerRequest> {
    return this.requests.update(id, input);
  }

  @Mutation(() => CustomerRequest)
  deleteRequest(@Args('id', { type: () => ID }) id: string): Promise<CustomerRequest> {
    return this.requests.remove(id);
  }

  @Mutation(() => CustomerRequest, { description: 'Links this request to an existing issue and marks it converted' })
  convertRequestToIssue(
    @Args('id', { type: () => ID }) id: string,
    @Args('issueId', { type: () => ID }) issueId: string,
  ): Promise<CustomerRequest> {
    return this.requests.linkToIssue(id, issueId);
  }

  @ResolveField(() => Project)
  async project(@Parent() request: CustomerRequest, @Context() ctx: GraphQLContext): Promise<Project> {
    return (await ctx.loaders.projectById.load(request.projectId))!;
  }

  @ResolveField(() => Issue, { nullable: true })
  convertedIssue(@Parent() request: CustomerRequest, @Context() ctx: GraphQLContext): Promise<Issue | null> {
    return request.convertedIssueId ? ctx.loaders.issueById.load(request.convertedIssueId) : Promise.resolve(null);
  }

  @ResolveField(() => Customer, { nullable: true })
  customer(@Parent() request: CustomerRequest, @Context() ctx: GraphQLContext): Promise<Customer | null> {
    return request.customerId ? ctx.loaders.customerById.load(request.customerId) : Promise.resolve(null);
  }
}
