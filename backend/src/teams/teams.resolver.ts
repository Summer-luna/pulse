import { Args, Context, ID, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/current-user.decorator.js';
import type { GraphQLContext } from '../common/loaders/loaders.js';
import { User } from '../users/user.entity.js';
import { CreateTeamInput } from './create-team.input.js';
import { Team } from './team.entity.js';
import { TeamsService } from './teams.service.js';
import { UpdateTeamInput } from './update-team.input.js';

@Resolver(() => Team)
export class TeamsResolver {
  constructor(private readonly teams: TeamsService) {}

  @Query(() => [Team], { name: 'teams' })
  list(): Promise<Team[]> {
    return this.teams.list();
  }

  @Query(() => Team, { name: 'team' })
  get(@Args('id', { type: () => ID }) id: string): Promise<Team> {
    return this.teams.get(id);
  }

  @Mutation(() => Team)
  createTeam(@Args('input', { type: () => CreateTeamInput }) input: CreateTeamInput): Promise<Team> {
    return this.teams.create(input);
  }

  @Mutation(() => Team)
  updateTeam(
    @Args('id', { type: () => ID }) id: string,
    @Args('input', { type: () => UpdateTeamInput }) input: UpdateTeamInput,
  ): Promise<Team> {
    return this.teams.update(id, input);
  }

  @Mutation(() => Team)
  deleteTeam(@Args('id', { type: () => ID }) id: string): Promise<Team> {
    return this.teams.remove(id);
  }

  @Mutation(() => Team, { description: 'Adds the current user to the team' })
  joinTeam(@Args('id', { type: () => ID }) id: string, @CurrentUser() user: User): Promise<Team> {
    return this.teams.join(id, user.id);
  }

  @Mutation(() => Team, { description: 'Removes the current user from the team' })
  leaveTeam(@Args('id', { type: () => ID }) id: string, @CurrentUser() user: User): Promise<Team> {
    return this.teams.leave(id, user.id);
  }

  @ResolveField(() => [User])
  members(@Parent() team: Team, @Context() ctx: GraphQLContext): Promise<User[]> {
    return ctx.loaders.membersByTeamId.load(team.id);
  }

  @ResolveField(() => Boolean)
  async isMember(@Parent() team: Team, @Context() ctx: GraphQLContext, @CurrentUser() user: User): Promise<boolean> {
    const members = await ctx.loaders.membersByTeamId.load(team.id);
    return members.some((member) => member.id === user.id);
  }

  @ResolveField(() => Int)
  activeProjectCount(@Parent() team: Team, @Context() ctx: GraphQLContext): Promise<number> {
    return ctx.loaders.activeProjectCountByTeamId.load(team.id);
  }
}
