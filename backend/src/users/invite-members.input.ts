import { Field, InputType } from '@nestjs/graphql';
import { ArrayMaxSize, ArrayMinSize, ArrayUnique, IsArray, IsEmail, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from './user-role.enum.js';

@InputType()
export class InviteMembersInput {
  @Field(() => [String])
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @ArrayUnique()
  @IsEmail({}, { each: true })
  emails!: string[];

  @Field(() => UserRole, { nullable: true })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
