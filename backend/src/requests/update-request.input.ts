import { Field, ID, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString, IsUUID, Length } from 'class-validator';
import { RequestSource } from './request-source.enum.js';
import { RequestStatus } from './request-status.enum.js';

@InputType()
export class UpdateRequestInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  title?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 120)
  requestor?: string;

  @Field(() => RequestSource, { nullable: true })
  @IsOptional()
  @IsEnum(RequestSource)
  source?: RequestSource;

  @Field(() => RequestStatus, { nullable: true })
  @IsOptional()
  @IsEnum(RequestStatus)
  status?: RequestStatus;

  @Field(() => ID, { nullable: true, description: 'Pass null to unassign' })
  @IsOptional()
  @IsUUID()
  customerId?: string | null;
}
