import { Field, ID, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, IsUUID, Length } from 'class-validator';

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

  @Field(() => String, { nullable: true, description: 'Free-text name; required unless requestorUserId is set' })
  @IsOptional()
  @IsString()
  @Length(1, 120)
  requestor?: string;

  @Field(() => ID, { nullable: true, description: 'The internal user filing this request' })
  @IsOptional()
  @IsUUID()
  requestorUserId?: string | null;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  customerId?: string | null;
}
