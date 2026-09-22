import { Field, ID, InputType } from '@nestjs/graphql';
import { ArrayUnique, IsArray, IsDateString, IsEnum, IsOptional, IsString, IsUUID, Length, Matches } from 'class-validator';
import { DateScalar } from '../common/date.scalar.js';
import { ProjectPriority } from './project-priority.enum.js';
import { ProjectStatus } from './project-status.enum.js';

@InputType()
export class CreateProjectInput {
  @Field(() => String)
  @IsString()
  @Length(1, 80)
  name!: string;

  @Field(() => String, { description: '2-5 letters, used as the issue identifier prefix' })
  @Matches(/^[A-Za-z]{2,5}$/, { message: 'key must be 2-5 letters' })
  key!: string;

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

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  leadId?: string | null;

  @Field(() => [ID], { nullable: true })
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
