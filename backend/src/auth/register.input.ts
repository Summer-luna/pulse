import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, Length } from 'class-validator';

@InputType()
export class RegisterInput {
  @Field(() => String)
  @IsString()
  @Length(1, 80)
  name!: string;

  @Field(() => String)
  @IsEmail()
  email!: string;

  @Field(() => String)
  @IsString()
  @Length(8, 72, { message: 'password must be 8-72 characters' })
  password!: string;
}
