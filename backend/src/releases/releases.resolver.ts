import { Args, Context, ID, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import type { GraphQLContext } from '../common/loaders/loaders.js';
import { Progress } from '../common/progress.model.js';
import { Project } from '../projects/project.entity.js';
import { CreateReleaseInput } from './create-release.input.js';
import { Release } from './release.entity.js';
import { ReleasesService } from './releases.service.js';
import { UpdateReleaseInput } from './update-release.input.js';

@Resolver(() => Release)
export class ReleasesResolver {
  constructor(private readonly releases: ReleasesService) {}

  @Query(() => [Release], { name: 'releases' })
  list(@Args('projectId', { type: () => ID, nullable: true }) projectId?: string): Promise<Release[]> {
    return this.releases.list(projectId);
  }

  @Query(() => Release, { name: 'release' })
  get(@Args('id', { type: () => ID }) id: string): Promise<Release> {
    return this.releases.get(id);
  }

  @Mutation(() => Release)
  createRelease(@Args('input', { type: () => CreateReleaseInput }) input: CreateReleaseInput): Promise<Release> {
    return this.releases.create(input);
  }

  @Mutation(() => Release)
  updateRelease(
    @Args('id', { type: () => ID }) id: string,
    @Args('input', { type: () => UpdateReleaseInput }) input: UpdateReleaseInput,
  ): Promise<Release> {
    return this.releases.update(id, input);
  }

  @Mutation(() => Release)
  deleteRelease(@Args('id', { type: () => ID }) id: string): Promise<Release> {
    return this.releases.remove(id);
  }

  @ResolveField(() => Project)
  async project(@Parent() release: Release, @Context() ctx: GraphQLContext): Promise<Project> {
    return (await ctx.loaders.projectById.load(release.projectId))!;
  }

  @ResolveField(() => Progress)
  progress(@Parent() release: Release, @Context() ctx: GraphQLContext): Promise<Progress> {
    return ctx.loaders.progressByReleaseId.load(release.id);
  }
}
