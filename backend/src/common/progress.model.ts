import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Progress {
  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  completed!: number;
}
