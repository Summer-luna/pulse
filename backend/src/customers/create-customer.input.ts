import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { ArrayMaxSize, IsArray, IsEnum, IsInt, IsOptional, IsString, IsUUID, Length, Min } from 'class-validator';
import { CustomerStatus } from './customer-status.enum.js';
import { CustomerTier } from './customer-tier.enum.js';

@InputType()
export class CreateCustomerInput {
  @Field(() => String)
  @IsString()
  @Length(1, 120)
  name!: string;

  @Field(() => CustomerStatus, { nullable: true })
  @IsOptional()
  @IsEnum(CustomerStatus)
  status?: CustomerStatus;

  @Field(() => CustomerTier, { nullable: true })
  @IsOptional()
  @IsEnum(CustomerTier)
  tier?: CustomerTier | null;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  annualRevenue?: number | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 40)
  size?: string | null;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  domains?: string[];

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  ownerId?: string | null;
}
