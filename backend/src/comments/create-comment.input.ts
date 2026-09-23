import { Field, ID, InputType } from '@nestjs/graphql';
import { IsString, IsUUID, Length } from 'class-validator';

@InputType()
export class CreateCommentInput {
  @Field(() => ID)
  @IsUUID()
  issueId!: string;

  @Field(() => String)
  @IsString()
  @Length(1, 10_000)
  body!: string;
}
