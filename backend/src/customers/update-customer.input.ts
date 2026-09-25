import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { ArrayMaxSize, IsArray, IsEnum, IsInt, IsOptional, IsString, IsUUID, Length, Min } from 'class-validator';
import { CustomerStatus } from './customer-status.enum.js';
import { CustomerTier } from './customer-tier.enum.js';
import { CustomerType } from './customer-type.enum.js';

@InputType()
export class UpdateCustomerInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 120)
  name?: string;

  @Field(() => CustomerStatus, { nullable: true })
  @IsOptional()
  @IsEnum(CustomerStatus)
  status?: CustomerStatus;

  @Field(() => CustomerType, { nullable: true })
  @IsOptional()
  @IsEnum(CustomerType)
  type?: CustomerType;

  @Field(() => CustomerTier, { nullable: true, description: 'Pass null to clear' })
  @IsOptional()
  @IsEnum(CustomerTier)
  tier?: CustomerTier | null;

  @Field(() => Int, { nullable: true, description: 'Pass null to clear' })
  @IsOptional()
  @IsInt()
  @Min(0)
  annualRevenue?: number | null;

  @Field(() => String, { nullable: true, description: 'Pass null to clear' })
  @IsOptional()
  @IsString()
  @Length(1, 40)
  size?: string | null;

  @Field(() => [String], { nullable: true, description: 'Replaces the full domain list' })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  domains?: string[];

  @Field(() => ID, { nullable: true, description: 'Pass null to unassign' })
  @IsOptional()
  @IsUUID()
  ownerId?: string | null;
}
