import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { ReleasePipelineType } from './release-pipeline-type.enum.js';

@InputType()
export class UpdateReleasePipelineInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 80)
  name?: string;

  @Field(() => ReleasePipelineType, { nullable: true })
  @IsOptional()
  @IsEnum(ReleasePipelineType)
  type?: ReleasePipelineType;
}
