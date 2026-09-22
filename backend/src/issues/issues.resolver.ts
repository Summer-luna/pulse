import { Args, Context, ID, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import type { GraphQLContext } from '../common/loaders/loaders.js';
import { Progress } from '../common/progress.model.js';
import { Label } from '../labels/label.entity.js';
import { Project } from '../projects/project.entity.js';
import { Release } from '../releases/release.entity.js';
import { User } from '../users/user.entity.js';
import { CreateIssueInput } from './create-issue.input.js';
import { Issue } from './issue.entity.js';
import { IssuesFilterInput } from './issues-filter.input.js';
import { IssuesService } from './issues.service.js';
import { UpdateIssueInput } from './update-issue.input.js';

@Resolver(() => Issue)
export class IssuesResolver {
  constructor(private readonly issues: IssuesService) {}

  @Query(() => [Issue], { name: 'issues' })
  list(@Args('filter', { type: () => IssuesFilterInput, nullable: true }) filter?: IssuesFilterInput): Promise<Issue[]> {
    return this.issues.list(filter ?? {});
  }

  @Query(() => Issue, { name: 'issue' })
  get(@Args('id', { type: () => ID }) id: string): Promise<Issue> {
    return this.issues.get(id);
  }

  @Query(() => Issue, { name: 'issueByIdentifier', description: 'Look up an issue by its human readable identifier, e.g. ENG-12' })
  getByIdentifier(@Args('identifier', { type: () => String }) identifier: string): Promise<Issue> {
    return this.issues.getByIdentifier(identifier);
  }

  @Mutation(() => Issue)
  createIssue(@Args('input', { type: () => CreateIssueInput }) input: CreateIssueInput): Promise<Issue> {
    return this.issues.create(input);
  }

  @Mutation(() => Issue)
  updateIssue(
    @Args('id', { type: () => ID }) id: string,
    @Args('input', { type: () => UpdateIssueInput }) input: UpdateIssueInput,
  ): Promise<Issue> {
    return this.issues.update(id, input);
  }

  @Mutation(() => Issue, { description: 'Sub-issues of the deleted issue become top-level issues' })
  deleteIssue(@Args('id', { type: () => ID }) id: string): Promise<Issue> {
    return this.issues.remove(id);
  }

  @ResolveField(() => String)
  async identifier(@Parent() issue: Issue, @Context() ctx: GraphQLContext): Promise<string> {
    const project = await ctx.loaders.projectById.load(issue.projectId);
    return `${project!.key}-${issue.number}`;
  }

  @ResolveField(() => Project)
  async project(@Parent() issue: Issue, @Context() ctx: GraphQLContext): Promise<Project> {
    return (await ctx.loaders.projectById.load(issue.projectId))!;
  }

  @ResolveField(() => User, { nullable: true })
  assignee(@Parent() issue: Issue, @Context() ctx: GraphQLContext): Promise<User | null> {
    return issue.assigneeId ? ctx.loaders.userById.load(issue.assigneeId) : Promise.resolve(null);
  }

  @ResolveField(() => Issue, { nullable: true })
  parent(@Parent() issue: Issue, @Context() ctx: GraphQLContext): Promise<Issue | null> {
    return issue.parentId ? ctx.loaders.issueById.load(issue.parentId) : Promise.resolve(null);
  }

  @ResolveField(() => [Issue])
  subIssues(@Parent() issue: Issue, @Context() ctx: GraphQLContext): Promise<Issue[]> {
    return ctx.loaders.subIssuesByParentId.load(issue.id);
  }

  @ResolveField(() => Progress, { nullable: true, description: 'Null when the issue has no sub-issues' })
  async subIssueProgress(@Parent() issue: Issue, @Context() ctx: GraphQLContext): Promise<Progress | null> {
    const progress = await ctx.loaders.progressByParentId.load(issue.id);
    return progress.total > 0 ? progress : null;
  }

  @ResolveField(() => Release, { nullable: true })
  release(@Parent() issue: Issue, @Context() ctx: GraphQLContext): Promise<Release | null> {
    return issue.releaseId ? ctx.loaders.releaseById.load(issue.releaseId) : Promise.resolve(null);
  }

  @ResolveField(() => [Label])
  labels(@Parent() issue: Issue, @Context() ctx: GraphQLContext): Promise<Label[]> {
    return ctx.loaders.labelsByIssueId.load(issue.id);
  }
}
