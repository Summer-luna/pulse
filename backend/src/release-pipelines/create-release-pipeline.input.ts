import { Field, ID, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString, IsUUID, Length } from 'class-validator';
import { ReleasePipelineType } from './release-pipeline-type.enum.js';

@InputType()
export class CreateReleasePipelineInput {
  @Field(() => ID)
  @IsUUID()
  projectId!: string;

  @Field(() => String)
  @IsString()
  @Length(1, 80)
  name!: string;

  @Field(() => ReleasePipelineType, { nullable: true })
  @IsOptional()
  @IsEnum(ReleasePipelineType)
  type?: ReleasePipelineType;
}
