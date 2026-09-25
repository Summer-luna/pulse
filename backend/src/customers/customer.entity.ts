import { Field, GraphQLISODateTime, ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CustomerStatus } from './customer-status.enum.js';
import { CustomerTier } from './customer-tier.enum.js';
import { CustomerType } from './customer-type.enum.js';

@ObjectType()
@Entity('customers')
export class Customer {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 120 })
  name!: string;

  @Field(() => CustomerStatus)
  @Column({ type: 'enum', enum: CustomerStatus, enumName: 'customer_status', default: CustomerStatus.ACTIVE })
  status!: CustomerStatus;

  @Field(() => CustomerType)
  @Column({ type: 'enum', enum: CustomerType, enumName: 'customer_type', default: CustomerType.EXTERNAL })
  type!: CustomerType;

  @Field(() => CustomerTier, { nullable: true })
  @Column({ type: 'enum', enum: CustomerTier, enumName: 'customer_tier', nullable: true })
  tier!: CustomerTier | null;

  @Field(() => Int, { nullable: true, description: 'Annual revenue in whole dollars' })
  @Column({ type: 'integer', nullable: true })
  annualRevenue!: number | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 40, nullable: true })
  size!: string | null;

  @Field(() => [String])
  @Column({ type: 'text', array: true, default: () => "'{}'" })
  domains!: string[];

  @Field(() => ID, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  ownerId!: string | null;

  @Field(() => GraphQLISODateTime)
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
