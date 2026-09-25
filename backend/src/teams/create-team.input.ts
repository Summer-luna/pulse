import { Field, ID, InputType } from '@nestjs/graphql';
import { ArrayUnique, IsArray, IsOptional, IsString, IsUUID, Length, Matches } from 'class-validator';

@InputType()
export class CreateTeamInput {
  @Field(() => String)
  @IsString()
  @Length(1, 80)
  name!: string;

  @Field(() => String, { description: '2-5 letters' })
  @Matches(/^[A-Za-z]{2,5}$/, { message: 'key must be 2-5 letters' })
  key!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => [ID], { nullable: true })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUUID(undefined, { each: true })
  memberIds?: string[];
}
