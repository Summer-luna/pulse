import { Field, ID, InputType } from '@nestjs/graphql';
import { IsArray, IsBoolean, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import type { IssueQuery } from './issue-query.js';
import { IssueStatus } from './issue-status.enum.js';

@InputType()
export class IssuesFilterInput implements IssueQuery {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  releaseId?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  assigneeId?: string;

  @Field(() => ID, { nullable: true, description: 'Only direct sub-issues of this issue' })
  @IsOptional()
  @IsUUID()
  parentId?: string;

  @Field(() => [IssueStatus], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsEnum(IssueStatus, { each: true })
  statuses?: IssueStatus[];

  @Field(() => Boolean, { nullable: true, description: 'Exclude sub-issues' })
  @IsOptional()
  @IsBoolean()
  topLevelOnly?: boolean;

  @Field(() => String, { nullable: true, description: 'Case-insensitive match on the title' })
  @IsOptional()
  @IsString()
  search?: string;
}
