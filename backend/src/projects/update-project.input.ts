import { Field, ID, InputType } from '@nestjs/graphql';
import { ArrayUnique, IsArray, IsDateString, IsEnum, IsOptional, IsString, IsUUID, Length } from 'class-validator';
import { DateScalar } from '../common/date.scalar.js';
import { ProjectPriority } from './project-priority.enum.js';
import { ProjectStatus } from './project-status.enum.js';
import { ProjectVisibility } from './project-visibility.enum.js';

@InputType()
export class UpdateProjectInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 80)
  name?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => ProjectStatus, { nullable: true })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @Field(() => ProjectPriority, { nullable: true })
  @IsOptional()
  @IsEnum(ProjectPriority)
  priority?: ProjectPriority;

  @Field(() => ProjectVisibility, { nullable: true })
  @IsOptional()
  @IsEnum(ProjectVisibility)
  visibility?: ProjectVisibility;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  leadId?: string | null;

  @Field(() => ID, { nullable: true, description: 'Pass null to unassign' })
  @IsOptional()
  @IsUUID()
  teamId?: string | null;

  @Field(() => [ID], { nullable: true, description: 'Replaces the full member list' })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUUID(undefined, { each: true })
  memberIds?: string[];

  @Field(() => DateScalar, { nullable: true })
  @IsOptional()
  @IsDateString()
  startDate?: string | null;

  @Field(() => DateScalar, { nullable: true })
  @IsOptional()
  @IsDateString()
  targetDate?: string | null;
}
