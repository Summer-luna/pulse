import { Args, Context, ID, Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/current-user.decorator.js';
import type { GraphQLContext } from '../common/loaders/loaders.js';
import { User } from '../users/user.entity.js';
import { Comment } from './comment.entity.js';
import { CommentsService } from './comments.service.js';
import { CreateCommentInput } from './create-comment.input.js';

@Resolver(() => Comment)
export class CommentsResolver {
  constructor(private readonly comments: CommentsService) {}

  @Mutation(() => Comment)
  createComment(
    @Args('input', { type: () => CreateCommentInput }) input: CreateCommentInput,
    @CurrentUser() user: User,
  ): Promise<Comment> {
    return this.comments.create(input, user.id);
  }

  @Mutation(() => Comment)
  deleteComment(@Args('id', { type: () => ID }) id: string, @CurrentUser() user: User): Promise<Comment> {
    return this.comments.remove(id, user.id);
  }

  @ResolveField(() => User, { nullable: true })
  author(@Parent() comment: Comment, @Context() ctx: GraphQLContext): Promise<User | null> {
    return comment.authorId ? ctx.loaders.userById.load(comment.authorId) : Promise.resolve(null);
  }
}
