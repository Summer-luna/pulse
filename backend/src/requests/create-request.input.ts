import { Field, ID, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString, IsUUID, Length } from 'class-validator';
import { RequestSource } from './request-source.enum.js';

@InputType()
export class CreateRequestInput {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  projectId?: string | null;

  @Field(() => String)
  @IsString()
  @Length(1, 200)
  title!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => String)
  @IsString()
  @Length(1, 120)
  requestor!: string;

  @Field(() => RequestSource, { nullable: true })
  @IsOptional()
  @IsEnum(RequestSource)
  source?: RequestSource;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  customerId?: string | null;
}
