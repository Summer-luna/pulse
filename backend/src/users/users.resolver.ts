import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { InviteMembersInput } from './invite-members.input.js';
import { InvitedMember } from './invited-member.model.js';
import { User } from './user.entity.js';
import { UsersService } from './users.service.js';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly users: UsersService) {}

  @Query(() => [User], { name: 'users' })
  list(): Promise<User[]> {
    return this.users.list();
  }

  @Mutation(() => [InvitedMember], { description: 'Admin only. Returns each invited member with a one-time temporary password.' })
  inviteMembers(
    @Args('input', { type: () => InviteMembersInput }) input: InviteMembersInput,
    @CurrentUser() user: User,
  ): Promise<InvitedMember[]> {
    return this.users.invite(input, user);
  }

  @Mutation(() => User, { description: 'Admin only.' })
  removeMember(@Args('id', { type: () => ID }) id: string, @CurrentUser() user: User): Promise<User> {
    return this.users.remove(id, user);
  }
}
