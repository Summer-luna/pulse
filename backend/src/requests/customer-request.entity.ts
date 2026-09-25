import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { RequestSource } from './request-source.enum.js';
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

  @Field(() => String)
  @Column({ type: 'varchar', length: 120 })
  requestor!: string;

  @Field(() => ID, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  customerId!: string | null;

  @Field(() => RequestSource)
  @Column({ type: 'enum', enum: RequestSource, enumName: 'request_source', default: RequestSource.EXTERNAL })
  source!: RequestSource;

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
