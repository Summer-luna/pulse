import { Field, GraphQLISODateTime, ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { DateScalar } from '../common/date.scalar.js';
import { IssuePriority } from './issue-priority.enum.js';
import { IssueStatus } from './issue-status.enum.js';

@ObjectType()
@Entity('issues')
@Unique(['projectId', 'number'])
export class Issue {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field(() => ID)
  @Column({ type: 'uuid' })
  projectId!: string;

  @Field(() => Int)
  @Column({ type: 'int' })
  number!: number;

  @Field(() => String)
  @Column({ type: 'varchar', length: 200 })
  title!: string;

  @Field(() => String)
  @Column({ type: 'text', default: '' })
  description!: string;

  @Field(() => IssueStatus)
  @Column({ type: 'enum', enum: IssueStatus, enumName: 'issue_status', default: IssueStatus.BACKLOG })
  status!: IssueStatus;

  @Field(() => IssuePriority)
  @Column({ type: 'enum', enum: IssuePriority, enumName: 'issue_priority', default: IssuePriority.NO_PRIORITY })
  priority!: IssuePriority;

  @Field(() => Int, { nullable: true, description: 'Points: 0, 1, 2, 3, 5 or 8. Null means no estimate.' })
  @Column({ type: 'smallint', nullable: true })
  estimate!: number | null;

  @Field(() => ID, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  assigneeId!: string | null;

  @Field(() => ID, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  parentId!: string | null;

  @Field(() => ID, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  releaseId!: string | null;

  @Field(() => DateScalar, { nullable: true })
  @Column({ type: 'date', nullable: true })
  dueDate!: string | null;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Column({ type: 'timestamptz', nullable: true })
  completedAt!: Date | null;

  @Field(() => GraphQLISODateTime)
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
