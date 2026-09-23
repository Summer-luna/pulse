import { Field, ObjectType } from '@nestjs/graphql';
import { User } from './user.entity.js';

@ObjectType()
export class InvitedMember {
  @Field(() => User)
  user!: User;

  @Field(() => String, { description: 'Shown once at invite time; not recoverable afterwards' })
  temporaryPassword!: string;
}
