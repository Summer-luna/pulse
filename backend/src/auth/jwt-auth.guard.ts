import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import type { GraphQLContext } from '../common/loaders/loaders.js';
import { IS_PUBLIC_KEY } from './public.decorator.js';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  override getRequest(context: ExecutionContext): GraphQLContext['req'] {
    // REST controllers (e.g. file uploads) run as a plain 'http' context, where
    // GqlExecutionContext.getContext() does not return the request; only actual
    // GraphQL resolvers get their request via the context function in app.module.ts.
    if (context.getType<GqlContextType>() === 'graphql') {
      return GqlExecutionContext.create(context).getContext<GraphQLContext>().req;
    }
    return context.switchToHttp().getRequest();
  }

  override canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);
    if (isPublic) {
      return true;
    }
    const req = this.getRequest(context);
    if (req.user) {
      return true;
    }
    return super.canActivate(context) as boolean | Promise<boolean>;
  }
}
