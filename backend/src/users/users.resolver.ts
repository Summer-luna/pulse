import { Query, Resolver } from '@nestjs/graphql';
import { User } from './user.entity.js';
import { UsersService } from './users.service.js';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly users: UsersService) {}

  @Query(() => [User], { name: 'users' })
  list(): Promise<User[]> {
    return this.users.list();
  }
}
