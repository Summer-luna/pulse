import { Args, Context, ID, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import type { GraphQLContext } from '../common/loaders/loaders.js';
import { Progress } from '../common/progress.model.js';
import { User } from '../users/user.entity.js';
import { CreateProjectInput } from './create-project.input.js';
import { Project } from './project.entity.js';
import { ProjectsService } from './projects.service.js';
import { UpdateProjectInput } from './update-project.input.js';

@Resolver(() => Project)
export class ProjectsResolver {
  constructor(private readonly projects: ProjectsService) {}

  @Query(() => [Project], { name: 'projects' })
  list(): Promise<Project[]> {
    return this.projects.list();
  }

  @Query(() => Project, { name: 'project' })
  get(@Args('id', { type: () => ID }) id: string): Promise<Project> {
    return this.projects.get(id);
  }

  @Mutation(() => Project)
  createProject(@Args('input', { type: () => CreateProjectInput }) input: CreateProjectInput): Promise<Project> {
    return this.projects.create(input);
  }

  @Mutation(() => Project)
  updateProject(
    @Args('id', { type: () => ID }) id: string,
    @Args('input', { type: () => UpdateProjectInput }) input: UpdateProjectInput,
  ): Promise<Project> {
    return this.projects.update(id, input);
  }

  @Mutation(() => Project)
  deleteProject(@Args('id', { type: () => ID }) id: string): Promise<Project> {
    return this.projects.remove(id);
  }

  @ResolveField(() => User, { nullable: true })
  lead(@Parent() project: Project, @Context() ctx: GraphQLContext): Promise<User | null> {
    return project.leadId ? ctx.loaders.userById.load(project.leadId) : Promise.resolve(null);
  }

  @ResolveField(() => Progress)
  progress(@Parent() project: Project, @Context() ctx: GraphQLContext): Promise<Progress> {
    return ctx.loaders.progressByProjectId.load(project.id);
  }

  @ResolveField(() => [User])
  members(@Parent() project: Project, @Context() ctx: GraphQLContext): Promise<User[]> {
    return ctx.loaders.membersByProjectId.load(project.id);
  }
}
