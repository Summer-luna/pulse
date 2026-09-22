import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { GraphQLContext } from '../common/loaders/loaders.js';
import type { User } from '../users/user.entity.js';

export const CurrentUser = createParamDecorator((_: unknown, context: ExecutionContext): User => {
  const ctx = GqlExecutionContext.create(context).getContext<GraphQLContext>();
  return ctx.req.user!;
});
