import { Field, ID, InputType } from '@nestjs/graphql';
import { IsDateString, IsEnum, IsOptional, IsString, IsUUID, Length } from 'class-validator';
import { DateScalar } from '../common/date.scalar.js';
import { ReleaseStatus } from './release-status.enum.js';

@InputType()
export class CreateReleaseInput {
  @Field(() => ID)
  @IsUUID()
  projectId!: string;

  @Field(() => String)
  @IsString()
  @Length(1, 80)
  name!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 40)
  version?: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => ReleaseStatus, { nullable: true })
  @IsOptional()
  @IsEnum(ReleaseStatus)
  status?: ReleaseStatus;

  @Field(() => DateScalar, { nullable: true })
  @IsOptional()
  @IsDateString()
  targetDate?: string | null;
}
