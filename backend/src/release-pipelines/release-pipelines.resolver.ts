import { Args, Context, ID, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import type { GraphQLContext } from '../common/loaders/loaders.js';
import { Project } from '../projects/project.entity.js';
import { Release } from '../releases/release.entity.js';
import { CreateReleasePipelineInput } from './create-release-pipeline.input.js';
import { ReleasePipeline } from './release-pipeline.entity.js';
import { ReleasePipelinesService } from './release-pipelines.service.js';
import { UpdateReleasePipelineInput } from './update-release-pipeline.input.js';

@Resolver(() => ReleasePipeline)
export class ReleasePipelinesResolver {
  constructor(private readonly pipelines: ReleasePipelinesService) {}

  @Query(() => [ReleasePipeline], { name: 'releasePipelines' })
  list(@Args('projectId', { type: () => ID, nullable: true }) projectId?: string): Promise<ReleasePipeline[]> {
    return this.pipelines.list(projectId);
  }

  @Query(() => ReleasePipeline, { name: 'releasePipeline' })
  get(@Args('id', { type: () => ID }) id: string): Promise<ReleasePipeline> {
    return this.pipelines.get(id);
  }

  @Mutation(() => ReleasePipeline)
  createReleasePipeline(@Args('input', { type: () => CreateReleasePipelineInput }) input: CreateReleasePipelineInput): Promise<ReleasePipeline> {
    return this.pipelines.create(input);
  }

  @Mutation(() => ReleasePipeline)
  updateReleasePipeline(
    @Args('id', { type: () => ID }) id: string,
    @Args('input', { type: () => UpdateReleasePipelineInput }) input: UpdateReleasePipelineInput,
  ): Promise<ReleasePipeline> {
    return this.pipelines.update(id, input);
  }

  @Mutation(() => ReleasePipeline)
  deleteReleasePipeline(@Args('id', { type: () => ID }) id: string): Promise<ReleasePipeline> {
    return this.pipelines.remove(id);
  }

  @ResolveField(() => Project)
  async project(@Parent() pipeline: ReleasePipeline, @Context() ctx: GraphQLContext): Promise<Project> {
    return (await ctx.loaders.projectById.load(pipeline.projectId))!;
  }

  @ResolveField(() => Int)
  releaseCount(@Parent() pipeline: ReleasePipeline): Promise<number> {
    return this.pipelines.releaseCount(pipeline.id);
  }

  @ResolveField(() => Release, { nullable: true })
  latestRelease(@Parent() pipeline: ReleasePipeline): Promise<Release | null> {
    return this.pipelines.latestRelease(pipeline.id);
  }
}
