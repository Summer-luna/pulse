import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '../users/user.entity.js';
import { AuthPayload } from './auth-payload.model.js';
import { AuthService } from './auth.service.js';
import { CurrentUser } from './current-user.decorator.js';
import { LoginInput } from './login.input.js';
import { Public } from './public.decorator.js';
import { RegisterInput } from './register.input.js';

@Resolver()
export class AuthResolver {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Mutation(() => AuthPayload)
  register(@Args('input') input: RegisterInput): Promise<AuthPayload> {
    return this.auth.register(input);
  }

  @Public()
  @Mutation(() => AuthPayload)
  login(@Args('input') input: LoginInput): Promise<AuthPayload> {
    return this.auth.login(input);
  }

  @Query(() => User, { name: 'me' })
  me(@CurrentUser() user: User): User {
    return user;
  }
}
