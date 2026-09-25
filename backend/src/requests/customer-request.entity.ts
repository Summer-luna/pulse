import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { RequestStatus } from './request-status.enum.js';

@ObjectType()
@Entity('requests')
export class CustomerRequest {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field(() => ID, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  projectId!: string | null;

  @Field(() => String)
  @Column({ type: 'varchar', length: 200 })
  title!: string;

  @Field(() => String)
  @Column({ type: 'text', default: '' })
  description!: string;

  @Field(() => String, { nullable: true, description: 'Free-text name, set for requests from an external customer' })
  @Column({ type: 'varchar', length: 120, nullable: true })
  requestor!: string | null;

  @Field(() => ID, { nullable: true, description: 'The internal user who filed this request, if any' })
  @Column({ type: 'uuid', nullable: true })
  requestorUserId!: string | null;

  @Field(() => ID, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  customerId!: string | null;

  @Field(() => RequestStatus)
  @Column({ type: 'enum', enum: RequestStatus, enumName: 'request_status', default: RequestStatus.OPEN })
  status!: RequestStatus;

  @Field(() => ID, { nullable: true, description: 'Set once this request has been converted into an issue' })
  @Column({ type: 'uuid', nullable: true })
  convertedIssueId!: string | null;

  @Field(() => GraphQLISODateTime)
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
