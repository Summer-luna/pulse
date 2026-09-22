import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { ArrayUnique, IsArray, IsDateString, IsEnum, IsIn, IsOptional, IsString, IsUUID, Length } from 'class-validator';
import { ISSUE_ESTIMATE_VALUES } from './issue-estimate.js';
import { DateScalar } from '../common/date.scalar.js';
import { IssuePriority } from './issue-priority.enum.js';
import { IssueStatus } from './issue-status.enum.js';

@InputType()
export class CreateIssueInput {
  @Field(() => ID)
  @IsUUID()
  projectId!: string;

  @Field(() => String)
  @IsString()
  @Length(1, 200)
  title!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => IssueStatus, { nullable: true })
  @IsOptional()
  @IsEnum(IssueStatus)
  status?: IssueStatus;

  @Field(() => IssuePriority, { nullable: true })
  @IsOptional()
  @IsEnum(IssuePriority)
  priority?: IssuePriority;

  @Field(() => Int, { nullable: true, description: 'Points: 0, 1, 2, 3, 5 or 8' })
  @IsOptional()
  @IsIn(ISSUE_ESTIMATE_VALUES)
  estimate?: number | null;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  assigneeId?: string | null;

  @Field(() => ID, { nullable: true, description: 'Makes this issue a sub-issue; the parent must be in the same project' })
  @IsOptional()
  @IsUUID()
  parentId?: string | null;

  @Field(() => ID, { nullable: true, description: 'The release must belong to the same project' })
  @IsOptional()
  @IsUUID()
  releaseId?: string | null;

  @Field(() => DateScalar, { nullable: true })
  @IsOptional()
  @IsDateString()
  dueDate?: string | null;

  @Field(() => [ID], { nullable: true })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUUID(undefined, { each: true })
  labelIds?: string[];
}
