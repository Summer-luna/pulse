import type { RequestStatus } from '@/graphql/generated/graphql'

export const REQUEST_STATUSES: readonly RequestStatus[] = ['OPEN', 'CONVERTED', 'DECLINED']

export const REQUEST_STATUS_LABEL: Record<RequestStatus, string> = {
  OPEN: 'Open',
  CONVERTED: 'Converted',
  DECLINED: 'Declined',
}

export const REQUEST_STATUS_COLOR: Record<RequestStatus, string> = {
  OPEN: '#c3c6cc',
  CONVERTED: '#5e6ad2',
  DECLINED: '#8a8f98',
}
