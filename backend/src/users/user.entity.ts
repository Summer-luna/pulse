import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from './user-role.enum.js';

@ObjectType()
@Entity('users')
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 80 })
  name!: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 200, unique: true })
  email!: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 16, default: '#5e6ad2' })
  color!: string;

  @Field(() => UserRole)
  @Column({ type: 'enum', enum: UserRole, enumName: 'user_role', default: UserRole.MEMBER })
  role!: UserRole;

  @Column({ type: 'varchar', length: 200, select: false })
  passwordHash!: string;

  @Field(() => GraphQLISODateTime)
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
