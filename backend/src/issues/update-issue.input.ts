import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { ArrayUnique, IsArray, IsDateString, IsEnum, IsIn, IsOptional, IsString, IsUUID, Length } from 'class-validator';
import { ISSUE_ESTIMATE_VALUES } from './issue-estimate.js';
import { DateScalar } from '../common/date.scalar.js';
import { IssuePriority } from './issue-priority.enum.js';
import { IssueStatus } from './issue-status.enum.js';

@InputType()
export class UpdateIssueInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  title?: string;

  @Field(() => ID, { nullable: true, description: 'Move the issue to a different project; clears parentId and releaseId' })
  @IsOptional()
  @IsUUID()
  projectId?: string;

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

  @Field(() => Int, { nullable: true, description: 'Points: 0, 1, 2, 3, 5 or 8. Pass null to clear.' })
  @IsOptional()
  @IsIn(ISSUE_ESTIMATE_VALUES)
  estimate?: number | null;

  @Field(() => ID, { nullable: true, description: 'Pass null to unassign' })
  @IsOptional()
  @IsUUID()
  assigneeId?: string | null;

  @Field(() => ID, { nullable: true, description: 'Pass null to turn a sub-issue back into a top-level issue' })
  @IsOptional()
  @IsUUID()
  parentId?: string | null;

  @Field(() => ID, { nullable: true, description: 'Pass null to remove from the release' })
  @IsOptional()
  @IsUUID()
  releaseId?: string | null;

  @Field(() => DateScalar, { nullable: true, description: 'Pass null to clear' })
  @IsOptional()
  @IsDateString()
  dueDate?: string | null;

  @Field(() => [ID], { nullable: true, description: 'Replaces the full label list' })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUUID(undefined, { each: true })
  labelIds?: string[];
}
