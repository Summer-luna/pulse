import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ReleasePipelineType } from './release-pipeline-type.enum.js';

@ObjectType()
@Entity('release_pipelines')
export class ReleasePipeline {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field(() => ID)
  @Column({ type: 'uuid' })
  projectId!: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 80 })
  name!: string;

  @Field(() => ReleasePipelineType)
  @Column({ type: 'enum', enum: ReleasePipelineType, enumName: 'release_pipeline_type', default: ReleasePipelineType.CONTINUOUS })
  type!: ReleasePipelineType;

  @Field(() => GraphQLISODateTime)
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
