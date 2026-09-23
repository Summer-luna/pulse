import type { UserRole } from '@/graphql/generated/graphql'

export const USER_ROLE_LABEL: Record<UserRole, string> = {
  ADMIN: 'Admin',
  MEMBER: 'Member',
  GUEST: 'Guest',
}
