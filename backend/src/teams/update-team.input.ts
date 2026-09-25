import { Field, ID, InputType } from '@nestjs/graphql';
import { ArrayUnique, IsArray, IsEnum, IsOptional, IsString, IsUUID, Length } from 'class-validator';
import { TeamAccess } from './team-access.enum.js';

@InputType()
export class UpdateTeamInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 80)
  name?: string;

  @Field(() => TeamAccess, { nullable: true })
  @IsOptional()
  @IsEnum(TeamAccess)
  access?: TeamAccess;

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
