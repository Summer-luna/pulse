import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { DateScalar } from '../common/date.scalar.js';
import { ProjectPriority } from './project-priority.enum.js';
import { ProjectStatus } from './project-status.enum.js';

@ObjectType()
@Entity('projects')
export class Project {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 80 })
  name!: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 5, unique: true })
  key!: string;

  @Field(() => String)
  @Column({ type: 'text', default: '' })
  description!: string;

  @Field(() => ProjectStatus)
  @Column({ type: 'enum', enum: ProjectStatus, enumName: 'project_status', default: ProjectStatus.BACKLOG })
  status!: ProjectStatus;

  @Field(() => ProjectPriority)
  @Column({ type: 'enum', enum: ProjectPriority, enumName: 'project_priority', default: ProjectPriority.NO_PRIORITY })
  priority!: ProjectPriority;

  @Field(() => ID, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  leadId!: string | null;

  @Field(() => DateScalar, { nullable: true })
  @Column({ type: 'date', nullable: true })
  startDate!: string | null;

  @Field(() => DateScalar, { nullable: true })
  @Column({ type: 'date', nullable: true })
  targetDate!: string | null;

  @Column({ type: 'int', default: 0 })
  issueCounter!: number;

  @Field(() => GraphQLISODateTime)
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
