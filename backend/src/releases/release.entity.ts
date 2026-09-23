import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { DateScalar } from '../common/date.scalar.js';
import { ReleaseStatus } from './release-status.enum.js';

@ObjectType()
@Entity('releases')
export class Release {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field(() => ID)
  @Column({ type: 'uuid' })
  projectId!: string;

  @Field(() => ID)
  @Column({ type: 'uuid' })
  pipelineId!: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 80 })
  name!: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 40, nullable: true })
  version!: string | null;

  @Field(() => String)
  @Column({ type: 'text', default: '' })
  description!: string;

  @Field(() => ReleaseStatus)
  @Column({ type: 'enum', enum: ReleaseStatus, enumName: 'release_status', default: ReleaseStatus.PLANNED })
  status!: ReleaseStatus;

  @Field(() => DateScalar, { nullable: true })
  @Column({ type: 'date', nullable: true })
  targetDate!: string | null;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Column({ type: 'timestamptz', nullable: true })
  releasedAt!: Date | null;

  @Field(() => GraphQLISODateTime)
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
