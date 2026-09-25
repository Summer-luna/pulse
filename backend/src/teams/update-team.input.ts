import { Field, ID, InputType } from '@nestjs/graphql';
import { ArrayUnique, IsArray, IsOptional, IsString, IsUUID, Length } from 'class-validator';

@InputType()
export class UpdateTeamInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 80)
  name?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => [ID], { nullable: true, description: 'Replaces the full member list' })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUUID(undefined, { each: true })
  memberIds?: string[];
}
