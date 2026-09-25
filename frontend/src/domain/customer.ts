import type { CustomerStatus, CustomerTier, CustomerType } from '@/graphql/generated/graphql'

export const CUSTOMER_TYPES: readonly CustomerType[] = ['EXTERNAL', 'INTERNAL']

export const CUSTOMER_TYPE_LABEL: Record<CustomerType, string> = {
  EXTERNAL: 'External',
  INTERNAL: 'Internal',
}

export const CUSTOMER_STATUSES: readonly CustomerStatus[] = ['ACTIVE', 'PROSPECT', 'CHURNED', 'LOST']

export const CUSTOMER_STATUS_LABEL: Record<CustomerStatus, string> = {
  ACTIVE: 'Active',
  PROSPECT: 'Prospect',
  CHURNED: 'Churned',
  LOST: 'Lost',
}

export const CUSTOMER_STATUS_COLOR: Record<CustomerStatus, string> = {
  ACTIVE: '#5e6ad2',
  PROSPECT: '#4cb782',
  CHURNED: '#e5484d',
  LOST: '#f2994a',
}

export const CUSTOMER_TIERS: readonly CustomerTier[] = ['TIER_1', 'TIER_2', 'TIER_3']

export const CUSTOMER_TIER_LABEL: Record<CustomerTier, string> = {
  TIER_1: 'Tier 1',
  TIER_2: 'Tier 2',
  TIER_3: 'Tier 3',
}
